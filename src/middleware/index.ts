import { defineMiddleware, sequence } from "astro:middleware";
import { users, type User } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";
import { authMiddleware } from "./auth";
import type { AstroCookies } from "astro";


const AUTH_COOKIE = "accessToken";

export async function fetchUser(cookies: AstroCookies) {
  let tokens = cookies.get(AUTH_COOKIE)?.json();
  console.log('cookies are ',cookies)
  if (!tokens) return null;
  if (tokens.expiresAt < new Date()) {
    cookies.delete(AUTH_COOKIE);
    return null;
  }
  try {
    let user: User | undefined;
    user = await db.query.users.findFirst({
      where: eq(users.id, tokens.userId),
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (e) {
    return null;
  }
}

const auth = defineMiddleware(
  async ({ cookies, locals, redirect, url }, next) => {
    const user = await fetchUser(cookies);
    locals.user = user;

  

    if (user) {
      if (user.userType === "customer") {
        if (url.pathname.startsWith("/dashboard")) {
          return redirect("/", 302);
        }
      } else {
        if (url.pathname.startsWith("/dashboard/auth")) {
          return redirect("/dashboard", 302);
        }
        const permissionsAll = await db.query.rolePermissions.findMany({
          with: {
            permission: true,
            role: true,
          },
        });

        const permissions = permissionsAll
          .filter(
            (permission) =>
              permission.role.name.toLowerCase() === user.userType.toLowerCase()
          )
          .map((permission) => permission.permission.name);
        locals.permissions = permissions || [];
      }
    } else {
      if (
        url.pathname.startsWith("/dashboard") &&
        url.pathname !== "/dashboard/auth"
      ) {
        return redirect("/dashboard/auth", 302);
      }
    }
    const res = await next();

    return res;
  }
);

export const onRequest = sequence(logger, auth, authMiddleware);
