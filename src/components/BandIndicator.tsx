import * as React from "react";
import { cva } from "class-variance-authority";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import Tooltip from "./Tooltip";

type BandIndicatorProps = {
    band: number; // 0.0 - 9.0
    prefix?: string;
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

const bandIndicator = cva(
    "relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-space-200 font-light font-dmsans text-xl border border-space-150 border-dashed bg-transparent cursor-pointer transition-colors ease-in-out duration-200 select-none w-fit h-[56px]",
    {
        variants: {
            level: {
                low: "!text-celestialblue-10/80 hover:!text-celestialblue-10 border-none !bg-space-800",
                mid: "!text-saffron-100/80 hover:!text-saffron-100 border-none !bg-persianred-600",
                high: "!text-emerald-100/80 hover:!text-emerald-100 border-none !bg-celestialblue-600",
            },
        },
        defaultVariants: {
            level: "mid",
        },
    }
);

const tooltipToneByLevel: Record<Level, "celestial" | "saffron" | "emerald"> = {
    low: "celestial",
    mid: "saffron",
    high: "emerald",
};

const shimmerVariants = {
    rest: { opacity: 0, x: "0%" },
    hover: {
        opacity: 0.32,
        x: "200%",
        transition: {
            x: {
                duration: 2.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1.1,
            },
            opacity: { duration: 0.25 },
        },
    },
} as const;

export default function BandIndicator({
    band,
    prefix = "IELTS",
    ariaLabel,
}: BandIndicatorProps) {
    const safeBand = Math.max(0, Math.min(9, band));
    const labelText = prefix.trim();
    const isDefaultLabel = labelText.toLowerCase() === "ielts";
    const formattedBand = safeBand.toFixed(1);
    const prefersReducedMotion = useReducedMotion();
    const shimmerControls = useAnimationControls();
    const [isLargeTooltip, setIsLargeTooltip] = React.useState(false);

    React.useEffect(() => {
        shimmerControls.set("rest");
    }, [shimmerControls]);

    React.useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const update = (event: MediaQueryListEvent | MediaQueryList) => {
            setIsLargeTooltip(event.matches);
        };

        update(mq);
        mq.addEventListener("change", update);

        return () => mq.removeEventListener("change", update);
    }, []);

    const handleHoverStart = React.useCallback(() => {
        if (prefersReducedMotion) return;
        shimmerControls.start("hover");
    }, [prefersReducedMotion, shimmerControls]);

    const handleHoverEnd = React.useCallback(() => {
        shimmerControls.start("rest");
    }, [shimmerControls]);

    const levelConfig =
        LEVEL_CONFIG.find((config) => safeBand < config.max) ?? LEVEL_CONFIG[1];
    const tooltipTone = tooltipToneByLevel[levelConfig.level];
    const tooltipContent = isLargeTooltip
        ? `${levelConfig.label} - ${levelConfig.tooltip}`
        : levelConfig.label;

    return (
        <Tooltip
            content={tooltipContent}
            tone={tooltipTone}
            variant="soft"
            side="bottom"
            size={isLargeTooltip ? "lg" : "sm"}
            offset={8}
            contentClassName="rounded-md leading-tight"
        >
            <motion.div
                role="status"
                aria-label={
                    ariaLabel ??
                    (isDefaultLabel
                        ? `IELTS band ${formattedBand}`
                        : `${labelText} ${formattedBand}`)
                }
                dir="ltr"
                className={bandIndicator({ level: levelConfig.level })}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                whileHover={prefersReducedMotion ? undefined : { scale: 0.99 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-full w-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-space-10/35 to-transparent opacity-0"
                    variants={shimmerVariants}
                    initial="rest"
                    animate={shimmerControls}
                />
                {labelText ? (
                    <span className="tracking-wide">{labelText}</span>
                ) : null}

                <span className="font-bold font-dmsans">
                    {formattedBand}
                </span>
            </motion.div>
        </Tooltip>
    );
}
