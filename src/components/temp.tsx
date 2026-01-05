<motion.div
    className={trackClassName}
    {...restMotionProps}
    style={{
        ...trackStyle,
        x: imageDragX,
        opacity: useTransform(imageDragX, [-360, 0, 360], [0.6, 1, 0.6]),
    }}
    onPointerDown={(e) => e.stopPropagation()}
/>

itemCount

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, useAnimate, useMotionValue} from "motion/react";
import type {AnimationPlaybackControls, PanInfo} from "motion";
import VocabularyCard from "./VocabularyCard";
import Progress from "./Progress";

export interface VocabularyItem {
    word: string;
    meaningEn: string;
    meaningFa: string;
    examples: string[];
    image: string;
}

interface VocabularyNavigatorProps {
    vocabularyItems: VocabularyItem[];
}

const SCROLL_BUTTON_CLASS =
    "hidden md:inline-flex justify-center items-center bg-transparent border-1 border-space-150 text-space-250 text-center max-w-[140px] min-w-[50px] w-[140px] h-[50px] rounded-full hover:bg-space-100 transition-colors cursor-pointer disabled:cursor-not-allowed";

const MOBILE_DRAG_THRESHOLD = 80;

const baseTransition = {
    type: "spring",
    duration: 0.35,
} as const;

const cardVariants = {
    enter: (direction: 1 | -1) => ({
        opacity: 0,
        y: direction === 1 ? 36 : -36,
        scale: 0.96,
    }),
    center: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {...baseTransition, duration: 0.38},
    },
    exit: (direction: 1 | -1) => ({
        opacity: 0,
        y: direction === 1 ? -36 : 36,
        scale: 0.96,
        transition: {...baseTransition, duration: 0.26},
    }),
} as const;

function ScrollButton({
                          icon,
                          onClick,
                          disabled,
                          position,
                      }: {
    icon: "arrow_up" | "arrow_down";
    onClick: () => void;
    disabled?: boolean;
    position: "top" | "bottom";
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            data-vocab-scroll={position}
            className={`${SCROLL_BUTTON_CLASS} ${disabled ? "opacity-40" : ""}`}
        >
            <span className="material-symbols-rounded">{icon}</span>
        </button>
    );
}

function VocabularyNavigator({vocabularyItems}: VocabularyNavigatorProps) {
    const itemCount = vocabularyItems.length;
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [scope, animate] = useAnimate();
    const [isMobile, setIsMobile] = useState(false);
    const imageDragX = useMotionValue(0);

    const sharedControlsRef = useRef<AnimationPlaybackControls | null>(null);
    const interactionStateRef = useRef({hovered: false, pressed: false});
    const pendingStateRef = useRef({...interactionStateRef.current});
    const appliedStateRef = useRef({...interactionStateRef.current});
    const animationFrameRef = useRef<number | null>(null);
    const wheelCooldownRef = useRef(false);
    const wheelTimeoutRef = useRef<number | null>(null);
    const lastPointerTypeRef = useRef<PointerEvent["pointerType"] | null>(null);
    const indexRef = useRef(index);
    const itemCountRef = useRef(itemCount);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        indexRef.current = index;
        itemCountRef.current = itemCount;
    }, [index, itemCount]);

    const runSharedAnimation = useCallback(() => {
        animationFrameRef.current = null;
        const node = scope.current;
        if (!node) return;

        const target = pendingStateRef.current;
        const lastApplied = appliedStateRef.current;
        if (
            lastApplied.hovered === target.hovered &&
            lastApplied.pressed === target.pressed
        )
            return;

        sharedControlsRef.current?.stop();

        const spring = {...baseTransition, duration: 0.22} as const;

        sharedControlsRef.current = animate([
            ["[data-vocab-card-container]", {scale: 1, y: 0}, spring],
            ["[data-vocab-card-panel]", {scale: 1, y: 0}, spring],
            ["[data-vocab-card-mobile-image]", {scale: 1, y: 0}, spring],
            ["[data-vocab-card-image-desktop]", {scale: 1, y: 0}, spring],
            ["[data-vocab-scroll='top']", {scale: 1}, spring],
            ["[data-vocab-scroll='bottom']", {scale: 1}, spring],
        ]);

        appliedStateRef.current = {...target};
    }, [animate, scope]);

    const scheduleSharedAnimation = useCallback(() => {
        if (animationFrameRef.current !== null) return;
        animationFrameRef.current = requestAnimationFrame(runSharedAnimation);
    }, [runSharedAnimation]);

    const triggerWheelFeedback = useCallback(
        async (direction: "next" | "prev") => {
            const rotateDeg = 6 * (direction === "next" ? 1 : -1);
            const cards = scope.current?.querySelectorAll("[data-vocab-card-container]") ?? [];
            if (cards.length === 0) return;

            const outgoingCard = cards[0] as HTMLElement;
            const incomingCard = cards[1] as HTMLElement | undefined;
            const currentIndex = indexRef.current;
            const total = itemCountRef.current;

            // Detect edges
            const isAtStart = currentIndex === 0 && direction === "prev";
            const isAtEnd = currentIndex === total - 1 && direction === "next";

            if (isAtStart || isAtEnd) {
                // Subtle bounce animation with direction-based movement
                const bounceY = direction === "next" ? -12 : 12; // negative => upward motion

                await animate(
                    outgoingCard,
                    {
                        y: [0, bounceY, 0],
                        scale: [1, 0.96, 1],
                        rotate: [0, direction === "next" ? 3 : -3, 0],
                        filter: ["blur(0px)", "blur(1px)", "blur(0px)"], // subtle blur pulse
                    },
                    {
                        duration: 0.45,
                        ease: [0.33, 1, 0.68, 1],
                    }
                );

                return;
            }

            // Normal forward/back transition
            const outProps = {
                rotate: [0, rotateDeg],
                y: [0, direction === "next" ? -8 : 8],
                scale: [1, 0.9],
                opacity: [1, 0.8],
                filter: ["blur(0px)", "blur(2px)"],
            };
            const inProps = {
                rotate: [rotateDeg, 0],
                y: [direction === "next" ? 8 : -8, 0],
                scale: [0.9, 1],
                opacity: [0.8, 1],
                filter: ["blur(2px)", "blur(0px)"],
            };

            await Promise.all([
                animate(outgoingCard, outProps, {duration: 0.25, ease: [0.33, 1, 0.68, 1]}),
                incomingCard
                    ? animate(incomingCard, inProps, {
                        duration: 0.35,
                        ease: [0.33, 1, 0.68, 1],
                        delay: 0.15,
                    })
                    : Promise.resolve(),
            ]);
        },
        [animate, scope]
    );


    const setInteractionState = useCallback(
        (partial: Partial<{ hovered: boolean; pressed: boolean }>) => {
            const next = {...interactionStateRef.current, ...partial};
            if (partial.pressed === true) next.hovered = true;
            interactionStateRef.current = next;
            pendingStateRef.current = {...next};
            scheduleSharedAnimation();
        },
        [scheduleSharedAnimation]
    );

    useEffect(() => {
        interactionStateRef.current = {hovered: false, pressed: false};
        pendingStateRef.current = {...interactionStateRef.current};
        lastPointerTypeRef.current = null;
        sharedControlsRef.current?.stop();
        scheduleSharedAnimation();
    }, [scheduleSharedAnimation, index]);

    useEffect(() => {
        imageDragX.set(0);
    }, [imageDragX, index, isMobile]);

    useEffect(
        () => () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            sharedControlsRef.current?.stop();
            if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
            wheelCooldownRef.current = false;
        },
        []
    );

    const updateIndex = useCallback(
        (targetIndex: number) => {
            setIndex((current) => {
                if (targetIndex === current || targetIndex < 0 || targetIndex >= itemCount)
                    return current;
                setDirection(targetIndex > current ? 1 : -1);
                return targetIndex;
            });
        },
        [itemCount]
    );

    const handlePrev = useCallback(() => updateIndex(index - 1), [index, updateIndex]);
    const handleNext = useCallback(() => updateIndex(index + 1), [index, updateIndex]);
    const goToNext = useCallback(() => updateIndex(indexRef.current + 1), [updateIndex]);
    const goToPrev = useCallback(() => updateIndex(indexRef.current - 1), [updateIndex]);

    useEffect(() => {
        if (isMobile) return;
        const node = scope.current;
        if (!node) return;

        const handleWheel = async (event: WheelEvent) => {
            if (Math.abs(event.deltaY) < 8) return;
            event.preventDefault();
            if (wheelCooldownRef.current) return;

            const currentIndex = indexRef.current;
            const total = itemCountRef.current;
            const isNext = event.deltaY > 0;
            const targetIndex = isNext ? currentIndex + 1 : currentIndex - 1;
            const canMove = targetIndex >= 0 && targetIndex < total;

            wheelCooldownRef.current = true;
            if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
            wheelTimeoutRef.current = window.setTimeout(() => {
                wheelCooldownRef.current = false;
                wheelTimeoutRef.current = null;
            }, 1100);

            lastPointerTypeRef.current = "mouse";
            setInteractionState({hovered: true, pressed: true});

            // 1️⃣ Play outgoing tilt first
            await triggerWheelFeedback(isNext ? "next" : "prev");

            // 2️⃣ Change the card index (AnimatePresence swaps cards)
            if (canMove) updateIndex(targetIndex);

            requestAnimationFrame(() =>
                setInteractionState({pressed: false, hovered: false})
            );
        };


        node.addEventListener("wheel", handleWheel, {passive: false});
        return () => node.removeEventListener("wheel", handleWheel);
    }, [isMobile, scope, setInteractionState, triggerWheelFeedback, updateIndex]);

    if (itemCount === 0) return null;

    const current = vocabularyItems[index];
    const prevItem = index > 0 ? vocabularyItems[index - 1] : undefined;
    const nextItem = index < itemCount - 1 ? vocabularyItems[index + 1] : undefined;

    const dragMotionProps = useMemo(() => {
        if (!isMobile) return {};

        return {
            drag: "x" as const,
            dragConstraints: {left: -MOBILE_DRAG_THRESHOLD, right: MOBILE_DRAG_THRESHOLD},
            dragElastic: 0.22,
            dragMomentum: false,
            dragSnapToOrigin: true,
            onDragStart: () => {
                lastPointerTypeRef.current = "touch";
                setInteractionState({pressed: true});
            },
            onDragEnd: (_event: unknown, info: PanInfo) => {
                lastPointerTypeRef.current = null;
                setInteractionState({pressed: false, hovered: false});
                const projected = info.offset.x + info.velocity.x * 0.2;

                if (projected >= MOBILE_DRAG_THRESHOLD && index > 0) goToPrev();
                else if (projected <= -MOBILE_DRAG_THRESHOLD && index < itemCount - 1) goToNext();
            },
        };
    }, [goToNext, goToPrev, index, isMobile, itemCount, setInteractionState]);

    const imageDragProps = useMemo(() => {
        if (!isMobile) return undefined;
        const threshold = MOBILE_DRAG_THRESHOLD;
        return {
            drag: "x" as const,
            dragConstraints: {left: -threshold, right: threshold} as const,
            dragElastic: 0.22,
            dragMomentum: false,
            dragSnapToOrigin: true,
            dragPropagation: false as const,
            onPointerDown: (event: PointerEvent | MouseEvent | TouchEvent) => event.stopPropagation(),
            onDragStart: () => {
                lastPointerTypeRef.current = "touch";
                setInteractionState({pressed: true});
            },
            onDragEnd: (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
                lastPointerTypeRef.current = null;
                setInteractionState({pressed: false, hovered: false});
                const projected = info.offset.x + info.velocity.x * 0.2;

                if (projected >= threshold && index > 0) {
                    goToPrev();
                } else if (projected <= -threshold && index < itemCount - 1) {
                    goToNext();
                }
                imageDragX.set(0);
            },
            onDragCancel: () => {
                lastPointerTypeRef.current = null;
                setInteractionState({pressed: false, hovered: false});
                imageDragX.set(0);
            },
        };
    }, [goToPrev, goToNext, imageDragX, index, isMobile, itemCount, setInteractionState]);

    const cardMotionProps = useMemo(
        () => ({
            custom: direction,
            variants: cardVariants,
            initial: "enter" as const,
            animate: "center" as const,
            layout: true,
            ...dragMotionProps,
        }),
        [direction, dragMotionProps]
    );

    return (
        <div
            ref={scope}
            className="flex w-full max-w-[1060px] flex-col items-center justify-center gap-5 no-scrollbar"
        >
            <ScrollButton icon="arrow_up" onClick={handlePrev} disabled={index === 0} position="top"/>
            <div className="relative w-full flex flex-col items-center" data-vocab-shell>
                <div
                    className="flex w-[98%] max-w-[1060px] items-center justify-center gap-6 sm:w-[80%] lg:w-[95%] lg:max-w-[980px]"
                    data-vocab-progress-shell=""
                >
                    <Progress
                        className="hidden h-[168px] w-[28px] items-center justify-center md:flex"
                        data-vocab-progress-desktop=""
                        value={index + 1}
                        max={itemCount}
                        tone="space"
                        size="lg"
                        dotted
                        orientation="vertical"
                    />
                    <div className="flex w-full justify-center">
                        <AnimatePresence initial={false} mode="wait" custom={direction}>
                            <VocabularyCard
                                key={`${current.word}-${index}`}
                                imageSrc={current.image}
                                faText={current.meaningFa}
                                enWord={current.word}
                                definition={current.meaningEn}
                                examples={current.examples}
                                animationControlled
                                motionProps={cardMotionProps}
                                imageDragProps={imageDragProps}
                                imageDragValue={imageDragX}
                                prevImageSrc={prevItem?.image}
                                prevImageLabel={prevItem?.word}
                                nextImageSrc={nextItem?.image}
                                nextImageLabel={nextItem?.word}
                                footer={
                                    <Progress
                                        className="inline-flex md:hidden"
                                        data-vocab-card-progress-mobile=""
                                        value={index + 1}
                                        max={itemCount}
                                        tone="space"
                                        size="lg"
                                        dotted
                                    />
                                }
                            />
                        </AnimatePresence>
                    </div>
                </div>
                <Progress
                    className="mt-4 inline-flex h-[28px] w-[168px] items-center justify-center md:hidden"
                    data-vocab-progress-mobile=""
                    value={index + 1}
                    max={itemCount}
                    tone="space"
                    size="lg"
                    dotted
                />
            </div>
            <ScrollButton
                icon="arrow_down"
                onClick={handleNext}
                disabled={index === itemCount - 1}
                position="bottom"
            />
        </div>
    );
}

export default VocabularyNavigator;


import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../utils/cn";
import {forwardRef, useCallback, useEffect, useMemo, useRef} from "react";
import type {MutableRefObject} from "react";
import {motion, useInView, useMotionValue, useReducedMotion, useTransform} from "motion/react";
import {animate} from "motion";
import type {AnimationPlaybackControls} from "motion";

/* ----------------------------- Variants ----------------------------- */

const progressVariants = cva(
    "relative overflow-hidden rounded-full border transition-all duration-300 ease-out",
    {
        variants: {
            size: {
                sm: "h-3 p-[3px]",
                md: "h-5 p-1",
                lg: "h-8 p-2",
            },
            tone: {
                celestial: "bg-space-900",
                saffron: "bg-space-900",
                emerald: "bg-space-900",
                space: "bg-space-10 border-space-200",
                white: "bg-space-10 border-space-150",
            },
            dotted: {
                true: "!border-[#01437A15] !p-[6px]",
                false: "",
            },
            orientation: {
                horizontal: "flex flex-row items-center justify-start",
                vertical: "flex flex-col-reverse items-center justify-center", // reversed for correct visual order
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
};


export type ProgressVariants = VariantProps<typeof progressVariants>;

const dotVariants = {
    inactive: {scale: 0.88, opacity: 0.5},
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
    max?: number;
    maxWidth?: number | string;
    hasStrips?: boolean;
    className?: string;
}

/* ----------------------------- Component ----------------------------- */

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
    (
        {
            value,
            max = 100,
            size,
            tone,
            maxWidth = "fit-content",
            hasStrips = false,
            dotted = false,
            orientation = "horizontal",
            className,
            ...props
        },
        ref
    ) => {
        const resolvedMax = Number.isFinite(max) ? Number(max) : 100;
        const clampedMax = Math.max(resolvedMax, 0);
        const percentage = clampedMax === 0 ? 0 : Math.min(Math.max((value / clampedMax) * 100, 0), 100);
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

        const inView = useInView(internalRef, {amount: 0.1, margin: "0px"});

        const progressMotion = useMotionValue(percentage);
        const barWidth = useTransform(progressMotion, (v) => `${v}%`);

        const stripeMask = useTransform(progressMotion, (v) => {
            const clamp = (val: number) => Math.min(Math.max(val, 0), 100);
            const edge = clamp(v);
            const fadeMid = clamp(edge + 3);
            const fadeEnd = clamp(edge + 8);
            return `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${edge}%, rgba(0,0,0,0.85) ${fadeMid}%, rgba(0,0,0,1) ${fadeEnd}%, rgba(0,0,0,1) 100%)`;
        });

        const toneFill =
            {
                celestial: "bg-celestialblue-400",
                saffron: "bg-saffron-400",
                emerald: "bg-emerald-400",
                space: "bg-space-150 dark:bg-space-400",
                white: "bg-celestialblue-700",
            }[tone ?? "celestial"];

        const strokeClass =
            {
                celestial: "border-space-500 text-space-500",
                saffron: "border-space-500 text-space-500",
                emerald: "border-space-500 text-space-500",
                space: "border-space-200 text-space-200",
                white: "border-space-150 text-space-150",
            }[tone ?? "celestial"];

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
            if (dotted || prefersReducedMotion || !inView) {
                progressMotion.set(percentage);
                return;
            }
            const controls = animate(progressMotion, percentage, barSpring);
            return () => controls.stop();
        }, [percentage, dotted, inView, prefersReducedMotion, progressMotion]);

        useEffect(() => {
            completionTimelineRef.current?.stop();

            if (prefersReducedMotion || !inView) return;

            if (dotted) {
                if (stepCount === 0 || activeCount < stepCount) return;
                if (!internalRef.current) return;
                const sequence: Array<[Element | Element[] | string, any, Record<string, unknown>?]> = [
                    [
                        internalRef.current,
                        {scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"]},
                        {duration: 0.6, ease: COMPLETE_EASE},
                    ],
                ];
                completionTimelineRef.current = animate(sequence);
                return () => completionTimelineRef.current?.stop();
            }

            if (percentage < 100 || !fillRef.current) return;

            const sequence: Array<[Element | Element[] | string, any, Record<string, unknown>?]> = [
                [
                    fillRef.current,
                    {
                        scale: [1, 1.04, 1],
                        boxShadow: [
                            "0 0 0 rgba(0,0,0,0)",
                            "0 0 24px rgba(99, 102, 241, 0.32)",
                            "0 0 0 rgba(0,0,0,0)",
                        ],
                    },
                    {duration: 0.65, ease: COMPLETE_EASE},
                ],
            ];

            if (hasStrips && stripesRef.current) {
                sequence.push([
                    stripesRef.current,
                    {opacity: [0.6, 1, 0.6]},
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
        ]);

        /* ----------------------- Render ----------------------- */
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
                    className={cn(progressVariants({size, tone, dotted, orientation}), className)}
                    style={{
                        width: orientation === "vertical" ? "fit-content" : maxWidth,
                        height: orientation === "vertical" ? "auto" : undefined,
                    }}
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
                                initial={isActive ? "active" : "inactive"}
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
                className={cn(progressVariants({size, tone}), strokeClass, className)}
                style={{width: maxWidth}}
                {...props}
            >
                {hasStrips && (
                    <motion.div
                        aria-hidden
                        ref={stripesRef}
                        className={cn(
                            "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-60",
                            size === "sm" ? "h-[4px]" : size === "lg" ? "h-[12px]" : "h-[8px]"
                        )}
                        style={{
                            backgroundImage: stripePattern,
                            backgroundSize: "auto 100%",
                            maskImage: prefersReducedMotion ? undefined : stripeMask,
                            WebkitMaskImage: prefersReducedMotion ? undefined : stripeMask,
                        }}
                    />
                )}


                <motion.div
                    ref={fillRef}
                    className={cn(
                        "relative z-[1] h-full rounded-full",
                        toneFill,
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

import {cva} from "class-variance-authority";
import {useCallback, useEffect, useRef, useState} from "react";
import type {KeyboardEvent} from "react";
import {LayoutGroup, motion, useAnimationControls, useInView, useReducedMotion} from "motion/react";
import {animate} from "motion";
import {cn} from "../utils/cn";

const tabVariants = cva(
    "relative isolate flex max-w-[180px] max-h-[70px] min-h-[54px] items-center justify-center rounded-2xl border px-7 py-3 text-center text-[15px] font-semibold tracking-tight transition-colors duration-200",
    {
        variants: {
            state: {
                active:
                    "border-celestialblue-400 bg-celestialblue-100 text-celestialblue-600 dark:border-celestialblue-500 dark:bg-celestialblue-800 dark:text-celestialblue-100 cursor-default",
                inactive:
                    "border-space-200 bg-[#C9D4E850] text-space-500 hover:border-celestialblue-400 hover:bg-[#C9D4E880] hover:text-space-700 dark:border-space-500 dark:bg-space-600/80 dark:text-space-200 dark:hover:border-celestialblue-500 dark:hover:text-space-50 dark:hover:bg-space-600 cursor-pointer",
            },
        },
        defaultVariants: {
            state: "inactive",
        },
    },
);

const containerVariants = {
    hidden: {
        opacity: 0,
        y: -16,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            ease: [0.2, 0.8, 0.2, 1],
            when: "beforeChildren",
            staggerChildren: 0.06,
        },
    },
} as const;

const tabMotionVariants = {
    hidden: {opacity: 0, y: -10, scale: 0.94},
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {duration: 0.35, ease: [0.25, 0.8, 0.4, 1]},
    },
} as const;

type LessonIndicatorProps = {
    lessons: string[];
    activeLessonIndex: number;
    onLessonSelect: (lessonIndex: number) => void;
};

type TabProps = {
    label: string;
    index: number;
    isActive: boolean;
    onSelect: (index: number) => void;
    prefersReducedMotion: boolean;
    total: number;
    buttonRef: (node: HTMLButtonElement | null) => void;
};

function LessonTab({label, index, isActive, onSelect, prefersReducedMotion, total, buttonRef}: TabProps) {
    const state = isActive ? "active" : "inactive";

    const handleClick = useCallback(() => {
        if (!isActive) {
            onSelect(index);
        }
    }, [index, isActive, onSelect]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            switch (event.key) {
                case " ":
                case "Enter":
                    event.preventDefault();
                    handleClick();
                    break;
                case "ArrowRight":
                case "ArrowDown": {
                    event.preventDefault();
                    const next = (index + 1) % total;
                    onSelect(next);
                    break;
                }
                case "ArrowLeft":
                case "ArrowUp": {
                    event.preventDefault();
                    const prev = (index - 1 + total) % total;
                    onSelect(prev);
                    break;
                }
                case "Home":
                    event.preventDefault();
                    onSelect(0);
                    break;
                case "End":
                    event.preventDefault();
                    onSelect(total - 1);
                    break;
                default:
                    break;
            }
        },
        [handleClick, index, onSelect, total],
    );

    return (
        <motion.button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-pressed={isActive}
            tabIndex={isActive ? 0 : -1}
            className={cn(tabVariants({state}))}
            ref={buttonRef}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            variants={prefersReducedMotion ? undefined : tabMotionVariants}
            whileHover={
                prefersReducedMotion || isActive
                    ? undefined
                    : {
                        scale: 1.03,
                        y: -2,
                        transition: {type: "spring", stiffness: 280, damping: 24},
                    }
            }
            whileTap={
                prefersReducedMotion
                    ? undefined
                    : {
                        scale: isActive ? 1 : 0.95,
                        transition: {type: "spring", stiffness: 420, damping: 30},
                    }
            }
            layout
        >
            {isActive && !prefersReducedMotion ? (
                <motion.span
                    layoutId="lesson-indicator-highlight"
                    className="absolute inset-0 z-0 rounded-2xl border border-celestialblue-400/80 bg-celestialblue-200/80 dark:border-celestialblue-500/70 dark:bg-celestialblue-800/90"
                    transition={{type: "spring", stiffness: 420, damping: 32}}
                />
            ) : null}
            {isActive && prefersReducedMotion ? (
                <span
                    className="absolute inset-0 z-0 rounded-2xl border border-celestialblue-400/80 bg-celestialblue-200/80 dark:border-celestialblue-500/70 dark:bg-celestialblue-800/90"/>
            ) : null}
            <span className="relative z-10 select-none leading-tight">{label}</span>
        </motion.button>
    );
}

function LessonIndicator({lessons, activeLessonIndex, onLessonSelect}: LessonIndicatorProps) {
    const prefersReducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(activeLessonIndex);
    const controls = useAnimationControls();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(wrapperRef, {amount: 0.6});
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        setActiveIndex(activeLessonIndex);
    }, [activeLessonIndex]);

    useEffect(() => {
        if (prefersReducedMotion) {
            controls.set("visible");
            return;
        }
        if (!inView) return;
        if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            controls.start("visible");
            return;
        }
        controls.set("hidden");
        requestAnimationFrame(() => {
            controls.start("visible");
        });
    }, [activeLessonIndex, controls, inView, prefersReducedMotion]);

    useEffect(() => {
        if (prefersReducedMotion || hasAnimatedRef.current || !inView) return;
        hasAnimatedRef.current = true;
        controls.start("visible");
    }, [controls, inView, prefersReducedMotion]);

    useEffect(() => {
        if (prefersReducedMotion || !wrapperRef.current) return;
        const sequence = animate([
            [
                wrapperRef.current,
                {
                    boxShadow: [
                        "0 0 0 rgba(92, 124, 196, 0)",
                        "0 14px 26px rgba(92, 124, 196, 0.18)",
                        "0 0 0 rgba(92, 124, 196, 0)",
                    ],
                },
                {duration: 0.6, ease: [0.33, 1, 0.68, 1]},
            ],
        ]);
        return () => sequence.stop();
    }, [activeLessonIndex, prefersReducedMotion]);

    const handleSelect = useCallback(
        (index: number) => {
            setActiveIndex(index);
            onLessonSelect?.(index);
        },
        [onLessonSelect],
    );

    const content = useMemo(
        () =>
            lessons.map((label, index) => (
                <LessonTab
                    key={label}
                    label={label}
                    index={index}
                    isActive={activeIndex === index}
                    onSelect={handleSelect}
                    prefersReducedMotion={prefersReducedMotion}
                />
            )),
        [activeIndex, handleSelect, lessons, prefersReducedMotion],
    );

    return (
        <LayoutGroup>
            <motion.nav
                ref={wrapperRef}
                role="tablist"
                className="mx-auto flex w-fit items-center justify-center gap-3 rounded-b-3xl border-3 border-t-0 border-space-50 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-space-500/50 dark:bg-space-900/50"
                variants={prefersReducedMotion ? undefined : containerVariants}
                initial={prefersReducedMotion ? undefined : "hidden"}
                animate={prefersReducedMotion ? undefined : controls}
            >
                {prefersReducedMotion ? lessons.map((label, index) => (
                    <LessonTab
                        key={label}
                        label={label}
                        index={index}
                        isActive={activeIndex === index}
                        onSelect={handleSelect}
                        prefersReducedMotion={prefersReducedMotion}
                    />
                )) : content}
            </motion.nav>
        </LayoutGroup>
    );
}

export default LessonIndicator;


<Content>
    <ReadingCard>
        <ReadingCard.Image src="https://yavuzceliker.github.io/sample-images/image-224.jpg"
                           alt="Sample image"/>
        <ReadingCard.Title>
            The Christmas Gifts
        </ReadingCard.Title>
        <ReadingCard.Body reading={reading}/>
    </ReadingCard>

    <ReadingPoint>
        <ReadingPoint.Item>
            <ReadingPoint.Title>Skim</ReadingPoint.Title>
            <ReadingPoint.Body>Look for numbers and key travel words.</ReadingPoint.Body>

        </ReadingPoint.Item>

        <ReadingPoint.Item>
            <ReadingPoint.Title>Scan</ReadingPoint.Title>
            <ReadingPoint.Body>Find details (time, gate, flight number).</ReadingPoint.Body>
            <ReadingPoint.Description>My flight number is 245, and the departure is at 10 am. I go through
                security and then wait at gate 12. There is a small delay, so the boarding starts later, While
                waiting, I sit on my seat near the gate and read a book. Finally,</ReadingPoint.Description>
        </ReadingPoint.Item>
    </ReadingPoint>


    <TipCard>
        <TipCard.Item>
            <TipCard.Title>Skim</TipCard.Title>
            <TipCard.Body>Look for numbers and key travel words.</TipCard.Body>
        </TipCard.Item>
        <TipCard.Divider/>
        <TipCard.Item>
            <TipCard.Title>Scan</TipCard.Title>
            <TipCard.Body>Find details (time, gate, flight number).</TipCard.Body>
            <TipCard.Description>
                My flight number is 245, and the departure is at 10 am. I go through
                security and then wait at gate 12. There is a small delay, so the boarding
                starts later. While waiting, I sit near the gate and read a book.*!
            </TipCard.Description>
        </TipCard.Item>
    </TipCard>
</Content>

const NavItem: FC<NavItemProps> = ({active = false, icon}): ReactElement => {
    const prefersReducedMotion = useReducedMotion();
    const tone = active ? {
        base: "!text-celestialblue-250",
        state: "bg-space-800 border-space-500",
    } : {
        base: "!text-emerald-100",
        state: "hover:!text-emerald-150 hover:border-space-400 hover:bg-space-10/5 border-transparent bg-transparent",
    };
    return (<button
        className={cn("flex items-center justify-center w-[60px] h-[60px] rounded-[10px] border transition-all duration-300 cursor-pointer", tone.base, tone.state)}>
        <motion.span className="material-symbols-rounded !text-[36px] !font-extralight"
                     whileHover={prefersReducedMotion ? undefined : {y: [0, 0], scale: [1.05, 1]}}
                     whileTap={prefersReducedMotion ? undefined : {scale: 0.95}}
                     transition={prefersReducedMotion ? undefined : {
                         type: "spring",
                         stiffness: 220,
                         damping: 14,
                         mass: 0.9
                     }}> {icon} </motion.span>
    </button>);
};

"use client";

import { motion, useReducedMotion } from "motion/react";
import { Card } from "@lunara/core-ui";

import DashboardCard from "@lunara/core-ui/components/DashboardCard";

export default function DashboardShell() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-[23px] md:auto-rows-400px grid-col-3 place-items-center mx-auto [grid-template-areas:'roadmap book music'_'bottom bottom bottom']"
        >
            <DashboardCard className={"[grid-area:roadmap]"} title={[
                {text: "انگلیسی پایه ", lang: "fa"},
            ]} type={"roadmap"} path={["Roadmap A1", "Grammar"]} progress={45}/>

            <DashboardCard
                className={"[grid-area:book]"}
                title={[
                    {text: "کتاب ", lang: "fa"},
                    {text: "Oxford Word Skills 2", lang: "en"},
                ]}
                type="book"
                path={["Trip with Robert", "Lesson 23"]}
                progress={58}
            />

            <DashboardCard
                className={"[grid-area:music]"}
                title={[
                    {text: "کتاب ", lang: "fa"},
                    {text: "Oxford Word Skills 2", lang: "en"},
                ]}
                type="music"
                path={["This is not America"]}
                progress={98}
            />

            <h1
                className={"[grid-area:bottom] text-red-400 text-center"}
            >
                123
            </h1>
        </motion.div>
    );
}



