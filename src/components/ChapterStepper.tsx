import * as React from "react";
import {
    AcademicCapIcon,
    CheckBadgeIcon,
    ChevronRightIcon,
    LockClosedIcon,
} from "@heroicons/react/24/solid";

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

export default function ChapterStepper({
    heading,
    steps,
    activeStepId,
    onStepSelect,
    disabled = false,
    ariaLabel = "Chapter steps",
}: ChapterStepperProps) {
    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

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

    return (
        <section className="w-full" dir="ltr">
            <h3 className="block md:hidden text-center font-semibold text-[20px] text-space-800">{heading}</h3>

            <div className="mt-4 md:mt-0">
                <div
                    className="flex gap-4 overflow-x-auto"
                    role="tablist"
                    aria-label={ariaLabel}
                    aria-orientation="horizontal"
                >
                    {steps.map((step, idx) => {
                        const isActive = step.id === activeStepIdResolved;
                        const isLocked = !!step.isLocked;
                        const isClickable = !disabled && !isLocked;
                        const tabId = `chapter-step-${step.id}`;
                        const Icon = isLocked
                            ? LockClosedIcon
                            : step.isCompleted
                                ? CheckBadgeIcon
                                : AcademicCapIcon;

                        return (
                            <React.Fragment key={step.id}>
                                <button
                                    type="button"
                                    role="tab"
                                    id={tabId}
                                    aria-selected={isActive}
                                    aria-controls={step.panelId}
                                    aria-disabled={isClickable ? undefined : true}
                                    disabled={!isClickable}
                                    tabIndex={idx === focusableIndex ? 0 : -1}
                                    onClick={() => onStepSelect(step.id)}
                                    onKeyDown={(event) => handleKeyDown(event, idx)}
                                    ref={(node) => {
                                        tabRefs.current[idx] = node;
                                    }}
                                    className={[
                                        "min-w-[180px] w-[200px] h-[130px] md:w-[250px] md:h-[150px] lg:h-[180px] rounded-xl md:rounded-2xl px-3 py-4 md:px-4 md:py-6 text-left transition",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celestialblue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-space-10",
                                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-space-50 disabled:text-space-300 disabled:border-space-100",
                                        isActive
                                            ? "bg-celestialblue-500"
                                            : "border border-celestialblue-150 bg-celestialblue-50 hover:border-celestialblue-200 hover:bg-celestialblue-10",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex flex-col gap-2">
                                            <div className={["font-semibold text-lg md:text-lg lg:text-2xl", isActive ? "text-saffron-50" : "text-celestialblue-700"].join(" ")}>{step.title}</div>

                                            {step.progressText && (
                                                <div
                                                    className={[
                                                        "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm md:text-lg",
                                                        isActive
                                                            ? "border border-celestialblue-600 bg-space-50 text-emerald-800"
                                                            : "border-space-150 bg-space-50 text-space-600",
                                                    ].join(" ")}
                                                >
                                                    <span
                                                        className={[
                                                            "inline-block h-4 w-4 rounded-full",
                                                            step.isCompleted ? "bg-emerald-500" : "bg-space-200",
                                                        ].join(" ")}
                                                        aria-hidden="true"
                                                    />
                                                    <span>{step.progressText}</span>
                                                </div>
                                            )}
                                        </div>

                                        <span
                                            aria-hidden="true"
                                            className={[
                                                "mt-1 h-8 w-8 md:h-9 md:w-9",
                                                isActive
                                                    ? "text-celestialblue-10"
                                                    : isLocked
                                                        ? "text-space-300"
                                                        : step.isCompleted
                                                            ? "text-emerald-500"
                                                            : "text-celestialblue-400",
                                            ].join(" ")}
                                        >
                                            <Icon className="h-8 w-8 md:h-9 md:w-9" />
                                        </span>
                                    </div>
                                </button>

                                {idx < steps.length - 1 && (
                                    <div className="flex items-center" aria-hidden="true">
                                        <ChevronRightIcon
                                            className={[
                                                "h-5 w-5",
                                                idx === activeIndex
                                                    ? "text-celestialblue-300/80"
                                                    : "text-space-200",
                                            ].join(" ")}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
