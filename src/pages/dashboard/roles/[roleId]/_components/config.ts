import type { FormConfig } from "@/types";
import { actions } from "astro:actions";
import { z } from "zod";

const dataFromPermissions = await actions.getPermissions({});

const options = dataFromPermissions.data || [];

export const formConfig: FormConfig = {
  title: "Add Role",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(2, {
        message: "Role name must be at least 2 characters.",
      }),
      label: "Role Name",
      placeholder: "Enter Role name",
      space: 1, // Takes half width
    },
    {
      name: "permissions",
      type: "multiselect",
      validation: z.array(z.string()),
      label: "Permissions",
      placeholder: "Select weekly off days",
      options: options,
      space: 1,
    },

    {
      name: "description",
      type: "textarea",
      validation: z.string().min(10),
      label: "Description",
      placeholder: "Enter Role description",
      space: 2,
    },
  ],
  columns: 2,
  onSubmit: async (values, isUpdate) => {
    console.log("Form values:", values);

    try {
        if (isUpdate) {
          console.log("Updating Role:", values);
          return await actions.updateUserRole({ ...values });
        } else {
          return await actions.createUserRole({ ...values });
        }
    } catch (e) {
      console.log("e is ", e);
    }
  },
  
};
