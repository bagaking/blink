import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";

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
            // 添加以下配置
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
});
