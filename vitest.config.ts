import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // react-loader-spinner's ESM entry imports styled-components, whose CJS build
    // relies on __esModule interop that Node's native ESM loader ignores.
    // Inlining it makes Vitest apply Vite's interop instead of crashing.
    server: {
      deps: {
        inline: ["react-loader-spinner"],
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
