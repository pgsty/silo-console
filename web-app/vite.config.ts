import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";

const VIRTUAL_REFRACTOR_JSON = "\0virtual:refractor-json";
const VIRTUAL_JSPDF_STUB = "\0virtual:jspdf-stub";

function consoleBundleTrimPlugin(): Plugin {
  return {
    name: "silo-console-bundle-trim",
    enforce: "pre",
    resolveId(id) {
      if (id === "refractor/lib/all.js" || id === "refractor/lib/common.js") {
        return VIRTUAL_REFRACTOR_JSON;
      }
      if (id === "jspdf") {
        return VIRTUAL_JSPDF_STUB;
      }
      return null;
    },
    load(id) {
      if (id === VIRTUAL_REFRACTOR_JSON) {
        return [
          'import { refractor } from "refractor/lib/core.js";',
          'import json from "refractor/lang/json.js";',
          "refractor.register(json);",
          "export { refractor };",
        ].join("\n");
      }
      if (id === VIRTUAL_JSPDF_STUB) {
        return "export default class jsPDF {}";
      }
      return null;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    consoleBundleTrimPlugin(),
    react(),
    process.env.VITE_COVERAGE === "true"
      ? istanbul({
          requireEnv: true,
          checkProd: true,
          forceBuildInstrument: true,
          // Literal translation data is checked by catalog validation, not
          // executable-code coverage. Instrumenting it bloats the static asset.
          exclude: ["src/i18n/locales/**"],
        })
      : undefined,
  ],
  base: "./",
  build: {
    outDir: "build",
    manifest: true,
    sourcemap: false,
    chunkSizeWarningLimit: 2000, //use npx vite-bundle-visualizer
    rollupOptions: {
      treeshake: {
        // MDS exports components and themes; importing its barrel does not
        // require evaluating every control used by a later, lazy screen.
        moduleSideEffects: (id) =>
          id.includes("/packages/mds/src/") ? false : undefined,
      },
      checks: {
        pluginTimings: process.env.VITE_COVERAGE === "true" ? false : true,
      },
      output: {
        codeSplitting: {
          // Rolldown's manualChunks compatibility function has no group
          // priorities. Capture shared dependencies in the core groups first
          // so lazy vendors cannot own React or create initialization cycles.
          groups: [
            {
              name: "languages",
              test: /\/src\/i18n\/locales\//,
              priority: 110,
            },
            {
              name: "react-vendor",
              test: /\/node_modules\/(?:react|react-dom|react-router|react-router-dom|react-redux|redux|redux-thunk|@reduxjs\/toolkit|immer|reselect|scheduler|use-sync-external-store)\//,
              priority: 100,
            },
            {
              name: "shared-vendor",
              test: /\/node_modules\//,
              tags: ["$initial"],
              // Keep login's transport, dates and styling dependencies out
              // of later groups (charts also use some lodash helpers).
              priority: 95,
            },
            {
              name: "mds",
              // Barrels also export controls used by lazy routes. Capture
              // only the component modules actually needed by login.
              test: (id) =>
                id.includes("/packages/mds/src/") && !id.endsWith("/index.ts"),
              tags: ["$initial"],
              priority: 90,
            },
            {
              name: "markdown",
              test: /\/node_modules\/(?:react-markdown|remark-[^/]+|rehype-(?!prism-plus\/)[^/]+|unified|micromark[^/]*|mdast-[^/]+|hast-[^/]+|unist-[^/]+|vfile[^/]*)\//,
              priority: 80,
            },
            {
              name: "console-vendor",
              test: /\/node_modules\/(?:lodash|prop-types|react-is|hoist-non-react-statics)\//,
              priority: 75,
            },
            {
              name: "charts",
              test: /\/node_modules\/(?:recharts|recharts-scale|react-smooth|victory-[^/]+|d3-[^/]+)\//,
              priority: 70,
            },
            {
              name: "pdf",
              test: /\/node_modules\/(?:react-pdf|pdfjs-dist)\//,
              priority: 60,
            },
            {
              name: "editor",
              test: (id) =>
                id.includes("/packages/mds/src/components/CodeEditor/") ||
                /\/node_modules\/(?:@uiw\/react-textarea-code-editor|refractor|prismjs)\//.test(
                  id,
                ),
              priority: 50,
            },
          ],
        },
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5005,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:9090",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  legacy: {
    // still needed by "react-use-websocket" in trace
    inconsistentCjsInterop: true,
  },
});
