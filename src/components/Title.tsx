import type {HTMLProps, JSX, ReactNode} from "react";
import {cva} from "class-variance-authority";
import {cn} from "../utils/cn";

type TitleVariant =
    | "CelestialBlue"
    | "CelestialBlue_alt"
    | "Saffron"
    | "PersianRed"
    | "Emerald"
    | "Space"
    | "Space_alt"
    | "PersianRed_alt"
    | "PersianRed_dark";

type TitleSize = 1 | 2 | 3 | 4 | 5 | 6;

interface TitleProps extends HTMLProps<HTMLHeadingElement> {
    children: ReactNode,
    tone?: TitleVariant
    size?: TitleSize;
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

function Title({children, tone, size = 3, className, ...rest}: TitleProps) {
    const Tag = (`h${size}` satisfies keyof JSX.IntrinsicElements) as
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";

    return (
        <Tag className={cn(titleVariants({ tone: tone, size: size }), className)} {...rest}>
            {children}
        </Tag>
    );
}

export default Title;
