import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  storeOrders,
  store,
  permissions,
  rolePermissions,
} from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedAction } from "./utils";

export const createPermission = defineAction({
  input: z.object({
    name: z.string(),
    description: z.string(),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      if (!locals.user) {
        throw new Error("User not found");
      }

      await db.insert(permissions).values({
        name: data.name,
        description: data.description,
        createdBy: locals.user.id,
        createdAt: new Date(),
      });
      return {
        success: true,
        message: "Permission created successfully",
      };
    } catch (error: any) {
      console.error("Error creating Permission:", error);
      return {
        success: false,
        message: error.message || "Failed to create permission",
      };
    }
  }),
});

export const updatePermission = defineAction({
  input: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      if (!locals.user) {
        throw new Error("User not found");
      }

      await db.update(permissions).set({
        name: data.name,
        description: data.description,
      }).where(eq(permissions.id,data.id));
      return {
        success: true,
        message: "Permission updated successfully",
      };
    } catch (error: any) {
      console.error("Error creating Permission:", error);
      return {
        success: false,
        message: error.message || "Failed to create permission",
      };
    }
  }),
});
export const deletePermission = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      if (!locals.user) {
        throw new Error("User not found");
      }
      await db.transaction(async (tx) => {
        await tx
          .delete(rolePermissions)
          .where(eq(rolePermissions.permissionId, data.id));
        await tx.delete(permissions).where(eq(permissions.id, data.id));
      });
      return {
        success: true,
        message: "Permission deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting Permission:", error);
      return {
        success: false,
        message: error.message || "Failed to delete permission",
      };
    }
  }),
});

export const getPermissions = defineAction({
  input: z.object({}),
  handler: protectedAction(async (data, { locals }) => {
    try {
      const data = await db.select().from(permissions);

      console.log("data categories is ", data);
      return data.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    } catch (error) {
      console.error("Error deleting category:", error);
      return [];
    }
  }),
});
