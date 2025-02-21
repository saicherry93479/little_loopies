import { db } from "@/lib/db";
import {
  products,
  productCategories,
  wholesalePriceTiers,
} from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedAction } from "./utils";

const pricingTierSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  userPrice: z.number().min(0, "User price must be non-negative"),
  userDiscountPercentage: z.number().min(0).max(100).default(0),
  isWholesaleEnabled: z.enum(["Yes", "No"]),
  activeForUsers: z.enum(["Yes", "No"]),
  category: z.string().optional(),
  pricing: z.array(pricingTierSchema).optional(),
  productQuantity: z.number().min(5, "quantity should be more than 4"),
});

export const createProduct = defineAction({
  input: productSchema,
  handler: protectedAction(async (data) => {
    try {
      return await db.transaction(async (tx) => {
        const [product] = await tx
          .insert(products)
          .values({
            name: data.name,
            description: data.description,
            images: data.images,
            userPrice: data.userPrice,
            userDiscountPercentage: data.userDiscountPercentage,
            isWholesaleEnabled: data.isWholesaleEnabled,
            activeForUsers: data.activeForUsers,
            productQuantity: data.productQuantity,
          })
          .returning({ insertedId: products.id });

        // Insert category association
        if (data.category) {
          await tx.insert(productCategories).values({
            productId: product.insertedId,
            categoryId: data.category,
          });
        }

        // Insert wholesale price tiers if enabled and provided
        if (data.isWholesaleEnabled && data.pricing?.length) {
          await tx.insert(wholesalePriceTiers).values(
            data.pricing.map((tier) => ({
              productId: product.insertedId,
              quantity: tier.quantity,
              pricePerUnit: tier.price,
            }))
          );
        }

        return {
          success: true,
          message: "Product created successfully",
          productId: product.insertedId,
        } as const;
      });
    } catch (error: any) {
      console.error("Error creating product:", error);
      return {
        success: false,
        message: error.message || "Failed to create product",
      } as const;
    }
  }),
});

export const updateProduct = defineAction({
  input: productSchema.extend({
    id: z.string().min(1, "Product ID is required"),
  }),
  handler: protectedAction(async (data) => {
    try {
      return await db.transaction(async (tx) => {
        // Update product
        await tx
          .update(products)
          .set({
            name: data.name,
            description: data.description,
            images: data.images,
            userPrice: data.userPrice,
            userDiscountPercentage: data.userDiscountPercentage,

            isWholesaleEnabled: data.isWholesaleEnabled,
            activeForUsers: data.activeForUsers,
            updatedAt: new Date(),
          })
          .where(eq(products.id, data.id));

        // Update category association

        await tx
          .delete(productCategories)
          .where(eq(productCategories.productId, data.id));
        if (data.category) {
          await tx.insert(productCategories).values({
            productId: data.id,
            categoryId: data.category,
          });
        }

        // Update wholesale price tiers
        await tx
          .delete(wholesalePriceTiers)
          .where(eq(wholesalePriceTiers.productId, data.id));

        if (data.isWholesaleEnabled && data.pricing?.length) {
          await tx.insert(wholesalePriceTiers).values(
            data.pricing.map((tier) => ({
              productId: data.id,
              quantity: tier.quantity,
              pricePerUnit: tier.price,
            }))
          );
        }

        return {
          success: true,
          message: "Product updated successfully",
        } as const;
      });
    } catch (error: any) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: error.message || "Failed to update product",
      } as const;
    }
  }),
});

export const deleteProduct = defineAction({
  input: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
  handler: protectedAction(async (data) => {
    try {
      return await db.transaction(async (tx) => {
        // Delete associated records first
        await tx
          .delete(productCategories)
          .where(eq(productCategories.productId, data.id));
        await tx
          .delete(wholesalePriceTiers)
          .where(eq(wholesalePriceTiers.productId, data.id));
        // Delete the product
        await tx.delete(products).where(eq(products.id, data.id));

        return {
          success: true,
          message: "Product deleted successfully",
        } as const;
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: error.message || "Failed to delete product",
      } as const;
    }
  }),
});

export const checkStock = defineAction({
  input: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
  handler: protectedAction(async (data) => {
    try {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, data.id));

      if (!product.length) {
        return {
          success: false,
          message: "Product not found",
          stock: 0,
        } as const;
      }

      return {
        success: true,
        message: "Product updated successfully",
        stock: product[0].productQuantity,
      } as const;
    } catch (error: any) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: error.message || "Failed to check stock",
        stock: 0,
      } as const;
    }
  }),
});
