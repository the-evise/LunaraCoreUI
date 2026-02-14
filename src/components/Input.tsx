import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, type ReactNode, useId, useState } from "react";
import { cn } from "../utils/cn";
import { motion } from "motion/react";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const inputFieldVariants = cva(
    "group relative flex w-full items-center gap-2 rounded-xl border transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white",
    {
        variants: {
            variant: {
                default:
                    "border-space-200 bg-white/90 text-space-900 shadow-sm hover:border-space-300",
                subtle:
                    "border-space-100 bg-space-50/80 text-space-900 shadow-sm hover:border-space-200",
                ghost:
                    "border-transparent bg-transparent text-space-900 hover:bg-space-50/60",
                search:
                    "rounded-full border-space-150 bg-white/80 text-space-900 shadow-sm hover:border-space-300",
            },
            size: {
                sm: "min-h-[40px] px-3 py-2",
                md: "min-h-[44px] px-4 py-2.5",
                lg: "min-h-[52px] px-5 py-3",
            },
            tone: {
                default:
                    "focus-within:border-celestialblue-200 focus-within:ring-celestialblue-200",
                info:
                    "focus-within:border-celestialblue-300 focus-within:ring-celestialblue-200",
                success:
                    "focus-within:border-emerald-300 focus-within:ring-emerald-200",
                warning:
                    "focus-within:border-saffron-300 focus-within:ring-saffron-200",
                danger:
                    "focus-within:border-persianred-300 focus-within:ring-persianred-200",
            },
        },
        compoundVariants: [
            { variant: "default", tone: "info", className: "border-celestialblue-200" },
            { variant: "default", tone: "success", className: "border-emerald-200" },
            { variant: "default", tone: "warning", className: "border-saffron-200" },
            { variant: "default", tone: "danger", className: "border-persianred-200" },
            { variant: "subtle", tone: "info", className: "border-celestialblue-200" },
            { variant: "subtle", tone: "success", className: "border-emerald-200" },
            { variant: "subtle", tone: "warning", className: "border-saffron-200" },
            { variant: "subtle", tone: "danger", className: "border-persianred-200" },
            { variant: "search", tone: "info", className: "border-celestialblue-200" },
            { variant: "search", tone: "success", className: "border-emerald-200" },
            { variant: "search", tone: "warning", className: "border-saffron-200" },
            { variant: "search", tone: "danger", className: "border-persianred-200" },
        ],
        defaultVariants: {
            variant: "default",
            size: "md",
            tone: "default",
        },
    }
);

const inputElementVariants = cva(
    "w-full min-w-0 bg-transparent font-medium text-space-900 placeholder:text-space-400 outline-none",
    {
        variants: {
            size: {
                sm: "text-xs",
                md: "text-sm",
                lg: "text-base",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

const labelVariants = cva(
    "text-xs font-semibold uppercase tracking-[0.2em]",
    {
        variants: {
            tone: {
                default: "text-space-400",
                info: "text-celestialblue-600",
                success: "text-emerald-600",
                warning: "text-saffron-700",
                danger: "text-persianred-600",
            },
        },
        defaultVariants: {
            tone: "default",
        },
    }
);

const messageVariants = cva(
    "text-xs",
    {
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
    }
);

export type InputVariants = VariantProps<typeof inputFieldVariants>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "className" | "prefix">,
        InputVariants {
    label?: string;
    helperText?: string;
    errorText?: string;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    prefix?: ReactNode;
    suffix?: ReactNode;
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
    labelClassName?: string;
    messageClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            errorText,
            leadingIcon,
            trailingIcon,
            prefix,
            suffix,
            variant = "default",
            size = "md",
            tone,
            className,
            fieldClassName,
            inputClassName,
            labelClassName,
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
        const resolvedSize = size ?? "md";
        const message = errorText ?? helperText;
        const messageId = message ? `${inputId}-message` : undefined;
        const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(" ") || undefined;
        const isInvalid = ariaInvalid ?? Boolean(errorText);
        const iconClassName = {
            sm: "text-lg",
            md: "text-xl",
            lg: "text-2xl",
        }[resolvedSize];
        const affixClassName = {
            sm: "px-2 py-0.5 text-[9px]",
            md: "px-2 py-1 text-[10px]",
            lg: "px-3 py-1 text-xs",
        }[resolvedSize];
        const [isFocused, setIsFocused] = useState(false);
        const allowMotion = !disabled;

        return (
            <div className={cn("flex w-full flex-col gap-2", className)}>
                {label ? (
                    <label
                        htmlFor={inputId}
                        className={cn(labelVariants({ tone: resolvedTone }), labelClassName)}
                    >
                        {label}
                    </label>
                ) : null}
                <motion.div
                    className={cn(
                        inputFieldVariants({ variant, size: resolvedSize, tone: resolvedTone }),
                        disabled ? "pointer-events-none opacity-60" : null,
                        fieldClassName
                    )}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                        opacity: 1,
                        y: isFocused ? -1 : 0,
                        scale: isFocused ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
                    whileHover={allowMotion ? { y: -1 } : undefined}
                >
                    {leadingIcon ? (
                        <span className={cn("text-space-500", iconClassName)}>{leadingIcon}</span>
                    ) : null}
                    {prefix ? (
                        <span
                            className={cn(
                                "rounded-lg border border-space-100 bg-space-50 font-semibold uppercase tracking-[0.2em] text-space-500",
                                affixClassName
                            )}
                        >
                            {prefix}
                        </span>
                    ) : null}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(inputElementVariants({ size: resolvedSize }), inputClassName)}
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
                    {suffix ? (
                        <span
                            className={cn(
                                "rounded-lg border border-space-100 bg-space-50 font-semibold uppercase tracking-[0.2em] text-space-500",
                                affixClassName
                            )}
                        >
                            {suffix}
                        </span>
                    ) : null}
                    {trailingIcon ? (
                        <span className={cn("text-space-500", iconClassName)}>{trailingIcon}</span>
                    ) : null}
                </motion.div>
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

Input.displayName = "Input";

export default Input;
