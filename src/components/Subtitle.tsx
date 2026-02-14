import type {HTMLProps, ReactNode} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../utils/cn";
import * as motion from "motion/react-client";

type SubtitleTone =
    | "CelestialBlue"
    | "Saffron"
    | "PersianRed"
    | "Emerald"
    | "Space"
    | "";

type SubtitleSize = 3 | 4 | 5 | 6; // excludes h1, h2

const subtitleVariants = cva(
    "inline-flex items-center rounded-full leading-tight transition-colors duration-200 w-fit",
    {
        variants: {
            tone: {
                CelestialBlue:
                    "bg-celestialblue-50 text-celestialblue-700 dark:bg-celestialblue-900/40 dark:text-celestialblue-150",
                Saffron:
                    "bg-saffron-50 text-saffron-700 dark:bg-saffron-900/40 dark:text-saffron-150",
                PersianRed:
                    "bg-persianred-50 text-persianred-700 dark:bg-persianred-900/40 dark:text-persianred-150",
                Emerald:
                    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-150",
                Space:
                    "bg-space-50 text-space-700 dark:bg-space-900/40 dark:text-space-150",
            },
            size: {
                3: "text-lg md:text-xl font-medium",
                4: "text-base md:text-2xl font-medium",
                5: "text-sm md:text-base font-medium",
                6: "text-xs md:text-sm font-medium",
            },
            padding: {
                sm: "px-2 py-1",
                md: "px-6 py-2",
                lg: "px-6 py-3",
            },
            align: {
                left: "justify-start text-left mr-auto ml-0",
                center: "justify-center text-center mx-auto",
                right: "justify-end text-right ml-auto mr-0",
            },
            isTransparent: {
                true: "!bg-transparent dark:!bg-transparent",
                false: "",
            },
        },
        defaultVariants: {
            tone: "CelestialBlue",
            size: 4,
            padding: "md",
            align: "center",
            isTransparent: false,
        },
    }
);

type SubtitleElement = "h3" | "h4" | "h5" | "h6";
const subtitleTagMap: Record<SubtitleSize, SubtitleElement> = {
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6",
};

const MotionHeadingMap = {
    h3: motion.h3,
    h4: motion.h4,
    h5: motion.h5,
    h6: motion.h6,
} as const;

export interface SubtitleProps
    extends Omit<HTMLProps<HTMLHeadingElement>, "size">,
        VariantProps<typeof subtitleVariants> {
    children: ReactNode;
    /** optional motion animation */
    animateFrom?: "left" | "right" | "bottom" | "top";
    /** removes background regardless of tone */
    isTransparent?: boolean;
}

function Subtitle({
                      children,
                      tone,
                      size = 4,
                      padding,
                      align = "center",
                      isTransparent = false,
                      className,
                      animateFrom,
                      ...rest
                  }: SubtitleProps) {
    const resolvedSize = (size ?? 4) as SubtitleSize;
    const tagKey: SubtitleElement = subtitleTagMap[resolvedSize] ?? "h4";
    const MotionTag = MotionHeadingMap[tagKey];
    const initialMap: Record<string, any> = {
        left: {opacity: 0, x: -20},
        right: {opacity: 0, x: 20},
        top: {opacity: 0, y: -20},
        bottom: {opacity: 0, y: 20},
    };

    const sharedProps = {
        initial: animateFrom ? initialMap[animateFrom] : false,
        animate: {opacity: 1, x: 0, y: 0},
        transition: {type: "spring", duration: 0.2, delay: 0.3, bounce: 0.2},
        className: cn(
            subtitleVariants({ tone, size: resolvedSize, padding, align, isTransparent }),
            className
        ),
        ...rest,
    };

    return (
        <MotionTag {...(sharedProps as any)}>
            {children}
        </MotionTag>
    );
}

export default Subtitle;
