import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {cva, type VariantProps} from "class-variance-authority";
import Icon, { type IconWeight } from "./Icon";

type IconName = "info";

const infoButtonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2",
        "rounded-xl border",
        "px-4 py-2 min-h-[42px]",
        "select-none cursor-pointer transition-colors duration-200",
    ].join(" "),
    {
        variants: {
            variant: {
                default: "border-space-50 text-space-700 bg-space-10",
                info: "border-celestialblue-300 text-celestialblue-700 bg-space-10",
                level: "border-persianred-300 text-persianred-600 bg-persianred-10",
            },
            hasIcon: {
                true: "",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            hasIcon: false,
        },
    }
);

type BaseProps = {
    onClick?: () => void;
    isDisabled?: boolean;
    className?: string;
    iconWeight?: IconWeight;
    iconFill?: boolean;
};

type InfoProps = BaseProps &
    VariantProps<typeof infoButtonVariants> & {
    variant: "info";
    label: string;
    icon?: IconName; // only used when hasIcon=true
};

type DefaultProps = BaseProps &
    VariantProps<typeof infoButtonVariants> & {
    variant?: "default";
    label: string;
    icon?: IconName; // only used when hasIcon=true
};

type LevelProps = BaseProps &
    VariantProps<typeof infoButtonVariants> & {
    variant: "level";
    band: number; // e.g. 5.5
    label?: string; // default "IELTS"
    icon?: IconName; // only used when hasIcon=true
};

export type InfoButtonsProps = InfoProps | DefaultProps | LevelProps;

type InfoDialogProps = {
    dialogId: string;
    isLevel: boolean;
    labelText: string;
    levelBand: number | null;
    onClose: () => void;
    prefersReducedMotion: boolean;
};

function InfoDialog({
    dialogId,
    isLevel,
    labelText,
    levelBand,
    onClose,
    prefersReducedMotion,
}: InfoDialogProps) {
    const overlayMotion = prefersReducedMotion
        ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        };
    const overlayTransition = prefersReducedMotion
        ? undefined
        : { duration: 0.2, ease: [0.33, 1, 0.68, 1] as const };
    const dialogMotion = prefersReducedMotion
        ? {
            initial: false,
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0 },
        }
        : {
            initial: { opacity: 0, y: 12, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 8, scale: 0.98 },
        };
    const dialogTransition = prefersReducedMotion
        ? { duration: 0.1 }
        : { type: "spring" as const, stiffness: 260, damping: 24, mass: 0.9 };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.button
                type="button"
                className="absolute inset-0 bg-space-900/40"
                aria-label="Close modal"
                onClick={onClose}
                {...overlayMotion}
                transition={overlayTransition}
            />
            <motion.div
                id={dialogId}
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-sm rounded-2xl border border-space-100 bg-white p-5 shadow-xl"
                {...dialogMotion}
                transition={dialogTransition}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-lg font-semibold text-space-900">
                            {isLevel ? `${labelText} Band` : labelText}
                        </p>
                        <p className="text-sm text-space-500">
                            {isLevel ? "Score details" : "Details"}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-space-100 text-space-500 transition-colors hover:text-space-700 cursor-pointer"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <span className="material-symbols-rounded !text-lg">close</span>
                    </button>
                </div>
                <div className="mt-4 rounded-xl border border-space-100 bg-space-10 px-3 py-2 text-space-700">
                    {isLevel ? (
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs uppercase tracking-wide text-space-500">{labelText}</span>
                            <span className="text-2xl font-semibold text-space-900">
                                {levelBand?.toFixed(1)}
                            </span>
                        </div>
                    ) : (
                        <p className="text-sm">{labelText}</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function clampBand(band: number) {
    const safe = Math.max(0, Math.min(9, band));
    // keep one decimal (IELTS uses .0/.5 most commonly)
    return Number(safe.toFixed(1));
}

export default function InfoButtons(props: InfoButtonsProps) {
    const {
        onClick,
        isDisabled,
        className,
        iconWeight,
        iconFill = false,
        hasIcon = false,
    } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const prefersReducedMotion = Boolean(useReducedMotion());
    const dialogId = React.useId();
    const variant = props.variant ?? "default";
    const isLevel = props.variant === "level";

    const iconName = hasIcon ? (props.icon ?? "info") : null;
    const labelText = isLevel ? (props.label ?? "IELTS") : props.label;
    const levelBand = isLevel ? clampBand(props.band) : null;

    const content =
        isLevel ? (
            <>
                <span className={"hidden sm:inline"}>{labelText}</span>
                <span className="font-semibold">{levelBand?.toFixed(1)}</span>
            </>
        ) : (
            <span className={"hidden sm:inline"}>{labelText}</span>
        );

    const handleOpen = () => {
        if (isDisabled) return;
        setIsOpen(true);
        onClick?.();
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    React.useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <>
            <motion.button
                type="button"
                onClick={handleOpen}
                disabled={isDisabled}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls={dialogId}
                className={infoButtonVariants({
                    variant,
                    hasIcon,
                    className,
                })}
                whileHover={
                    prefersReducedMotion
                        ? undefined
                        : { y: -1, scale: 1.02 }
                }
                whileTap={
                    prefersReducedMotion
                        ? undefined
                        : { scale: 0.98 }
                }
                transition={
                    prefersReducedMotion
                        ? undefined
                        : { type: "spring", stiffness: 320, damping: 24 }
                }
                style={{ willChange: "transform" }}
            >
                {hasIcon && iconName ? (
                    <Icon
                        name={iconName}
                        size="sm"
                        weight={iconWeight}
                        isFill={iconFill}
                    />
                ) : null}
                {content}
            </motion.button>
            <AnimatePresence>
                {isOpen ? (
                    <InfoDialog
                        dialogId={dialogId}
                        isLevel={isLevel}
                        labelText={labelText}
                        levelBand={levelBand}
                        onClose={handleClose}
                        prefersReducedMotion={prefersReducedMotion}
                    />
                ) : null}
            </AnimatePresence>
        </>
    );
}
