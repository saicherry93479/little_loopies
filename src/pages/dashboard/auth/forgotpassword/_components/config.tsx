import type { FormConfig } from "@/types";
import { z } from "zod";

export const forgotConfig: FormConfig = {
  title: "Forgot Password ",
  fields: [
    {
      name: "email",
      type: "input",
      inputType: "email",
      validation: z.string().email("Invalid email address"),
      label: "Email Address",
      placeholder: "Enter email address",
      space: 2,
    },
  ],
  onSubmit: function (values: any, isUpdate: boolean): Promise<any> {
    throw new Error("Function not implemented.");
  },
};
