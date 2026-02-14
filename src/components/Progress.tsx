import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { forwardRef } from "react";
import { motion } from "motion/react";
import type { MotionValue } from "motion";
import {
    useProgressLogic,
    type ProgressOrientation,
    type ProgressTone,
    type ProgressVariant,
} from "../hooks/useProgressLogic";

/* ----------------------------- Variants ----------------------------- */

const progressVariants = cva(
    "relative overflow-hidden border transition-colors duration-200 ease-out",
    {
        variants: {
            variant: {
                default: "rounded-full",
                card: "",
            },
            size: {
                sm: "h-3 p-[3px]",
                md: "h-5 p-1",
                lg: "h-8 p-2",
                xl: "h-12 p-1",
            },
            tone: {
                celestial: "bg-space-50 border-space-200",
                saffron: "bg-saffron-10 border-saffron-200/50",
                emerald: "bg-emerald-10 border-emerald-600/50",
                space: "bg-space-50 border-space-200",
                white: "bg-space-10 border-space-150",
                roadmap: "border-celestialblue-200 bg-space-10",
                book: "border-saffron-200 bg-saffron-50",
                music: "border-persianred-200 bg-persianred-50",
            },
            dotted: {
                true: "!p-[6px]",
                false: "",
            },
            orientation: {
                horizontal: "flex flex-row items-center justify-start gap-1",
                vertical: "flex flex-col-reverse items-center justify-center gap-1",
            },
        },
        compoundVariants: [
            {
                variant: "card",
                size: "sm",
                className: "!rounded-sm",
            },
            {
                variant: "card",
                size: "md",
                className: "!rounded-md",
            },
            {
                variant: "card",
                size: "lg",
                className: "!rounded-lg",
            },
            {
                variant: "card",
                size: "xl",
                className: "!rounded-xl",
            },
            {
                dotted: true,
                orientation: "horizontal",
                size: "xl",
                className: "!h-auto",
            },
        ],
        defaultVariants: {
            variant: "default",
            size: "md",
            tone: "celestial",
            dotted: false,
            orientation: "horizontal",
        },
    }
);

const innerHeightBySize = {
    sm: "!h-[6px]",
    md: "!h-[12px]",
    lg: "!h-[16px]",
    xl: "!h-10",
} as const;

const cardFillRadiusBySize = {
    sm: "!rounded-[4px]",
    md: "!rounded-sm",
    lg: "!rounded-md",
    xl: "!rounded-lg",
} as const;

export type ProgressVariants = VariantProps<typeof progressVariants>;

const dotVariants = {
    inactive: { scale: 0.88, opacity: 0.45 },
    active: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 480, damping: 26 },
    },
} as const;

const dotTransition = { type: "spring", stiffness: 420, damping: 30 } as const;

interface ProgressProps extends ProgressVariants {
    value: number;
    valueMotion?: MotionValue<number>;
    max?: number;
    maxWidth?: number | string;
    hasStrips?: boolean;
    className?: string;
    variant?: "default" | "card";
    animateOnInView?: boolean;
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
            maxWidth = "100%",
            hasStrips,
            dotted,
            orientation,
            variant,
            className,
            animateOnInView = true,
            ...props
        },
        ref
    ) => {
        const resolvedSize = (size ?? "md") as keyof typeof innerHeightBySize;
        const resolvedTone = (tone ?? "celestial") as ProgressTone;
        const resolvedHasStrips = hasStrips ?? false;
        const resolvedDotted = dotted ?? false;
        const resolvedOrientation = (orientation ?? "horizontal") as ProgressOrientation;
        const resolvedVariant = (variant ?? "default") as ProgressVariant;

        const {
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
        } = useProgressLogic({
            value,
            valueMotion,
            max,
            tone: resolvedTone,
            hasStrips: resolvedHasStrips,
            dotted: resolvedDotted,
            orientation: resolvedOrientation,
            variant: resolvedVariant,
            forwardedRef: ref,
        });
        const shouldAnimateOnInView = animateOnInView && !prefersReducedMotion;

        if (isCardVariant) {
            return (
                <motion.div
                    ref={setRefs}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={clampedMax}
                    className={cn(
                        progressVariants({
                            variant: resolvedVariant,
                            size: resolvedSize,
                            tone: resolvedTone,
                        }),
                        "relative w-full overflow-hidden border transition-colors duration-200 ease-out",
                        toneStyle.border,
                        toneStyle.base,
                        className
                    )}
                    style={{ width: maxWidth }}
                    initial={shouldAnimateOnInView ? { opacity: 0, y: -10 } : undefined}
                    whileInView={
                        shouldAnimateOnInView
                            ? {
                                  opacity: 1,
                                  y: 0,
                                  transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
                              }
                            : undefined
                    }
                    viewport={shouldAnimateOnInView ? { amount: 0.4 } : undefined}
                    exit={
                        shouldAnimateOnInView
                            ? {
                                  opacity: 0,
                                  y: -10,
                                  transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
                              }
                            : undefined
                    }
                    layout
                    {...props}
                >
                    <motion.div
                        className={cn(
                            "w-full relative z-[1] box-border transition-shadow duration-200",
                            toneStyle.bg,
                            innerHeightBySize[resolvedSize],
                            cardFillRadiusBySize[resolvedSize]
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

        if (resolvedDotted) {
            const dottedDotSizeClass =
                resolvedSize === "sm"
                    ? "h-[10px] w-[10px]"
                    : resolvedSize === "xl" && resolvedOrientation === "horizontal"
                      ? "h-5 w-5"
                      : "h-4 w-4 md:h-3 md:w-3";
            return (
                <motion.div
                    ref={setRefs}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={dottedStepCount}
                    className={cn(
                        progressVariants({
                            size: resolvedSize,
                            tone: resolvedTone,
                            dotted: resolvedDotted,
                            orientation: resolvedOrientation,
                        }),
                        resolvedSize === "sm" ? "!p-[8px]" : "",
                        className
                    )}
                    style={{
                        width: "fit-content",
                        height: resolvedOrientation === "vertical" ? "auto" : undefined,
                    }}
                    initial={shouldAnimateOnInView ? { opacity: 0, y: 10 } : undefined}
                    whileInView={
                        shouldAnimateOnInView
                            ? {
                                  opacity: 1,
                                  y: 0,
                                  transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
                              }
                            : undefined
                    }
                    viewport={shouldAnimateOnInView ? { once: true, amount: 0.4 } : undefined}
                    {...props}
                >
                    {dotIndices.map((index) => {
                        const isActive = index < activeCount;
                        if (prefersReducedMotion) {
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        dottedDotSizeClass,
                                        "rounded-full",
                                        isActive ? dotTone.active : `border-2 ${dotTone.inactive}`
                                    )}
                                />
                            );
                        }
                        return (
                            <motion.div
                                key={index}
                                className={cn(
                                    dottedDotSizeClass,
                                    "rounded-full",
                                    isActive ? dotTone.active : `border-2 ${dotTone.inactive}`
                                )}
                                initial={false}
                                animate={isActive ? "active" : "inactive"}
                                variants={dotVariants}
                                transition={dotTransition}
                            />
                        );
                    })}
                </motion.div>
            );
        }

        return (
            <motion.div
                ref={setRefs}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={clampedMax}
                className={cn(
                    progressVariants({ size: resolvedSize, tone: resolvedTone }),
                    toneStyle.base,
                    toneStyle.border,
                    className
                )}
                style={{
                    width: "100%",
                    maxWidth: resolvedOrientation === "vertical" ? "fit-content" : maxWidth,
                }}
                initial={shouldAnimateOnInView ? { opacity: 0, y: 10 } : undefined}
                whileInView={
                    shouldAnimateOnInView
                        ? {
                              opacity: 1,
                              y: 0,
                              transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
                          }
                        : undefined
                }
                viewport={shouldAnimateOnInView ? { amount: 0.4 } : undefined}
                exit={
                    shouldAnimateOnInView
                        ? {
                              opacity: 0,
                              y: -10,
                              transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
                          }
                        : undefined
                }
                layout
                {...props}
            >
                {canRenderStrips ? (
                    <motion.div
                        aria-hidden
                        ref={stripesRef}
                        className={cn(
                            "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2",
                            innerHeightBySize[resolvedSize]
                        )}
                        style={{
                            backgroundImage: stripePattern,
                            backgroundSize: "auto 100%",
                            backgroundPositionX: prefersReducedMotion
                                ? "0%"
                                : stripeIntroPositionCSS,
                            opacity: prefersReducedMotion ? 0.42 : stripeOpacity,
                            maskImage: prefersReducedMotion ? undefined : stripeMask,
                            WebkitMaskImage: prefersReducedMotion ? undefined : stripeMask,
                        }}
                    />
                ) : null}

                <motion.div
                    ref={fillRef}
                    className={cn(
                        "relative w-fit z-[1] h-full rounded-full",
                        toneStyle.bg,
                        innerHeightBySize[resolvedSize]
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
