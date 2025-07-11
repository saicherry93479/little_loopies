import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import type { FormConfig } from "@/types";
import { actions } from "astro:actions";
import * as z from "zod";
import { eq } from 'drizzle-orm';

const dataFromCategories = async () => {
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
    console.error("Error fetching categories:", error);
    return [];
  }
}

const categoriesMap = await dataFromCategories();

// Size options for baby/kids clothing
const sizeOptions = [
  { label: "0-3 months", value: "0-3 months" },
  { label: "3-6 months", value: "3-6 months" },
  { label: "6-9 months", value: "6-9 months" },
  { label: "9-12 months", value: "9-12 months" },
  { label: "1-2 years", value: "1-2 years" },
  { label: "2-3 years", value: "2-3 years" },
];

export const formConfig: FormConfig = {
  title: "Add Product",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
      }),
      label: "Product Name",
      placeholder: "Enter product name",
      space: 1,
    },
    {
      name: "brand",
      type: "input",
      validation: z.string().min(2, {
        message: "Brand name must be at least 2 characters.",
      }),
      label: "Brand Name",
      placeholder: "Enter brand name",
      space: 1,
    },
    {
      name: "category",
      type: "select",
      validation: z.string().optional(),
      isSearchable: true,
      label: "Category",
      placeholder: "Select category",
      options: categoriesMap,
      space: 1,
    },
    {
      name: "gender",
      type: "select",
      validation: z.string().optional(),
      label: "Gender",
      placeholder: "Select gender",
      options: [
        { label: "Boy", value: "Boy" },
        { label: "Girl", value: "Girl" },
        { label: "Unisex", value: "Unisex" },
      ],
      space: 1,
    },
    {
      name: "basePrice",
      type: "input",
      inputType: "number",
      validation: z.number().min(50),
      label: "Base Price",
      placeholder: "Enter base price",
      space: 1,
    },
    {
      name: "baseDiscountPercentage",
      type: "input",
      inputType: "number",
      validation: z.number().min(0).max(100),
      label: "Base Discount Percentage",
      placeholder: "Enter discount percentage",
      space: 1,
    },
    {
      name: "activeForUsers",
      type: "select",
      validation: z.string(),
      label: "Enable for Users",
      placeholder: "Select option",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      space: 1,
    },
    {
      name: "isWholesaleEnabled",
      type: "select",
      validation: z.string(),
      label: "Enable for Stores",
      placeholder: "Select option",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      space: 1,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string().min(10),
      label: "Description",
      placeholder: "Enter product description",
      space: 2,
    },
    // Color Variants Section
    {
      name: "colorVariants",
      type: "dynamicGroup",
      label: "Color Variants",
      validation: z.array(z.any()),
      space: 2,
      dynamicFields: [
        {
          name: "color",
          type: "input",
          label: "Color Name",
          validation: z.string().min(1, "Color is required"),
          placeholder: "e.g., Red, Blue, Green",
          space: 1,
        },
        {
          name: "price",
          type: "input",
          label: "Price for this Color",
          inputType: "number",
          validation: z.number().min(0),
          placeholder: "Enter price",
          space: 1,
        },
        {
          name: "discountPercentage",
          type: "input",
          label: "Discount %",
          inputType: "number",
          validation: z.number().min(0).max(100),
          placeholder: "Enter discount percentage",
          space: 1,
        },
        {
          name: "sku",
          type: "input",
          label: "SKU (Optional)",
          validation: z.string().optional(),
          placeholder: "Enter SKU code",
          space: 1,
        },
        {
          name: "images",
          type: "file",
          validation: z.any(),
          label: "Images for this Color",
          maxFiles: 6,
          maxFileSize: 4 * 1024 * 1024,
          space: 2,
        },
        // Sizes nested dynamic group
        {
          name: "sizes",
          type: "dynamicGroup",
          label: "Available Sizes",
          validation: z.array(z.any()),
          space: 2,
          dynamicFields: [
            {
              name: "size",
              type: "select",
              label: "Size",
              validation: z.string().min(1, "Size is required"),
              options: sizeOptions,
              space: 1,
            },
            {
              name: "quantity",
              type: "input",
              label: "Stock Quantity",
              inputType: "number",
              validation: z.number().min(0),
              placeholder: "Enter stock quantity",
              space: 1,
            },
          ],
        },
      ],
    },
    // Wholesale Pricing Section (conditional)
    {
      name: "pricing",
      type: "dynamicGroup",
      label: "Quantity-based Pricing For Stores",
      validation: z.array(z.any()),
      space: 2,
      condition: (values) => values.isWholesaleEnabled === "Yes",
      dynamicFields: [
        {
          name: "quantity",
          type: "input",
          label: "Minimum Quantity",
          inputType: "number",
          validation: z.number().min(10),
          space: 1,
        },
        {
          name: "price",
          type: "input",
          label: "Unit Price",
          inputType: "number",
          validation: z.number().min(10),
          space: 1,
        },
      ],
    },
  ],
  columns: 2,
  onSubmit: async (values, isUpdate) => {
    console.log("Form values:", values);

    try {
      if (isUpdate) {
        console.log("Updating product:", values);
        return await actions.updateProduct({ ...values });
      } else {
        return await actions.createProduct({ ...values });
      }
    } catch (e) {
      console.log("Error:", e);
      throw e;
    }
  },
  onFileUpload: async (files, fieldName) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('productName', 'product');
      formData.append('fieldName', fieldName || 'default');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.urls;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },
};

// Helper function to transform existing product data for the form
export const transformProductDataForForm = (productData: any) => {
  if (!productData) return null;

  return {
    id: productData.id,
    name: productData.name,
    brand: productData.brand || "",
    gender: productData.gender || "",
    category: productData.categories?.[0]?.categoryId || "",
    basePrice: productData.userPrice,
    baseDiscountPercentage: productData.userDiscountPercentage,
    activeForUsers: productData.activeForUsers,
    isWholesaleEnabled: productData.isWholesaleEnabled,
    description: productData.description,
    colorVariants: productData.colorVariants || [],
    pricing: productData.wholesalePriceTiers?.map((tier: any) => ({
      quantity: tier.quantity,
      price: tier.pricePerUnit,
    })) || [],
  };
};