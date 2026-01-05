import { cva, type VariantProps } from "class-variance-authority";
import {cn, detectLang} from "../utils/cn";
import Progress from "./Progress";
import { animate } from "motion";
import { motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
}

/* ----------------------------- Variants ----------------------------- */

const cardVariants = cva(
    "group w-full 2xl:w-[446px] h-[400px] flex flex-col bg-red-200 justify-between rounded-lg border-1 text-space-800 overflow-hidden transition-all duration-300 ease-in-out hover:ring-2 select-none transform-gpu",
    {
        variants: {
            tone: {
                roadmap: "bg-celestialblue-100 border-celestialblue-250 group-hover:bg-celestialblue-100/80 ring-celestialblue-250",
                book: "bg-[#F0F4C3] border-[#AED581] hover:bg-[#F0F4C3E6] ring-[#AED581]",
                music: "bg-[#FFCCBC] border-[#FF8A65] hover:bg-[#FFCCBCE6] ring-[#FF8A65]",
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

/* ----------------------------- Component ----------------------------- */

function DashboardCard({ title, type, path, progress, className }: DashboardCardProps) {
    const tone = type as VariantProps<typeof cardVariants>["tone"];
    const icon = iconMap[type];
    const prefersReducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(cardRef, { amount: 0.4, once: true });
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

        if (!isInView || progressVisible) {
            return;
        }

        const timer = window.setTimeout(() => setProgressVisible(true), 220);
        return () => window.clearTimeout(timer);
    }, [clampProgress, prefersReducedMotion, isInView, progressVisible, progress, progressValue]);

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
            ref={cardRef}
            className={cn(cardVariants({ tone }), className)}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -18 }}
            whileInView={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }
            }
            viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.4 }}
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : {
                        y: 0,
                        scale: 0.98,
                        transition: { type: "spring", stiffness: 220, damping: 26, mass: 0.9 },
                    }
            }
            style={{ willChange: "transform, opacity" }}
        >
            <motion.div
                className="flex flex-col p-4 justify-between h-full"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                animate={prefersReducedMotion ? undefined : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={prefersReducedMotion ? undefined : { duration: 0.5, ease: EASE }}
            >
                {/* ---------------- Header ---------------- */}
                <motion.div
                    className="flex flex-col gap-3"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                    animate={prefersReducedMotion ? undefined : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
                    transition={prefersReducedMotion ? undefined : { duration: 0.5, ease: EASE, delay: 0.1 }}
                >
                    <div className="flex justify-between items-start">
                        <span
                            className={cn(
                                "material-symbols-rounded !text-[48px] !font-thin",
                                iconColorMap[type]
                            )}
                        >
                          {icon}
                        </span>
                        <h3 className="text-xl font-light" dir={"rtl"}>
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
                    </div>

                    <motion.div
                        className={cn(
                            "inline-flex items-center justify-center rounded-full px-5 py-1 text-[20px] font-medium w-fit self-end cursor-pointer",
                            type === "roadmap" && "bg-celestialblue-700/20 text-celestialblue-800",
                            type === "book" && "bg-[#9E9D2420] text-[#4F5705]",
                            type === "music" && "bg-[#7A1D0120] text-[#572305]"
                        )}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                        animate={prefersReducedMotion ? undefined : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={prefersReducedMotion ? undefined : { duration: 0.46, ease: EASE, delay: 0.46 }}

                    >
                        {path.map((segment, i) => {
                            const lang = detectLang(segment);
                            return (
                                <>
                                    <motion.a href={"/"} className={cn(lang === "en" ? "font-dmsans" : "font-iransans", "hover:pointer-cursor hover:underline hover:underline-offset-2")}>{segment}</motion.a>
                                    {i < path.length - 1 && (
                                        <span
                                            className="material-symbols-rounded !text-xl !font-light">chevron_backward</span>
                                    )}
                                </>
                                );

                        })}
                    </motion.div>
                </motion.div>

                {/* ---------------- Progress ---------------- */}
                <motion.div
                    className="flex flex-col gap-[6px]"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                    animate={prefersReducedMotion ? { opacity: 1, y: 0 } : progressVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={prefersReducedMotion ? undefined : { duration: 0.52, ease: EASE, delay: 0.34 }}
                >
                    <span className={cn(
                        "text-sm md:text-base font-black flex items-center justify-start",
                        type === "roadmap" && "text-celestialblue-700",
                        type === "book" && "text-[#9E9D24]",
                        type === "music" && "text-[#E64A19]",
                    )}>
                        {displayProgress}% <span className="font-iransans font-light ml-2">پیشرفت</span>
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
                className={cn(
                    "group/btn relative py-2 text-center font-iransans text-xl font-medium",
                    "border-t bg-space-10 text-celestialblue-950/70 text-current cursor-pointer transition-colors duration-300",
                    type === "roadmap" && "border-[#F0F4C3] group-hover:bg-emerald-50 group-hover:text-emerald-700",
                    type === "book" && "border-[#AED581] group-hover:bg-persianred-50 group-hover:text-persianred-700",
                    type === "music" && "border-[#F0F4C3] group-hover:bg-saffron-50 group-hover:text-saffron-700",
                )}
            >
                ادامه مسیر

                <motion.div
                    className="absolute left-6 top-[25%] flex justify-center -space-x-[14px] opacity-0 group-hover/btn:opacity-20 transition-all duration-300 group-hover/btn:left-4"
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: EASE,
                    }}
                >
                    <span className={"material-symbols-outlined !font-semibold"}>arrow_back_ios</span>
                    <span className={"material-symbols-outlined !font-semibold"}>arrow_back_ios</span>
                    <span className={"material-symbols-outlined !font-semibold"}>arrow_back_ios</span>
                </motion.div>
            </button>
        </motion.div>
    );
}

export default DashboardCard;
