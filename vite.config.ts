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
    {
      name: "vscode-icons",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/@vscode-icons/")) {
            const iconPath = req.url.replace("/@vscode-icons/", "");
            const filePath = path.resolve(
              __dirname,
              "node_modules/vscode-icons-js/icons",
              iconPath
            );
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "image/svg+xml");
              fs.createReadStream(filePath).pipe(res);
            } else {
              next();
            }
          } else {
            next();
          }
        });
      },
    },
  ],
  build: {
    outDir: "dist/renderer",
    emptyOutDir: true,
  },
  server: {
    port: 5173, // 确保这里的端口与 main.ts 中的一致
  },
});
