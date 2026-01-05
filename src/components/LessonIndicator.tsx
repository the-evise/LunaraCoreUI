import {cva} from "class-variance-authority";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {KeyboardEvent} from "react";
import {LayoutGroup, motion, useAnimationControls, useInView, useReducedMotion} from "motion/react";
import {animate} from "motion";
import {cn} from "../utils/cn";

const tabVariants = cva(
    "relative isolate flex max-w-[180px] max-h-[70px] min-h-[54px] items-center justify-center rounded-2xl border px-7 py-3 text-center text-[15px] font-semibold tracking-tight transition-colors duration-200",
    {
        variants: {
            state: {
                active:
                    "border-celestialblue-400 bg-celestialblue-100 text-celestialblue-600 dark:border-celestialblue-500 dark:bg-celestialblue-800 dark:text-celestialblue-100 cursor-default",
                inactive:
                    "border-space-200 bg-[#C9D4E850] text-space-500 hover:border-celestialblue-400 hover:bg-[#C9D4E880] hover:text-space-700 dark:border-space-500 dark:bg-space-600/80 dark:text-space-200 dark:hover:border-celestialblue-500 dark:hover:text-space-50 dark:hover:bg-space-600 cursor-pointer",
            },
        },
        defaultVariants: {
            state: "inactive",
        },
    },
);

const containerVariants = {
    hidden: {
        opacity: 0,
        y: -16,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            ease: [0.2, 0.8, 0.2, 1],
            when: "beforeChildren",
            staggerChildren: 0.06,
        },
    },
} as const;

const tabMotionVariants = {
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {duration: 0.35, ease: [0.25, 0.8, 0.4, 1]},
    },
} as const;

type LessonIndicatorProps = {
    lessons: string[];
    activeLessonIndex: number;
    onLessonSelect: (lessonIndex: number) => void;
};

type TabProps = {
    label: string;
    index: number;
    isActive: boolean;
    onSelect: (index: number) => void;
    prefersReducedMotion: boolean;
    total: number;
    buttonRef: (node: HTMLButtonElement | null) => void;
};

function LessonTab({label, index, isActive, onSelect, prefersReducedMotion, total, buttonRef}: TabProps) {
    const state = isActive ? "active" : "inactive";

    const handleClick = useCallback(() => {
        if (!isActive) {
            onSelect(index);
        }
    }, [index, isActive, onSelect]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            switch (event.key) {
                case " ":
                case "Enter":
                    event.preventDefault();
                    handleClick();
                    break;
                case "ArrowRight":
                case "ArrowDown": {
                    event.preventDefault();
                    const next = (index + 1) % total;
                    onSelect(next);
                    break;
                }
                case "ArrowLeft":
                case "ArrowUp": {
                    event.preventDefault();
                    const prev = (index - 1 + total) % total;
                    onSelect(prev);
                    break;
                }
                case "Home":
                    event.preventDefault();
                    onSelect(0);
                    break;
                case "End":
                    event.preventDefault();
                    onSelect(total - 1);
                    break;
                default:
                    break;
            }
        },
        [handleClick, index, onSelect, total],
    );

    return (
        <motion.button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-pressed={isActive}
            tabIndex={isActive ? 0 : -1}
            className={cn(tabVariants({state}))}
            ref={buttonRef}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            variants={prefersReducedMotion ? undefined : tabMotionVariants}
            whileHover={
                prefersReducedMotion || isActive
                    ? {
                        scale: 1,
                        y: 0,
                        transition: {type: "spring", stiffness: 280, damping: 24},
                    }
                    : {
                          scale: 1.03,
                          y: -2,
                          transition: {type: "spring", stiffness: 280, damping: 24},
                      }
            }
            whileTap={
                prefersReducedMotion
                    ? undefined
                    : {
                          scale: isActive ? 1 : 0.95,
                          transition: {type: "spring", stiffness: 420, damping: 30},
                      }
            }

            layout
        >
            {isActive && !prefersReducedMotion ? (
                <motion.span
                    layoutId="lesson-indicator-highlight"
                    className="absolute inset-0 z-0 rounded-2xl border border-celestialblue-400/80 bg-celestialblue-200/80 dark:border-celestialblue-500/70 dark:bg-celestialblue-800/90"
                    transition={{type: "spring", stiffness: 420, damping: 32}}
                />
            ) : null}
            {isActive && prefersReducedMotion ? (
                <span className="absolute inset-0 z-0 rounded-2xl border border-celestialblue-400/80 bg-celestialblue-200/80 dark:border-celestialblue-500/70 dark:bg-celestialblue-800/90" />
            ) : null}
            <span className="relative z-10 select-none leading-tight">{label}</span>
        </motion.button>
    );
}

function LessonIndicator({lessons, activeLessonIndex, onLessonSelect}: LessonIndicatorProps) {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const [activeIndex, setActiveIndex] = useState(activeLessonIndex);
    const controls = useAnimationControls();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(wrapperRef, {amount: 0.6});
    const hasAnimatedRef = useRef(false);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

    useEffect(() => {
        setActiveIndex(activeLessonIndex);
    }, [activeLessonIndex]);

    useEffect(() => {
        if (prefersReducedMotion || hasAnimatedRef.current || !inView) return;
        hasAnimatedRef.current = true;
        controls.start("visible");
    }, [controls, inView, prefersReducedMotion]);

    useEffect(() => {
        if (prefersReducedMotion || !wrapperRef.current) return;
        const sequence = animate([
            [
                {
                    boxShadow: [
                        "0 0 0 rgba(92, 124, 196, 0)",
                        "0 14px 26px rgba(92, 124, 196, 0.18)",
                        "0 0 0 rgba(92, 124, 196, 0)",
                    ],
                },
                {duration: 0.6, ease: [0.33, 1, 0.68, 1]},
            ],
        ]);
        return () => sequence.stop();
    }, [prefersReducedMotion]);

    const handleSelect = useCallback(
        (index: number) => {
            setActiveIndex(index);
            onLessonSelect?.(index);
            requestAnimationFrame(() => {
                tabRefs.current[index]?.focus();
            });
        },
        [onLessonSelect],
    );

    const renderedTabs = useMemo(
        () =>
            lessons.map((label, index) => (
                <LessonTab
                    key={label}
                    label={label}
                    index={index}
                    isActive={activeIndex === index}
                    onSelect={handleSelect}
                    prefersReducedMotion={prefersReducedMotion}
                    total={lessons.length}
                    buttonRef={(node) => {
                        tabRefs.current[index] = node;
                    }}
                />
            )),
        [activeIndex, handleSelect, lessons, prefersReducedMotion],
    );

    return (
        <LayoutGroup>
            <motion.nav
                ref={wrapperRef}
                role="tablist"
                className="mx-auto flex w-fit items-center justify-center gap-3 rounded-b-3xl border-3 border-t-0 border-space-50 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-space-500/50 dark:bg-space-900/50"
                variants={prefersReducedMotion ? undefined : containerVariants}
                initial={prefersReducedMotion ? undefined : "hidden"}
                animate={prefersReducedMotion ? undefined : controls}
            >
                {prefersReducedMotion
                    ? lessons.map((label, index) => (
                          <LessonTab
                              key={label}
                              label={label}
                              index={index}
                              isActive={activeIndex === index}
                              onSelect={handleSelect}
                              prefersReducedMotion={prefersReducedMotion}
                              total={lessons.length}
                              buttonRef={(node) => {
                                  tabRefs.current[index] = node;
                              }}
                          />
                      ))
                    : renderedTabs}
            </motion.nav>
        </LayoutGroup>
    );
}

export default LessonIndicator;
