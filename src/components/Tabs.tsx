import { cva } from "class-variance-authority";
import { type HTMLAttributes, type ReactNode, useEffect, useId, useMemo, useState } from "react";
import { cn } from "../utils/cn";

const tabTriggerVariants = cva(
    "relative inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celestialblue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60 select-none",
    {
        variants: {
            variant: {
                primary: "",
                secondary: "",
                quiz: "",
                ghost: "",
                outline: "",
            },
            size: {
                xs: "px-2.5 py-1 text-xs",
                sm: "px-3 py-1.5 text-sm",
                md: "px-4 py-2 text-base",
                lg: "px-5 py-3 text-lg",
                xl: "px-6 py-3.5 text-xl",
            },
            state: {
                active: "",
                inactive: "",
            },
            orientation: {
                horizontal: "",
                vertical: "w-full justify-start text-left",
            },
        },
        compoundVariants: [
            {
                variant: "primary",
                state: "active",
                className:
                    "border-celestialblue-600 bg-celestialblue-500 text-space-10 shadow-sm",
            },
            {
                variant: "primary",
                state: "inactive",
                className:
                    "border-transparent text-space-500 hover:border-celestialblue-200 hover:bg-celestialblue-50 hover:text-celestialblue-700",
            },
            {
                variant: "secondary",
                state: "active",
                className:
                    "border-space-150 bg-space-10 text-space-700 shadow-sm",
            },
            {
                variant: "secondary",
                state: "inactive",
                className:
                    "border-transparent text-space-500 hover:border-space-100/70 hover:bg-space-100/70 hover:text-space-700",
            },
            {
                variant: "quiz",
                state: "active",
                className:
                    "border-saffron-300 bg-saffron-50 text-saffron-800 shadow-sm",
            },
            {
                variant: "quiz",
                state: "inactive",
                className:
                    "border-transparent text-space-500 hover:border-saffron-200 hover:bg-saffron-50/70 hover:text-saffron-700",
            },
            {
                variant: "ghost",
                state: "active",
                className: "border-transparent bg-space-10 text-space-700",
            },
            {
                variant: "ghost",
                state: "inactive",
                className:
                    "border-transparent text-space-500 hover:bg-space-100/70 hover:text-space-700",
            },
            {
                variant: "outline",
                state: "active",
                className:
                    "border-space-200 bg-white text-space-700 shadow-sm",
            },
            {
                variant: "outline",
                state: "inactive",
                className:
                    "border-transparent text-space-500 hover:border-space-100/70 hover:bg-space-50/80 hover:text-space-700",
            },
        ],
        defaultVariants: {
            variant: "primary",
            size: "md",
            state: "inactive",
            orientation: "horizontal",
        },
    }
);

const tabPanelVariants = cva(
    "rounded-2xl bg-space-10/80 text-space-600",
    {
        variants: {
            size: {
                xs: "p-3 text-xs",
                sm: "p-3 text-sm",
                md: "p-4 text-sm",
                lg: "p-5 text-base",
                xl: "p-6 text-lg",
            },
            orientation: {
                horizontal: "w-full",
                vertical: "w-full md:flex-1",
            },
        },
        defaultVariants: {
            size: "md",
            orientation: "horizontal",
        },
    }
);

export type TabsItem = {
    id?: string;
    value: string;
    label: ReactNode;
    content?: ReactNode;
    disabled?: boolean;
    tabClassName?: string;
    panelClassName?: string;
};

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
    items?: TabsItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    variant?: "primary" | "secondary" | "quiz" | "ghost" | "outline";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    orientation?: "horizontal" | "vertical";
    listClassName?: string;
    tabClassName?: string;
    panelClassName?: string;
    contentClassName?: string;
    ariaLabel?: string;
    disabled?: boolean;
};

const Tabs = ({
    items = [],
    value,
    defaultValue,
    onValueChange,
    variant = "primary",
    size = "md",
    orientation = "horizontal",
    listClassName,
    tabClassName,
    panelClassName,
    contentClassName,
    ariaLabel,
    disabled,
    className,
    ...props
}: TabsProps) => {
    const baseId = useId();
    const fallbackValue = useMemo(() => {
        if (defaultValue) return defaultValue;
        const firstEnabled = items.find((item) => !item.disabled);
        return firstEnabled?.value ?? items[0]?.value;
    }, [defaultValue, items]);
    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
        fallbackValue
    );
    const currentValue = value ?? uncontrolledValue;

    useEffect(() => {
        if (value !== undefined) {
            return;
        }
        if (currentValue && items.some((item) => item.value === currentValue)) {
            return;
        }
        if (fallbackValue && fallbackValue !== uncontrolledValue) {
            setUncontrolledValue(fallbackValue);
        }
    }, [currentValue, fallbackValue, items, uncontrolledValue, value]);

    const handleSelect = (nextValue: string) => {
        if (disabled || nextValue === currentValue) {
            return;
        }
        const nextItem = items.find((item) => item.value === nextValue);
        if (nextItem?.disabled) {
            return;
        }
        if (value === undefined) {
            setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
    };

    const isVertical = orientation === "vertical";
    const hasPanels = items.some((item) => item.content !== undefined);

    return (
        <div
            className={cn(
                "flex w-fit max-w-[300px] sm:max-w-[600px] md:max-w-[800px] md:w-full gap-4",
                isVertical ? "flex-col md:flex-row" : "flex-col",
                className
            )}
            {...props}
        >
            <div
                role="tablist"
                aria-label={ariaLabel}
                aria-orientation={orientation}
                className={cn(
                    "inline-flex w-full items-stretch gap-1 rounded-2xl border border-space-100/70 bg-space-50/80 p-1 shadow-sm overflow-hidden",
                    isVertical ? "flex-col md:w-64" : "flex-row",
                    listClassName
                )}
            >
                {items.map((item, index) => {
                    const isActive = item.value === currentValue;
                    const tabId = item.id ?? `${baseId}-tab-${index}`;
                    const panelId = `${tabId}-panel`;
                    return (
                        <button
                            key={tabId}
                            id={tabId}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={panelId}
                            tabIndex={isActive ? 0 : -1}
                            disabled={disabled || item.disabled}
                            onClick={() => handleSelect(item.value)}
                            className={cn(
                                tabTriggerVariants({
                                    variant,
                                    size,
                                    state: isActive ? "active" : "inactive",
                                    orientation,
                                }),
                                tabClassName,
                                item.tabClassName
                            )}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {hasPanels ? (
                <div className={cn("w-full", isVertical ? "md:flex-1" : null, contentClassName)}>
                    {items.map((item, index) => {
                        const isActive = item.value === currentValue;
                        const tabId = item.id ?? `${baseId}-tab-${index}`;
                        const panelId = `${tabId}-panel`;
                        return (
                            <div
                                key={panelId}
                                role="tabpanel"
                                id={panelId}
                                aria-labelledby={tabId}
                                hidden={!isActive}
                                className={cn(
                                    tabPanelVariants({ size, orientation }),
                                    panelClassName,
                                    item.panelClassName
                                )}
                            >
                                {item.content}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default Tabs;
