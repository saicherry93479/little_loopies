import { db } from "@/lib/db";
import { newsletterSubscriptions } from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const subscribeNewsletter = defineAction({
  input: z.object({
    email: z.string().email("Please enter a valid email address"),
  }),
  handler: async (data) => {
    try {
      // Check if email already exists
      const existing = await db.query.newsletterSubscriptions.findFirst({
        where: eq(newsletterSubscriptions.email, data.email),
      });

      if (existing) {
        if (existing.status === "unsubscribed") {
          // Reactivate subscription
          await db
            .update(newsletterSubscriptions)
            .set({ status: "active", updatedAt: new Date() })
            .where(eq(newsletterSubscriptions.email, data.email));
          return {
            success: true,
            message: "Welcome back! Your subscription has been reactivated.",
          };
        }
        return {
          success: false,
          message: "This email is already subscribed to our newsletter.",
        };
      }

      // Create new subscription
      await db.insert(newsletterSubscriptions).values({
        email: data.email,
        status: "active",
      });

      return {
        success: true,
        message: "Thank you for subscribing to our newsletter!",
      };
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        message: "Failed to subscribe. Please try again later.",
      };
    }
  },
}); 