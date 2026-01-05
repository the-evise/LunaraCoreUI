export function cn(...classes: (string | false | undefined | null)[]) {
    return classes.filter(Boolean).join(" ");
}

export function detectLang(text: string): "fa" | "en" {
    return /[\u0600-\u06FF]/.test(text) ? "fa" : "en";
}

