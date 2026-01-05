import { memo } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import type { Section } from "./SectionTracker";
import { motion } from "motion/react";

const emptySectionVariants = cva(
    "relative flex flex-col justify-center items-center rounded-3xl min-w-[260px] w-[70%] h-[450px] max-w-[400px] min-h-[280px] rounded-2xl border-1 border-space-10 dark:border-space-500 overflow-hidden box-content z-10 transition-all duration-300 md:border-2 md:min-w-[658px] md:max-w-[760px] md:h-[320px] p-[5px] md:p-[10px]",
    {
        variants: {
            section: {
                Vocabulary:
                    "bg-[linear-gradient(180deg,rgba(251,215,121,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(240,189,63,1)_0%,rgba(41,50,68,1)_73%)]",
                Reading:
                    "bg-[linear-gradient(180deg,rgba(107,212,249,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(29,129,192,1)_0%,rgba(41,50,68,1)_73%)]",
                Grammar:
                    "bg-[linear-gradient(180deg,rgba(255,143,131,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(155,15,24,1)_0%,rgba(41,50,68,1)_73%)]",
                Review:
                    "bg-[linear-gradient(180deg,rgba(177,187,206,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(74,83,100,1)_0%,rgba(41,50,68,1)_73%)]",
                Quiz:
                    "bg-[linear-gradient(180deg,rgba(139,253,188,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(14,177,106,1)_0%,rgba(41,50,68,1)_73%)]",
            },
        },
        defaultVariants: {
            section: "Review",
        },
    }
);

type EmptySectionProps = {
    section?: Section;
    className?: string;
};

const bigGlowMap: Record<Section, string> = {
    Vocabulary: "bg-saffron-250/20 dark:bg-saffron-250/10",
    Reading: "bg-celestialblue-250/20 dark:bg-celestialblue-250/10",
    Grammar: "bg-persianred-250/20 dark:bg-persianred-250/10",
    Review: "bg-space-500/10 dark:bg-space-250/10",
    Quiz: "bg-emerald-500/20 dark:bg-emerald-500/10",
};

const smallGlowMap: Record<Section, string> = {
    Vocabulary: "bg-persianred-200/50 dark:bg-persianred-250/50",
    Reading: "bg-emerald-200/50 dark:bg-emerald-250/50",
    Grammar: "bg-saffron-200/50 dark:bg-saffron-250/50",
    Review: "bg-celestialblue-200/50 dark:bg-celestialblue-100/50",
    Quiz: "bg-emerald-200/50 dark:bg-emerald-400/50",
};

const EmptySection = memo(function EmptySection({ section = "Review", className }: EmptySectionProps) {
    return (
        <motion.div className={cn(emptySectionVariants({ section }), className)} aria-hidden whileTap={{scale: 0.98}}>
            <div
                className={cn(
                    "absolute top-80 left-1/2 w-[760px] h-[735px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] transition-all duration-300",
                    bigGlowMap[section],
                )}
            />
            <div
                className={cn(
                    "absolute top-1/48 left-1/2 w-[274px] h-[265px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] z-0 transition-all duration-300",
                    smallGlowMap[section],
                )}
            />
            <div className="relative flex-1 flex flex-col justify-center items-center rounded-[18px] bg-space-10 dark:bg-space-900/90 z-10 shadow-[0_0_8px_rgba(0,0,0,0.25)] w-full h-full p-[5px] transition-all duration-300 border border-dashed border-space-200/50 dark:border-space-700/60" />
        </motion.div>
    );
});

export default EmptySection;
