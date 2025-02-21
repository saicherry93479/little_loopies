import { db } from "@/lib/db";
import {
  categories,
  permissions,
  rolePermissions,
  roles,
} from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { and, eq, inArray, ne } from "drizzle-orm";
import { z } from "zod";
import { protectedAction } from "./utils";

// Create Category Action
export const createUserRole = defineAction({
  input: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    active: z.string().default("InActive"),
    permissions: z.array(z.string()),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      await db.transaction(async (tx) => {
        const [role] = await db
          .insert(roles)
          .values({
            name: data.name,
            description: data.description,
            status: data.active,
          })
          .returning({ id: roles.id });

        await tx.insert(rolePermissions).values(
          data.permissions.map((permission) => ({
            roleId: role.id,
            permissionId: permission,
          }))
        );
      });

      return {
        success: true,
        message: "Role created successfully",
      } as const;
    } catch (error: any) {
      console.error("Error creating Role:", error.message);
      return {
        success: false,
        message: error.message || "Failed to create role",
      } as const;
    }
  }),
});

export const updateUserRole = defineAction({
  input: z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    permissions: z.array(z.string()),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      await db.transaction(async (tx) => {
        // Update role details
        const [role] = await tx
          .update(roles)
          .set({
            name: data.name,
            description: data.description,
          })
          .where(eq(roles.id, data.id))
          .returning({ id: roles.id });

        // Get existing permissions for this role
        const existingPermissions = await tx
          .select({ permissionId: rolePermissions.permissionId })
          .from(rolePermissions)
          .where(eq(rolePermissions.roleId, role.id));

        const existingPermissionIds = new Set(
          existingPermissions.map((p) => p.permissionId)
        );
        const newPermissionIds = new Set(data.permissions);

        // Find permissions to add (in new but not in existing)
        const permissionsToAdd = data.permissions.filter(
          (permissionId) => !existingPermissionIds.has(permissionId)
        );

        // Find permissions to remove (in existing but not in new)
        const permissionsToRemove = Array.from(existingPermissionIds).filter(
          (permissionId) => !newPermissionIds.has(permissionId)
        );

        // Add new permissions if any
        if (permissionsToAdd.length > 0) {
          await tx.insert(rolePermissions).values(
            permissionsToAdd.map((permissionId) => ({
              roleId: role.id,
              permissionId,
            }))
          );
        }

        // Remove permissions if any
        if (permissionsToRemove.length > 0) {
          await tx
            .delete(rolePermissions)
            .where(
              and(
                eq(rolePermissions.roleId, role.id),
                inArray(rolePermissions.permissionId, permissionsToRemove)
              )
            );
        }
      });

      return {
        success: true,
        message: "Role updated successfully",
      } as const;
    } catch (error: any) {
      console.error("Error updating Role:", error.message);
      return {
        success: false,
        message: error.message || "Failed to update role",
      } as const;
    }
  }),
});

export const getActiveRoles = defineAction({
  input: z.object({}),
  handler: protectedAction(async (data, { locals }) => {
    try {
      const data = await db.select().from(roles).where(ne(roles.name, "Store"));

      return data.map((role) => ({
        label: role.name,
        value: role.name,
      }));
    } catch (error) {
      console.error("Error deleting category:", error);
      return [];
    }
  }),
});
