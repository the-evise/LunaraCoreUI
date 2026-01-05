import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../utils/cn";
import Card from "./Card";
import Title from "./Title";
import {motion, useAnimationControls, useInView, useReducedMotion} from "motion/react";
import {useCallback, useEffect, useRef} from "react";
import type {ReactNode} from "react";

/* ----------------------------- Variants ----------------------------- */

const cardVariants = cva(
    "flex flex-col w-full max-w-[860px] mx-auto rounded-2xl overflow-hidden transition-all duration-300 shadow-sm",
    {
        variants: {
            tone: {
                space: "bg-space-25 text-space-800 border border-space-100",
                white: "bg-white text-space-900 border border-space-150",
            },
            padding: {
                sm: "p-4 md:p-6",
                md: "p-6 md:p-8",
                lg: "p-2 md:p-[30px]",
            },
        },
        defaultVariants: {
            tone: "white",
            padding: "md",
        },
    }
);

export type ReadingCardVariants = VariantProps<typeof cardVariants>;

const containerVariants = {
    hidden: {opacity: 0, y: 28, scale: 0.96},
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {duration: 0.55, ease: [0.2, 0.8, 0.2, 1]},
    },
    hovered: {
        scale: 1.012,
        y: -6,
        transition: {type: "spring", stiffness: 240, damping: 22},
    },
    pressed: {
        scale: 0.995,
        y: 1,
        transition: {type: "spring", stiffness: 360, damping: 28},
    },
} as const;

/* ----------------------------- Main Card ----------------------------- */

type ReadingCardProps = ReadingCardVariants & {
    children: ReactNode;
    className?: string;
};

function ReadingCard({ children, tone, padding, className }: ReadingCardProps) {
    const motionControls = useAnimationControls();
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(containerRef, {margin: "-15% 0px", once: true});

    useEffect(() => {
        if (prefersReducedMotion) {
            motionControls.set("visible");
            return;
        }
        if (inView) {
            motionControls.start("visible");
        }
    }, [inView, motionControls, prefersReducedMotion]);

    const handleInteractionStart = useCallback(() => {
        if (prefersReducedMotion) return;
        motionControls.start("hovered");
    }, [motionControls, prefersReducedMotion]);

    const handleInteractionEnd = useCallback(() => {
        if (prefersReducedMotion) return;
        motionControls.start("visible");
    }, [motionControls, prefersReducedMotion]);

    return (
        <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={motionControls}
            whileTap={prefersReducedMotion ? undefined : "pressed"}
            onHoverStart={handleInteractionStart}
            onHoverEnd={handleInteractionEnd}
            onFocusCapture={handleInteractionStart}
            onBlurCapture={handleInteractionEnd}
            className="w-full"
        >
            <Card
                align="left"
                className={cn(cardVariants({ tone, padding }), className)}
            >
                {children}
            </Card>
        </motion.div>
    );
}

/* ----------------------------- Image ----------------------------- */

type ReadingImageProps = {
    src: string;
    alt?: string;
    className?: string;
};

function ReadingImage({ src, alt, className }: ReadingImageProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.img
            src={src}
            alt={alt ?? ""}
            className={cn(
                "w-full h-auto rounded-xl object-cover mb-3 md:mb-6",
                "aspect-[16/9]",
                className
            )}
            initial={
                prefersReducedMotion
                    ? undefined
                    : {opacity: 0, scale: 0.975, y: 16}
            }
            whileInView={
                prefersReducedMotion
                    ? undefined
                    : {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {duration: 0.55, ease: [0.2, 0.8, 0.2, 1]},
                    }
            }
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : {scale: 1.02, transition: {type: "spring", stiffness: 260, damping: 24}}
            }
            viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.45}}
        />
    );
}

/* ----------------------------- Title ----------------------------- */

type ReadingTitleProps = {
    children: ReactNode;
};

function ReadingTitle({ children }: ReadingTitleProps) {
    return (
        <Title
            tone="CelestialBlue"
            size={3}
            className="mb-4 text-center md:text-left px-2 md:px-[10px]"
        >
            {children}
        </Title>
    );
}

/* ----------------------------- Body ----------------------------- */

type ReadingBodyProps = {
    reading: string[];
};

function ReadingBody({ reading }: ReadingBodyProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="space-y-4 text-space-800 text-reading md:text-reading-desktop leading-relaxed px-2 md:px-[10px]">
            {reading.map((text, i) => (
                <motion.p
                    key={i}
                    initial={
                        prefersReducedMotion
                            ? undefined
                            : {opacity: 0, y: 12}
                    }
                    whileInView={
                        prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.35,
                                    ease: [0.33, 1, 0.68, 1],
                                    delay: i * 0.05,
                                },
                            }
                    }
                    viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.55}}
                >
                    {text}
                </motion.p>
            ))}
        </div>
    );
}

/* ----------------------------- Compound API ----------------------------- */

ReadingCard.Image = ReadingImage;
ReadingCard.Title = ReadingTitle;
ReadingCard.Body = ReadingBody;

export default ReadingCard;
