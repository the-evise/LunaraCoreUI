import "material-symbols";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../utils/cn";

export type ComingSoonCardProps = {
    title: string;
    description?: string;
    highlights?: string[];
    etaLabel?: string;
    label?: string;
    badgeLabel?: string;
    icon?: string;
    className?: string;
};

const cardVariants = cva(
    "group w-full 2xl:w-[446px] flex flex-col rounded-3xl bg-white/80 text-space-900 shadow-sm ring-1 ring-space-100/70 transition-colors duration-300 ease-out select-none"
);

const EASE = [0.33, 1, 0.68, 1] as const;
const baseTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 0.1,
} as const;

export default function ComingSoonCard({
    title,
    description = "A new learning mode is landing soon. Stay curious and keep your streak glowing.",
    highlights,
    etaLabel = "Soon",
    label = "New feature",
    badgeLabel = "Coming soon",
    icon = "auto_awesome",
    className,
}: ComingSoonCardProps) {
    const prefersReducedMotion = useReducedMotion();
    const resolvedHighlights = (highlights ?? []).slice(0, 3);

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
                    : { y: -4, transition: baseTransition }
            }
            style={{ willChange: prefersReducedMotion ? undefined : "transform, opacity" }}
        >
            <div className="flex items-center justify-between gap-3 px-4 pt-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-celestialblue-50 text-celestialblue-600">
                        <span className="material-symbols-rounded text-2xl" aria-hidden="true">
                            {icon}
                        </span>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-space-400">
                            {label}
                        </p>
                        <p className="text-sm text-space-500">{etaLabel}</p>
                    </div>
                </div>
                <div className="rounded-full bg-celestialblue-100 px-3 py-1 text-xs font-semibold text-celestialblue-700 self-end">
                    {badgeLabel}
                </div>
            </div>

            <div className="mt-4 flex flex-1 flex-col gap-4 rounded-xl bg-space-50/80 m-4 p-4">
                <div>
                    <h3 className="text-2xl font-semibold text-space-900 font-dmsans">
                        {title}
                    </h3>
                    <p className="mt-2 text-base text-space-700">{description}</p>
                </div>

                {resolvedHighlights.length ? (
                    <div className="grid gap-2">
                        {resolvedHighlights.map((highlight, index) => (
                            <div
                                key={`${highlight}-${index}`}
                                className="rounded-xl bg-white/80 px-3 py-2 text-sm text-space-600"
                            >
                                {highlight}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-space-500">
                        More details will surface soon.
                    </p>
                )}
            </div>
        </motion.div>
    );
}
