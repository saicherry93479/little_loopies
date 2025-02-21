export function env(key: string) {
    if ("Deno" in globalThis) {
      // @ts-ignore Deno is available during runtime
      return Deno.env.get(key) || "";
    }
    if (import.meta.env.DEV) {
      return import.meta.env[key];
    }
  }
  