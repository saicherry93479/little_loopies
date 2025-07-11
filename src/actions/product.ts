import { db } from "@/lib/db";
import {
  products,
  productCategories,
  wholesalePriceTiers,
  productVariants,
} from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedAction } from "./utils";

const pricingTierSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
});

// Size options schema
const sizeSchema = z.object({
  size: z.enum(["0-3 months", "3-6 months", "6-9 months", "9-12 months", "1-2 years", "2-3 years"]),
  quantity: z.number().min(0, "Quantity must be non-negative"),
});

// Color variant schema
const colorVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  images: z.array(z.string()).min(1, "At least one image is required for each color"),
  price: z.number().min(0, "Price must be non-negative"),
  discountPercentage: z.number().min(0).max(100).default(0),
  sizes: z.array(sizeSchema).min(1, "At least one size is required"),
  sku: z.string().optional(),
  isActive: z.boolean().default(true),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  brand: z.string().optional(),
  gender: z.string().optional(),
  // Base product info - variants will override these
  basePrice: z.number().min(0, "Base price must be non-negative"),
  baseDiscountPercentage: z.number().min(0).max(100).default(0),
  isWholesaleEnabled: z.enum(["Yes", "No"]),
  activeForUsers: z.enum(["Yes", "No"]),
  category: z.string().optional(),
  pricing: z.array(pricingTierSchema).optional(),
  // Color variants with their own images, pricing, and sizes
  colorVariants: z.array(colorVariantSchema).min(1, "At least one color variant is required"),
});

export const createProduct = defineAction({
  input: productSchema,
  handler: protectedAction(async (data) => {
    try {
      return await db.transaction(async (tx) => {
        // Calculate total quantity from all variants
        const totalQuantity = data.colorVariants.reduce((total, variant) => {
          return total + variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.quantity, 0);
        }, 0);

        // Create main product with base info
        const [product] = await tx
          .insert(products)
          .values({
            name: data.name,
            description: data.description,
            brand: data.brand,
            gender: data.gender,
            images: data.colorVariants[0].images, // Use first variant's images as main
            userPrice: data.basePrice,
            userDiscountPercentage: data.baseDiscountPercentage,
            isWholesaleEnabled: data.isWholesaleEnabled,
            activeForUsers: data.activeForUsers,
            productQuantity: totalQuantity,
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

        // Insert color variants with sizes
        for (const variant of data.colorVariants) {
          for (const size of variant.sizes) {
            await tx.insert(productVariants).values({
              productId: product.insertedId,
              color: variant.color,
              size: size.size,
              price: variant.price,
              discountPercentage: variant.discountPercentage,
              stock: size.quantity,
              images: variant.images,
              sku: variant.sku,
              isActive: variant.isActive,
            });
          }
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
        // Calculate total quantity from all variants
        const totalQuantity = data.colorVariants.reduce((total, variant) => {
          return total + variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.quantity, 0);
        }, 0);

        // Update main product
        await tx
          .update(products)
          .set({
            name: data.name,
            description: data.description,
            brand: data.brand,
            gender: data.gender,
            images: data.colorVariants[0].images, // Use first variant's images as main
            userPrice: data.basePrice,
            userDiscountPercentage: data.baseDiscountPercentage,
            isWholesaleEnabled: data.isWholesaleEnabled,
            activeForUsers: data.activeForUsers,
            productQuantity: totalQuantity,
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

        // Delete existing variants
        await tx
          .delete(productVariants)
          .where(eq(productVariants.productId, data.id));

        // Insert updated color variants with sizes
        for (const variant of data.colorVariants) {
          for (const size of variant.sizes) {
            await tx.insert(productVariants).values({
              productId: data.id,
              color: variant.color,
              size: size.size,
              price: variant.price,
              discountPercentage: variant.discountPercentage,
              stock: size.quantity,
              images: variant.images,
              sku: variant.sku,
              isActive: variant.isActive,
            });
          }
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
        await tx
          .delete(productVariants)
          .where(eq(productVariants.productId, data.id));
        
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
    color: z.string().optional(),
    size: z.string().optional(),
  }),
  handler: protectedAction(async (data) => {
    try {
      if (data.color && data.size) {
        // Check specific variant stock
        const variant = await db
          .select()
          .from(productVariants)
          .where(
            eq(productVariants.productId, data.id) &&
            eq(productVariants.color, data.color) &&
            eq(productVariants.size, data.size)
          );

        if (!variant.length) {
          return {
            success: false,
            message: "Product variant not found",
            stock: 0,
          } as const;
        }

        return {
          success: true,
          message: "Variant stock retrieved successfully",
          stock: variant[0].stock,
        } as const;
      } else {
        // Check total product stock
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
          message: "Product stock retrieved successfully",
          stock: product[0].productQuantity,
        } as const;
      }
    } catch (error: any) {
      console.error("Error checking stock:", error);
      return {
        success: false,
        message: error.message || "Failed to check stock",
        stock: 0,
      } as const;
    }
  }),
});

// Additional helper action to get product with all variants
export const getProductWithVariants = defineAction({
  input: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
  handler: protectedAction(async (data) => {
    try {
      const productData = await db.query.products.findFirst({
        where: eq(products.id, data.id),
        with: {
          categories: true,
          wholesalePriceTiers: true,
        },
      });

      if (!productData) {
        return {
          success: false,
          message: "Product not found",
          data: null,
        } as const;
      }

      // Get all variants for this product
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, data.id));

      // Group variants by color
      const colorVariants = variants.reduce((acc, variant) => {
        if (!acc[variant.color]) {
          acc[variant.color] = {
            color: variant.color,
            images: variant.images || [],
            price: variant.price,
            discountPercentage: variant.discountPercentage,
            sku: variant.sku,
            isActive: variant.isActive,
            sizes: [],
          };
        }
        
        acc[variant.color].sizes.push({
          size: variant.size,
          quantity: variant.stock,
        });
        
        return acc;
      }, {} as Record<string, any>);

      return {
        success: true,
        message: "Product retrieved successfully",
        data: {
          ...productData,
          colorVariants: Object.values(colorVariants),
        },
      } as const;
    } catch (error: any) {
      console.error("Error getting product with variants:", error);
      return {
        success: false,
        message: error.message || "Failed to get product",
        data: null,
      } as const;
    }
  }),
});