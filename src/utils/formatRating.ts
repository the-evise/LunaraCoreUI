// formatRating.ts
/**
 * Turns a number in the 1–10 range into a one‑decimal‑place string.
 *
 * @example
 * formatRating(8)   // → "8.0"
 * formatRating(4.6) // → "4.6"
 */
export function formatRating(value: number | string): string {
    // The hook guarantees `value` is already in [1, 10] and has at most one decimal.
    if (typeof value === "string") {
        return value;
    }
    return value.toFixed(1);
}
