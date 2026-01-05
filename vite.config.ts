import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), tailwind()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
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
});
