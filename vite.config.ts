// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only, using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// STATIC_BUILD=1 builds a fully static SPA (no Nitro server) for cPanel, where only
// static files can be hosted. The default build keeps the Netlify/Nitro server output.
const isStaticBuild = process.env["STATIC_BUILD"] === "1";

export default defineConfig({
  nitro: isStaticBuild ? false : { preset: "netlify" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isStaticBuild
      ? {
          // Emit the SPA shell as dist/client/index.html so Apache/cPanel can serve
          // client-side routes directly (paired with public/.htaccess rewrites).
          spa: { enabled: true, prerender: { outputPath: "/index" } },
        }
      : {}),
  },
});
