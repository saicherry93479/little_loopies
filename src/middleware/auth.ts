import { defineMiddleware } from "astro:middleware";
import { fetchUser } from "./index";

export const authMiddleware = defineMiddleware(
  async ({ cookies, locals, redirect, url }, next) => {
    // Protected routes that require authentication
    const protectedRoutes = [
      "/account",
      "/orders",
      "/checkout",
    ];

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      url.pathname.startsWith(route)
    );

    // If it's a protected route and user is not authenticated, redirect to login
    if (isProtectedRoute && !locals.user) {
      // Store the original URL to redirect back after login
      const returnUrl = encodeURIComponent(url.pathname + url.search);
      return redirect(`/auth/login?returnUrl=${returnUrl}`, 302);
    }

    // If trying to access auth pages while already logged in, redirect to home
    if (url.pathname.startsWith("/auth/") && locals.user) {
      return redirect("/", 302);
    }

    return next();
  }
);