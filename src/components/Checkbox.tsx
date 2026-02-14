import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    type ChangeEvent,
    forwardRef,
    type InputHTMLAttributes,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { cn } from "../utils/cn";
import mergeRefs from "../utils/mergeRefs";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const checkboxWrapperVariants = cva("flex items-start", {
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

const checkboxBoxVariants = cva(
    "relative flex items-center justify-center rounded-md border bg-white shadow-sm transition-colors duration-200 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white",
    {
        variants: {
            variant: {
                default: "",
                card: "self-center rounded-md bg-space-25",
                ghost: "self-center",
            },
            size: {
                sm: "h-4 w-4 [--checkbox-icon-size:var(--checkbox-icon-size-sm)]",
                md: "h-5 w-5 [--checkbox-icon-size:var(--checkbox-icon-size-md)]",
                lg: "h-6 w-6 [--checkbox-icon-size:var(--checkbox-icon-size-lg)]",
            },
            tone: {
                default:
                    "border-space-200 text-transparent peer-checked:border-celestialblue-500 peer-checked:bg-celestialblue-500 peer-checked:text-space-10 data-[state=mixed]:border-celestialblue-400 data-[state=mixed]:bg-celestialblue-100 data-[state=mixed]:text-celestialblue-700 peer-focus-visible:ring-celestialblue-200",
                info:
                    "border-celestialblue-200 text-transparent peer-checked:border-celestialblue-500 peer-checked:bg-celestialblue-500 peer-checked:text-space-10 data-[state=mixed]:border-celestialblue-400 data-[state=mixed]:bg-celestialblue-100 data-[state=mixed]:text-celestialblue-700 peer-focus-visible:ring-celestialblue-200",
                success:
                    "border-emerald-200 text-transparent peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:text-space-10 data-[state=mixed]:border-emerald-400 data-[state=mixed]:bg-emerald-100 data-[state=mixed]:text-emerald-700 peer-focus-visible:ring-emerald-200",
                warning:
                    "border-saffron-200 text-transparent peer-checked:border-saffron-500 peer-checked:bg-saffron-500 peer-checked:text-space-10 data-[state=mixed]:border-saffron-400 data-[state=mixed]:bg-saffron-100 data-[state=mixed]:text-saffron-800 peer-focus-visible:ring-saffron-200",
                danger:
                    "border-persianred-200 text-transparent peer-checked:border-persianred-500 peer-checked:bg-persianred-500 peer-checked:text-space-10 data-[state=mixed]:border-persianred-400 data-[state=mixed]:bg-persianred-100 data-[state=mixed]:text-persianred-700 peer-focus-visible:ring-persianred-200",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            tone: "default",
        },
        compoundVariants: [
            { variant: "card", size: "sm", className: "h-6 w-6" },
            { variant: "card", size: "md", className: "h-7 w-7" },
            { variant: "card", size: "lg", className: "h-8 w-8" },
            { variant: "ghost", size: "sm", className: "h-6 w-6" },
            { variant: "ghost", size: "md", className: "h-7 w-7" },
            { variant: "ghost", size: "lg", className: "h-8 w-8" },
        ],
    }
);

const checkboxLabelVariants = cva("font-semibold", {
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

const checkboxDescriptionVariants = cva("text-space-500", {
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

export type CheckboxVariants = VariantProps<typeof checkboxWrapperVariants> &
    VariantProps<typeof checkboxBoxVariants>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "className">,
        CheckboxVariants {
    label?: string;
    description?: string;
    helperText?: string;
    errorText?: string;
    indeterminate?: boolean;
    className?: string;
    wrapperClassName?: string;
    boxClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    messageClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            label,
            description,
            helperText,
            errorText,
            indeterminate = false,
            variant = "default",
            size = "md",
            tone,
            className,
            wrapperClassName,
            boxClassName,
            labelClassName,
            descriptionClassName,
            messageClassName,
            id,
            disabled,
            checked,
            defaultChecked,
            onChange,
            "aria-describedby": ariaDescribedBy,
            "aria-invalid": ariaInvalid,
            "aria-checked": ariaChecked,
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
        const prefersReducedMotion = useReducedMotion();
        const inputRef = useRef<HTMLInputElement | null>(null);
        const composedRef = useCallback(mergeRefs(ref, inputRef), [ref]);
        const isMixed = Boolean(indeterminate);
        const [isChecked, setIsChecked] = useState(() => Boolean(checked ?? defaultChecked));
        const shouldShowIcon = isMixed || isChecked;
        const iconValue = isMixed ? "remove" : "check";
        const iconMotion = prefersReducedMotion
            ? {
                  initial: { opacity: 1, scale: 1 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 1 },
              }
            : {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.8 },
              };
        const iconTransition = prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.16, ease: [0.16, 1, 0.3, 1] as const };
        const boxHoverMotion =
            prefersReducedMotion || disabled ? undefined : { scale: 1.03 };
        const boxTapMotion =
            prefersReducedMotion || disabled ? undefined : { scale: 0.98 };
        const boxTransition = prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.2 };

        useEffect(() => {
            if (!inputRef.current) return;
            inputRef.current.indeterminate = isMixed;
        }, [isMixed]);

        useEffect(() => {
            if (typeof checked !== "boolean") return;
            setIsChecked(checked);
        }, [checked]);

        const handleChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                onChange?.(event);
                if (typeof checked === "boolean") return;
                setIsChecked(event.target.checked);
            },
            [checked, onChange]
        );

        return (
            <div className={cn("flex w-full flex-col gap-2", className)}>
                <label
                    htmlFor={inputId}
                    className={cn(
                        checkboxWrapperVariants({ variant, size: resolvedSize, tone: resolvedTone }),
                        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                        wrapperClassName
                    )}
                >
                    <input
                        ref={composedRef}
                        id={inputId}
                        type="checkbox"
                        className="peer sr-only"
                        aria-describedby={describedBy}
                        aria-invalid={isInvalid}
                        aria-checked={isMixed ? "mixed" : ariaChecked}
                        checked={checked}
                        defaultChecked={defaultChecked}
                        onChange={handleChange}
                        disabled={disabled}
                        {...props}
                    />
                    <motion.span
                        className={cn(
                            checkboxBoxVariants({ variant, size: resolvedSize, tone: resolvedTone }),
                            boxClassName
                        )}
                        data-state={isMixed ? "mixed" : undefined}
                        whileHover={boxHoverMotion}
                        whileTap={boxTapMotion}
                        transition={boxTransition}
                    >
                        <AnimatePresence initial={false}>
                            {shouldShowIcon ? (
                                <motion.span
                                    key={iconValue}
                                    className="material-symbols-rounded !text-(length:--checkbox-icon-size) select-none"
                                    initial={iconMotion.initial}
                                    animate={iconMotion.animate}
                                    exit={iconMotion.exit}
                                    transition={iconTransition}
                                    aria-hidden="true"
                                >
                                    {iconValue}
                                </motion.span>
                            ) : null}
                        </AnimatePresence>
                    </motion.span>
                    {(label || description) ? (
                        <span className="flex flex-col gap-1">
                            {label ? (
                                <span
                                    className={cn(
                                        checkboxLabelVariants({ size: resolvedSize, tone: resolvedTone }),
                                        labelClassName
                                    )}
                                >
                                    {label}
                                </span>
                            ) : null}
                            {description ? (
                                <span
                                    className={cn(
                                        checkboxDescriptionVariants({ size: resolvedSize }),
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
