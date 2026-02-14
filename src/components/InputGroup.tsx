import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type FieldsetHTMLAttributes, type ReactNode, useId } from "react";
import { cn } from "../utils/cn";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const inputGroupVariants = cva(
    "relative w-full rounded-2xl border shadow-sm transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white",
    {
        variants: {
            variant: {
                default: "border-space-100 bg-space-10/80",
                subtle: "border-space-50 bg-space-50/80",
                outline: "border-space-150 bg-transparent",
                ghost: "border-transparent bg-transparent shadow-none",
            },
            size: {
                sm: "p-3",
                md: "p-4",
                lg: "p-5",
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
            { variant: "subtle", tone: "info", className: "border-celestialblue-100" },
            { variant: "subtle", tone: "success", className: "border-emerald-100" },
            { variant: "subtle", tone: "warning", className: "border-saffron-100" },
            { variant: "subtle", tone: "danger", className: "border-persianred-100" },
            { variant: "outline", tone: "info", className: "border-celestialblue-200" },
            { variant: "outline", tone: "success", className: "border-emerald-200" },
            { variant: "outline", tone: "warning", className: "border-saffron-200" },
            { variant: "outline", tone: "danger", className: "border-persianred-200" },
        ],
        defaultVariants: {
            variant: "default",
            size: "md",
            tone: "default",
        },
    }
);

const headerLabelVariants = cva(
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

const headerDescriptionVariants = cva("text-xs text-space-500", {
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

const messageVariants = cva("mt-3 text-xs", {
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

const contentVariants = cva("", {
    variants: {
        layout: {
            vertical: "flex flex-col gap-3",
            horizontal: "flex flex-wrap items-start gap-3",
            grid: "grid gap-3",
        },
    },
    defaultVariants: {
        layout: "vertical",
    },
});

export type InputGroupVariants = VariantProps<typeof inputGroupVariants> &
    VariantProps<typeof contentVariants>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export interface InputGroupProps
    extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "className">,
        InputGroupVariants {
    label?: string;
    description?: string;
    helperText?: string;
    errorText?: string;
    headerSlot?: ReactNode;
    columns?: number;
    className?: string;
    headerClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    contentClassName?: string;
    messageClassName?: string;
}

const InputGroup = forwardRef<HTMLFieldSetElement, InputGroupProps>(
    (
        {
            label,
            description,
            helperText,
            errorText,
            headerSlot,
            variant = "default",
            size = "md",
            tone,
            layout = "vertical",
            columns,
            className,
            headerClassName,
            labelClassName,
            descriptionClassName,
            contentClassName,
            messageClassName,
            disabled,
            id,
            "aria-describedby": ariaDescribedBy,
            "aria-invalid": ariaInvalid,
            children,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const groupId = id ?? generatedId;
        const resolvedTone = errorText ? "danger" : tone ?? "default";
        const message = errorText ?? helperText;
        const labelId = label ? `${groupId}-label` : undefined;
        const descriptionId = description ? `${groupId}-description` : undefined;
        const messageId = message ? `${groupId}-message` : undefined;
        const describedBy = [ariaDescribedBy, descriptionId, messageId]
            .filter(Boolean)
            .join(" ") || undefined;
        const isInvalid = ariaInvalid ?? Boolean(errorText);

        return (
            <fieldset
                ref={ref}
                id={groupId}
                disabled={disabled}
                aria-invalid={isInvalid}
                aria-labelledby={labelId}
                aria-describedby={describedBy}
                className={cn(
                    inputGroupVariants({ variant, size, tone: resolvedTone }),
                    disabled ? "opacity-60" : null,
                    className
                )}
                {...props}
            >
                {(label || headerSlot || description) ? (
                    <div className={cn("flex items-start justify-between gap-3", headerClassName)}>
                        <div className="space-y-1">
                            {label ? (
                                <p
                                    id={labelId}
                                    className={cn(headerLabelVariants({ tone: resolvedTone }), labelClassName)}
                                >
                                    {label}
                                </p>
                            ) : null}
                            {description ? (
                                <p
                                    id={descriptionId}
                                    className={cn(headerDescriptionVariants({ size }), descriptionClassName)}
                                >
                                    {description}
                                </p>
                            ) : null}
                        </div>
                        {headerSlot ? <div>{headerSlot}</div> : null}
                    </div>
                ) : null}
                <div
                    className={cn(
                        contentVariants({ layout }),
                        (label || description) ? "mt-4" : null,
                        contentClassName
                    )}
                    style={
                        layout === "grid" && columns
                            ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
                            : undefined
                    }
                >
                    {children}
                </div>
                {message ? (
                    <p id={messageId} className={cn(messageVariants({ tone: resolvedTone }), messageClassName)}>
                        {message}
                    </p>
                ) : null}
            </fieldset>
        );
    }
);

InputGroup.displayName = "InputGroup";

export default InputGroup;
