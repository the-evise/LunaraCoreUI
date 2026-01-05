import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import type { ReactNode } from "react";

/* ----------------------------- Variants ----------------------------- */

const cardVariants = cva(
    "relative flex flex-col w-full max-w-[800px] xl:max-w-[1060px] border-2 transition-all duration-300",
    {
        variants: {
            tone: {
                default: "border-space-150 bg-space-10 text-space-900",
                Space: "border-space-150 bg-space-50 text-space-800",
                CelestialBlue:
                    "border-celestialblue-150 bg-celestialblue-50 text-celestialblue-900",
                Saffron:
                    "border-saffron-150 bg-saffron-50 text-saffron-900",
                PersianRed:
                    "border-persianred-150 bg-persianred-50 text-persianred-900",
                Emerald:
                    "border-emerald-150 bg-emerald-50 text-emerald-900",
                White: "border-space-100 bg-white text-space-700",
            },
            padding: {
                none: "p-0",
                xsm: "p-1",
                sm: "p-2 md:p-4",
                md: "p-2 md:p-7",
                lg: "p-2 md:p-9",
            },
            align: {
                left: "text-left items-start",
                center: "text-center items-center",
                right: "text-right items-end",
            },
            rounded: {
                sm: "rounded-sm",
                md: "rounded-md",
                xmd: "rounded-lg md:rounded-[10px]",
                lg: "rounded-lg",
                xl: "rounded-xl",
                "2xl": "rounded-xl md:rounded-2xl",
                "3xl": "rounded-2xl md:rounded-3xl",
            },
            hoverable: {
                true: "hover:-translate-y-[2px] hover:border-opacity-80 transition-transform duration-200",
                false: "",
            },
            elevation: {
                none: "",
                sm: "shadow-[0_0px_4px_rgba(38,46,61,0.1)]",
                md: "shadow-[0_0px_8px_rgba(38,46,61,0.16)]",
                lg: "shadow-[0_0px_10px_rgba(38,46,61,0.18)]",
            },
            flatEdges: {
                true: "rounded-none border-t-1 border-b-0 last:border-b-1 border-x-0 md:border-2",
                false: "",
            },
        },
        compoundVariants: [
            { flatEdges: true, rounded: "sm", class: "md:rounded-sm" },
            { flatEdges: true, rounded: "md", class: "md:rounded-md" },
            { flatEdges: true, rounded: "xmd", class: "md:rounded-[10px]" },
            { flatEdges: true, rounded: "lg", class: "md:rounded-lg" },
            { flatEdges: true, rounded: "xl", class: "md:rounded-xl" },
            { flatEdges: true, rounded: "2xl", class: "md:rounded-2xl" },
            { flatEdges: true, rounded: "3xl", class: "md:rounded-3xl" },
        ],
        defaultVariants: {
            tone: "default",
            padding: "md",
            align: "left",
            rounded: "2xl",
            hoverable: false,
            elevation: "none",
        },
    }
);

export type CardVariants = VariantProps<typeof cardVariants>;

/* ----------------------------- Component ----------------------------- */

interface CardProps extends CardVariants {
    children: ReactNode;
    className?: string;
    /** When true, removes rounded corners and keeps only top/bottom borders */
    flatEdges?: boolean;
}

function Card({
                  children,
                  tone,
                  padding,
                  align,
                  rounded,
                  hoverable,
                  elevation,
                  className,
                  flatEdges = false,
              }: CardProps) {
    return (
        <div
            className={cn(
                cardVariants({ tone, padding, align, rounded, hoverable, elevation, flatEdges }),
                className
            )}
        >
            {children}
        </div>
    );
}

export default Card;
