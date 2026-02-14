import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, useId, useState } from "react";
import { cn } from "../utils/cn";
import { motion } from "motion/react";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const radioWrapperVariants = cva("flex items-start", {
    variants: {
        variant: {
            default: "",
            card: "items-center rounded-2xl border border-space-100 bg-space-10/80 p-3 shadow-sm transition-colors duration-200 ease-out has-[:checked]:bg-space-50/80",
            ghost: "items-center rounded-2xl p-3 transition-colors duration-200 ease-out hover:bg-space-50/70 has-[:checked]:bg-space-50/80",
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
        { variant: "card", size: "sm", className: "gap-3" },
        { variant: "card", size: "md", className: "gap-4" },
        { variant: "card", size: "lg", className: "gap-5" },
        { variant: "ghost", size: "sm", className: "gap-3" },
        { variant: "ghost", size: "md", className: "gap-4" },
        { variant: "ghost", size: "lg", className: "gap-5" },
    ],
    defaultVariants: {
        variant: "default",
        size: "md",
        tone: "default",
    },
});

const radioControlVariants = cva(
    "relative flex items-center justify-center border bg-white shadow-sm transition-colors duration-200 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] after:rounded-full after:opacity-0 after:scale-75 after:transition after:duration-150 peer-checked:after:opacity-100 peer-checked:after:scale-100",
    {
        variants: {
            variant: {
                default: "rounded-full",
                card: "self-center rounded-md bg-space-25",
                ghost: "self-center rounded-md bg-space-25",
            },
            size: {
                sm: "h-4 w-4 after:h-1.5 after:w-1.5",
                md: "h-5 w-5 after:h-2 after:w-2",
                lg: "h-6 w-6 after:h-2.5 after:w-2.5",
            },
            tone: {
                default:
                    "border-space-200 peer-checked:border-celestialblue-500 peer-checked:bg-celestialblue-50 peer-checked:after:bg-celestialblue-500 peer-focus-visible:ring-celestialblue-200",
                info:
                    "border-celestialblue-200 peer-checked:border-celestialblue-500 peer-checked:bg-celestialblue-50 peer-checked:after:bg-celestialblue-500 peer-focus-visible:ring-celestialblue-200",
                success:
                    "border-emerald-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:after:bg-emerald-500 peer-focus-visible:ring-emerald-200",
                warning:
                    "border-saffron-200 peer-checked:border-saffron-500 peer-checked:bg-saffron-50 peer-checked:after:bg-saffron-500 peer-focus-visible:ring-saffron-200",
                danger:
                    "border-persianred-200 peer-checked:border-persianred-500 peer-checked:bg-persianred-50 peer-checked:after:bg-persianred-500 peer-focus-visible:ring-persianred-200",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            tone: "default",
        },
        compoundVariants: [
            { variant: "card", size: "sm", className: "h-6 w-6 after:h-2.5 after:w-2.5" },
            { variant: "card", size: "md", className: "h-7 w-7 after:h-3 after:w-3" },
            { variant: "card", size: "lg", className: "h-8 w-8 after:h-3.5 after:w-3.5" },
            { variant: "ghost", size: "sm", className: "h-6 w-6 after:h-2.5 after:w-2.5" },
            { variant: "ghost", size: "md", className: "h-7 w-7 after:h-3 after:w-3" },
            { variant: "ghost", size: "lg", className: "h-8 w-8 after:h-3.5 after:w-3.5" },
        ],
    }
);

const radioLabelVariants = cva("font-semibold", {
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

const radioDescriptionVariants = cva("text-space-500", {
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

export type RadioVariants = VariantProps<typeof radioWrapperVariants> &
    VariantProps<typeof radioControlVariants>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export interface RadioProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "className">,
        RadioVariants {
    label?: string;
    description?: string;
    helperText?: string;
    errorText?: string;
    className?: string;
    wrapperClassName?: string;
    controlClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    messageClassName?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
            controlClassName,
            labelClassName,
            descriptionClassName,
            messageClassName,
            id,
            disabled,
            "aria-describedby": ariaDescribedBy,
            "aria-invalid": ariaInvalid,
            onFocus,
            onBlur,
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
        const [isFocused, setIsFocused] = useState(false);
        const allowMotion = !disabled;

        return (
            <div className={cn("flex w-full flex-col gap-2", className)}>
                <label
                    htmlFor={inputId}
                    className={cn(
                        radioWrapperVariants({ variant, size, tone: resolvedTone }),
                        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                        wrapperClassName
                    )}
                >
                    <input
                        ref={ref}
                        id={inputId}
                        type="radio"
                        className="peer sr-only"
                        aria-describedby={describedBy}
                        aria-invalid={isInvalid}
                        disabled={disabled}
                        onFocus={(event) => {
                            onFocus?.(event);
                            setIsFocused(true);
                        }}
                        onBlur={(event) => {
                            onBlur?.(event);
                            setIsFocused(false);
                        }}
                        {...props}
                    />
                    <motion.span
                        className={cn(
                            radioControlVariants({ variant, size, tone: resolvedTone }),
                            controlClassName
                        )}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{
                            opacity: 1,
                            scale: isFocused ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
                        whileHover={allowMotion ? { scale: 1.03 } : undefined}
                        whileTap={allowMotion ? { scale: 0.98 } : undefined}
                    />
                    {(label || description) ? (
                        <span className="flex flex-col gap-1">
                            {label ? (
                                <span
                                    className={cn(
                                        radioLabelVariants({ size, tone: resolvedTone }),
                                        labelClassName
                                    )}
                                >
                                    {label}
                                </span>
                            ) : null}
                            {description ? (
                                <span
                                    className={cn(
                                        radioDescriptionVariants({ size }),
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

Radio.displayName = "Radio";

export default Radio;
