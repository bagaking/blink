import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: "src/main/main.ts",
        vite: {
          build: {
            outDir: "dist/main",
            rollupOptions: {
              external: ["electron"],
            },
          },
        },
      },
      {
        entry: "src/preload/preload.ts",
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: "dist/preload",
            rollupOptions: {
              external: ["electron"],
            },
            lib: {
              entry: "src/preload/preload.ts",
              formats: ["cjs"],
            },
            minify: false,
          },
        },
      },
    ]),
  ],
  build: {
    outDir: "dist/renderer",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
