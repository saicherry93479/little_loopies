import { db } from "@/lib/db";
import { store, users } from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { mailSender } from "@/lib/aws/mail";
import { generatePassword, hashPassword } from "@/lib/utils/password";
import { protectedAction } from "./utils";

// Schema definitions
const storeAddressSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  landmark: z.string().optional(),
  country: z.string().optional(),
});

const storeTimingsSchema = z.object({
  openTime: z.string(),
  closeTime: z.string(),
  weeklyOff: z.array(z.string()).optional().default([]),
});

const storeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  gstNumber: z
    .string()
    .regex(
      /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/,
      "Invalid GST number"
    )
    .optional(),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
    .optional(),
  aadharLinkedMobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  storeAddress: storeAddressSchema,
  storeTimings: storeTimingsSchema,
  status: z
    .enum(["pending", "active", "suspended", "inactive"])
    .default("pending"),
  storePhotos: z.array(z.string()).optional(),
});

// Create store action
export const createStore = defineAction({
  input: storeSchema,
  handler: protectedAction(async (data) => {
    try {
      return await db.transaction(async (tx) => {
        const password = await generatePassword();
        const hash = await hashPassword(password);
        console.log("hash is ", hash);
        const [user] = await tx
          .insert(users)
          .values({
            name: data.name,
            email: data.email,
            userType: "store",
            status: "pending",
            password: hash,
          })
          .returning({ id: users.id });
        console.log("user is ", user);
        const [result] = await tx
          .insert(store)
          .values({
            name: data.name,
            userId: user.id,
            email: data.email,
            mobile: data.mobile,
            storeName: data.storeName,
            gstNumber: data.gstNumber,
            panNumber: data.panNumber,
            aadharLinkedMobile: data.aadharLinkedMobile,
            storeAddress: data.storeAddress,
            storeTimings: data.storeTimings,
            status: data.status,
          })
          .returning({ insertedId: store.id });

        return {
          success: true,
          message: "Store created successfully",
          storeId: result.insertedId,
        } as const;
      });
    } catch (error: any) {
      console.error("Error creating store:", error);
      return {
        success: false,
        message: error.message || "Failed to create store",
      } as const;
    }
  }),
});

// Update store action
export const updateStore = defineAction({
  input: storeSchema.extend({
    id: z.string().min(1, "Store ID is required"),
  }),
  handler: async (data) => {
    try {
      return await db.transaction(async (tx) => {
        await tx
          .update(store)
          .set({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            storeName: data.storeName,
            gstNumber: data.gstNumber,
            panNumber: data.panNumber,
            aadharLinkedMobile: data.aadharLinkedMobile,
            storeAddress: data.storeAddress,
            storeTimings: data.storeTimings,
            status: data.status,
            updatedAt: new Date(),
          })
          .where(eq(store.id, data.id));

        return {
          success: true,
          message: "Store updated successfully",
        } as const;
      });
    } catch (error: any) {
      console.error("Error updating store:", error);
      return {
        success: false,
        message: error.message || "Failed to update store",
      } as const;
    }
  },
});

// Delete store action
export const deleteStore = defineAction({
  input: z.object({
    id: z.string().min(1, "Store ID is required"),
  }),
  handler: async (data) => {
    try {
      return await db.transaction(async (tx) => {
        await tx.delete(store).where(eq(store.id, data.id));

        return {
          success: true,
          message: "Store deleted successfully",
        } as const;
      });
    } catch (error: any) {
      console.error("Error deleting store:", error);
      return {
        success: false,
        message: "Failed to delete store",
      } as const;
    }
  },
});

// Update store status action
export const updateStoreStatus = defineAction({
  input: z.object({
    id: z.string(),
    status: z.enum(["pending", "active", "suspended", "inactive"]),
  }),
  handler: async ({ id, status }) => {
    try {
      await db
        .update(store)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(store.id, id));

      return {
        success: true,
        message: "Store status updated successfully",
      };
    } catch (error) {
      console.error("Error updating store status:", error);
      return {
        success: false,
        message: "Failed to update store status",
      };
    }
  },
});

export const sendStoreEmail = defineAction({
  input: z.object({
    id: z.string().min(1, "Store ID is required"),
    email: z.string().email("Invalid email"),
  }),
  handler: protectedAction(async (inputData: any) => {
    try {
      const password = await generatePassword();
      const hash = await hashPassword(password);
      await db
        .update(users)
        .set({
          password: hash,
        })
        .where(eq(users.email, inputData.email));
      const resp = await mailSender.sendPasswordEmail(
        {
          email: inputData.email,
          password: password,
        }
      );
      console.log("resp is ", resp);
      return { success: false, resp: {} } as const;
    } catch (err) {
      console.log('error in sendStoreEmail', err);
      return { success: false, resp: {} } as const;
    }
  }),
});
