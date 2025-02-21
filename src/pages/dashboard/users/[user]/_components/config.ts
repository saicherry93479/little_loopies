import type { FormConfig } from "@/types";
import { actions } from "astro:actions";
import { z } from "zod";

const roles = await actions.getActiveRoles({});
const activeRoles = roles.data || [];
export const formConfig: FormConfig = {
  title: "Add User",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(5, {
        message: "User name must be at least 5 characters.",
      }),
      label: "User Name",
      placeholder: "Enter User name",
      space: 1, // Takes half width
    },
    {
      name: "email",
      type: "input",
      inputType: "email",
      validation: z.string().email("Invalid Email Address"),
      label: "Email",
      placeholder: "Enter  email",
      space: 1, // Takes half width
    },
    {
      name: "userType",
      type: "select",
      validation: z.string(),
      label: "User Type",
      placeholder: "Select Kind Of User",
      options: activeRoles,
      space: 1,
    },
    {
      name: "status",
      type: "select",
      validation: z.string(),
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
      ],
      space: 1,
    },
  ],
  columns: 2,
  onSubmit: async (values, isUpdate) => {
    console.log("Form values:", values);

    try {
        if (isUpdate) {
          // console.log("Updating Role:", values);
          // return await actions.updateRole({ ...values });
        } else {
          return await actions.createUser({ ...values });
        }
    } catch (e) {
      console.log("e is ", e);
    }
  },

};
