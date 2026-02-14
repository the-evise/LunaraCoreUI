import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    cloneElement,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { cn } from "../utils/cn";

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipAlign = "start" | "center" | "end";

const tooltipVariants = cva(
    "pointer-events-none absolute z-50 rounded-xl border text-xs font-medium shadow-[0_10px_24px_-12px_rgba(15,23,42,0.45)] backdrop-blur-sm",
    {
        variants: {
            variant: {
                solid: "",
                soft: "",
                outline: "",
            },
            tone: {
                space: "",
                celestial: "",
                saffron: "",
                persianred: "",
                emerald: "",
            },
            size: {
                sm: "px-2.5 py-1.5 text-[11px] max-h-8 w-max max-w-[12rem]",
                md: "px-3 py-2 text-xs max-h-10 w-max max-w-[18rem]",
                lg: "px-3.5 py-2.5 text-sm max-h-12 w-max max-w-[24rem]",
            },
        },
        compoundVariants: [
            { variant: "solid", tone: "space", className: "border-space-900 bg-space-900 text-space-10" },
            { variant: "solid", tone: "celestial", className: "border-celestialblue-500 bg-celestialblue-500 text-white" },
            { variant: "solid", tone: "saffron", className: "border-saffron-400 bg-saffron-400 text-space-900" },
            { variant: "solid", tone: "persianred", className: "border-persianred-500 bg-persianred-500 text-white" },
            { variant: "solid", tone: "emerald", className: "border-emerald-500 bg-emerald-500 text-white" },
            { variant: "soft", tone: "space", className: "border-space-200 bg-white/90 text-space-700" },
            { variant: "soft", tone: "celestial", className: "border-celestialblue-100 bg-celestialblue-50/70 text-celestialblue-700" },
            { variant: "soft", tone: "saffron", className: "border-saffron-100 bg-saffron-50/70 text-saffron-700" },
            { variant: "soft", tone: "persianred", className: "border-persianred-100 bg-persianred-50/70 text-persianred-700" },
            { variant: "soft", tone: "emerald", className: "border-emerald-100 bg-emerald-50/70 text-emerald-700" },
            { variant: "outline", tone: "space", className: "border-space-200 bg-white text-space-700" },
            { variant: "outline", tone: "celestial", className: "border-celestialblue-200 bg-white text-celestialblue-700" },
            { variant: "outline", tone: "saffron", className: "border-saffron-200 bg-white text-saffron-700" },
            { variant: "outline", tone: "persianred", className: "border-persianred-200 bg-white text-persianred-700" },
            { variant: "outline", tone: "emerald", className: "border-emerald-200 bg-white text-emerald-700" },
        ],
        defaultVariants: {
            variant: "solid",
            tone: "space",
            size: "md",
        },
    }
);

const arrowVariants = cva("absolute h-2 w-2 rotate-45 border", {
    variants: {
        variant: {
            solid: "",
            soft: "",
            outline: "",
        },
        tone: {
            space: "",
            celestial: "",
            saffron: "",
            persianred: "",
            emerald: "",
        },
    },
    compoundVariants: [
        { variant: "solid", tone: "space", className: "border-space-900 bg-space-200" },
        { variant: "solid", tone: "celestial", className: "border-celestialblue-500 bg-celestialblue-100" },
        { variant: "solid", tone: "saffron", className: "border-saffron-400 bg-saffron-100" },
        { variant: "solid", tone: "persianred", className: "border-persianred-500 bg-persianred-100" },
        { variant: "solid", tone: "emerald", className: "border-emerald-500 bg-emerald-100" },
        { variant: "soft", className: "border-t-0 border-l-0"},
        { variant: "soft", tone: "space", className: "border-space-200 bg-white/90" },
        { variant: "soft", tone: "celestial", className: "border-celestialblue-100 bg-celestialblue-50/70" },
        { variant: "soft", tone: "saffron", className: "border-saffron-100 bg-saffron-50/70" },
        { variant: "soft", tone: "persianred", className: "border-persianred-100 bg-persianred-50/70" },
        { variant: "soft", tone: "emerald", className: "border-emerald-100 bg-emerald-50/70" },
        { variant: "outline", tone: "space", className: "border-space-200 bg-white" },
        { variant: "outline", tone: "celestial", className: "border-celestialblue-200 bg-white" },
        { variant: "outline", tone: "saffron", className: "border-saffron-200 bg-white" },
        { variant: "outline", tone: "persianred", className: "border-persianred-200 bg-white" },
        { variant: "outline", tone: "emerald", className: "border-emerald-200 bg-white" },
    ],
    defaultVariants: {
        variant: "solid",
        tone: "space",
    },
});

type TooltipChildProps = {
    "aria-describedby"?: string;
};
export type TooltipProps = Omit<HTMLAttributes<HTMLSpanElement>, "children" | "title"> &
    VariantProps<typeof tooltipVariants> & {
        content: ReactNode;
        children: ReactElement<TooltipChildProps>;
        side?: TooltipSide;
        align?: TooltipAlign;
        offset?: number;
        open?: boolean;
        defaultOpen?: boolean;
        disabled?: boolean;
        hoverDebounceMs?: number;
        onOpenChange?: (open: boolean) => void;
        contentClassName?: string;
    };

const getSideOffsetStyle = (side: TooltipSide, offset: number) => {
    if (side === "top") return { marginBottom: offset };
    if (side === "bottom") return { marginTop: offset };
    if (side === "left") return { marginRight: offset };
    return { marginLeft: offset };
};

const getPlacementClasses = (side: TooltipSide, align: TooltipAlign) => {
    const sideClass = {
        top: "bottom-full",
        bottom: "top-full",
        left: "right-full",
        right: "left-full",
    }[side];

    const alignClass =
        side === "top" || side === "bottom"
            ? {
                start: "left-0",
                center: "left-1/2 -translate-x-1/2",
                end: "right-0",
            }[align]
            : {
                start: "top-0",
                center: "top-1/2 -translate-y-1/2",
                end: "bottom-0",
            }[align];

    return `${sideClass} ${alignClass}`;
};

const getArrowClasses = (side: TooltipSide) => {
    switch (side) {
        case "top":
            return "left-1/2 -translate-x-1/2 -bottom-1";
        case "bottom":
            return "left-1/2 -translate-x-1/2 -top-1";
        case "left":
            return "top-1/2 -translate-y-1/2 -right-1";
        case "right":
            return "top-1/2 -translate-y-1/2 -left-1";
        default:
            return "";
    }
};

const getMotionOffset = (side: TooltipSide) => {
    switch (side) {
        case "top":
            return { opacity: 0, y: 8 };
        case "bottom":
            return { opacity: 0, y: -8 };
        case "left":
            return { opacity: 0, x: 8 };
        case "right":
            return { opacity: 0, x: -8 };
        default:
            return { opacity: 0 };
    }
};

function Tooltip({
    content,
    children,
    variant,
    tone,
    size,
    side = "top",
    align = "center",
    offset = 10,
    open,
    defaultOpen = false,
    disabled,
    hoverDebounceMs = 120,
    onOpenChange,
    className,
    contentClassName,
    ...props
}: TooltipProps) {
    const prefersReducedMotion = useReducedMotion();
    const tooltipId = useId();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const hoverTimerRef = useRef<number | null>(null);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const openStateRef = useRef(isOpen);

    useEffect(() => {
        openStateRef.current = isOpen;
    }, [isOpen]);

    useEffect(
        () => () => {
            if (hoverTimerRef.current !== null) {
                window.clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
            }
        },
        []
    );

    const clearHoverTimer = () => {
        if (hoverTimerRef.current !== null) {
            window.clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
    };

    const setOpenState = (next: boolean) => {
        if (openStateRef.current === next) {
            return;
        }
        if (!isControlled) {
            setInternalOpen(next);
        }
        onOpenChange?.(next);
    };

    const setHoverOpenState = (next: boolean) => {
        clearHoverTimer();

        if (hoverDebounceMs <= 0) {
            setOpenState(next);
            return;
        }

        hoverTimerRef.current = window.setTimeout(() => {
            setOpenState(next);
            hoverTimerRef.current = null;
        }, hoverDebounceMs);
    };

    const handleMouseEnter: HTMLAttributes<HTMLSpanElement>["onMouseEnter"] = (event) => {
        props.onMouseEnter?.(event);
        if (!disabled) setHoverOpenState(true);
    };
    const handleMouseLeave: HTMLAttributes<HTMLSpanElement>["onMouseLeave"] = (event) => {
        props.onMouseLeave?.(event);
        setHoverOpenState(false);
    };
    const handleFocusCapture: HTMLAttributes<HTMLSpanElement>["onFocusCapture"] = (event) => {
        props.onFocusCapture?.(event);
        if (!disabled) {
            clearHoverTimer();
            setOpenState(true);
        }
    };
    const handleBlurCapture: HTMLAttributes<HTMLSpanElement>["onBlurCapture"] = (event) => {
        props.onBlurCapture?.(event);
        clearHoverTimer();
        setOpenState(false);
    };

    const childProps: TooltipChildProps = {
        "aria-describedby": [children.props["aria-describedby"], tooltipId]
            .filter(Boolean)
            .join(" ") || undefined,
    };

    return (
        <span
            className={cn("relative inline-flex", className)}
            {...props}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
        >
            {cloneElement(children, childProps)}
            <AnimatePresence>
                {isOpen && !disabled ? (
                    <motion.span
                        role="tooltip"
                        id={tooltipId}
                        className={cn(tooltipVariants({ variant, tone, size }), getPlacementClasses(side, align), contentClassName)}
                        style={getSideOffsetStyle(side, offset)}
                        initial={prefersReducedMotion ? undefined : getMotionOffset(side)}
                        animate={
                            prefersReducedMotion
                                ? undefined
                                : {
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] },
                                }
                        }
                        exit={
                            prefersReducedMotion
                                ? undefined
                                : {
                                    opacity: 0,
                                    transition: { duration: 0.18, ease: [0.33, 1, 0.68, 1] },
                                }
                        }
                    >
                        {content}
                        <span
                            aria-hidden
                            className={cn(arrowVariants({ variant, tone }), getArrowClasses(side))}
                        />
                    </motion.span>
                ) : null}
            </AnimatePresence>
        </span>
    );
}

export default Tooltip;
