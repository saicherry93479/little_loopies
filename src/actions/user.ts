import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { generatePassword, hashPassword } from "@/lib/utils/password";
import { mailSender } from "@/lib/aws/mail";
import { z } from "zod";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

export const createUser = defineAction({
  input: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    status: z.enum(["pending", "active", "suspended"]),
    userType: z.string(),
  }),
  handler: async ({ name, email, status, userType }, { locals }) => {
    try {
      const password = generatePassword();
      const hash = await hashPassword(password);

      const userPresent = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (userPresent) {
        return {
          success: false,
          message: "User Already Present with same mail",
        };
      }

      await db.insert(users).values({
        email: email,
        userType: userType,
        status: status,
        password: hash,
        name: name,
      });
      const resp = await mailSender.sendPasswordEmail(
        "cherry.workspace.mail@gmail.com",
        password
      );
      console.log("response from email service is ", resp);
      if (resp.success) {
        return {
          success: true,
          message: "User creatd Successfully",
        };
      }
      return {
        success: true,
        message: "created,send password manually",
      };
    } catch (e) {
      console.log("unable to create user ", e);
      return {
        success: false,
        message: "Unable to create user",
      };
    }
  },
});
