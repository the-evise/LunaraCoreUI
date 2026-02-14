import { cva, type VariantProps } from "class-variance-authority";
import {cn, detectLang} from "../utils/cn";
import Progress from "./Progress";
import { animate } from "motion";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface TitleSegment {
    text: string;
    lang?: "fa" | "en";
}

interface DashboardCardProps {
    title: TitleSegment[];
    type: "roadmap" | "book" | "music";
    path: string[]; // roadmap/book path or song+artist
    progress: number; // 0-100
    className?: string;
    ctaLabel?: string;
    onCtaClick?: () => void;
}

/* ----------------------------- Variants ----------------------------- */

const cardVariants = cva(
    "group dashboard-card w-full flex flex-col justify-between rounded-3xl text-space-900 ring-1 overflow-hidden transition-colors duration-300 ease-out select-none",
    {
        variants: {
            tone: {
                roadmap: "bg-celestialblue-50/70 ring-celestialblue-100/70",
                book: "bg-[#F0F4C3]/70 ring-[#AED581]/60",
                music: "bg-[#FFCCBC]/70 ring-[#FF8A65]/60",
            },
        },
        defaultVariants: { tone: "roadmap" },
    }
);

const iconMap = {
    roadmap: "automation",
    book: "book_3",
    music: "radio",
};

const iconColorMap: Record<DashboardCardProps["type"], string> = {
    roadmap: "text-celestialblue-600",
    book: "text-[#9E9D24]",
    music: "text-[#E64A19]",
};

const EASE = [0.33, 1, 0.68, 1] as const;
const baseTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 0.1,
} as const;

/* ----------------------------- Component ----------------------------- */

function DashboardCard({ title, type, path, progress, className, ctaLabel = "Continue", onCtaClick }: DashboardCardProps) {
    const tone = type as VariantProps<typeof cardVariants>["tone"];
    const icon = iconMap[type];
    const prefersReducedMotion = useReducedMotion();
    const [progressVisible, setProgressVisible] = useState(prefersReducedMotion);
    const progressValue = useMotionValue(prefersReducedMotion ? progress : 0);
    const clampProgress = useCallback((value: number) => Math.min(Math.max(Math.round(value), 0), 100), []);
    const [displayProgress, setDisplayProgress] = useState(
        prefersReducedMotion ? clampProgress(progress) : 0,
    );

    useEffect(() => {
        const unsubscribe = progressValue.on("change", (value) => {
            setDisplayProgress(clampProgress(value));
        });
        return () => unsubscribe();
    }, [clampProgress, progressValue]);

    useEffect(() => {
        if (prefersReducedMotion) {
            setProgressVisible(true);
            progressValue.set(progress);
            setDisplayProgress(clampProgress(progress));
            return;
        }

        if (progressVisible) {
            return;
        }

        const timer = window.setTimeout(() => setProgressVisible(true), 220);
        return () => window.clearTimeout(timer);
    }, [clampProgress, prefersReducedMotion, progressVisible, progress, progressValue]);

    useEffect(() => {
        if (prefersReducedMotion || !progressVisible) {
            return;
        }

        const controls = animate(progressValue, progress, {
            type: "spring",
            stiffness: 40,
            damping: 25,
            mass: 1.2,
        });

        return () => controls.stop();
    }, [prefersReducedMotion, progressVisible, progress, progressValue]);

    return (
        <motion.div
            className={cn(cardVariants({ tone }), className)}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -18 }}
            animate={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: baseTransition }
            }
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : {
                        scale: 0.992,
                        transition: { type: "spring", stiffness: 200, damping: 28, mass: 0.9 },
                    }
            }
            whileTap={
                prefersReducedMotion
                    ? undefined
                    : {
                        rotateX: -2,
                        scale: 0.985,
                        transition: { type: "spring", stiffness: 320, damping: 22, mass: 0.6 },
                    }
            }
            style={{
                willChange: "transform, opacity",
                transformPerspective: prefersReducedMotion ? undefined : 900,
                transformStyle: "preserve-3d",
            }}
        >
            <motion.div
                className="flex h-full flex-col justify-between gap-6 p-5"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? undefined : baseTransition}
            >
                {/* ---------------- Header ---------------- */}
                <motion.div
                    className="flex flex-col gap-4"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? undefined : { duration: 0.5, ease: EASE, delay: 0.1 }}
                >
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-semibold text-space-900 leading-8" dir="ltr">
                            {title.map((segment, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        segment.lang === "fa"
                                            ? "font-iransans"
                                            : "font-dmsans"
                                    )}
                                >
                                {segment.text}
                            </span>
                            ))}
                        </h3>

                        <span
                            className={cn(
                                "dashboard-card__icon material-symbols-rounded !text-[36px] !font-normal",
                                iconColorMap[type]
                            )}
                        >
                          {icon}
                        </span>
                    </div>

                    <motion.div
                        className={cn(
                            "inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] w-fit self-start",
                            type === "roadmap" && "bg-celestialblue-100/80 text-celestialblue-700",
                            type === "book" && "bg-[#9E9D2420] text-[#4F5705]",
                            type === "music" && "bg-[#7A1D0120] text-[#572305]"
                        )}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={prefersReducedMotion ? undefined : { duration: 0.46, ease: EASE, delay: 0.46 }}
                    >
                        {path.map((segment, i) => {
                            const lang = detectLang(segment);
                            return (
                                <span
                                    key={`path-segment-${segment}-${i}`}
                                    className="inline-flex items-center"
                                >
                                    <motion.a
                                        href={"/"}
                                        className={cn(
                                            lang === "en" ? "font-dmsans" : "font-iransans",
                                            "hover:pointer-cursor hover:underline hover:underline-offset-2"
                                        )}
                                    >
                                        {segment}
                                    </motion.a>
                                    {i < path.length - 1 && (
                                        <span className="material-symbols-rounded !text-xl !font-light">
                                            chevron_forward
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </motion.div>
                </motion.div>

                {/* ---------------- Progress ---------------- */}
                <motion.div
                    className="flex flex-col gap-2"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                    animate={prefersReducedMotion ? { opacity: 1, y: 0 } : progressVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={prefersReducedMotion ? undefined : { duration: 0.52, ease: EASE, delay: 0.34 }}
                >
                    <span className={cn(
                        "text-sm md:text-base font-semibold flex items-center justify-end",
                        type === "roadmap" && "text-celestialblue-700",
                        type === "book" && "text-[#9E9D24]",
                        type === "music" && "text-[#E64A19]",
                    )}>
                        {displayProgress}% complete
                    </span>
                    <Progress
                        variant="card"
                        tone={type}
                        value={progress}
                        valueMotion={progressValue}
                        maxWidth={"w-full"}
                        size={"xl"}
                    />
                </motion.div>
            </motion.div>

            {/* ---------------- Footer ---------------- */}
            <button
                type="button"
                onClick={onCtaClick}
                className={cn(
                    "group/btn relative py-3 text-center font-iransans text-lg font-medium",
                    "bg-white/70 text-space-700 cursor-pointer transition-colors duration-200",
                    type === "roadmap" && "group-hover:text-emerald-100 group-hover:bg-space-500",
                    type === "book" && "text-persianred-700 group-hover:bg-persianred-50",
                    type === "music" && "text-saffron-700 group-hover:bg-saffron-50",
                )}
            >
                {ctaLabel}

                <motion.div
                    className="absolute right-6 top-[25%] flex justify-center -space-x-[14px] opacity-0 group-hover/btn:opacity-100 text-emerald-100 transition-all duration-200 group-hover/btn:right-4"
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: EASE,
                    }}
                >
                    <span className={"material-symbols-outlined !font-semibold"}>arrow_forward_ios</span>
                    <span className={"material-symbols-outlined !font-semibold"}>arrow_forward_ios</span>
                    <span className={"material-symbols-outlined !font-semibold"}>arrow_forward_ios</span>
                </motion.div>
            </button>
        </motion.div>
    );
}

export default DashboardCard;
