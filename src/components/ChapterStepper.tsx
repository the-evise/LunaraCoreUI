import * as React from "react";
import { cva } from "class-variance-authority";
import {LayoutGroup, motion, useAnimationControls, useInView, useReducedMotion} from "motion/react";
import {
    AcademicCapIcon,
    CheckBadgeIcon,
    ChevronRightIcon,
    LockClosedIcon,
} from "@heroicons/react/24/solid";
import Card from "./Card";
import { cn } from "../utils/cn";

export type ChapterStep = {
    id: string;
    title: string; // "Lesson 1"
    progressText?: string; // "3/7" (optional)
    isCompleted?: boolean; // optional for future
    isLocked?: boolean; // optional for future
    panelId?: string; // optional tabpanel id for aria-controls
};

export type ChapterStepperProps = {
    heading: string; // "In search of discovery"
    steps: ChapterStep[];
    activeStepId: string;
    onStepSelect: (stepId: string) => void;

    /** Optional: disable interaction */
    disabled?: boolean;

    /** Optional: aria label for the step list */
    ariaLabel?: string;
};

type StepperButtonProps = {
    step: ChapterStep;
    isActive: boolean;
    isLocked: boolean;
    isClickable: boolean;
    prefersReducedMotion: boolean;
    tabId: string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    setRef: (node: HTMLButtonElement | null) => void;
};

const containerVariants = {
    hidden: {
        opacity: 0,
        y: -12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.2, 0.8, 0.2, 1],
            when: "beforeChildren",
            staggerChildren: 0.06,
        },
    },
} as const;

const stepVariants = {
    hidden: {
        opacity: 0,
        y: -8,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition:{
            type: "spring",
            stiffness: 400,
            damping: 20,
            mass: 0.1,
        },
    },
} as const;

const arrowVariants = {
    hidden: {
        opacity: 0,
        y: 6,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.25, ease: [0.25, 0.8, 0.4, 1], delay: 0.4},
    },
} as const;

const stepperButtonVariants = cva(
    "chapter-stepper__tab shrink-0 basis-64 min-w-64 xl:basis-72 xl:min-w-72 2xl:basis-80 2xl:min-w-80 h-[140px] rounded-xl md:rounded-2xl px-3 py-4 md:px-4 md:py-6 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-space-50 disabled:text-space-300 disabled:border-space-100 font-dmsans cursor-pointer self-center relative isolate",
    {
        variants: {
            state: {
                active: "bg-celestialblue-500",
                inactive: "border border-celestialblue-150 bg-celestialblue-50 hover:border-celestialblue-200 hover:bg-celestialblue-10",
            },
        },
        defaultVariants: {
            state: "inactive",
        },
    }
);

const stepperTitleVariants = cva("font-semibold text-md md:text-lg h-[56px]", {
    variants: {
        state: {
            active: "text-saffron-50",
            inactive: "text-celestialblue-700",
        },
    },
    defaultVariants: {
        state: "inactive",
    },
});

const stepperIconVariants = cva("mt-1 h-8 w-8 md:h-9 md:w-9", {
    variants: {
        tone: {
            active: "text-celestialblue-10",
            locked: "text-space-300",
            completed: "text-emerald-500",
            default: "text-celestialblue-400",
        },
    },
    defaultVariants: {
        tone: "default",
    },
});

const chevronVariants = cva("h-5 w-5", {
    variants: {
        highlighted: {
            true: "text-celestialblue-300/80",
            false: "text-space-200",
        },
    },
    defaultVariants: {
        highlighted: false,
    },
});

function StepperButton({
    step,
    isActive,
    isLocked,
    isClickable,
    prefersReducedMotion,
    tabId,
    tabIndex,
    onClick,
    onKeyDown,
    setRef,
}: StepperButtonProps) {
    const Icon = isLocked
        ? LockClosedIcon
        : step.isCompleted
            ? CheckBadgeIcon
            : AcademicCapIcon;
    const iconTone = isActive
        ? "active"
        : isLocked
            ? "locked"
            : step.isCompleted
                ? "completed"
                : "default";

    return (
        <motion.button
            type="button"
            role="tab"
            id={tabId}
            aria-selected={isActive}
            aria-controls={step.panelId}
            aria-disabled={isClickable ? undefined : true}
            disabled={!isClickable}
            tabIndex={tabIndex}
            onClick={onClick}
            onKeyDown={onKeyDown}
            ref={setRef}
            variants={prefersReducedMotion ? undefined : stepVariants}
            className={stepperButtonVariants({ state: isActive ? "active" : "inactive" })}
        >
            {isActive && !prefersReducedMotion ? (
                <motion.span
                    layoutId="chapter-stepper-highlight"
                    className="absolute inset-0 z-0 rounded-xl md:rounded-2xl bg-celestialblue-500"
                    transition={{type: "spring", stiffness: 420, damping: 32}}
                />
            ) : null}
            {isActive && prefersReducedMotion ? (
                <span className="absolute inset-0 z-0 rounded-xl md:rounded-2xl bg-celestialblue-500" />
            ) : null}
            <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                    <div
                        className={stepperTitleVariants({ state: isActive ? "active" : "inactive" })}
                    >
                        {step.title}
                    </div>
                </div>

                <span
                    aria-hidden="true"
                    className={stepperIconVariants({ tone: iconTone })}
                >
                    <Icon className="h-8 w-8 md:h-9 md:w-9" />
                </span>
            </div>
        </motion.button>
    );
}

export default function ChapterStepper({
    heading,
    steps,
    activeStepId,
    onStepSelect,
    disabled = false,
    ariaLabel = "Chapter steps",
}: ChapterStepperProps) {
    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
    const prefersReducedMotion = useReducedMotion() ?? false;
    const controls = useAnimationControls();
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const inView = useInView(wrapperRef, {amount: 0.6});
    const hasAnimatedRef = React.useRef(false);

    const resolvedActiveIndex = steps.findIndex((step) => step.id === activeStepId);
    const firstUnlockedIndex = steps.findIndex((step) => !step.isLocked);
    const fallbackIndex =
        firstUnlockedIndex >= 0 ? firstUnlockedIndex : steps.length ? 0 : -1;
    const activeIndex = resolvedActiveIndex >= 0 ? resolvedActiveIndex : fallbackIndex;
    const activeStepIdResolved = activeIndex >= 0 ? steps[activeIndex]?.id : undefined;
    const focusableIndex =
        activeIndex >= 0 && !disabled && !steps[activeIndex]?.isLocked
            ? activeIndex
            : steps.findIndex((step) => !disabled && !step.isLocked);

    const focusAndSelect = (index: number) => {
        const step = steps[index];
        if (!step || disabled || step.isLocked) {
            return;
        }
        tabRefs.current[index]?.focus();
        if (step.id !== activeStepId) {
            onStepSelect(step.id);
        }
    };

    const findNextEnabledIndex = (startIndex: number, direction: number) => {
        if (!steps.length) {
            return -1;
        }
        let nextIndex = startIndex;
        for (let i = 0; i < steps.length; i += 1) {
            nextIndex = (nextIndex + direction + steps.length) % steps.length;
            const nextStep = steps[nextIndex];
            if (!disabled && !nextStep.isLocked) {
                return nextIndex;
            }
        }
        return -1;
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        if (disabled) {
            return;
        }
        const { key } = event;
        if (key === "ArrowRight" || key === "ArrowDown") {
            event.preventDefault();
            const nextIndex = findNextEnabledIndex(index, 1);
            if (nextIndex !== -1) {
                focusAndSelect(nextIndex);
            }
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
            event.preventDefault();
            const nextIndex = findNextEnabledIndex(index, -1);
            if (nextIndex !== -1) {
                focusAndSelect(nextIndex);
            }
        } else if (key === "Home") {
            event.preventDefault();
            const nextIndex = findNextEnabledIndex(-1, 1);
            if (nextIndex !== -1) {
                focusAndSelect(nextIndex);
            }
        } else if (key === "End") {
            event.preventDefault();
            const nextIndex = findNextEnabledIndex(steps.length, -1);
            if (nextIndex !== -1) {
                focusAndSelect(nextIndex);
            }
        }
    };

    React.useEffect(() => {
        if (prefersReducedMotion || hasAnimatedRef.current || !inView) return;
        hasAnimatedRef.current = true;
        controls.start("visible");
    }, [controls, inView, prefersReducedMotion]);

    return (
        <Card className={"lesson-panel-shell chapter-stepper-root overflow-x-auto overflow-y-hidden justify-center items-center !border-space-100/10"} hoverable={false} padding={"sm"} rounded={"sm"} align={"center"} flatEdges>
            <h3 className="block md:hidden text-center font-semibold text-[20px] text-space-800">{heading}</h3>

            <div className="mt-4 md:mt-0 w-full">
                <LayoutGroup>
                    <motion.div
                        className="chapter-stepper__tabs flex gap-4 sm:gap-2 md:gap-4"
                        role="tablist"
                        aria-label={ariaLabel}
                        aria-orientation="horizontal"
                        ref={wrapperRef}
                        variants={prefersReducedMotion ? undefined : containerVariants}
                        initial={prefersReducedMotion ? undefined : "hidden"}
                        animate={prefersReducedMotion ? undefined : controls}
                    >
                        {steps.map((step, idx) => {
                            const isActive = step.id === activeStepIdResolved;
                            const isLocked = !!step.isLocked;
                            const isClickable = !disabled && !isLocked;
                            const tabId = `chapter-step-${step.id}`;

                            return (
                                <React.Fragment key={step.id}>
                                    <StepperButton
                                        step={step}
                                        isActive={isActive}
                                        isLocked={isLocked}
                                        isClickable={isClickable}
                                        prefersReducedMotion={prefersReducedMotion}
                                        tabId={tabId}
                                        tabIndex={idx === focusableIndex ? 0 : -1}
                                        onClick={() => onStepSelect(step.id)}
                                        onKeyDown={(event) => handleKeyDown(event, idx)}
                                        setRef={(node) => {
                                            tabRefs.current[idx] = node;
                                        }}
                                    />

                                    {idx < steps.length - 1 && (
                                        prefersReducedMotion ? (
                                            <div className="chapter-stepper__separator flex items-center" aria-hidden="true">
                                                <ChevronRightIcon
                                                    className={cn(chevronVariants({ highlighted: idx === activeIndex }))}
                                                />
                                            </div>
                                        ) : (
                                            <motion.div className="chapter-stepper__separator flex items-center" aria-hidden="true" variants={arrowVariants}>
                                                <ChevronRightIcon
                                                    className={cn(chevronVariants({ highlighted: idx === activeIndex }))}
                                                />
                                            </motion.div>
                                        )
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </motion.div>
                </LayoutGroup>
            </div>
        </Card>
    );
}
