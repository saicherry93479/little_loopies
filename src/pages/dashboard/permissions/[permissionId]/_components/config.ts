
import type { FormConfig } from "@/types";
import { actions } from "astro:actions";
import { z } from "zod";

const dataFromCategories = await  actions.getActiveCategories({});

const categoriesMap = dataFromCategories.data || [];
export const formConfig: FormConfig = {
  title: "Add Permission",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(2, {
        message: "Permission name must be at least 2 characters.",
      }),
      label: "Permission Name",
      placeholder: "Enter product name",
      space: 1, // Takes half width
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string().min(10),
      label: "Description",
      placeholder: "Enter Permission description",
      space: 2,
    },
  ],
  columns: 2,
  onSubmit: async (values, isUpdate) => {
    console.log("Form values:", values);

    try {
      if (isUpdate) {
        // console.log("Updating product:", values);
        return await actions.updatePermission({ ...values });
      } else {
        return await actions.createPermission({ ...values });
      }
    } catch (e) {
      console.log("e is ", e);
    }
  },
 
};
