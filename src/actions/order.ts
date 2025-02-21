import { db } from "@/lib/db";
import { getEligibleStoresForOrder } from "@/lib/db/queries/Orders";
import {
  orders,
  orderItems,
  storeOrders,
  store,
  orderStatusHistory,
  customerOrders,
  products,
  orderTrackingLinks,
  storeProducts,
  invoices,
} from "@/lib/db/schema";
import { mailSender } from "@/lib/aws/mail";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedAction } from "./utils";
// import { notifyNewOrder } from "@/pages/api/orderEvents";

const orderSchema = z.object({
  shippingAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      phone: z.string(),
    })
    .optional(),
  totalAmount: z.number().min(0),
  orderItems: z
    .array(
      z.object({
        name: z.string(),
        productId: z.string(),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
        totalPrice: z.number().min(0),
      })
    )
    .min(1),
  name: z.string().min(1).optional(),
  email: z.string().email().min(1).optional(),
  mobile: z.string().length(10).min(10).optional(),
  userType: z.string().optional(),
});

export const createOrder = defineAction({
  input: orderSchema,
  handler: async (data, { locals }) => {
    try {
      if (
        data.userType === "customer" &&
        (!data.name || !data.email || !data.mobile)
      ) {
        return {
          success: false,
          message: "Please provide name, email and mobile number",
        } as const;
      }

      const result = await db.transaction(async (tx) => {
        // Create order
        const [order] = await tx
          .insert(orders)
          .values({
            orderType: data.userType as "customer" | "store",
            notes: `ordered on ${new Date().toLocaleDateString()}`,
            totalAmount: data.totalAmount,
          })
          .returning({ insertedId: orders.id });
        console.log("order in create order ", order);
        // Generate tracking link for the order
        const [trackingLink] = await tx
          .insert(orderTrackingLinks)
          .values({
            orderId: order.insertedId,
            issuedTo: data.email, // For customer orders
            issuedBy: null, // For store orders
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
            maxAccess: 100, // Limit to 100 views
          })
          .returning();
        console.log("trackingLink in create order ", trackingLink);
        if (locals?.user && locals?.user?.userType === "Store") {
          const [currentStore] = await tx
            .select()
            .from(store)
            .where(eq(store.userId, locals.user.id));

          await tx.insert(storeOrders).values({
            storeId: currentStore.id,
            orderId: order.insertedId,
          });
          console.log("storeOrder in create order ");
        } else {
          await tx.insert(customerOrders).values({
            orderId: order.insertedId,
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            paymentStatus: "pending",
            paymentMethod: "cod",
            shippingAddress: JSON.stringify(data.shippingAddress),
          });
          console.log("customerOrder in create order ");
        }
        console.log("orderItems in create order ");
        await tx.insert(orderItems).values(
          data.orderItems.map((item) => ({
            orderId: order.insertedId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          }))
        );
        console.log("orderStatusHistory in create order ");

        await tx.insert(orderStatusHistory).values({
          orderId: order.insertedId,
          status: "Ordered",
          notes: `Ordered by ${data.name || "store"}`,
          updatedBy: data.userType === "Customer" ? null : locals?.user?.id,
        });
        console.log("orderStatusHistory in create order ");

        await tx.insert(invoices).values({
          orderId: order.insertedId,
          status: "pending",
          paymentMethod: "cod",
          amount: data.orderItems.reduce(
            (acc, item) => acc + item.unitPrice * item.quantity,
            0
          ),
        });

        if (data.userType === "customer") {
          // Update product quantities
          for (const item of data.orderItems) {
            const [currentProduct] = await tx
              .select()
              .from(products)
              .where(eq(products.id, item.productId));

            if (currentProduct) {
              await tx
                .update(products)
                .set({
                  productQuantity:
                    currentProduct.productQuantity - item.quantity,
                })
                .where(eq(products.id, item.productId));
            }
          }
          console.log("productQuantity in create order ");
          // Generate tracking URL
          const trackingUrl = `http://localhost:4321/track/${trackingLink.token}?email=${encodeURIComponent(data.email)}`;

          // Send email with tracking link
          const emailResponse = await mailSender.sendOrderConfirmationEmail({
            email: "cherry.workspace.mail@gmail.com",
            orderNumber: order.insertedId,
            items: data.orderItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.unitPrice,
              subtotal: item.totalPrice,
            })),
            total: data.totalAmount,
            shippingAddress: JSON.stringify(data.shippingAddress),
            trackingNumber: trackingLink.token,
            estimatedDelivery: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString(), // 7 days estimated delivery
          });

          return {
            orderId: order.insertedId,
            trackingToken: trackingLink.token,
            trackingUrl,
            emailStatus: emailResponse.success,
          };
        }

        return {
          orderId: order.insertedId,
          trackingToken: trackingLink.token,
        };
      });

      // await notifyNewOrder({
      //   id: result.orderId,
      //   customerName: data.name,
      //   amount: data.totalAmount,
      //   status: "ordered",
      //   timestamp: new Date().toISOString(),
      // });
      return {
        success: true,
        message: "Order created successfully",
        orderId: result.orderId,
        trackingToken: result.trackingToken,
        trackingUrl: result.trackingUrl,
        emailStatus: result.emailStatus,
      } as const;
    } catch (error: any) {
      console.error("Error creating order:", error);
      return {
        success: false,
        message: error.message || "Failed to create order",
      } as const;
    }
  },
});

export const updateOrderStatus = defineAction({
  input: z.object({
    orderId: z.string(),
    status: z.string(),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      const order = await db
        .update(orders)
        .set({ status: data.status })
        .where(eq(orders.id, data.orderId))
        .returning();

      await db.transaction(async (tx) => {
        await tx
          .update(orders)
          .set({ status: data.status })
          .where(eq(orders.id, data.orderId));
        await tx.insert(orderStatusHistory).values({
          orderId: data.orderId,
          status: data.status,
          updatedBy: locals.user.id,
        });
        if (data.status === "delivered") {
          const storeOrder = await tx.query.storeOrders.findFirst({
            where: eq(storeOrders.orderId, data.orderId),
          });
          if (storeOrder) {
            const allOrderItems = await tx.query.orderItems.findMany({
              where: eq(orderItems.orderId, data.orderId),
            });

            for (const item of allOrderItems) {
              await tx.insert(storeProducts).values({
                storeId: storeOrder.storeId,
                productId: item.productId,
                price: item.unitPrice,
                stock: item.quantity,
                isActive: true,
                storeQuantity: item.quantity,
              });
            }
          }
        }
      });

      return {
        success: true,
        message: "Order status updated successfully",
      } as const;
    } catch (error: any) {
      console.error("Error updating order status:", error);
      return {
        success: false,
        message: error.message || "Failed to update order status",
      } as const;
    }
  }),
});

export const getEligibleStoresAction = defineAction({
  input: z.object({
    orderId: z.string(),
  }),
  handler: protectedAction(async ({ orderId }) => {
    try {
      const stores = await getEligibleStoresForOrder(orderId);

      return {
        success: true,
        data: stores,
        message:
          stores.length === 0
            ? "No stores found with sufficient inventory"
            : undefined,
      };
    } catch (error) {
      console.error("Action error:", error);
      return {
        success: false,
        error: "Failed to find eligible stores",
      };
    }
  }),
});

export const getOrderStatusHistory = defineAction({
  input: z.object({
    orderId: z.string(),
  }),

  handler: async ({ orderId }) => {
    try {
      const orderHistory = await db
        .select()
        .from(orderStatusHistory)
        .where(eq(orderStatusHistory.orderId, orderId));
      return { success: true, orderHistory: orderHistory };
    } catch (e) {
      console.error("Error fetching order status history:", e);
      return { success: true, orderHistory: [] };
    }
  },
});
