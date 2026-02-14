import * as React from "react";
import "material-symbols";
import { cn } from "../utils/cn";
import MenuPanel from "./MenuPanel";

export type StreakEntry = {
    label: string;
    points: number;
    isToday?: boolean;
};

export type StreakButtonProps = {
    totalPoints?: number;
    todayPoints?: number;
    entries?: StreakEntry[];
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClick?: () => void;
    disabled?: boolean;
    label?: string;
    className?: string;
    buttonClassName?: string;
    panelClassName?: string;
};

export default function StreakButton({
    totalPoints,
    todayPoints,
    entries = [],
    isOpen,
    defaultOpen = false,
    onOpenChange,
    onClick,
    disabled,
    label = "Streak",
    className,
    buttonClassName,
    panelClassName,
}: StreakButtonProps) {
    const isControlled = typeof isOpen === "boolean";
    const [isPanelOpen, setIsPanelOpen] = React.useState(defaultOpen);
    const [mobilePanelTop, setMobilePanelTop] = React.useState<number | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const resolvedTotalPoints =
        totalPoints ?? entries.reduce((sum, entry) => sum + entry.points, 0);
    const todayEntryPoints = entries.find((entry) => entry.isToday)?.points;
    const resolvedTodayPoints = todayPoints ?? todayEntryPoints ?? 0;
    const maxPoints = entries.length
        ? Math.max(1, ...entries.map((entry) => entry.points))
        : 1;

    const updateMobilePanelTop = React.useCallback(() => {
        const triggerButton = containerRef.current?.querySelector<HTMLButtonElement>(
            "button[aria-haspopup='menu']"
        );
        if (!triggerButton) {
            return;
        }
        const triggerRect = triggerButton.getBoundingClientRect();
        setMobilePanelTop(Math.round(triggerRect.bottom + 12));
    }, []);

    React.useEffect(() => {
        if (!isControlled) {
            return;
        }
        setIsPanelOpen(Boolean(isOpen));
    }, [isControlled, isOpen]);

    React.useEffect(() => {
        if (!isPanelOpen) {
            return;
        }

        updateMobilePanelTop();

        const handleViewportChange = () => {
            updateMobilePanelTop();
        };

        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("scroll", handleViewportChange, true);

        let resizeObserver: ResizeObserver | undefined;
        if (typeof ResizeObserver !== "undefined" && containerRef.current) {
            const triggerButton = containerRef.current.querySelector<HTMLButtonElement>(
                "button[aria-haspopup='menu']"
            );
            if (!triggerButton) {
                return;
            }
            resizeObserver = new ResizeObserver(handleViewportChange);
            resizeObserver.observe(triggerButton);
        }

        return () => {
            window.removeEventListener("resize", handleViewportChange);
            window.removeEventListener("scroll", handleViewportChange, true);
            resizeObserver?.disconnect();
        };
    }, [isPanelOpen, updateMobilePanelTop]);

    return (
        <div ref={containerRef} className={cn("inline-flex", className)}>
            <MenuPanel
                open={isOpen}
                defaultOpen={defaultOpen}
                onOpenChange={(openState, reason) => {
                    setIsPanelOpen(openState);
                    onOpenChange?.(openState);
                    if (reason === "trigger") {
                        onClick?.();
                    }
                }}
                className="static md:relative"
            >
                <MenuPanel.Trigger
                    variant="secondary"
                    disabled={disabled}
                    icon="local_fire_department"
                    iconSize="md"
                    className={cn(
                        "gap-2 px-3 text-space-900 data-[state=on]:ring-2 data-[state=on]:ring-saffron-200 [&_.material-symbols-rounded]:text-saffron-500",
                        buttonClassName
                    )}
                >
                    {resolvedTotalPoints}
                    <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-space-400 md:inline">
                        {label}
                    </span>
                    <span className="sr-only">{label} details</span>
                </MenuPanel.Trigger>

                <MenuPanel.Content
                    variant="default"
                    align="center"
                    sideOffset={12}
                    className={cn(
                        "!fixed !left-0 !right-0 !z-90 !w-full !max-h-[60vh] !max-w-[768px] !overflow-auto !rounded-none !p-4 sm:!p-8",
                        "md:!static md:!w-[360px] md:!max-h-none md:!overflow-visible md:!rounded-2xl md:!p-4",
                        panelClassName
                    )}
                    style={{ top: mobilePanelTop ?? 130 }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-space-900">
                                Streak details
                            </p>
                            <p className="text-xs text-space-500">
                                Earn 1 point per quiz or review. Total streak is the sum of daily
                                points.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="rounded-xl border border-space-100 bg-space-10 px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-space-400">
                                        Today
                                    </p>
                                    <p className="text-base font-semibold text-space-900">
                                        {resolvedTodayPoints} point
                                        {resolvedTodayPoints === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <span className="text-xs text-space-500">
                                    Quiz + Review
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-space-400">
                                Recent days
                            </p>
                            {entries.length ? (
                                <div className="space-y-2">
                                    {entries.map((entry, index) => (
                                        <div
                                            key={`${entry.label}-${index}`}
                                            className="flex items-center gap-3"
                                        >
                                            <span
                                                className={cn(
                                                    "w-10 text-xs font-semibold uppercase tracking-wide text-space-400",
                                                    entry.isToday && "text-saffron-600"
                                                )}
                                            >
                                                {entry.label}
                                            </span>
                                            <div className="h-2 flex-1 rounded-full bg-space-50">
                                                <div
                                                    className="h-2 rounded-full bg-saffron-400"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            (entry.points / maxPoints) * 100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-6 text-right text-xs font-semibold text-space-700">
                                                {entry.points}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-space-500">
                                    Complete a quiz to start tracking your streak.
                                </p>
                            )}
                        </div>
                    </div>
                </MenuPanel.Content>
            </MenuPanel>
        </div>
    );
}
