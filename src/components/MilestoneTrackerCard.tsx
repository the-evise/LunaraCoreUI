import * as React from "react";
import "material-symbols";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import Progress from "./Progress";
import { cn } from "../utils/cn";

export type MilestoneTrackerCardProps = {
    currentLevel: number;
    targetLevel: number;
    progress?: number;
    label?: string;
    subtitle?: string;
    badgeLabel?: string;
    className?: string;
};

const cardVariants = cva(
    [
        "group relative w-full 2xl:w-[446px] min-h-[220px] flex flex-col",
        "rounded-3xl bg-white/85 text-space-900 shadow-sm ring-1 ring-space-100/70",
        "overflow-hidden transition-colors duration-300 ease-out select-none",
    ].join(" ")
);

const EASE = [0.33, 1, 0.68, 1] as const;
const baseTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 0.1,
} as const;

const clampBand = (value: number) => Math.max(0, Math.min(9, value));

export default function MilestoneTrackerCard({
    currentLevel,
    targetLevel,
    progress,
    label = "Milestone tracker",
    subtitle = "Level journey",
    badgeLabel = "Active",
    className,
}: MilestoneTrackerCardProps) {
    const prefersReducedMotion = useReducedMotion();
    const safeCurrent = clampBand(currentLevel);
    const safeTarget = Math.max(safeCurrent, clampBand(targetLevel));
    const gap = Math.max(0, safeTarget - safeCurrent);
    const progressValue =
        typeof progress === "number"
            ? Math.min(Math.max(progress, 0), 100)
            : safeTarget === 0
                ? 0
                : Math.min((safeCurrent / safeTarget) * 100, 100);

    return (
        <motion.div
            className={cn(cardVariants(), className)}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: baseTransition }
            }
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : { y: -3, scale: 0.99, transition: baseTransition }
            }
            style={{ willChange: prefersReducedMotion ? undefined : "transform, opacity" }}
        >
            {!prefersReducedMotion ? (
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-celestialblue-100/60 blur-3xl"
                    animate={{ opacity: [0.45, 0.7, 0.45], scale: [1, 1.08, 1] }}
                    transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
                />
            ) : null}
            <motion.div
                className="flex items-center justify-between gap-3 px-4 pt-4"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? undefined : { duration: 0.4, ease: EASE, delay: 0.05 }}
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-celestialblue-50 text-celestialblue-600 ring-1 ring-celestialblue-100/80">
                        <span className="material-symbols-rounded text-2xl" aria-hidden="true">
                            auto_graph
                        </span>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-space-400">
                            {label}
                        </p>
                        <p className="text-sm text-space-500">{subtitle}</p>
                    </div>
                </div>
                <div className="rounded-full bg-celestialblue-100 px-3 py-1 text-xs font-semibold text-celestialblue-700 ring-1 ring-celestialblue-200/60 self-end">
                    {badgeLabel}
                </div>
            </motion.div>

            <motion.div
                className="flex flex-1 flex-col gap-4 rounded-2xl border border-space-100/70 bg-space-50/80 m-4 p-4 transition-colors duration-300 group-hover:bg-space-50"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? undefined : { duration: 0.4, ease: EASE, delay: 0.12 }}
            >
                <motion.div
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-space-100/80 bg-white/80 px-3 py-3 transition-colors duration-300 group-hover:bg-white"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? undefined : { duration: 0.4, ease: EASE, delay: 0.18 }}
                >
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-[0.2em] text-space-400">
                            Current
                        </span>
                        <span className="text-2xl font-semibold text-space-900">
                            {safeCurrent.toFixed(1)}
                        </span>
                    </div>
                    <span className="material-symbols-rounded text-space-400">arrow_forward</span>
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-[0.2em] text-space-400">
                            Target
                        </span>
                        <span className="text-2xl font-semibold text-space-900">
                            {safeTarget.toFixed(1)}
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    className="space-y-2"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? undefined : { duration: 0.35, ease: EASE, delay: 0.22 }}
                >
                    <div className="flex items-center justify-between text-xs text-space-500">
                        <span>Progress</span>
                        <span>{Math.round(progressValue)}%</span>
                    </div>
                    <Progress orientation="horizontal" value={progressValue} tone="space" size="md" />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
