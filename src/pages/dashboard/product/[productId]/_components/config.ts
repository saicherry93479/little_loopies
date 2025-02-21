import type { FormConfig } from "@/types";
import { actions } from "astro:actions";
import { z } from "zod";

const dataFromCategories = await actions.getActiveCategories({});

const categoriesMap = dataFromCategories.data || [];
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
      space: 1, // Takes half width
    },
    {
      name: "productQuantity",
      type: "input",
      inputType: "number",
      validation: z.number().min(5),

      label: "Product Quantity",
      placeholder: "Enter Quantity",

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
      name: "userPrice",
      type: "input",
      inputType: "number",
      validation: z.number().min(50),

      label: "Price For User",
      placeholder: "Enter Price",

      space: 1,
    },
    {
      name: "userDiscountPercentage",
      type: "input",
      inputType: "number",
      validation: z.number(),

      label: "Price Discount For User",
      placeholder: "Enter Price Discount",

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
        // ... more options
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
        // ... more options
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
    {
      name: "images",
      type: "file",
      validation: z.any(),
      label: "Product Images",
      maxFiles: 4,
      maxFileSize: 4 * 1024 * 1024,
      space: 2,
    },
    {
      name: "pricing",
      type: "dynamicGroup",
      label: "Quantity-based Pricing For Stores",
      space: 2,
      dynamicFields: [
        {
          name: "quantity",
          type: "input",
          label: "Quantity",
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
      console.log("e is ", e);
    }
  },
  onFileUpload: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('productName', 'product'); 

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
