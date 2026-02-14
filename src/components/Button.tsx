import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import mergeRefs from "../utils/mergeRefs";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import Icon, { type IconWeight } from "./Icon";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const buttonVariants = cva(
    // Structural essentials only
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border font-semibold transition-[color,background-color,border-color,opacity,filter,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celestialblue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60 select-none cursor-pointer data-[state=off]:opacity-70 data-[state=off]:saturate-75 data-[state=off]:shadow-none data-[state=on]:shadow-md data-[state=on]:brightness-105",
    {
        variants: {
            variant: {
                primary:
                    "border-celestialblue-600 bg-celestialblue-500 text-space-10 shadow-sm hover:border-celestialblue-300 hover:bg-celestialblue-500 active:border-celestialblue-700 active:bg-celestialblue-600",
                secondary:
                    "border-space-150 bg-space-10 text-space-700 shadow-sm hover:border-space-100 hover:bg-space-50 active:border-space-200 active:bg-space-100",
                quiz: "border-saffron-300 bg-saffron-50 text-saffron-800 shadow-sm hover:border-saffron-300 hover:bg-saffron-100 active:border-saffron-500 active:bg-saffron-200",
                ghost: "border-transparent text-space-600 hover:bg-space-50 active:bg-space-100",
                outline:
                    "border-space-200 bg-transparent text-space-700 hover:border-space-300 hover:bg-space-50 active:bg-space-100",
            },
            size: {
                xs: "h-6 px-2.5 py-1 text-xs [--button-icon-size:var(--button-icon-size-xs)]",
                sm: "h-8 px-3 py-1.5 text-sm [--button-icon-size:var(--button-icon-size-sm)]",
                md: "h-10 px-4 py-2 text-base [--button-icon-size:var(--button-icon-size-md)]",
                lg: "h-[52px] px-5 py-3 text-lg [--button-icon-size:var(--button-icon-size-lg)]",
                xl: "h-[68px] px-6 py-3.5 text-xl [--button-icon-size:var(--button-icon-size-xl)]",
            },
            hasIcon: {
                true: "gap-2",
                false: "",
            },
            iconOnly: {
                true: "p-0",
                false: "",
            },
        },
        compoundVariants: [            { iconOnly: true, size: "xs", class: "h-7 w-7 text-base" },
            { iconOnly: true, size: "sm", class: "h-9 w-9 text-lg" },
            { iconOnly: true, size: "md", class: "h-10 w-10 text-xl" },
            { iconOnly: true, size: "lg", class: "h-12 w-12 text-2xl" },
            { iconOnly: true, size: "xl", class: "h-14 w-14 text-2xl" },
        ],
        defaultVariants: {
            variant: "primary",
            size: "md",
            hasIcon: false,
            iconOnly: false,
        },
    }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export const BUTTON_SHORTCUT_KEYS = [
    "Enter",
    "Escape",
    "Space",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
] as const;

export type ButtonShortcutKey = typeof BUTTON_SHORTCUT_KEYS[number];

const shortcutKeyMap: Record<ButtonShortcutKey, string | string[]> = {
    Enter: ["Enter", "NumpadEnter"],
    Escape: "Escape",
    Space: [" ", "Space", "Spacebar"],
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    "1": ["1", "Numpad1"],
    "2": ["2", "Numpad2"],
    "3": ["3", "Numpad3"],
    "4": ["4", "Numpad4"],
    "5": ["5", "Numpad5"],
    "6": ["6", "Numpad6"],
    "7": ["7", "Numpad7"],
    "8": ["8", "Numpad8"],
    "9": ["9", "Numpad9"],
    "0": ["0", "Numpad0"],
};

const getShortcutIndicator = (shortcut: ButtonShortcutKey) => {
    if (shortcut === "Enter") {
        return { type: "icon" as const, value: "keyboard_return", label: "Enter" };
    }
    if (shortcut === "Escape") {
        return { type: "text" as const, value: "Esc", label: "Escape" };
    }
    if (shortcut === "Space") {
        return { type: "text" as const, value: "Space", label: "Space" };
    }
    if (shortcut === "ArrowLeft") {
        return { type: "icon" as const, value: "keyboard_arrow_left", label: "Left" };
    }
    if (shortcut === "ArrowRight") {
        return { type: "icon" as const, value: "keyboard_arrow_right", label: "Right" };
    }
    if (shortcut === "ArrowUp") {
        return { type: "icon" as const, value: "keyboard_arrow_up", label: "Up" };
    }
    if (shortcut === "ArrowDown") {
        return { type: "icon" as const, value: "keyboard_arrow_down", label: "Down" };
    }
    return { type: "text" as const, value: shortcut, label: shortcut };
};

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "ref" | "children">,
        ButtonVariants {
    children?: React.ReactNode;
    icon?: string; // left icon (material name)
    iconWeight?: IconWeight;
    iconFill?: boolean;
    isMagnetic?: boolean;
    iconOnly?: boolean;
    static?: boolean;
    isKeyable?: boolean;
    keyShortcut?: ButtonShortcutKey;
    isToggle?: boolean;
    toggled?: boolean;
    defaultToggled?: boolean;
    onToggleChange?: (isOn: boolean) => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            hasIcon,
            iconOnly = false,
            icon,
            iconWeight,
            iconFill,
            className,
            children,
            onPointerDown,
            onPointerEnter,
            onPointerMove,
            onPointerLeave,
            onPointerUp,
            isMagnetic = true,
            static: isStatic = false,
            isKeyable = false,
            keyShortcut,
            isToggle = false,
            toggled,
            defaultToggled,
            onToggleChange,
            disabled,
            onClick,
            "aria-pressed": ariaPressed,
            ...props
        },
        ref
    ) => {
        const resolvedHasIcon = Boolean(hasIcon || iconOnly || icon);
        const resolvedSize = size ?? "md";
        const allowMotion = !isStatic;
        const resolvedShortcut = isKeyable ? (keyShortcut ?? "Enter") : null;
        const resolvedShortcutKeys = useMemo(() => {
            if (!resolvedShortcut) return [];
            return shortcutKeyMap[resolvedShortcut];
        }, [resolvedShortcut]);
        const shortcutIndicator = resolvedShortcut
            ? getShortcutIndicator(resolvedShortcut)
            : null;
        const hasKeyIndicator = Boolean(shortcutIndicator);
        const [isToggled, setIsToggled] = useState(() => Boolean(toggled ?? defaultToggled));
        const isToggleActive = isToggle
            ? (typeof toggled === "boolean" ? toggled : isToggled)
            : false;
        const [clickGlow, setClickGlow] = useState<{
            id: number;
            x: number;
            y: number;
        } | null>(null);
        const [tilt, setTilt] = useState({ x: 0, y: 0 });
        const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
        const [isPressed, setIsPressed] = useState(false);
        const [isHovering, setIsHovering] = useState(false);
        const [isMagnetActive, setIsMagnetActive] = useState(false);
        const buttonRef = useRef<HTMLButtonElement | null>(null);
        const composedRef = useCallback(mergeRefs(ref, buttonRef), [ref]);
        const glowSize = 180;
        const isLarge = resolvedSize === "lg" || resolvedSize === "xl";
        const allowMagnet = isMagnetic && !isLarge;
        const maxTilt = resolvedSize === "xl" ? 0.9 : resolvedSize === "lg" ? 1.2 : 3;
        const magnetRadius = resolvedSize === "xl" ? 110 : resolvedSize === "lg" ? 96 : 70;
        const magnetStrength = resolvedSize === "xl" ? 0.05 : resolvedSize === "lg" ? 0.06 : 0.08;
        const maxMagnetOffset = resolvedSize === "xl" ? 3.5 : resolvedSize === "lg" ? 4.5 : 6;
        const pointerSpeedLimit = 1.2;
        const tiltMultiplier = isPressed
            ? resolvedSize === "xl"
                ? 1.05
                : resolvedSize === "lg"
                    ? 1.1
                    : 1.2
            : 1;
        const glowClassName =
            variant === "quiz"
                ? "bg-saffron-200/60"
                : variant === "primary"
                    ? "bg-celestialblue-200/60"
                    : "bg-space-200/50";
        const pointerRef = useRef({ x: 0, y: 0, t: 0 });
        const keyBadgeClassName = cn(
            "inline-flex items-center justify-center rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ml-auto",
            variant === "primary"
                ? "border-white/40 bg-white/90 text-space-700"
                : variant === "quiz"
                    ? "border-saffron-200 bg-white/80 text-saffron-700"
                    : "border-space-200 bg-white/70 text-space-600"
        );
        const keySpacingClassName = hasKeyIndicator
            ? resolvedHasIcon
                ? "gap-3"
                : "gap-2"
            : undefined;
        const keyPaddingClassName = hasKeyIndicator && !iconOnly
            ? {
                xs: "!p-1 h-fit",
                sm: "!p-1.5 h-fit",
                md: "!p-2 h-fit",
                lg: "!p-3 h-fit",
                xl: "!p-3.5 h-fit",
            }[resolvedSize]
            : undefined;
        const minWidthClassName = !isToggle && !iconOnly
            ? {
                xs: "min-w-[72px]",
                sm: "min-w-[88px]",
                md: "min-w-[104px]",
                lg: "min-w-[120px]",
                xl: "min-w-[136px]",
            }[resolvedSize]
            : undefined;

        useKeyboardShortcut(
            resolvedShortcutKeys,
            () => {
                if (!resolvedShortcut || disabled) return;
                buttonRef.current?.click();
            },
            {
                enabled: Boolean(resolvedShortcut),
                preventDefault: true,
            }
        );

        const handlePointerDown = (
            event: React.PointerEvent<HTMLButtonElement>
        ) => {
            onPointerDown?.(event);
            if (event.defaultPrevented || disabled || !allowMotion) return;
            setIsPressed(true);
            const rect = event.currentTarget.getBoundingClientRect();
            setClickGlow({
                id: Date.now(),
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        };

        useEffect(() => {
            if (!isToggle || typeof toggled !== "boolean") return;
            setIsToggled(toggled);
        }, [isToggle, toggled]);

        useEffect(() => {
            if (!allowMagnet || !allowMotion) {
                setIsMagnetActive(false);
                setMagnetOffset({ x: 0, y: 0 });
            }
        }, [allowMagnet, allowMotion]);

        useEffect(() => {
            if (!isMagnetActive || !allowMagnet || !allowMotion) return;

            const handlePointerMove = (event: PointerEvent) => {
                if (disabled || event.pointerType !== "mouse") return;
                const now = performance.now();
                const last = pointerRef.current;
                if (last.t) {
                    const speed =
                        Math.hypot(event.clientX - last.x, event.clientY - last.y) /
                        Math.max(1, now - last.t);
                    if (speed > pointerSpeedLimit) {
                        pointerRef.current = { x: event.clientX, y: event.clientY, t: now };
                        setMagnetOffset({ x: 0, y: 0 });
                        return;
                    }
                }
                pointerRef.current = { x: event.clientX, y: event.clientY, t: now };

                const node = buttonRef.current;
                if (!node) return;
                const rect = node.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = event.clientX - centerX;
                const dy = event.clientY - centerY;
                const distance = Math.hypot(dx, dy);

                if (distance > magnetRadius) {
                    setMagnetOffset({ x: 0, y: 0 });
                    if (!isHovering) {
                        setIsMagnetActive(false);
                    }
                    return;
                }

                const strength = (1 - distance / magnetRadius) * magnetStrength;
                const offsetX = Math.max(-maxMagnetOffset, Math.min(maxMagnetOffset, dx * strength));
                const offsetY = Math.max(-maxMagnetOffset, Math.min(maxMagnetOffset, dy * strength));
                setMagnetOffset({ x: offsetX, y: offsetY });
            };

            window.addEventListener("pointermove", handlePointerMove);
            return () => window.removeEventListener("pointermove", handlePointerMove);
        }, [isMagnetActive, isHovering, magnetRadius, magnetStrength, disabled, allowMotion, allowMagnet]);

        useEffect(() => {
            if (allowMotion) return;
            setIsPressed(false);
            setIsHovering(false);
            setTilt({ x: 0, y: 0 });
            setMagnetOffset({ x: 0, y: 0 });
        }, [allowMotion]);

        const handlePointerMove = (
            event: React.PointerEvent<HTMLButtonElement>
        ) => {
            onPointerMove?.(event);
            if (disabled || event.pointerType !== "mouse" || !allowMotion) return;
            const now = performance.now();
            const last = pointerRef.current;
            if (last.t) {
                const speed =
                    Math.hypot(event.clientX - last.x, event.clientY - last.y) /
                    Math.max(1, now - last.t);
                if (speed > pointerSpeedLimit) {
                    pointerRef.current = { x: event.clientX, y: event.clientY, t: now };
                    setTilt({ x: 0, y: 0 });
                    return;
                }
            }
            pointerRef.current = { x: event.clientX, y: event.clientY, t: now };
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * maxTilt * 2;
            const rotateX = (0.5 - y) * maxTilt * 2;
            setTilt({
                x: Math.max(-maxTilt, Math.min(maxTilt, rotateX)),
                y: Math.max(-maxTilt, Math.min(maxTilt, rotateY)),
            });
        };

        const handlePointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
            onPointerEnter?.(event);
            if (disabled || event.pointerType !== "mouse") return;
            pointerRef.current = { x: event.clientX, y: event.clientY, t: performance.now() };
            setIsHovering(allowMotion);
            if (allowMagnet && allowMotion) {
                setIsMagnetActive(true);
            } else {
                setIsMagnetActive(false);
            }
        };

        const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
            onPointerLeave?.(event);
            setIsPressed(false);
            setIsHovering(false);
            setTilt({ x: 0, y: 0 });
            setMagnetOffset({ x: 0, y: 0 });
            pointerRef.current = { x: 0, y: 0, t: 0 };
        };

        const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
            onPointerUp?.(event);
            setIsPressed(false);
        };

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);
            if (event.defaultPrevented || !isToggle || disabled) return;
            const nextValue = !isToggleActive;
            if (typeof toggled !== "boolean") {
                setIsToggled(nextValue);
            }
            onToggleChange?.(nextValue);
        };

        return (
            <motion.button
                ref={composedRef}
                data-variant={variant}
                data-state={isToggle ? (isToggleActive ? "on" : "off") : undefined}
                aria-pressed={isToggle ? isToggleActive : ariaPressed}
                disabled={disabled}
                className={cn(
                    buttonVariants({
                        variant,
                        size: resolvedSize,
                        hasIcon: resolvedHasIcon,
                        iconOnly,
                    }),
                    keySpacingClassName,
                    keyPaddingClassName,
                    minWidthClassName,
                    className
                )}
                initial={
                    allowMotion
                        ? { opacity: 0, scale: 0.98, y: 6 }
                        : false
                }
                whileTap={allowMotion ? { scale: 0.98 } : undefined}
                style={{
                    transformPerspective:
                        allowMotion && !isLarge && (isHovering || isPressed)
                            ? 700
                            : undefined,
                }}
                animate={{
                    x: allowMotion ? magnetOffset.x : 0,
                    y: allowMotion ? magnetOffset.y : 0,
                    rotateX: allowMotion ? tilt.x * tiltMultiplier : 0,
                    rotateY: allowMotion ? tilt.y * tiltMultiplier : 0,
                    opacity: 1,
                    scale: 1,
                }}
                transition={
                    allowMotion
                        ? {
                            rotateX: { type: "spring", stiffness: 220, damping: 18 },
                            rotateY: { type: "spring", stiffness: 220, damping: 18 },
                            x: { type: "spring", stiffness: 140, damping: 24, mass: 0.9 },
                            y: { type: "spring", stiffness: 140, damping: 24, mass: 0.9 },
                            opacity: { duration: 0.2, ease: [0.33, 1, 0.68, 1] },
                            scale: { duration: 0.25, ease: [0.33, 1, 0.68, 1] },
                        }
                        : { duration: 0 }
                }
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerUp={handlePointerUp}
                onClick={handleClick}
                {...props}
            >
                {allowMotion && clickGlow ? (
                    <motion.span
                        key={clickGlow.id}
                        className={cn(
                            "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl",
                            glowClassName
                        )}
                        style={{
                            left: clickGlow.x,
                            top: clickGlow.y,
                            width: glowSize,
                            height: glowSize,
                        }}
                        initial={{ opacity: 0.45, scale: 0.35 }}
                        animate={{ opacity: 0, scale: 1.25 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        onAnimationComplete={() => {
                            setClickGlow((current) =>
                                current?.id === clickGlow.id ? null : current
                            );
                        }}
                    />
                ) : null}
                {/* Left icon */}
                {resolvedHasIcon && icon ? (
                    <Icon
                        name={icon}
                        size={resolvedSize}
                        weight={iconWeight}
                        isFill={iconFill}
                        className="relative z-10 text-current"
                    />
                ) : null}

                {/* Label */}
                {!iconOnly ? <span className="relative z-10">{children}</span> : null}

                {shortcutIndicator ? (
                    <div className={keyBadgeClassName} aria-hidden="true">
                        {shortcutIndicator.type === "icon" ? (
                            <span className="material-symbols-rounded !text-base">
                                {shortcutIndicator.value}
                            </span>
                        ) : (
                            <span>{shortcutIndicator.value}</span>
                        )}
                    </div>
                ) : null}
            </motion.button>
        );
    }
);

export default Button;
Button.displayName = "Button";
