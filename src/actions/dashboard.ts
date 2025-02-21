import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction } from "astro:actions";
import { getMainScreenData } from "@/lib/db/queries/Dashboard";
import { protectedAction } from "./utils";

export const getStoreData = defineAction({
  input: z.object({
    storeId: z.string(),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      const finalData = await getMainScreenData({
        storeId: data.storeId,
      });
      return {
        success: true,
        data: finalData,
        message: "Store Data fetched successfully",
        storeId: data.storeId,
      }
    } catch (error) {
      console.error("Failed to get Store Data:", error);
      return {
        success: false,
        message: "Failed to get Store Data",
      };
    }
  }),
});
