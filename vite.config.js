import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

function inlineBuildStyles() {
  return {
    name: "inline-build-styles",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, { bundle }) {
        if (!bundle) return html;

        return html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, (linkTag) => {
          const href = linkTag.match(/\bhref="\/?([^"]+\.css)"/)?.[1];
          const stylesheet = href ? bundle[href] : null;
          if (!stylesheet || stylesheet.type !== "asset") return linkTag;

          const css =
            typeof stylesheet.source === "string"
              ? stylesheet.source
              : new TextDecoder().decode(stylesheet.source);
          delete bundle[href];
          return `<style>${css}</style>`;
        });
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";

  return {
    plugins: [
      svelte({
        prebundleSvelteLibraries: false,
      }),
      tailwindcss(),
      svelteTesting(),
      inlineBuildStyles(),
    ],
    server: {
      port: Number(env.APP_PORT) || 3004,
    },
    preview: {
      port: Number(env.APP_PORT) || 3004,
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
    define: {
      // Dipakai untuk membentuk URL aset (gambar) — selalu absolut.
      DELCOM_BASEURL: JSON.stringify(baseUrl),
      // Dipakai untuk request API. Di production lewat proxy same-origin (/delcom-api,
      // lihat vercel.json) sehingga tidak ada request lintas-origin/CORS preflight.
      DELCOM_API_URL: JSON.stringify(mode === "production" ? "/delcom-api" : baseUrl),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,svelte}"],
        exclude: [
          "src/main.js",
          "src/setupTests.js",
          "src/test-utils.js",
          "**/*.test.{js,jsx}",
          "node_modules/**",
          ".docs/**",
        ],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  };
});
