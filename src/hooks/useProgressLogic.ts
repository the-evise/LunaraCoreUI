import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ForwardedRef, MutableRefObject } from "react";
import { useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { animate } from "motion";
import type { AnimationPlaybackControls, AnimationSequence, MotionValue } from "motion";

export type ProgressTone =
    | "celestial"
    | "saffron"
    | "emerald"
    | "space"
    | "white"
    | "roadmap"
    | "book"
    | "music";

export type ProgressOrientation = "horizontal" | "vertical";
export type ProgressVariant = "default" | "card";

type UseProgressLogicArgs = {
    value: number;
    valueMotion?: MotionValue<number>;
    max: number;
    tone: ProgressTone;
    hasStrips: boolean;
    dotted: boolean;
    orientation: ProgressOrientation;
    variant: ProgressVariant;
    forwardedRef: ForwardedRef<HTMLDivElement>;
};

const toneMap: Record<ProgressTone, { bg: string; border: string; base: string }> = {
    celestial: {
        bg: "bg-celestialblue-400",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
    saffron: {
        bg: "bg-saffron-400",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
    emerald: {
        bg: "bg-emerald-400",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
    space: {
        bg: "bg-space-300",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
    white: {
        bg: "bg-celestialblue-700",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
    roadmap: {
        bg: "bg-celestialblue-200",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
    book: {
        bg: "bg-[#D4E157]",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
    music: {
        bg: "bg-[#FF8A65]",
        border: "border-space-150/60",
        base: "bg-space-10/80",
    },
};

const dotToneMap: Record<ProgressTone, { active: string; inactive: string }> = {
    celestial: {
        active: "bg-celestialblue-500/70",
        inactive: "border-celestialblue-300/70",
    },
    saffron: {
        active: "bg-saffron-500/70",
        inactive: "border-saffron-300/70",
    },
    emerald: {
        active: "bg-emerald-500/70",
        inactive: "border-emerald-300/70",
    },
    space: {
        active: "bg-space-400/70",
        inactive: "border-space-200/70",
    },
    white: {
        active: "bg-celestialblue-700/70",
        inactive: "border-celestialblue-300/70",
    },
    roadmap: {
        active: "bg-celestialblue-400/70",
        inactive: "border-celestialblue-200/70",
    },
    book: {
        active: "bg-[#D4E157]",
        inactive: "border-[#D4E157]/60",
    },
    music: {
        active: "bg-[#FF8A65]",
        inactive: "border-[#FF8A65]/60",
    },
};

const barSpring = { type: "spring", stiffness: 220, damping: 30 } as const;
const COMPLETE_EASE = [0.33, 1, 0.68, 1] as const;
const STRIPE_BASE_OPACITY = 0.12;
const STRIPE_FLASH_OPACITY = 0.75;
const STRIPE_SETTLE_OPACITY = 0.48;

export function useProgressLogic({
    value,
    valueMotion,
    max,
    tone,
    hasStrips,
    dotted,
    orientation,
    variant,
    forwardedRef,
}: UseProgressLogicArgs) {
    const resolvedMax = Number.isFinite(max) ? Number(max) : 100;
    const clampedMax = Math.max(resolvedMax, 0);
    const percentage =
        clampedMax === 0
            ? 0
            : Math.min(Math.max((value / clampedMax) * 100, 0), 100);

    const isCardVariant = variant === "card";
    const canRenderStrips = hasStrips && orientation === "horizontal";
    const stepCount = Math.max(Math.floor(clampedMax), 0);
    const dottedStepCount = dotted ? Math.max(stepCount, 1) : stepCount;
    const activeCount = Math.min(Math.max(Math.round(value), 0), dottedStepCount);

    // Keep strips intentionally bounded: always 1..10.
    const stripReference =
        clampedMax > 0
            ? clampedMax
            : Number.isFinite(value)
              ? Math.abs(value)
              : 1;
    const stripCount = Math.min(10, Math.max(1, Math.floor(stripReference)));

    const toneStyle = toneMap[tone] ?? toneMap.celestial;
    const dotTone = dotToneMap[tone] ?? dotToneMap.celestial;

    const stripePattern = useMemo(() => {
        if (dotted || !canRenderStrips) return "none";
        const segmentWidth = 100 / stripCount;
        return `repeating-linear-gradient(
        90deg,
        currentColor 0 1px,
        transparent 1px ${segmentWidth}%
      )`;
    }, [dotted, canRenderStrips, stripCount]);

    const dotIndices = useMemo(() => {
        if (!dotted) return [];
        const base = Array.from({ length: dottedStepCount }, (_, i) => i);
        return orientation === "vertical" ? base.reverse() : base;
    }, [dotted, orientation, dottedStepCount]);

    const internalRef = useRef<HTMLDivElement | null>(null);
    const fillRef = useRef<HTMLDivElement | null>(null);
    const stripesRef = useRef<HTMLDivElement | null>(null);
    const completionTimelineRef = useRef<AnimationPlaybackControls | null>(null);
    const previousActiveCountRef = useRef<number | null>(null);
    const previousPercentageRef = useRef<number | null>(null);
    const prefersReducedMotion = useReducedMotion();

    const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
            internalRef.current = node;
            if (typeof forwardedRef === "function") {
                forwardedRef(node);
            } else if (forwardedRef && typeof forwardedRef === "object") {
                (forwardedRef as MutableRefObject<HTMLDivElement | null>).current = node;
            }
        },
        [forwardedRef]
    );

    const inView = useInView(internalRef, { amount: 0.1, margin: "-0px" });

    const internalProgressMotion = useMotionValue(percentage);
    const progressMotion = valueMotion ?? internalProgressMotion;
    const barWidth = useTransform(progressMotion, (v) => `${v}%`);
    const stripeOpacity = useMotionValue(0);
    const stripeIntroPosition = useMotionValue(-160);
    const stripeIntroPositionCSS = useTransform(
        stripeIntroPosition,
        (v) => `${v}%`
    );
    const stripeMask = useTransform(progressMotion, (v) => {
        const clamp = (val: number) => Math.min(Math.max(val, 0), 100);
        const edge = clamp(v);
        if (edge >= 99.5) return "none";
        const fadeMid = clamp(edge + 3);
        const fadeEnd = clamp(edge + 8);
        return `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${edge}%, rgba(0,0,0,0.85) ${fadeMid}%, rgba(0,0,0,1) ${fadeEnd}%, rgba(0,0,0,1) 100%)`;
    });
    const cardFillWidth = useTransform(progressMotion, (v) => {
        const clamped = Math.min(Math.max(v, 0), 100);
        return `${clamped}%`;
    });

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
        if (!canRenderStrips || dotted) {
            stripeOpacity.set(0);
            stripeIntroPosition.set(0);
        }
    }, [dotted, canRenderStrips, stripeIntroPosition, stripeOpacity]);

    useEffect(() => {
        if (!canRenderStrips || dotted) return;
        if (prefersReducedMotion) {
            stripeOpacity.set(STRIPE_BASE_OPACITY);
            stripeIntroPosition.set(0);
            return;
        }
        if (!inView || !stripesRef.current) return;

        stripeOpacity.set(0);
        stripeIntroPosition.set(-160);

        const sequence = animate([
            [stripeOpacity, STRIPE_BASE_OPACITY, { duration: 0.45, ease: COMPLETE_EASE }],
            [
                stripeIntroPosition,
                0,
                { duration: 0.8, ease: [0.33, 1, 0.68, 1], at: "<" },
            ],
        ]);

        return () => sequence.stop();
    }, [
        dotted,
        canRenderStrips,
        inView,
        prefersReducedMotion,
        stripeIntroPosition,
        stripeOpacity,
    ]);

    useEffect(() => {
        completionTimelineRef.current?.stop();

        const previousActiveCount = previousActiveCountRef.current;
        const previousPercentage = previousPercentageRef.current;
        previousActiveCountRef.current = activeCount;
        previousPercentageRef.current = percentage;

        if (prefersReducedMotion || !inView) return;

        if (dotted) {
            const isComplete = activeCount >= dottedStepCount;
            const wasComplete =
                previousActiveCount !== null && previousActiveCount >= dottedStepCount;
            if (!isComplete || wasComplete) return;
            if (!internalRef.current) return;
            const sequence: AnimationSequence = [
                [
                    internalRef.current,
                    {
                        scale: [1, 1.04, 1],
                        filter: ["brightness(1)", "brightness(1.12)", "brightness(1)"],
                        boxShadow: [
                            "0px 0px 0px rgba(58, 114, 255, 0)",
                            "0px 0px 18px rgba(58, 114, 255, 0.05)",
                            "0px 0px 0px rgba(58, 114, 255, 0)",
                        ],
                    },
                    { duration: 0.6, ease: COMPLETE_EASE },
                ],
            ];
            completionTimelineRef.current = animate(sequence);
            return () => completionTimelineRef.current?.stop();
        }

        const isComplete = percentage >= 100;
        const wasComplete = previousPercentage !== null && previousPercentage >= 100;
        if (!isComplete || wasComplete || !fillRef.current || !internalRef.current) return;

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
                { duration: 0.65, ease: COMPLETE_EASE },
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
                { duration: 0.65, ease: COMPLETE_EASE, at: "<0.08" },
            ],
        ];

        if (canRenderStrips && stripesRef.current) {
            sequence.push([
                stripesRef.current,
                {
                    opacity: [
                        stripeOpacity.get(),
                        STRIPE_FLASH_OPACITY,
                        STRIPE_SETTLE_OPACITY,
                    ],
                },
                { duration: 0.65, ease: COMPLETE_EASE, at: "<" },
            ]);
        }

        completionTimelineRef.current = animate(sequence);
        return () => completionTimelineRef.current?.stop();
    }, [
        dotted,
        canRenderStrips,
        inView,
        percentage,
        prefersReducedMotion,
        dottedStepCount,
        activeCount,
        stripeOpacity,
    ]);

    return {
        clampedMax,
        dottedStepCount,
        percentage,
        activeCount,
        canRenderStrips,
        isCardVariant,
        toneStyle,
        dotTone,
        dotIndices,
        stripePattern,
        prefersReducedMotion,
        setRefs,
        fillRef,
        stripesRef,
        barWidth,
        stripeIntroPositionCSS,
        stripeOpacity,
        stripeMask,
        cardFillWidth,
    };
}
