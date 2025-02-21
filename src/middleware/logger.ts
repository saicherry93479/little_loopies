import { logToFile } from "@/lib/utils/logger";
import { defineMiddleware } from "astro:middleware";

const red = (str: string) => `\x1b[31m${str}\x1b[0m`;
const green = (str: string) => `\x1b[32m${str}\x1b[0m`;
const yellow = (str: string) => `\x1b[33m${str}\x1b[0m`;
const blue = (str: string) => `\x1b[34m${str}\x1b[0m`;

if (import.meta.env.PROD) {
  logToFile.init();
  console.log = logToFile;
  console.error = logToFile;
}

export const logger = defineMiddleware(async ({ url, request: req }, next) => {
  const start = Date.now();
  const res = await next();
  const ms = Date.now() - start;
  const method = req.method;
  const path = url.pathname;
  const status = res.status;

  const color =
    status >= 500 ? red : status >= 400 ? yellow : status >= 300 ? blue : green;

  // [method] path - status - ms
  console.log(
    `${color(status.toString())} ${method} ${path} - ${status} - ${ms}ms`,
  );

  if (status == 302) {
    console.log("<-- Redirecting to", res.headers.get("Location"));
  }

  return res;
});
