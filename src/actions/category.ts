import { db } from "@/lib/db";
import { categories, productCategories } from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedAction } from "./utils";

// Create Category Action
export const createCategory = defineAction({
  input: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    active: z.string().default("ImActive"),
    images: z.array(z.string()),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      const result = await db.insert(categories).values({ ...data });

      return {
        success: true,
        message: "Category created successfully",
      } as const;
    } catch (error: any) {
      console.error("Error creating category:", error.message);
      return {
        success: false,
        message: error.message || "Failed to create category",
      } as const;
    }
  }),
});

// Update Category Action
export const updateCategory = defineAction({
  input: z.object({
    id: z.string().min(1, "Category ID is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    active: z.string().min(1, "Name is required"),
    images: z.array(z.string()),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      console.log("came hew in updatecategory ", data);
      await db
        .update(categories)
        .set({
          name: data.name,
          description: data.description,
          active: data.active,
          updatedAt: new Date(),
          images: data.images,
        })
        .where(eq(categories.id, data.id));

      return {
        success: true,
        message: "Category updated successfully",
      } as const;
    } catch (error: any) {
      console.error("Error updating category:", error);
      return {
        success: false,
        message: error.message,
      } as const;
    }
  }),
});

// Delete Category Action
export const deleteCategory = defineAction({
  input: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      await db.transaction(async (tx) => {
        const category = await tx.query.categories.findFirst({
          where: eq(categories.id, data.id),
        });

        if (!category) {
          throw new Error("Category not found");
        }

        await tx
          .delete(productCategories)
          .where(eq(productCategories.categoryId, category.name));

        await tx.delete(categories).where(eq(categories.id, data.id));
      });

      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        error: "Failed to delete category",
      } as const;
    }
  }),
});

export const getActiveCategories = defineAction({
  input: z.object({}),
  handler: async (data, { locals }) => {
    try {
      const data = await db
        .select()
        .from(categories)
        .where(eq(categories.active, "Active"));
      console.log("data categories is ", data);
      return data.map((category) => ({
        label: category.name,
        value: category.name,
      }));
    } catch (error) {
      console.error("Error deleting category:", error);
      return [];
    }
  },
});
