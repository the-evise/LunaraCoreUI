import { cva, type VariantProps } from "class-variance-authority";
import {
    forwardRef,
    type ChangeEvent,
    type InputHTMLAttributes,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { cn } from "../utils/cn";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const COMPLETE_EASE = [0.33, 1, 0.68, 1] as const;

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const toggleWrapperVariants = cva("flex items-start", {
    variants: {
        variant: {
            default: "",
            card: "items-center rounded-2xl border border-space-100 bg-space-10/80 p-3 shadow-sm",
            ghost: "rounded-2xl p-3 transition hover:bg-space-50/70",
        },
        size: {
            sm: "gap-2",
            md: "gap-3",
            lg: "gap-4",
        },
        tone: {
            default: "",
            info: "",
            success: "",
            warning: "",
            danger: "",
        },
    },
    compoundVariants: [
        { variant: "card", tone: "info", className: "border-celestialblue-200" },
        { variant: "card", tone: "success", className: "border-emerald-200" },
        { variant: "card", tone: "warning", className: "border-saffron-200" },
        { variant: "card", tone: "danger", className: "border-persianred-200" },
    ],
    defaultVariants: {
        variant: "default",
        size: "md",
        tone: "default",
    },
});

const toggleTrackVariants = cva(
    "relative inline-flex shrink-0 items-center rounded-full border transition-colors duration-200 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white after:absolute after:top-1/2 after:-translate-y-1/2 after:content-[''] after:rounded-full after:bg-white after:shadow-sm after:transition after:duration-200",
    {
        variants: {
            variant: {
                default: "rounded-full",
                card: "self-center rounded-sm bg-space-100/50 after:rounded-sm",
                ghost: "rounded-full",
            },
            size: {
                sm: "h-5 w-8 px-1 after:left-1 after:h-3 after:w-3 after:translate-x-0 peer-checked:after:translate-x-3",
                md: "h-7 w-11 px-1 after:left-1 after:h-4 after:w-4 after:translate-x-0 peer-checked:after:translate-x-4",
                lg: "h-8 w-14 px-1 after:left-1 after:h-5 after:w-5 after:translate-x-0 peer-checked:after:translate-x-6",
            },
            tone: {
                default:
                    "border-space-200 bg-space-150 peer-checked:border-celestialblue-500 peer-checked:bg-celestialblue-500 peer-focus-visible:ring-celestialblue-200",
                info:
                    "border-celestialblue-200 bg-celestialblue-50/70 peer-checked:border-celestialblue-500 peer-checked:bg-celestialblue-500 peer-focus-visible:ring-celestialblue-200",
                success:
                    "border-emerald-200 bg-emerald-50/70 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-focus-visible:ring-emerald-200",
                warning:
                    "border-saffron-200 bg-saffron-50/70 peer-checked:border-saffron-500 peer-checked:bg-saffron-500 peer-focus-visible:ring-saffron-200",
                danger:
                    "border-persianred-200 bg-persianred-50/70 peer-checked:border-persianred-500 peer-checked:bg-persianred-500 peer-focus-visible:ring-persianred-200",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            tone: "default",
        },
        compoundVariants: [
          { variant: "card", className: "border-0"},
            { variant: "card", size: "sm", className: "h-7 w-12 px-0 after:left-[2px] after:h-6 after:w-6 peer-checked:after:translate-x-[20px]" },
            { variant: "card", size: "md", className: "h-8 w-14 px-0 after:left-[2px] after:h-7 after:w-7 peer-checked:after:translate-x-[23px]" },
            { variant: "card", size: "lg", className: "h-9 w-16 px-0 after:left-[2px] after:h-8 after:w-9 peer-checked:after:translate-x-[24px]" },
        ],
    }
);

const toggleLabelVariants = cva("font-semibold", {
    variants: {
        size: {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        },
        tone: {
            default: "text-space-900",
            info: "text-celestialblue-700",
            success: "text-emerald-700",
            warning: "text-saffron-800",
            danger: "text-persianred-700",
        },
    },
    defaultVariants: {
        size: "md",
        tone: "default",
    },
});

const toggleDescriptionVariants = cva("text-space-500", {
    variants: {
        size: {
            sm: "text-[11px]",
            md: "text-xs",
            lg: "text-sm",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

const messageVariants = cva("text-xs", {
    variants: {
        tone: {
            default: "text-space-500",
            info: "text-celestialblue-600",
            success: "text-emerald-600",
            warning: "text-saffron-700",
            danger: "text-persianred-600",
        },
    },
    defaultVariants: {
        tone: "default",
    },
});

export type ToggleVariants = VariantProps<typeof toggleWrapperVariants> &
    VariantProps<typeof toggleTrackVariants>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export interface ToggleProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "className">,
        ToggleVariants {
    label?: string;
    description?: string;
    helperText?: string;
    errorText?: string;
    className?: string;
    wrapperClassName?: string;
    trackClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    messageClassName?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    (
        {
            label,
            description,
            helperText,
            errorText,
            variant = "default",
            size = "md",
            tone,
            className,
            wrapperClassName,
            trackClassName,
            labelClassName,
            descriptionClassName,
            messageClassName,
            id,
            disabled,
            "aria-describedby": ariaDescribedBy,
            "aria-invalid": ariaInvalid,
            onFocus,
            onBlur,
            onChange,
            checked,
            defaultChecked,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const resolvedTone = errorText ? "danger" : tone ?? "default";
        const message = errorText ?? helperText;
        const messageId = message ? `${inputId}-message` : undefined;
        const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(" ") || undefined;
        const isInvalid = ariaInvalid ?? Boolean(errorText);
        const prefersReducedMotion = useReducedMotion() ?? false;
        const [isFocused, setIsFocused] = useState(false);
        const [isChecked, setIsChecked] = useState(Boolean(checked ?? defaultChecked));
        const [pulseKey, setPulseKey] = useState(0);
        const trackRef = useRef<HTMLSpanElement | null>(null);

        useEffect(() => {
            if (typeof checked === "boolean") {
                setIsChecked(checked);
            }
        }, [checked]);

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event);
            setIsChecked(event.target.checked);
        };

        const trackTransition = {
            type: "spring" as const,
            stiffness: 420,
            damping: 28,
        };

        useEffect(() => {
            if (!isChecked || prefersReducedMotion) return;
            setPulseKey((current) => current + 1);
        }, [isChecked, prefersReducedMotion]);

        return (
            <div className={cn("flex w-full flex-col gap-2", className)}>
                <label
                    htmlFor={inputId}
                    className={cn(
                        toggleWrapperVariants({ variant, size, tone: resolvedTone }),
                        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                        wrapperClassName
                    )}
                >
                    <input
                        ref={ref}
                        id={inputId}
                        type="checkbox"
                        className="peer sr-only"
                        aria-describedby={describedBy}
                        aria-invalid={isInvalid}
                        disabled={disabled}
                        role="switch"
                        checked={checked}
                        defaultChecked={defaultChecked}
                        onFocus={(event) => {
                            onFocus?.(event);
                            setIsFocused(true);
                        }}
                        onBlur={(event) => {
                            onBlur?.(event);
                            setIsFocused(false);
                        }}
                        onChange={handleChange}
                        {...props}
                    />
                    <motion.span
                        ref={trackRef}
                        className={cn(
                            toggleTrackVariants({ variant, size, tone: resolvedTone }),
                            trackClassName
                        )}
                        initial={false}
                        animate={
                            prefersReducedMotion
                                ? {
                                    scale: isChecked ? 1.02 : 1,
                                    filter: "brightness(1)",
                                }
                                : {
                                    scale: isChecked ? 1.04 : isFocused ? 1.02 : 1,
                                    filter: isChecked ? "brightness(1.05)" : "brightness(1)",
                                }
                        }
                        transition={
                            prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    ...trackTransition,
                                    filter: { duration: 0.4, ease: COMPLETE_EASE },
                                }
                        }
                    >
                        <AnimatePresence>
                            {!prefersReducedMotion && isChecked ? (
                                <motion.span
                                    key={pulseKey}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 rounded-full bg-white/40"
                                    initial={{ opacity: 0.45, scale: 0.7 }}
                                    animate={{ opacity: 0, scale: 1.45 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: COMPLETE_EASE }}
                                />
                            ) : null}
                        </AnimatePresence>
                    </motion.span>
                    {(label || description) ? (
                        <span className="flex flex-col gap-1">
                            {label ? (
                                <span
                                    className={cn(
                                        toggleLabelVariants({ size, tone: resolvedTone }),
                                        labelClassName
                                    )}
                                >
                                    {label}
                                </span>
                            ) : null}
                            {description ? (
                                <span
                                    className={cn(
                                        toggleDescriptionVariants({ size }),
                                        descriptionClassName
                                    )}
                                >
                                    {description}
                                </span>
                            ) : null}
                        </span>
                    ) : null}
                </label>
                {message ? (
                    <p
                        id={messageId}
                        className={cn(messageVariants({ tone: resolvedTone }), messageClassName)}
                    >
                        {message}
                    </p>
                ) : null}
            </div>
        );
    }
);

Toggle.displayName = "Toggle";

export default Toggle;
