import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../utils/cn";
import {forwardRef, useCallback, useEffect, useMemo, useRef} from "react";
import type {MutableRefObject} from "react";
import {AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useTransform} from "motion/react";
import {animate} from "motion";
import type {AnimationPlaybackControls, AnimationSequence, MotionValue} from "motion";

/* ----------------------------- Variants ----------------------------- */

const progressVariants = cva(
    "relative overflow-hidden border transition-all duration-300 ease-out",
    {
        variants: {
            variant: {
                "default": "rounded-full",
                "card": "rounded-lg"
            },
            size: {
                sm: "h-3 p-[3px]",
                md: "h-5 p-1",
                lg: "h-8 p-2",
                xl: "h-12 p-1"
            },
            tone: {
                celestial: "bg-space-900",
                saffron: "bg-space-900",
                emerald: "bg-space-900",
                space: "bg-space-10 border-space-200",
                white: "bg-space-10 border-space-150",
                roadmap: "border-celestialblue-200 bg-space-10",
                book: "border-saffron-200 bg-saffron-50",
                music: "border-persianred-200 bg-persianred-50",
            },
            dotted: {
                true: "!border-[#01437A15] !p-[6px]",
                false: "",
            },
            orientation: {
                horizontal: "flex flex-row items-center justify-start gap-1",
                vertical: "flex flex-col-reverse items-center justify-center gap-1", // reversed for correct visual order
            },
        },
        defaultVariants: {
            size: "md",
            tone: "celestial",
            dotted: false,
            orientation: "horizontal",
        },
    }
);

const innerHeightBySize: Record<NonNullable<ProgressProps["size"]>, string> = {
    sm: "!h-[6px]",
    md: "!h-[12px]",
    lg: "!h-[16px]",
    xl: "!h-10",
};


export type ProgressVariants = VariantProps<typeof progressVariants>;

const dotVariants = {
    intro: {scale: 0.6, opacity: 0},
    inactive: {scale: 0.88, opacity: 0.45},
    active: {
        scale: 1,
        opacity: 1,
        transition: {type: "spring", stiffness: 480, damping: 26},
    },
} as const;

const dotTransition = {type: "spring", stiffness: 420, damping: 30} as const;
const barSpring = {type: "spring", stiffness: 220, damping: 30} as const;
const COMPLETE_EASE = [0.33, 1, 0.68, 1] as const;

interface ProgressProps extends ProgressVariants {
    value: number;
    valueMotion?: MotionValue<number>;
    max?: number;
    maxWidth?: number | string;
    hasStrips?: boolean;
    className?: string;
    variant?: "default" | "card";
}

/* ----------------------------- Component ----------------------------- */

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
    (
        {
            value,
            valueMotion,
            max = 100,
            size,
            tone,
            maxWidth = "fit-content",
            hasStrips = false,
            dotted = false,
            orientation = "horizontal",
            variant = "default",
            className,
            ...props
        },
        ref
    ) => {
        const resolvedMax = Number.isFinite(max) ? Number(max) : 100;
        const clampedMax = Math.max(resolvedMax, 0);
        const percentage = clampedMax === 0 ? 0 : Math.min(Math.max((value / clampedMax) * 100, 0), 100);

        const isCardVariant = variant === "card";

        const stepCount = Math.max(Math.floor(clampedMax), 0);
        const activeCount = Math.min(Math.max(Math.round(value), 0), stepCount);

        const internalRef = useRef<HTMLDivElement | null>(null);
        const fillRef = useRef<HTMLDivElement | null>(null);
        const stripesRef = useRef<HTMLDivElement | null>(null);
        const completionTimelineRef = useRef<AnimationPlaybackControls | null>(null);
        const prefersReducedMotion = useReducedMotion();

        const setRefs = useCallback(
            (node: HTMLDivElement | null) => {
                internalRef.current = node;
                if (typeof ref === "function") {
                    ref(node);
                } else if (ref && typeof ref === "object") {
                    (ref as MutableRefObject<HTMLDivElement | null>).current = node;
                }
            },
            [ref],
        );

        const inView = useInView(internalRef, {amount: 0.1, margin: "-0px"});

        const internalProgressMotion = useMotionValue(percentage);
        const progressMotion = valueMotion ?? internalProgressMotion;
        const barWidth = useTransform(progressMotion, (v) => `${v}%`);
        const stripeOpacity = useMotionValue(0);
        const stripeIntroPosition = useMotionValue(-160);
        const stripeIntroPositionCSS = useTransform(stripeIntroPosition, (v) => `${v}%`);
        const stripeMask = useTransform(progressMotion, (v) => {
            const clamp = (val: number) => Math.min(Math.max(val, 0), 100);
            const edge = clamp(v);
            const fadeMid = clamp(edge + 3);
            const fadeEnd = clamp(edge + 8);
            return `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${edge}%, rgba(0,0,0,0.85) ${fadeMid}%, rgba(0,0,0,1) ${fadeEnd}%, rgba(0,0,0,1) 100%)`;
        });

        const toneMap =
            {
                celestial: { bg: "bg-celestialblue-400", border: "border-space-150", base: "bg-space-50" },
                saffron: { bg: "bg-saffron-400", border: "border-space-150", base: "bg-space-50" },
                emerald: { bg: "bg-emerald-400", border: "border-space-150", base: "bg-space-50" },
                space: { bg: "bg-space-300", border: "border-space-200", base: "bg-space-10" },
                white: { bg: "bg-celestialblue-700", border: "border-space-150", base: "bg-space-10" },
                roadmap: { bg: "bg-celestialblue-200", border: "border-space-10", base: "bg-space-10/50" },
                book: { bg: "bg-[#D4E157]", border: "border-space-10", base: "bg-space-10/50" },
                music: { bg: "bg-[#FF8A65]", border: "border-space-10", base: "bg-space-10/50" },
            } as const;

        const toneStyle = toneMap[tone as keyof typeof toneMap];

        const stripePattern = useMemo(() => {
            if (dotted || !hasStrips || stepCount <= 1) return "none";
            const segmentWidth = 100 / Math.max(stepCount, 1);
            return `repeating-linear-gradient(
        90deg,
        currentColor 0 1px,
        transparent 1px ${segmentWidth}%
      )`;
        }, [dotted, hasStrips, stepCount]);

        const dotIndices = useMemo(() => {
            if (!dotted || stepCount < 1) return [];
            const base = Array.from({length: stepCount}, (_, i) => i);
            return orientation === "vertical" ? base.reverse() : base;
        }, [dotted, orientation, stepCount]);

        useEffect(() => {
            if (valueMotion) {
                if (prefersReducedMotion) {
                    valueMotion.set(percentage);
                }
                return;
            }

            if (prefersReducedMotion) {
                progressMotion.set(percentage);
                return;
            }

            if (isCardVariant) {
                const controls = animate(progressMotion, percentage, {
                    type: "spring",
                    stiffness: 30,
                    damping: 18,
                    mass: 1.2,
                });
                return () => controls.stop();
            }

            if (dotted || !inView) {
                progressMotion.set(percentage);
                return;
            }

            const controls = animate(progressMotion, percentage, barSpring);
            return () => controls.stop();
        }, [
            valueMotion,
            prefersReducedMotion,
            isCardVariant,
            dotted,
            inView,
            percentage,
            progressMotion,
        ]);

        useEffect(() => {
            if (!hasStrips || dotted) {
                stripeOpacity.set(0);
                stripeIntroPosition.set(0);
            }
        }, [dotted, hasStrips, stripeIntroPosition, stripeOpacity]);

        useEffect(() => {
            if (!hasStrips || dotted) return;
            if (prefersReducedMotion) {
                stripeOpacity.set(0.6);
                stripeIntroPosition.set(0);
                return;
            }
            if (!inView || !stripesRef.current) return;

            stripeOpacity.set(0);
            stripeIntroPosition.set(-160);

            const sequence = animate([
                [stripeOpacity, 0.6, {duration: 0.45, ease: COMPLETE_EASE}],
                [stripeIntroPosition, 0, {duration: 0.8, ease: [0.33, 1, 0.68, 1], at: "<"}],
            ]);

            return () => sequence.stop();
        }, [dotted, hasStrips, inView, prefersReducedMotion, stripeIntroPosition, stripeOpacity]);

        useEffect(() => {
            completionTimelineRef.current?.stop();

            if (prefersReducedMotion || !inView) return;

            if (dotted) {
                if (stepCount === 0 || activeCount < stepCount) return;
                if (!internalRef.current) return;
                const sequence: AnimationSequence = [
                    [
                        internalRef.current,
                        {
                            opacity: [0, 1],
                            transform: ["translateY(12px)", "translateY(0px)"],
                        },
                        {duration: 0.45, ease: [0.2, 0.8, 0.2, 1]},
                    ],
                    [
                        internalRef.current,
                        {
                            scale: [1, 1.06, 1],
                            filter: ["brightness(1)", "brightness(1.12)", "brightness(1)"],
                            boxShadow: [
                                "0px 0px 0px rgba(58, 114, 255, 0)",
                                "0px 0px 18px rgba(58, 114, 255, 0.05)",
                                "0px 0px 0px rgba(58, 114, 255, 0)",
                            ],
                        },
                        {duration: 0.6, ease: COMPLETE_EASE},
                    ],
                ];
                completionTimelineRef.current = animate(sequence);
                return () => completionTimelineRef.current?.stop();
            }

            if (percentage < 100 || !fillRef.current || !internalRef.current) return;

            const sequence: AnimationSequence = [
                [
                    internalRef.current,
                    {
                        scale: [1, 1.05, 1],
                        filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
                        boxShadow: [
                            "0 0 0 rgba(99, 102, 241, 0)",
                            "0 0 28px rgba(99, 102, 241, 0.05)",
                            "0 0 0 rgba(99, 102, 241, 0)",
                        ],
                    },
                    {duration: 0.65, ease: COMPLETE_EASE},
                ],
                [
                    fillRef.current,
                    {
                        scale: [1, 1.04, 1],
                        filter: ["saturate(1)", "saturate(1.2)", "saturate(1.05)"],
                        boxShadow: [
                            "0 0 0 rgba(0,0,0,0)",
                            "0 0 10px rgba(126, 140, 255, 0.05)",
                            "0 0 0 rgba(0,0,0,0)",
                        ],
                    },
                    {duration: 0.65, ease: COMPLETE_EASE, at: "<0.08"},
                ],
            ];

            if (hasStrips && stripesRef.current) {
                sequence.push([
                    stripesRef.current,
                    {
                        opacity: [stripeOpacity.get(), 1, 0.65],
                    },
                    {duration: 0.65, ease: COMPLETE_EASE, at: "<"},
                ]);
            }

            completionTimelineRef.current = animate(sequence);
            return () => completionTimelineRef.current?.stop();
        }, [
            dotted,
            hasStrips,
            inView,
            percentage,
            prefersReducedMotion,
            stepCount,
            activeCount,
            stripeOpacity,
        ]);

        /* ----------------------- Render ----------------------- */

        const cardFillScaleX = useTransform(progressMotion, (v) => {
            const clamped = Math.min(Math.max(v, 0), 100);
            return clamped / 100;
        });

        const cardFillWidth = useTransform(progressMotion, (v) => {
            const clamped = Math.min(Math.max(v, 0), 100);
            return `${clamped}%`;
        });

        if (isCardVariant) {
            return (
                <motion.div
                    dir={"rtl"}
                    ref={setRefs}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    className={cn(progressVariants({variant, size, tone}),
                        "relative w-full overflow-hidden border transition-all duration-300 ease-out",
                        toneStyle.border,
                        toneStyle.base,
                        className
                    )}
                    style={{ width: maxWidth }}
                    initial={prefersReducedMotion ? undefined : {opacity: 0, y: -10}}
                    whileInView={
                        prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 1,
                                y: 0,
                                transition: {duration: 0.4, ease: [0.33, 1, 0.68, 1]},
                            }
                    }
                    viewport={prefersReducedMotion ? undefined : {amount: 0.4}}
                    exit={
                        prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 0,
                                y: -10,
                                transition: {duration: 0.4, ease: [0.33, 1, 0.68, 1]},
                            }
                    }
                    layout

                    {...props}
                >

                    {/* Inner fill */}
                    <motion.div

                        className={cn(
                            "h-10 w-full rounded-md relative z-[1] box-border hover:inset-ring-2 inset-ring-space-10 cursor-pointer transition-shadow duration-300",
                            toneStyle.bg
                        )}
                        whileTap={{
                            filter: "hue-rotate(1deg) brightness(1.1)",
                            transition: { type: "spring", stiffness: 120, damping: 12 },

                        }}
                        whileHover={{
                            filter: "hue-rotate(1deg) brightness(1.01)",
                            transition: { type: "spring", stiffness: 120, damping: 12 },
                        }}
                        style={{ width: cardFillWidth, transformOrigin: "right center" }}
                    />
                </motion.div>

            );
        }

        if (dotted) {
            const dotIndices = useMemo(() => {
                if (stepCount < 1) return [];
                const base = Array.from({length: stepCount}, (_, i) => i);
                return orientation === "vertical" ? base.reverse() : base;
            }, [orientation, stepCount]);

            return (
                <motion.div
                    ref={setRefs}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={clampedMax}
                    className={cn(progressVariants({ size, tone, dotted, orientation }), className)}
                    style={{
                        width: orientation === "vertical" ? "fit-content" : maxWidth,
                        height: orientation === "vertical" ? "auto" : undefined,
                    }}
                    initial={prefersReducedMotion ? undefined : {opacity: 0, y: 10}}
                    whileInView={
                        prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 1,
                                y: 0,
                                transition: {duration: 0.4, ease: [0.33, 1, 0.68, 1]},
                            }
                    }
                    viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.4}}
                    {...props}
                >
                    {dotIndices.map((index) => {
                        const isActive = index < activeCount;
                        if (prefersReducedMotion) {
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-4 w-4 rounded-full md:h-3 md:w-3",
                                        isActive
                                            ? "bg-celestialblue-700/50 dark:bg-space-600/40"
                                            : "border-2 border-celestialblue-700/50",
                                    )}
                                />
                            );
                        }
                        return (
                            <motion.div
                                key={index}
                                className={cn(
                                    "h-4 w-4 rounded-full md:h-3 md:w-3",
                                    isActive
                                        ? "bg-celestialblue-700/50 dark:bg-space-600/40"
                                        : "border-2 border-celestialblue-700/50",
                                )}
                                initial={prefersReducedMotion ? undefined : "intro"}
                                animate={isActive ? "active" : "inactive"}
                                variants={dotVariants}
                                transition={dotTransition}
                                layout
                            />
                        );
                    })}
                </motion.div>
            );
        }

        /* --------------------- Default (non-dotted) --------------------- */


        return (
            <motion.div
                ref={setRefs}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={clampedMax}
                className={cn(progressVariants({ size, tone }),toneStyle.base, toneStyle.border, className)}
                style={{
                    width: "95%",
                    maxWidth: orientation === "vertical" ? "fit-content" : maxWidth,
            }}
                initial={prefersReducedMotion ? undefined : {opacity: 0, y: 10}}
                whileInView={
                    prefersReducedMotion
                        ? undefined
                        : {
                            opacity: 1,
                            y: 0,
                            transition: {duration: 0.4, ease: [0.33, 1, 0.68, 1]},
                        }
                }
                viewport={prefersReducedMotion ? undefined : {amount: 0.4}}
                 exit={
                     prefersReducedMotion
                     ? undefined
                     : {
                         opacity: 0,
                         y: -10,
                         transition: {duration: 0.4, ease: [0.33, 1, 0.68, 1]},
                     }
                 }
                layout
                {...props}
            >
                {hasStrips && (
                    <motion.div
                        aria-hidden
                        ref={stripesRef}
                        className={cn(
                            "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2",
                            innerHeightBySize[size ?? "md"]
                        )}
                        style={{
                            backgroundImage: stripePattern,
                            backgroundSize: "auto 100%",
                            backgroundPositionX: prefersReducedMotion ? "0%" : stripeIntroPositionCSS,
                            opacity: prefersReducedMotion ? 0.6 : stripeOpacity,
                            maskImage: prefersReducedMotion ? undefined : stripeMask,
                            WebkitMaskImage: prefersReducedMotion ? undefined : stripeMask,
                        }}
                    />
                )}


                <motion.div
                    ref={fillRef}
                    className={cn(
                        "relative w-fit z-[1] h-full rounded-full",
                        toneStyle.bg,
                        innerHeightBySize[size ?? "md"]
                    )}
                    style={{
                        width: prefersReducedMotion ? `${percentage}%` : barWidth,
                        transformOrigin: "left center",
                    }}
                />
            </motion.div>
        );
    }
);

Progress.displayName = "Progress";
export default Progress;
