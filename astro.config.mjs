// @ts-check
import { defineConfig } from "astro/config";
import deno from "@astrojs/deno";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  adapter: deno({}),
  output: "server",
  experimental: {},
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: ["npm:nodemailer"],
      },
    },
    resolve: {
      alias: {
        "@": "/src",
        ...(import.meta.env.PROD && {
          "react-dom/server": "react-dom/server.edge",
        }),
      },
    },
  },
});
