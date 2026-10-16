import { sveltekit } from "@sveltejs/kit/vite";
import bunAdapter from "@sveltejs/adapter-bun";
import vercelAdapter from "@sveltejs/adapter-vercel";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig, loadEnv } from "vite";
import process from "process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(process.env.APP_PORT || env.APP_PORT) || 3005;
  const isVercel = Boolean(process.env.VERCEL);

  return {
    plugins: [
      sveltekit({
        adapter: isVercel
          ? vercelAdapter()
          : bunAdapter({
              envPrefix: "APP_",
              serverOptions: {
                port: port,
              },
            }),
        inlineStyleThreshold: 200000,
      }),
      tailwindcss(),
      svelteTesting(),
    ],
    resolve: {
      alias: {
        $lib: path.resolve(__dirname, "src/lib"),
      },
    },
    server: {
      port: port,
    },
    preview: {
      port: port,
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
      ...(mode === "test"
        ? {
            "import.meta.env.VITE_DELCOM_BASEURL": JSON.stringify(
              "https://open-api.delcom.org/api/v1"
            ),
          }
        : {}),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      include: ["src/**/*.{test,spec}.{js,ts}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{ts,svelte}"],
        exclude: [
          "node_modules/",
          "src/setupTests.ts",
          "src/test-utils.ts",
          "src/tests/**",
          "src/features/**/types.ts",
          "src/routes/**/+error.svelte",
          "src/routes/**/+server.ts",
          "**/*.d.ts",
        ],
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  };
});