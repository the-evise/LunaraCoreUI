import * as React from "react";
import {cva} from "class-variance-authority";

type IELTSLevelIndicatorProps = {
    score: number; // 0.0 – 9.0
    label?: string;
    ariaLabel?: string;
};

type Level = "low" | "mid" | "high";

const LEVEL_CONFIG = [
    {
        max: 5.5,
        level: "low",
        label: "Basic proficiency",
        tooltip: "Limited command of the language",
    },
    {
        max: 7.0,
        level: "mid",
        label: "Operational proficiency",
        tooltip: "Effective command with occasional inaccuracies",
    },
    {
        max: Infinity,
        level: "high",
        label: "Advanced proficiency",
        tooltip: "Fully operational command of the language",
    },
] as const satisfies readonly {
    max: number;
    level: Level;
    label: string;
    tooltip: string;
}[];

const ieltsIndicator = cva(
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-space-200 font-light font-dmsans text-xl border border-space-150 border-dashed bg-transparent",
    {
        variants: {
            level: {
                low: "!text-saffron-100 border-none !bg-persianred-600",
                mid: "!text-saffron-100 border-none !bg-persianred-600",
                high: "",
            },
        },
        defaultVariants: {
            level: "mid",
        },
    }
);

export default function IELTSLevelIndicator({
                                                score,
                                                label = "IELTS",
                                                ariaLabel,
                                            }: IELTSLevelIndicatorProps) {
    const safeScore = Math.max(0, Math.min(9, score));

    const levelConfig =
        LEVEL_CONFIG.find(c => safeScore < c.max) ?? LEVEL_CONFIG[1];

    return (
        <div
            role="status"
            aria-label={ariaLabel ?? `IELTS level ${safeScore}`}
            dir="ltr"
            title={levelConfig.tooltip}
            className={ieltsIndicator({ level: levelConfig.level })}
        >
            <span className="tracking-wide">{label}</span>

            <span className="font-bold font-dmsans">
                {safeScore.toFixed(1)}
            </span>
        </div>
    );
}
