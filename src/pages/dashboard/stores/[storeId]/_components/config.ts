import { z } from "zod";
import type { FormConfig } from "@/types";
import { actions } from "astro:actions";

const mobileNumberSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Invalid mobile number");
const gstNumberSchema = z
  .string()
  .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/, "Invalid GST number")
  .optional();
const panNumberSchema = z
  .string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
  .optional();
const pincodeSchema = z.string().regex(/^\d{6}$/, "Pincode must be 6 digits");

export const storeFormConfig: FormConfig = {
  title: "Store Management",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(2, "Name must be at least 2 characters"),
      label: "Owner Name",
      placeholder: "Enter owner's full name",
      space: 1,
    },
    {
      name: "email",
      type: "input",
      inputType: "email",
      validation: z.string().email("Invalid email address"),
      label: "Email Address",
      placeholder: "Enter email address",
      space: 1,
    },
    {
      name: "mobile",
      type: "input",
      inputType: "tel",
      validation: mobileNumberSchema,
      label: "Mobile Number",
      placeholder: "Enter 10-digit mobile number",
      space: 1,
    },
    {
      name: "storeName",
      type: "input",
      validation: z.string().min(3, "Store name must be at least 3 characters"),
      label: "Store Name",
      placeholder: "Enter store name",
      space: 1,
    },
    {
      name: "gstNumber",
      type: "input",
      validation: gstNumberSchema,
      label: "GST Number (Optional)",
      placeholder: "Enter GST number",
      space: 1,
    },
    {
      name: "panNumber",
      type: "input",
      validation: panNumberSchema,
      label: "PAN Number (Optional)",
      placeholder: "Enter PAN number",
      space: 1,
    },
    {
      name: "aadharLinkedMobile",
      type: "input",
      inputType: "tel",
      validation: mobileNumberSchema,
      label: "Aadhar Linked Mobile",
      placeholder: "Enter Aadhar linked mobile number",
      space: 1,
    },
    {
      name: "storePhotos",
      type: "file",
      validation: z.array(z.string()).optional(),
      label: "Store Photos",
      maxFiles: 4,
      maxFileSize: 2 * 1024 * 1024, // 2MB
      placeholder: "Upload store photos",
      space: 2,
    },
    {
      name: "storeAddress.street",
      type: "input",
      validation: z
        .string()
        .min(5, "Street address must be at least 5 characters"),
      label: "Street Address",
      placeholder: "Enter street address",
      space: 1,
    },
    {
      name: "storeAddress.landmark",
      type: "input",
      validation: z.string().optional(),
      label: "Landmark (Optional)",
      placeholder: "Enter nearby landmark",
      space: 1,
    },
    {
      name: "storeAddress.city",
      type: "input",
      validation: z.string().min(2, "City name must be at least 2 characters"),
      label: "City",
      placeholder: "Enter city",
      space: 1,
    },
    {
      name: "storeAddress.state",
      type: "select",
      validation: z.string(),
      label: "State",
      isSearchable: true,
      placeholder: "Select state",
      options: [
        { label: "Andhra Pradesh", value: "AP" },
        { label: "Karnataka", value: "KA" },
        { label: "Kerala", value: "KL" },
        { label: "Tamil Nadu", value: "TN" },
        // Add other states as needed
      ],
      space: 1,
    },
    {
      name: "storeAddress.pincode",
      type: "input",
      validation: pincodeSchema,
      label: "Pincode",
      placeholder: "Enter 6-digit pincode",
      space: 1,
    },
    {
      name: "storeTimings.openTime",
      type: "input",
      inputType: "time",
      validation: z.string(),
      label: "Opening Time",
      space: 1,
    },
    {
      name: "storeTimings.closeTime",
      type: "input",
      inputType: "time",
      validation: z.string(),
      label: "Closing Time",
      space: 1,
    },
    {
      name: "storeTimings.weeklyOff",
      type: "multiselect",
      validation: z.array(z.string()).optional(),
      label: "Weekly Off Days",
      placeholder: "Select weekly off days",
      options: [
        { label: "Sunday", value: "sunday" },
        { label: "Monday", value: "monday" },
        { label: "Tuesday", value: "tuesday" },
        { label: "Wednesday", value: "wednesday" },
        { label: "Thursday", value: "thursday" },
        { label: "Friday", value: "friday" },
        { label: "Saturday", value: "saturday" },
      ],
      space: 1,
    },
  ],
  onSubmit: async (values, isUpdate) => {
    try {
        if (isUpdate) {
          return await actions.updateStore({ ...values });
        } else {
          return await actions.createStore({ ...values });
        }


    } catch (error) {
      console.error("Error submitting store form:", error);
      return {
        success: false,
        message: "Failed to submit store form",
      };
    }
  },
  onFileUpload: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('productName', 'store');

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
