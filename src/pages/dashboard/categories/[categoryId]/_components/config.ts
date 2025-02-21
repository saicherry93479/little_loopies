import type { FormConfig } from "@/types";
import { actions } from "astro:actions";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Add Category",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(2, {
        message: "Category name must be at least 2 characters.",
      }),
      label: "Category Name",
      placeholder: "Enter category name",
      space: 1,
    },
    {
      name: "active",
      type: "select",
      validation: z.string(),
      label: "Active Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
      space: 1,
    },
    {
      name: "images",
      type: "file",
      validation: z.any(),
      label: "Category Images",
      maxFiles: 4,
      maxFileSize: 4 * 1024 * 1024,
      space: 2,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string().min(2, {
        message: "Category name must be at least 2 characters.",
      }),
      label: "Description",
      placeholder: "Enter category description",
      space: 2,
    },
    // {
    //   name: "pricing",
    //   type: "dynamicGroup",
    //   label: "Quantity-based Pricing",
    //   space:2,
    //   dynamicFields: [
    //     {
    //       name: "quantity",
    //       type: "input",
    //       label: "Quantity",
    //       space:1,
    //       validation: z.string().transform(Number),
    //     },
    //     {
    //       name: "price",
    //       type: "input",
    //       label: "Price",
    //       validation: z.string().transform(Number),
    //     },
    //   ],
    // },
  ],
  columns: 2,
  onSubmit: async (values, isUpdate) => {
    console.log("Form values:", values);
    try {
      if (isUpdate) {
        return await actions.updateCategory({
          ...values,
        });
      } else {
        return await actions.createCategory({
          ...values,
        });
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
      formData.append('productName', 'category');

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

export default formConfig;
