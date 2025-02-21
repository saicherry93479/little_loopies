import type { FormConfig } from "@/types";
import { actions } from "astro:actions";
import { z } from "zod";

export const signInConfig: FormConfig = {
  title: "Log In to Your Account",
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
    {
      name: "password",
      type: "input",
      inputType: "password",
      validation: z
        .string()
        .min(6, "password should be  at least 2 characters"),
      label: "Password",
      placeholder: "Enter Password",
      space: 2,
    },
  ],
  onsuccess: '/dashboard',
  onSubmit: async function (values: any, isUpdate: boolean): Promise<any> {
    console.log("values ", values);
    const resp=await actions.login({
      email: values.email,
      password: values.password,
    });
    console.log('reps is ',resp)
    return  resp;
  },
};
