import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../utils/cn";

type NotificationPillProps = {
    label: ReactNode;
    subtitle?: ReactNode;
    ariaLabel?: string;
    title?: string;
    onDismissStart?: () => void;
    onDismiss?: () => void;
    layoutId?: string;
    className?: string;
    labelClassName?: string;
    subtitleClassName?: string;
};

export default function NotificationPill({
    label,
    subtitle,
    ariaLabel,
    title,
    onDismissStart,
    onDismiss,
    layoutId,
    className,
    labelClassName,
    subtitleClassName,
}: NotificationPillProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosingContent, setIsClosingContent] = useState(false);
    const [isPanelClosing, setIsPanelClosing] = useState(false);
    const prefersReducedMotion = useReducedMotion() ?? false;
    const contentExitDuration = 0.12;
    const closeDuration = 0.14;
    const fadeDuration = 0.18;
    const animationState = isPanelClosing ? "closing" : isOpen ? "open" : "closed";
    const handleClick = () => {
        if (isOpen) {
            if (!onDismiss) {
                setIsOpen(false);
                return;
            }
            if (!prefersReducedMotion) {
                onDismissStart?.();
                setIsClosingContent(true);
                return;
            }
            onDismissStart?.();
            onDismiss();
            return;
        }
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isClosingContent) return;
        const timeout = setTimeout(() => {
            setIsPanelClosing(true);
        }, contentExitDuration * 1000);
        return () => clearTimeout(timeout);
    }, [contentExitDuration, isClosingContent]);

    useEffect(() => {
        if (!isPanelClosing) return;
        const totalMs = (closeDuration + fadeDuration) * 1000;
        const timeout = setTimeout(() => {
            onDismiss?.();
        }, totalMs);
        return () => clearTimeout(timeout);
    }, [closeDuration, fadeDuration, isPanelClosing, onDismiss]);

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            aria-label={ariaLabel}
            aria-expanded={isOpen && !isPanelClosing}
            title={title}
            layoutId={layoutId}
            className={cn(
                "mx-auto flex w-fit min-w-[230px] max-w-full flex-col items-center justify-center border px-3 text-center text-sm font-semibold shadow-sm",
                isOpen && !isPanelClosing ? "min-h-[64px] py-2" : "h-10",
                className
            )}
            layout
            variants={
                prefersReducedMotion
                    ? undefined
                    : {
                          closed: {
                              scale: 1,
                              borderRadius: 160,
                              opacity: 1,
                              transition: { duration: 0 },
                          },
                          open: {
                              scale: 1.03,
                              borderRadius: 24,
                              opacity: 1,
                              transition: {
                                  type: "spring",
                                  stiffness: 320,
                                  damping: 26,
                                  mass: 0.6,
                              },
                          },
                          closing: {
                              scale: 1,
                              borderRadius: 160,
                              opacity: 0,
                              transition: {
                                  scale: {
                                      duration: closeDuration,
                                      ease: "easeOut",
                                  },
                                  borderRadius: {
                                      duration: closeDuration,
                                      ease: "easeOut",
                                  },
                                  opacity: {
                                      duration: fadeDuration,
                                      delay: closeDuration,
                                      ease: "easeOut",
                                  },
                              },
                          },
                      }
            }
            animate={prefersReducedMotion ? undefined : animationState}
        >
            <motion.span className="flex flex-col items-center justify-center">
                <AnimatePresence initial={false}>
                    {!isClosingContent ? (
                        <motion.span
                            className={cn("whitespace-nowrap", labelClassName)}
                            initial={false}
                            exit={
                                prefersReducedMotion ? undefined : { opacity: 0, y: -4 }
                            }
                            transition={
                                prefersReducedMotion
                                    ? undefined
                                    : { duration: contentExitDuration, ease: "easeOut" }
                            }
                        >
                            {label}
                        </motion.span>
                    ) : null}
                </AnimatePresence>
                <AnimatePresence initial={false}>
                    {isOpen && subtitle && !isClosingContent ? (
                        <motion.span
                            className={cn("mt-1 text-xs font-medium text-space-500", subtitleClassName)}
                            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -2 }}
                            transition={
                                prefersReducedMotion
                                    ? undefined
                                    : { duration: 0.18, delay: 0.08, ease: "easeOut" }
                            }
                        >
                            {subtitle}
                        </motion.span>
                    ) : null}
                </AnimatePresence>
            </motion.span>
        </motion.button>
    );
}
