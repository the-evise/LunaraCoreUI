import { withSharedConfig } from "@lunara/tailwind";
// @ts-ignore
import type { Config } from "tailwindcss";

const config: Config = withSharedConfig({
    content: [
        "./src/**/*.{ts,tsx}",               // internal components
        "../../core-web/src/**/*.{ts,tsx}",  // optional, for cross-testing
    ],
    theme: {
        extend: {},
    },
    plugins: [
        function({ addVariant }) {
            addVariant("bt-hover", [".bt:hover &"]);
        },
    ],
});

export default config;
