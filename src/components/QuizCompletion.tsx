import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import QuizCard from "./QuizCard";
import { cn } from "../utils/cn";
import { motion, useReducedMotion } from "motion/react";
import Button from "./Button";


/* --------------------------- Variants --------------------------- */

const containerVariants = cva(
    "flex min-h-screen w-full flex-col items-center justify-center gap-7 px-4 py-12 text-center transition-colors duration-300 sm:gap-9 sm:py-16",
    {
        variants: {
            status: {
                success: "bg-emerald-10/50 text-emerald-800",
                failure: "bg-persianred-10/50 text-persianred-800",
            },
        },
        defaultVariants: {
            status: "success",
        },
    }
);

const imageWrapperVariants = cva(
    "flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[80px] border border-space-100/80 bg-white/90 shadow-[0_16px_40px_rgba(26,39,68,0.08)] sm:h-[260px] sm:w-[260px]",
);

const messageVariants = cva(
    "max-w-[680px] text-2xl font-semibold leading-snug sm:text-3xl",
    {
        variants: {
            status: {
                success: "text-emerald-800",
                failure: "text-persianred-800",
            },
        },
        defaultVariants: {
            status: "success",
        },
    }
);

/* --------------------------- Types --------------------------- */

type QuizResult = {
    xp?: ReactNode;
    time?: ReactNode;
    grade?: "S" | "A" | "B" | "C" | "D" | "F";
};

interface QuizCompletionProps extends VariantProps<typeof containerVariants> {
    message: string;
    result: QuizResult;
    actionLabel?: string;
    onAction?: () => void;
}

/* --------------------------- Component --------------------------- */

function QuizCompletion({
                            status = "success",
                            message,
                            result,
                            actionLabel = "Continue",
                            onAction,
                        }: QuizCompletionProps) {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const easing = [0.16, 1, 0.3, 1] as const;
    const words = useMemo(
        () => message.trim().split(/\s+/).filter(Boolean),
        [message],
    );
    const wordDelay = 0.05;
    const wordStagger = 0.11;
    const wordDuration = 0.32;
    const typingDurationMs =
        words.length > 0
            ? Math.round(
                (wordDelay + (words.length - 1) * wordStagger + wordDuration) *
                    1000,
            )
            : 0;
    const [typingComplete, setTypingComplete] = useState(prefersReducedMotion);
    const [contentVisible, setContentVisible] = useState(prefersReducedMotion);
    const [imageVisible, setImageVisible] = useState(prefersReducedMotion);

    useEffect(() => {
        if (prefersReducedMotion) {
            setTypingComplete(true);
            return;
        }

        setTypingComplete(words.length === 0);
        setContentVisible(false);
        setImageVisible(false);

        if (words.length === 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setTypingComplete(true);
        }, typingDurationMs);

        return () => window.clearTimeout(timer);
    }, [prefersReducedMotion, typingDurationMs, words.length]);

    useEffect(() => {
        if (prefersReducedMotion) {
            setContentVisible(true);
            setImageVisible(true);
            return;
        }

        if (!typingComplete) {
            setContentVisible(false);
            setImageVisible(false);
            return;
        }

        const contentTimer = window.setTimeout(() => {
            setContentVisible(true);
        }, 140);
        const imageTimer = window.setTimeout(() => {
            setImageVisible(true);
        }, 520);

        return () => {
            window.clearTimeout(contentTimer);
            window.clearTimeout(imageTimer);
        };
    }, [prefersReducedMotion, typingComplete]);

    const typewriterContainer = {
        hidden: { opacity: 1 },
        show: {
            opacity: 1,
            transition: {
                delayChildren: wordDelay,
                staggerChildren: wordStagger,
            },
        },
    } as const;
    const typewriterWord = {
        hidden: { opacity: 0, y: 6, scale: 0.97 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: wordDuration, ease: easing },
        },
    } as const;
    const contentMotionProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 12 },
            animate: contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
            transition: { duration: 0.35, ease: easing },
        };
    const imageMotionProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, scale: 0.96 },
            animate: imageVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 },
            transition: { duration: 0.4, ease: easing },
        };
    return (
        <motion.section
            className={containerVariants({ status })}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: { duration: 0.4, ease: easing } }
            }
        >
            <motion.div className={imageWrapperVariants()} {...imageMotionProps}>
                <img
                    src="/StreakEarned.png"
                    alt="Streak earned"
                    className="h-full w-full object-cover"
                />
            </motion.div>

            <motion.p
                key={message}
                className={cn(messageVariants({ status }), "flex flex-wrap justify-center gap-x-2 gap-y-1")}
                variants={prefersReducedMotion ? undefined : typewriterContainer}
                initial={prefersReducedMotion ? undefined : "hidden"}
                animate={prefersReducedMotion ? undefined : "show"}
            >
                {prefersReducedMotion ? (
                    message
                ) : (
                    words.map((word, index) => (
                        <motion.span
                            key={`${word}-${index}`}
                            className="inline-block"
                            variants={typewriterWord}
                        >
                            {word}
                        </motion.span>
                    ))
                )}
            </motion.p>

            <motion.div className="w-full max-w-2xl" {...contentMotionProps}>
                <QuizCard xp={result.xp} time={result.time} grade={result.grade} frameless/>
            </motion.div>

            <motion.div {...contentMotionProps}>
                <Button
                    type="button"
                    size="lg"
                    static={Boolean(prefersReducedMotion)}
                    className={cn(
                        "min-w-[220px] rounded-full px-8",
                        status === "failure"
                            ? "border-persianred-400 bg-persianred-500 text-white hover:border-persianred-300 hover:bg-persianred-400 active:border-persianred-600 active:bg-persianred-500"
                            : "border-celestialblue-500 bg-celestialblue-500 text-space-10 hover:border-celestialblue-300 hover:bg-celestialblue-400 active:border-celestialblue-600 active:bg-celestialblue-500"
                    )}
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            </motion.div>
        </motion.section>
    );
}

export default QuizCompletion;
