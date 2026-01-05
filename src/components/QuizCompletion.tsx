import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import QuizCard from "./QuizCard";
import { cn } from "../utils/cn";


/* --------------------------- Variants --------------------------- */

const containerVariants = cva(
    "flex min-h-screen w-full flex-col items-center justify-center gap-8 px-4 py-12 transition-colors duration-300",
    {
        variants: {
            status: {
                success: "bg-emerald-10/50 text-emerald-700",
                failure: "bg-persianred-10/50 text-persianred-700",
            },
        },
        defaultVariants: {
            status: "success",
        },
    }
);

const animationWrapperVariants = cva(
    "flex max-w-[320px] max-h-[320px] items-center justify-center overflow-hidden rounded-3xl bg-space-100",
    {
        variants: {
            hasAnimation: {
                true: "",
                false: "w-[160px] h-[160px]",
            },
        },
        defaultVariants: {
            hasAnimation: false,
        },
    }
);

const messageVariants = cva(
    "max-w-[640px] text-center text-2xl font-semibold leading-snug",
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
    animation?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

/* --------------------------- Component --------------------------- */

function QuizCompletion({
                            status = "success",
                            message,
                            result,
                            animation,
                            actionLabel = "Continue",
                            onAction,
                        }: QuizCompletionProps) {
    return (
        <section className={containerVariants({ status })}>
            {/* --- Animation Area --- */}
            <div className={animationWrapperVariants({ hasAnimation: Boolean(animation) })}>
                {animation ?? null}
            </div>

            {/* --- Message --- */}
            <p className={messageVariants({ status })}>{message}</p>

            {/* --- Result Summary --- */}
            <QuizCard xp={result.xp} time={result.time} grade={result.grade} frameless/>

            {/* --- CTA Button (always blue) --- */}
            <button
                type="button"
                className={cn(
                    "rounded-full bg-celestialblue-400 px-8 py-3 text-lg font-semibold text-space-10",
                    "transition hover:bg-celestialblue-300 border-5 border-solid border-celestialblue-100 box-border",
                    "min-w-[220px] focus-visible:outline-offset-2 focus-visible:outline-celestialblue-200"
                )}
                onClick={onAction}
            >
                {actionLabel}
            </button>
        </section>
    );
}

export default QuizCompletion;
