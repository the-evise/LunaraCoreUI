import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type FieldsetHTMLAttributes, type ReactNode, useId, useState } from "react";
import { cn } from "../utils/cn";
import Radio, { type RadioVariants } from "./Radio";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const radioGroupVariants = cva(
    "relative w-full rounded-2xl border border-space-100 bg-space-10/80 shadow-sm transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white",
    {
        variants: {
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
            size: {
                sm: "p-3",
                md: "p-4",
                lg: "p-5",
            },
            variant: {
                default: "border-space-100 bg-space-10/80",
                subtle: "border-space-50 bg-space-50/80",
                outline: "border-space-150 bg-transparent",
                ghost: "border-transparent bg-transparent shadow-none p-0",
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
            tone: "default",
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

const descriptionVariants = cva("text-xs text-space-500", {
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

const layoutVariants = cva("", {
    variants: {
        layout: {
            vertical: "flex flex-col gap-3",
            horizontal: "flex flex-wrap gap-3",
            grid: "grid gap-3",
        },
    },
    defaultVariants: {
        layout: "vertical",
    },
});

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants> &
    VariantProps<typeof layoutVariants>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export type RadioGroupOption = {
    id?: string;
    value: string;
    label: string;
    description?: string;
    helperText?: string;
    disabled?: boolean;
    tone?: RadioVariants["tone"];
    variant?: RadioVariants["variant"];
    size?: RadioVariants["size"];
};

type BaseRadioGroupProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> &
    RadioGroupVariants & {
        label?: string;
        description?: string;
        helperText?: string;
        errorText?: string;
        headerSlot?: ReactNode;
        options?: RadioGroupOption[];
        name?: string;
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        itemVariant?: RadioVariants["variant"];
        itemSize?: RadioVariants["size"];
        itemTone?: RadioVariants["tone"];
        layout?: RadioGroupVariants["layout"];
        columns?: number;
        className?: string;
        headerClassName?: string;
        labelClassName?: string;
        descriptionClassName?: string;
        contentClassName?: string;
        messageClassName?: string;
        itemClassName?: string;
        itemLabelClassName?: string;
        itemDescriptionClassName?: string;
    };

const RadioGroup = forwardRef<HTMLFieldSetElement, BaseRadioGroupProps>(
    (
        {
            label,
            description,
            helperText,
            errorText,
            headerSlot,
            options,
            name,
            value,
            defaultValue,
            onValueChange,
            variant = "default",
            size = "md",
            tone,
            layout = "vertical",
            columns,
            itemVariant = "default",
            itemSize,
            itemTone,
            className,
            headerClassName,
            labelClassName,
            descriptionClassName,
            contentClassName,
            messageClassName,
            itemClassName,
            itemLabelClassName,
            itemDescriptionClassName,
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
        const groupName = name ?? `${groupId}-group`;
        const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
        const currentValue = value ?? uncontrolledValue;
        const resolvedTone = errorText ? "danger" : tone ?? "default";
        const message = errorText ?? helperText;
        const labelId = label ? `${groupId}-label` : undefined;
        const descriptionId = description ? `${groupId}-description` : undefined;
        const messageId = message ? `${groupId}-message` : undefined;
        const describedBy = [ariaDescribedBy, descriptionId, messageId]
            .filter(Boolean)
            .join(" ") || undefined;
        const isInvalid = ariaInvalid ?? Boolean(errorText);
        const resolvedItemTone = itemTone ?? resolvedTone;
        const resolvedItemSize = itemSize ?? size;

        const handleChange = (nextValue: string) => {
            if (value === undefined) {
                setUncontrolledValue(nextValue);
            }
            onValueChange?.(nextValue);
        };

        const renderedOptions = options && options.length > 0 ? options.map((option, index) => {
            const optionId = option.id ?? `${groupId}-option-${index}`;
            const optionTone = option.tone ?? resolvedItemTone;
            const optionSize = option.size ?? resolvedItemSize;
            const optionVariant = option.variant ?? itemVariant;
            const isChecked = currentValue === option.value;
            return (
                <Radio
                    key={optionId}
                    id={optionId}
                    name={groupName}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    helperText={option.helperText}
                    variant={optionVariant}
                    size={optionSize}
                    tone={optionTone}
                    checked={isChecked}
                    onChange={() => handleChange(option.value)}
                    disabled={disabled || option.disabled}
                    aria-invalid={isInvalid}
                    className={itemClassName}
                    labelClassName={itemLabelClassName}
                    descriptionClassName={itemDescriptionClassName}
                />
            );
        }) : null;

        return (
            <fieldset
                ref={ref}
                id={groupId}
                disabled={disabled}
                role="radiogroup"
                aria-invalid={isInvalid}
                aria-labelledby={labelId}
                aria-describedby={describedBy}
                className={cn(
                    radioGroupVariants({ variant, size, tone: resolvedTone }),
                    disabled ? "opacity-60" : null,
                    className
                )}
                {...props}
            >
                {(label || description || headerSlot) ? (
                    <div className={cn("flex items-start justify-between gap-3", headerClassName)}>
                        <div className="space-y-1">
                            {label ? (
                                <p id={labelId} className={cn(labelVariants({ tone: resolvedTone }), labelClassName)}>
                                    {label}
                                </p>
                            ) : null}
                            {description ? (
                                <p
                                    id={descriptionId}
                                    className={cn(descriptionVariants({ size }), descriptionClassName)}
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
                        layoutVariants({ layout }),
                        (label || description) ? "mt-4" : null,
                        contentClassName
                    )}
                    style={
                        layout === "grid" && columns
                            ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
                            : undefined
                    }
                >
                    {renderedOptions ?? children}
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

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
