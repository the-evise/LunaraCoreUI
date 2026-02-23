import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolvePagesBase(): string {
    const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
    const inferredBase = repoName ? `/${repoName}` : "";
    const requestedBase =
        process.env.BASE_PATH ??
        (process.env.GITHUB_ACTIONS === "true" ? inferredBase : "");

    return requestedBase === "/" ? "" : requestedBase;
}

export default defineConfig(({ mode }) => {
    const isPagesBuild = mode === "pages" || process.env.BUILD_TARGET === "pages";

    return {
        base: isPagesBuild ? resolvePagesBase() : undefined,
        plugins: [react(), tailwind()],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },
        build: isPagesBuild
            ? {
                  sourcemap: true,
                  outDir: "dist-pages",
                  emptyOutDir: true,
              }
            : {
                  lib: {
                      entry: resolve(__dirname, "src/index.ts"),
                      name: "CoreUI",
                      fileName: (format) => `index.${format}.js`,
                      formats: ["es", "cjs"],
                  },
                  rollupOptions: {
                      external: ["react", "react-dom"],
                      output: {
                          globals: {
                              react: "React",
                              "react-dom": "ReactDOM",
                          },
                      },
                  },
                  sourcemap: true,
                  outDir: "dist",
                  emptyOutDir: true,
              },
        assetsInclude: ["**/*.riv"],
    };
});
