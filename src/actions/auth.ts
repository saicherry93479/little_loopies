import { db } from "@/lib/db";
import { sessions, tempUsers, users, type User } from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { mailSender } from "@/lib/aws/mail";
import { hashPassword, verifyPassword } from "@/lib/utils/password";

// Login Action
export const login = defineAction({
  input: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  handler: async (data, { cookies, locals }) => {
    try {
      console.log("came here login ", data);
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email));
      console.log("user is ", user);
      if(!user || user.length === 0){
        return {
          success: false,
          message: "Invalid email or password",
        };
      }
      if (
        user.length === 0 ||
        !(await verifyPassword(data.password, user[0].password))
      ) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const accessToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await db.insert(sessions).values({
        userId: user[0].id, 
        accessToken, 
        expiresAt: expiresAt, 
        createdAt: new Date(),
        lastUsedAt: new Date(),
        userAgent: undefined,
        ipAddress: "unknown"
      });

      cookies.set(
        "accessToken",
        {
          accessToken: accessToken,
          userId: user[0].id,
          expiresAt: expiresAt,
        },
        {
          path: "/",
          expires: expiresAt,
        }
      );

      locals.user = user[0];
      
      // If user is a store type, check if they're trying to access customer site
      if (user[0].userType === "Store" && !req.url.includes("/dashboard")) {
        return {
          success: false,
          message: "Store accounts can only access the dashboard",
        };
      }

      return {
        success: true,
        message: "Login successful",
      };
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      return {
        success: false,
        message: error.message || "Failed to login",
      };
    }
  },
});

// Logout Action
export const logout = defineAction({
  input: z.object({}),
  handler: async (_, { cookies, locals }) => {
    try {
      const accessToken = cookies.get("accessToken")?.json();

      if (!accessToken) {
        return {
          success: true,
          message: "Logout successful",
        };
      }

      await db
        .delete(sessions)
        .where(eq(sessions.accessToken, accessToken.accessToken));

      cookies.set("accessToken", "", {
        httpOnly: true,
        secure: import.meta.env.PROD,
        expires: new Date(),
        path: "/",
      });
      locals.user = null;

      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      console.error("Error logging out:", error);
      return {
        success: false,
        message: "Failed to log out",
      };
    }
  },
});

const emailActionInput = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("signup"),
    email: z.string().email(),
    name: z.string().min(2),
  }),
  z.object({
    type: z.literal("forgot"),
    email: z.string().email(),
  }),
]);

export const sendPasswordSetupEmail = defineAction({
  input: emailActionInput,
  async handler(data) {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (data.type === "signup") {
        if (existingUser) {
          return {
            success: false,
            error:
              "Email already registered. Please use forgot password if you need to reset.",
          };
        }
      } else {
        if (!existingUser) {
          return {
            success: false,
            error: "No account found with this email address.",
          };
        }
      }

      await db.delete(tempUsers).where(eq(tempUsers.email, data.email));

      const tempUser = await db
        .insert(tempUsers)
        .values({
          name: data.type === "signup" ? data.name : (existingUser?.name ?? ""), // Use existing name for forgot password
          email: data.email,
          type: data.type === "signup" ? "new_signup" : "password_reset",
        })
        .returning()
        .get();

      const emailResult = await mailSender.sendEmailForPassword({
        email: data.email,
        name: tempUser.name,
        token: tempUser.token,
        type: data.type,
        domain: "https://localhost:4321",
      });

      if (!emailResult.success) {
        await db.delete(tempUsers).where(eq(tempUsers.id, tempUser.id));

        return {
          success: false,
          error: "Failed to send email",
        };
      }

      return {
        success: true,
        message:
          data.type === "signup"
            ? "Verification email sent successfully"
            : "Password reset email sent successfully",
      };
    } catch (error) {
      console.error("Password setup action error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
});

export const checkTokenValidity = defineAction({
  input: z.object({
    token: z.string().uuid(),
  }),
  async handler({ token }, { locals }) {
    try {
      const tempUser = await db.query.tempUsers.findFirst({
        where: and(
          eq(tempUsers.token, token),
          eq(tempUsers.used, false),
          sql`date(${tempUsers.expiresAt},'unixepoch') > datetime('now')`
        ),
      });
      if (!tempUser) {
        return {
          success: false,
          error: "Invalid or expired token",
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      console.error("validity  password action error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
});

export const setPassword = defineAction({
  input: z
    .object({
      token: z.string().uuid(),
      password: z.string().min(8),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
  async handler({ token, password }, { locals, cookies }) {
    try {
      // Find valid temp user entry first - outside transaction
      const tempUser = await db.query.tempUsers.findFirst({
        where: and(
          eq(tempUsers.token, token),
          eq(tempUsers.used, false),
          sql`date(${tempUsers.expiresAt},'unixepoch') > datetime('now')`
        ),
      });

      if (!tempUser) {
        return {
          success: false,
          error: "Invalid or expired token",
        };
      }

      // Hash the password outside transaction
      const hashedPassword = await hashPassword(password);
      const accessToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      let user: User;

      // Split into smaller transactions if needed
      try {
        // Transaction 1: Handle user creation/update
        await db.transaction(async (tx) => {
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            userType: users.userType,
            status: users.status,
            password: users.password,
            createdAt: users.createdAt
          })
            user = await tx
              .insert(users)
              .values({
                name: tempUser.name,
                email: tempUser.email,
                password: hashedPassword,
                userType: "customer",
                status: "active",
              })
              .returning()
              .get();
          } else {
            user = await tx
              .update(users)
              .set({ password: hashedPassword })
              .where(eq(users.email, tempUser.email))
              .returning()
              .get();
          }
        });

        // Transaction 2: Update temp user and create session
        await db.transaction(async (tx) => {
          // Mark temp user as used
          await tx
            .update(tempUsers)
            .set({ used: true })
            .where(eq(tempUsers.id, tempUser.id));

          // Create session
          await tx.insert(sessions).values({
            userId: user.id,
            accessToken,
            expiresAt: expiresAt,
          });
        });

        // Set cookies after successful transactions
        cookies.set(
          "accessToken",
          {
            accessToken: accessToken,
            userId: user.id,
            expiresAt: expiresAt,
          },
          {
            path: "/",
            expires: expiresAt,
          }
        );

        locals.user = user;

        return {
          success: true,
          message: `Password ${tempUser.type === "new_signup" ? "set" : "reset"} successfully`,
        };
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw new Error("Database transaction failed");
      }
    } catch (error) {
      console.error("Set password action error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to set password. Please try again.",
      };
    }
  },
});
