import * as React from "react";
import type {HTMLProps, JSX, ReactNode} from "react";
import { motion, useReducedMotion } from "motion/react";
import {cva} from "class-variance-authority";
import {cn} from "../utils/cn";

export type TitleVariant =
    | "CelestialBlue"
    | "CelestialBlue_alt"
    | "Saffron"
    | "PersianRed"
    | "Emerald"
    | "Space"
    | "Space_alt"
    | "PersianRed_alt"
    | "PersianRed_dark";

export type TitleSize = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type IntlWithSegmenter = typeof Intl & {
    Segmenter?: new (
        locales?: string | string[],
        options?: { granularity: "grapheme" }
    ) => {
        segment: (input: string) => Iterable<{ segment: string }>;
    };
};

export interface TitleProps extends HTMLProps<HTMLHeadingElement> {
    children: ReactNode,
    tone?: TitleVariant
    size?: TitleSize;
    animate?: boolean;
    as?: HeadingTag;
}

const titleVariants = cva("font-lato mb-2", {
    variants: {
        tone: {
            CelestialBlue: "text-celestialblue-500",
            CelestialBlue_alt: "text-celestialblue-400",
            Saffron: "text-saffron-500",
            PersianRed: "text-persianred-500",
            PersianRed_alt: "text-persianred-400",
            PersianRed_dark: "text-persianred-900",
            Emerald: "text-emerald-500",
            Space: "text-space-500",
            Space_alt: "text-space-300"
        },
        size: {
            1: "text-5xl",
            2: "text-4xl",
            3: "text-3xl",
            4: "text-xl md:text-2xl",
            5: "text-lg md:text-xl",
            6: "text-lg",
        },
    },
    defaultVariants: {
        tone: "CelestialBlue",
        size: 3,
    },
});

const typewriterContainer = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.018,
            delayChildren: 0.04,
        },
    },
} as const;

const typewriterChar = {
    hidden: { opacity: 0, y: 6 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.12, ease: "easeOut" },
    },
} as const;
const MAX_ANIMATED_CHARACTERS = 180;

function Title({children, tone, size = 3, animate = true, as, className, ...rest}: TitleProps) {
    const fallbackTag = (`h${size}` satisfies keyof JSX.IntrinsicElements) as HeadingTag;
    const Tag = as ?? fallbackTag;
    const prefersReducedMotion = useReducedMotion();
    const isPlainText =
        typeof children === "string" || typeof children === "number";
    const text = isPlainText ? String(children) : null;
    const characters = React.useMemo(
        () => {
            if (!text) {
                return [];
            }
            const segmenterCtor = (Intl as IntlWithSegmenter).Segmenter;
            if (segmenterCtor) {
                return Array.from(
                    new segmenterCtor(undefined, { granularity: "grapheme" }).segment(text),
                    (part) => part.segment
                );
            }
            return Array.from(text);
        },
        [text],
    );
    const shouldAnimate =
        animate &&
        !prefersReducedMotion &&
        Boolean(text) &&
        characters.length <= MAX_ANIMATED_CHARACTERS;

    return (
        <Tag
            className={cn(titleVariants({ tone: tone, size: size }), className)}
            aria-label={shouldAnimate ? text ?? undefined : undefined}
            {...rest}
        >
            {shouldAnimate ? (
                <motion.span
                    key={text ?? "title-text"}
                    aria-hidden="true"
                    className="inline whitespace-pre-wrap"
                    variants={typewriterContainer}
                    initial="hidden"
                    animate="show"
                >
                    {characters.map((char, index) => {
                        const isWhitespace = /^\s$/.test(char);
                        return (
                            <motion.span
                                key={`${char}-${index}`}
                                className={cn("inline-block", isWhitespace && "whitespace-pre")}
                                variants={typewriterChar}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </motion.span>
            ) : (
                children
            )}
        </Tag>
    );
}

export default Title;
