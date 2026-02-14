"use client";

import {
    Children,
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    useCallback,
    type CSSProperties,
    type MutableRefObject,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../utils/cn";
import Icon, { type IconSize, type IconWeight } from "./Icon";

type MenuPanelAlign = "start" | "center" | "end";
type MenuPanelSide = "top" | "bottom";
type MenuPanelOpenReason = "trigger" | "outside" | "escape" | "item-select";
type MenuPanelIconPosition = "start" | "end";
type MenuPanelTriggerVariant = "primary" | "secondary" | "quiz" | "outline" | "ghost";
type MenuPanelItemVariant = "primary" | "outline" | "ghost";
type MenuPanelContentVariant = "default" | "soft" | "elevated" | "ghost";

type MenuPanelContextValue = {
    open: boolean;
    setOpen: (nextOpen: boolean, reason: MenuPanelOpenReason) => void;
    contentId: string;
    triggerId: string;
    triggerRef: MutableRefObject<HTMLElement | null>;
    contentRef: MutableRefObject<HTMLDivElement | null>;
    containerRef: MutableRefObject<HTMLDivElement | null>;
};

const MenuPanelContext = createContext<MenuPanelContextValue | null>(null);

const triggerVariants = cva(
    "relative inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-[color,background-color,border-color,opacity,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celestialblue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60 data-[state=off]:opacity-80 data-[state=on]:shadow-md data-[state=on]:brightness-105",
    {
        variants: {
            variant: {
                primary:
                    "border-celestialblue-600 bg-celestialblue-500 text-space-10 shadow-sm hover:border-celestialblue-300 hover:bg-celestialblue-500 active:border-celestialblue-700 active:bg-celestialblue-600",
                secondary:
                    "border-space-150 bg-space-10 text-space-700 shadow-sm hover:border-space-100 hover:bg-space-50 active:border-space-200 active:bg-space-100",
                quiz:
                    "border-saffron-300 bg-saffron-50 text-saffron-800 shadow-sm hover:border-saffron-300 hover:bg-saffron-100 active:border-saffron-500 active:bg-saffron-200",
                ghost: "border-transparent bg-transparent text-space-600 hover:bg-space-50 active:bg-space-100",
                outline:
                    "border-space-200 bg-transparent text-space-700 hover:border-space-300 hover:bg-space-50 active:bg-space-100",
            },
        },
        defaultVariants: {
            variant: "secondary",
        },
    }
);

const contentVariants = cva(
    "min-w-[220px] rounded-2xl border p-2 shadow-[0_20px_40px_-24px_rgba(9,16,37,0.45)] will-change-transform",
    {
        variants: {
            variant: {
                default: "border-space-100 bg-white text-space-800",
                soft: "border-space-100 bg-space-25/90 text-space-800 backdrop-blur-sm",
                elevated: "border-space-150 bg-white text-space-800 shadow-[0_24px_48px_-26px_rgba(9,16,37,0.5)]",
                ghost: "border-space-100/70 bg-white/90 text-space-800 backdrop-blur-sm",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const itemVariants = cva(
    "relative flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-[color,background-color,border-color,opacity,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celestialblue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60 data-[state=off]:opacity-80 data-[state=on]:shadow-sm",
    {
        variants: {
            variant: {
                primary:
                    "border-celestialblue-200 bg-celestialblue-50 text-celestialblue-700 hover:border-celestialblue-250 hover:bg-celestialblue-100 active:border-celestialblue-300",
                outline:
                    "border-space-200 bg-transparent text-space-700 hover:border-space-250 hover:bg-space-50 active:bg-space-100",
                ghost:
                    "border-transparent bg-transparent text-space-700 hover:bg-space-50 active:bg-space-100",
            },
        },
        defaultVariants: {
            variant: "outline",
        },
    }
);

function useMenuPanelContext(componentName: string) {
    const context = useContext(MenuPanelContext);
    if (!context) {
        throw new Error(`${componentName} must be used within MenuPanel.Root`);
    }
    return context;
}

type MenuPanelRootProps = {
    children: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, reason: MenuPanelOpenReason) => void;
    className?: string;
};

function MenuPanelRoot({
    children,
    open,
    defaultOpen = false,
    onOpenChange,
    className,
}: MenuPanelRootProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const resolvedOpen = isControlled ? open : internalOpen;
    const contentId = useId();
    const triggerId = useId();
    const triggerRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const setOpen = useCallback((nextOpen: boolean, reason: MenuPanelOpenReason) => {
        if (!isControlled) {
            setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen, reason);
    }, [isControlled, onOpenChange]);

    useEffect(() => {
        if (!resolvedOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (!target) {
                return;
            }
            if (containerRef.current?.contains(target)) {
                return;
            }
            setOpen(false, "outside");
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                return;
            }
            event.preventDefault();
            setOpen(false, "escape");
            triggerRef.current?.focus();
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleEscape as unknown as EventListener);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape as unknown as EventListener);
        };
    }, [resolvedOpen, setOpen]);

    const value = useMemo<MenuPanelContextValue>(
        () => ({
            open: resolvedOpen,
            setOpen,
            contentId,
            triggerId,
            triggerRef,
            contentRef,
            containerRef,
        }),
        [contentId, resolvedOpen, setOpen, triggerId]
    );

    return (
        <MenuPanelContext.Provider value={value}>
            <div ref={containerRef} className={cn("relative inline-flex", className)}>
                {children}
            </div>
        </MenuPanelContext.Provider>
    );
}

type MenuPanelTriggerProps = {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
    disabled?: boolean;
    icon?: string;
    iconSize?: IconSize;
    iconPosition?: MenuPanelIconPosition;
    iconWeight?: IconWeight;
    iconFill?: boolean;
} & VariantProps<typeof triggerVariants>;

function MenuPanelTrigger({
    children,
    className,
    asChild = false,
    disabled = false,
    variant = "secondary",
    icon,
    iconSize = "sm",
    iconPosition = "start",
    iconWeight,
    iconFill,
}: MenuPanelTriggerProps) {
    const context = useMenuPanelContext("MenuPanel.Trigger");

    const handleToggle = () => {
        if (disabled) {
            return;
        }
        context.setOpen(!context.open, "trigger");
    };

    const triggerProps = {
        id: context.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": context.open ? "on" : "off",
        "data-variant": variant,
        onClick: handleToggle,
    };

    if (asChild) {
        const child = Children.only(children) as ReactElement<any>;
        if (!isValidElement(child)) {
            return null;
        }
        const childProps = (child.props ?? {}) as any;
        const childRef = (child as any).ref as
            | ((instance: HTMLElement | null) => void)
            | { current?: HTMLElement | null }
            | null
            | undefined;

        return cloneElement<any>(child, {
            ...triggerProps,
            ...childProps,
            className: cn(childProps.className, className),
            ref: (node: HTMLElement | null) => {
                context.triggerRef.current = node;
                if (typeof childRef === "function") {
                    childRef(node);
                } else if (childRef && typeof childRef === "object") {
                    childRef.current = node;
                }
            },
            onClick: (event: MouseEvent<HTMLElement>) => {
                childProps.onClick?.(event);
                if (!event.defaultPrevented) {
                    handleToggle();
                }
            },
        });
    }

    return (
        <button
            id={context.triggerId}
            ref={(node) => {
                context.triggerRef.current = node;
            }}
            type="button"
            aria-haspopup="menu"
            aria-expanded={context.open}
            aria-controls={context.contentId}
            data-state={context.open ? "on" : "off"}
            data-variant={variant}
            disabled={disabled}
            className={cn(triggerVariants({ variant }), className)}
            onClick={handleToggle}
        >
            {icon && iconPosition === "start" ? (
                <Icon name={icon} size={iconSize} weight={iconWeight} isFill={iconFill} className="text-current" />
            ) : null}
            {children ? <span>{children}</span> : null}
            {icon && iconPosition === "end" ? (
                <Icon name={icon} size={iconSize} weight={iconWeight} isFill={iconFill} className="text-current" />
            ) : null}
        </button>
    );
}

type MenuPanelContentProps = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    align?: MenuPanelAlign;
    side?: MenuPanelSide;
    sideOffset?: number;
} & VariantProps<typeof contentVariants>;

const MenuPanelContent = forwardRef<HTMLDivElement, MenuPanelContentProps>(function MenuPanelContent(
    { children, className, style, align = "end", side = "bottom", sideOffset = 8, variant = "default" },
    forwardedRef
) {
    const context = useMenuPanelContext("MenuPanel.Content");
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (!context.open) {
            return;
        }

        const firstItem = context.contentRef.current?.querySelector<HTMLElement>(
            "[data-menu-panel-item]:not([data-disabled='true'])"
        );
        firstItem?.focus();
    }, [context.open]);

    if (!context.open) {
        return null;
    }

    const positionStyle: CSSProperties = {};
    if (side === "bottom") {
        positionStyle.top = `calc(100% + ${sideOffset}px)`;
    } else {
        positionStyle.bottom = `calc(100% + ${sideOffset}px)`;
    }

    if (align === "start") {
        positionStyle.left = 0;
    } else if (align === "end") {
        positionStyle.right = 0;
    } else {
        positionStyle.left = "50%";
        positionStyle.transform = "translateX(-50%)";
    }

    return (
        <div className="absolute z-50" style={positionStyle}>
            <motion.div
                id={context.contentId}
                ref={(node) => {
                    context.contentRef.current = node;
                    if (typeof forwardedRef === "function") {
                        forwardedRef(node);
                    } else if (forwardedRef) {
                        forwardedRef.current = node;
                    }
                }}
                role="menu"
                aria-labelledby={context.triggerId}
                className={cn(contentVariants({ variant }), className)}
                style={style}
                initial={
                    shouldReduceMotion
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: side === "bottom" ? -8 : 8, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: shouldReduceMotion ? 0 : 0.16,
                    ease: [0.33, 1, 0.68, 1],
                }}
                onKeyDown={(event) => {
                    const items = Array.from(
                        context.contentRef.current?.querySelectorAll<HTMLElement>(
                            "[data-menu-panel-item]:not([data-disabled='true'])"
                        ) ?? []
                    );
                    if (!items.length) {
                        return;
                    }

                    const currentIndex = items.findIndex((item) => item === document.activeElement);
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        const next = items[(currentIndex + 1 + items.length) % items.length];
                        next?.focus();
                    } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        const previous = items[(currentIndex - 1 + items.length) % items.length];
                        previous?.focus();
                    } else if (event.key === "Home") {
                        event.preventDefault();
                        items[0]?.focus();
                    } else if (event.key === "End") {
                        event.preventDefault();
                        items[items.length - 1]?.focus();
                    }
                }}
            >
                {children}
            </motion.div>
        </div>
    );
});

type MenuPanelItemProps = {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    asChild?: boolean;
    closeOnSelect?: boolean;
    onSelect?: (event: MouseEvent<HTMLElement>) => void;
    icon?: string;
    iconPosition?: MenuPanelIconPosition;
    iconWeight?: IconWeight;
    iconFill?: boolean;
    isToggle?: boolean;
    toggled?: boolean;
    defaultToggled?: boolean;
    onToggleChange?: (isOn: boolean) => void;
} & VariantProps<typeof itemVariants>;

function MenuPanelItem({
    children,
    className,
    disabled = false,
    asChild = false,
    closeOnSelect = true,
    onSelect,
    variant = "outline",
    icon,
    iconPosition = "start",
    iconWeight,
    iconFill,
    isToggle = false,
    toggled,
    defaultToggled,
    onToggleChange,
}: MenuPanelItemProps) {
    const context = useMenuPanelContext("MenuPanel.Item");
    const [internalToggled, setInternalToggled] = useState(() => Boolean(toggled ?? defaultToggled));
    const isToggleActive = isToggle
        ? (typeof toggled === "boolean" ? toggled : internalToggled)
        : false;

    useEffect(() => {
        if (!isToggle || typeof toggled !== "boolean") {
            return;
        }
        setInternalToggled(toggled);
    }, [isToggle, toggled]);

    const handleSelect = (event: MouseEvent<HTMLElement>) => {
        if (disabled) {
            event.preventDefault();
            return;
        }
        onSelect?.(event);
        if (!event.defaultPrevented && isToggle) {
            const nextValue = !isToggleActive;
            if (typeof toggled !== "boolean") {
                setInternalToggled(nextValue);
            }
            onToggleChange?.(nextValue);
        }
        if (!event.defaultPrevented && closeOnSelect) {
            context.setOpen(false, "item-select");
        }
    };

    const menuItemRole = isToggle ? "menuitemcheckbox" : "menuitem";

    if (asChild) {
        const child = Children.only(children) as ReactElement<any>;
        if (!isValidElement(child)) {
            return null;
        }
        const childProps = (child.props ?? {}) as any;

        return cloneElement<any>(child, {
            ...childProps,
            role: menuItemRole,
            "aria-checked": isToggle ? isToggleActive : undefined,
            tabIndex: disabled ? -1 : 0,
            "data-menu-panel-item": "",
            "data-disabled": disabled ? "true" : "false",
            "data-state": isToggle ? (isToggleActive ? "on" : "off") : undefined,
            "data-variant": variant,
            className: cn(childProps.className, className),
            onClick: (event: MouseEvent<HTMLElement>) => {
                childProps.onClick?.(event);
                if (!event.defaultPrevented) {
                    handleSelect(event);
                }
            },
        });
    }

    return (
        <button
            type="button"
            role={menuItemRole}
            aria-checked={isToggle ? isToggleActive : undefined}
            tabIndex={disabled ? -1 : 0}
            data-menu-panel-item=""
            data-disabled={disabled ? "true" : "false"}
            data-state={isToggle ? (isToggleActive ? "on" : "off") : undefined}
            data-variant={variant}
            disabled={disabled}
            className={cn(
                itemVariants({ variant }),
                isToggle
                    ? "data-[state=on]:border-emerald-250 data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-600"
                    : null,
                className
            )}
            onClick={handleSelect}
        >
            {icon && iconPosition === "start" ? (
                <Icon name={icon} size="sm" weight={iconWeight} isFill={iconFill} className="shrink-0 text-current" />
            ) : null}
            {children ? <span className="min-w-0 flex-1">{children}</span> : null}
            {isToggle ? (
                <span
                    className={cn(
                        "ml-auto rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-[0.16em]",
                        isToggleActive
                            ? "border-emerald-250 bg-emerald-100 text-emerald-600"
                            : "border-space-200 bg-space-50 text-space-400"
                    )}
                >
                    {isToggleActive ? "ON" : "OFF"}
                </span>
            ) : null}
            {icon && iconPosition === "end" ? (
                <Icon name={icon} size="sm" weight={iconWeight} isFill={iconFill} className="shrink-0 text-current" />
            ) : null}
        </button>
    );
}

function MenuPanelSeparator({ className }: { className?: string }) {
    return <div role="separator" className={className} />;
}

function MenuPanelLabel({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}

const MenuPanel = Object.assign(MenuPanelRoot, {
    Root: MenuPanelRoot,
    Trigger: MenuPanelTrigger,
    Content: MenuPanelContent,
    Item: MenuPanelItem,
    Separator: MenuPanelSeparator,
    Label: MenuPanelLabel,
});

export type {
    MenuPanelAlign,
    MenuPanelContentProps,
    MenuPanelContentVariant,
    MenuPanelIconPosition,
    MenuPanelItemProps,
    MenuPanelItemVariant,
    MenuPanelOpenReason,
    MenuPanelRootProps,
    MenuPanelSide,
    MenuPanelTriggerVariant,
    MenuPanelTriggerProps,
};

export default MenuPanel;
