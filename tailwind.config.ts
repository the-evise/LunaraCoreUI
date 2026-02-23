// @ts-ignore
import type { Config } from "tailwindcss";

const mergeContent = (content: Config["content"]): Config["content"] => {
    if (Array.isArray(content)) {
        return Array.from(new Set(content));
    }

    return content ?? [];
};

const withLocalSharedConfig = (config: Config): Config => {
    return {
        ...config,
        content: mergeContent(config.content),
        theme: {
            ...(config.theme ?? {}),
            extend: {
                ...(config.theme?.extend ?? {}),
            },
        },
    };
};

const config: Config = withLocalSharedConfig({
    content: [
        "./src/**/*.{ts,tsx}",
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
