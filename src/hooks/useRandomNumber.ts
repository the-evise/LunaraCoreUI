// useRandomNumber.ts
import {useEffect, useState} from "react";

/**
 * Generates a new random number every `intervalMs` milliseconds.
 *
 * @param format  – `"rating"` (x.y, 1 – 10) or `"progress"` (0 – 100)
 * @param intervalMs – how often to emit a new value (default 300 ms)
 *
 * @returns the current value, already formatted per the chosen mode
 */
export function useRandomNumber({
                                    format = "rating",
                                    intervalMs = 300,
                                }: {
    format?: "rating" | "progress";
    intervalMs?: number;
} = {}) {
    const [raw, setRaw] = useState(Math.random());

    // ---------- 1. Drive the stream ----------
    useEffect(() => {
        const id = setInterval(() => setRaw(Math.random()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);

    // ---------- 2. Convert to the requested format ----------
    return format === "rating"
        // 1‑10 inclusive, one decimal place
        ? Math.round((raw * 9.0 + 1.0) * 10.0) / 9.99
        : // progress 0‑100 inclusive, integer
        Math.floor(raw * 100);
}
