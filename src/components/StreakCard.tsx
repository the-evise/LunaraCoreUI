import * as React from "react";
import "material-symbols";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../utils/cn";
import type { StreakEntry } from "./StreakButton";

export type StreakCardProps = {
    /** Entries should be ordered oldest -> newest. */
    entries?: StreakEntry[];
    totalPoints?: number;
    todayPoints?: number;
    label?: string;
    subtitle?: string;
    ctaLabel?: string;
    onCtaClick?: () => void;
    className?: string;
};

const cardVariants = cva(
    "group w-full 2xl:w-[446px] h-[400px] flex flex-col rounded-3xl border-1 border-space-150 bg-space-10 text-space-900 overflow-hidden transition-colors duration-300 ease-in-out hover:ring-2 ring-saffron-200 select-none transform-gpu",
);

const EASE = [0.33, 1, 0.68, 1] as const;
const BAR_BASE_HEIGHT = 12;
const BAR_MAX_EXTRA = 52;

const getCurrentStreakDays = (entries: StreakEntry[]) => {
    if (!entries.length) return 0;
    const todayIndex = entries.findIndex((entry) => entry.isToday);
    const startIndex = todayIndex === -1 ? entries.length - 1 : todayIndex;
    let count = 0;
    for (let i = startIndex; i >= 0; i -= 1) {
        if (entries[i].points <= 0) break;
        count += 1;
    }
    return count;
};

export default function StreakCard({
    entries,
    totalPoints,
    todayPoints,
    label = "Streak",
    subtitle,
    ctaLabel,
    onCtaClick,
    className,
}: StreakCardProps) {
    const resolvedEntries = entries ?? [];
    const prefersReducedMotion = useReducedMotion();

    const resolvedTotalPoints =
        totalPoints ??
        resolvedEntries.reduce((sum, entry) => sum + entry.points, 0);
    const todayEntryPoints = resolvedEntries.find((entry) => entry.isToday)?.points;
    const resolvedTodayPoints = todayPoints ?? todayEntryPoints ?? 0;
    const maxPoints = resolvedEntries.length
        ? Math.max(1, ...resolvedEntries.map((entry) => entry.points))
        : 1;
    const activeDays = resolvedEntries.filter((entry) => entry.points > 0).length;
    const currentStreakDays = getCurrentStreakDays(resolvedEntries);
    const streakLabel = currentStreakDays === 1 ? "day" : "days";
    const todayLabel = resolvedTodayPoints === 1 ? "point" : "points";
    const resolvedSubtitle =
        subtitle ?? (resolvedEntries.length ? "Daily points" : "No activity yet");
    const resolvedCtaLabel =
        ctaLabel ?? (resolvedEntries.length ? "View streak" : "Start streak");

    return (
        <motion.div
            className={cn(cardVariants(), className)}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -18 }}
            animate={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }
            }
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : { scale: 0.98, transition: { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } }
            }
            style={{ willChange: "transform, opacity" }}
        >
            <motion.div
                className="flex h-full flex-col p-4"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? undefined : { duration: 0.5, ease: EASE }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-600 ring-1 ring-saffron-150">
                            <span className="material-symbols-rounded text-2xl" aria-hidden="true">
                                local_fire_department
                            </span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-space-400">
                                {label}
                            </p>
                            <p className="text-sm text-space-500">{resolvedSubtitle}</p>
                        </div>
                    </div>
                    <div
                        className={cn(
                            "rounded-full border px-3 py-1 text-xs font-semibold",
                            currentStreakDays
                                ? "border-saffron-200 bg-saffron-50/60 text-saffron-700"
                                : "border-space-150 bg-space-50 text-space-500",
                        )}
                    >
                        {currentStreakDays
                            ? `${currentStreakDays} ${streakLabel} streak`
                            : "Start today"}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-[1.1fr_0.9fr] gap-4">
                    <div className="rounded-2xl border border-space-100 bg-white/80 p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">
                            Total points
                        </p>
                        <p className="mt-2 text-2xl md:text-4xl font-light text-space-900 font-dmsans">
                            {resolvedTotalPoints}
                        </p>
                        <p className="mt-1 text-xs text-space-500">
                            Earn 1 point per quiz or review.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-saffron-150 bg-saffron-50/70 p-3">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-saffron-700">
                                Today
                            </p>
                            <span className="material-symbols-rounded text-saffron-500" aria-hidden="true">
                                bolt
                            </span>
                        </div>
                        <p className="mt-2 text-md md:text-2xl font-semibold text-space-900 font-dmsans">
                            {resolvedTodayPoints} {todayLabel}
                        </p>
                        <p className="text-xs text-space-500">Quiz + Review</p>
                    </div>
                </div>

                <div className="mt-5 flex-1">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">
                            Recent days
                        </p>
                        <p className="text-xs text-space-500">
                            {activeDays} active
                        </p>
                    </div>
                    {resolvedEntries.length ? (
                        <div className="mt-4 flex items-end justify-between gap-2">
                            {resolvedEntries.map((entry, index) => {
                                const barHeight =
                                    BAR_BASE_HEIGHT +
                                    Math.round((entry.points / maxPoints) * BAR_MAX_EXTRA);
                                return (
                                    <div
                                        key={`${entry.label}-${index}`}
                                        className="flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div
                                            className={cn(
                                                "w-3 rounded-full transition-colors",
                                                entry.isToday
                                                    ? "bg-saffron-400"
                                                    : entry.points > 0
                                                        ? "bg-space-200"
                                                        : "bg-space-150",
                                            )}
                                            style={{ height: `${barHeight}px` }}
                                            title={`${entry.label}: ${entry.points} ${
                                                entry.points === 1 ? "point" : "points"
                                            }`}
                                        />
                                        <span
                                            className={cn(
                                                "text-[10px] uppercase tracking-[0.2em] text-space-400",
                                                entry.isToday && "text-saffron-600",
                                            )}
                                        >
                                            {entry.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="mt-3 text-md text-space-400">
                            Complete a quiz to start tracking your streak.
                        </p>
                    )}
                </div>
            </motion.div>

            <button
                type="button"
                onClick={onCtaClick}
                className={cn(
                    "group/btn relative py-2 text-center text-sm font-semibold",
                    "border-t border-space-150 bg-space-10 text-space-600 transition-colors duration-300",
                    "hover:text-saffron-700 group-hover:bg-saffron-50/70 cursor-pointer",
                )}
            >
                {resolvedCtaLabel}
            </button>
        </motion.div>
    );
}
