import type { DailyGoalNotification } from "./NotificationIsland";
import { cn } from "../utils/cn";
import NotificationPill from "./NotificationPill";

export default function NotificationDailyGoal({
    title,
    progress,
    target,
    unit = "xp",
    layoutId,
    onDismissStart,
    onDismiss,
    className,
}: DailyGoalNotification) {
    const resolvedTitle = title ?? "Daily goal";
    const detailLabel = `${progress}/${target} ${unit}`;
    const ariaLabel = `${resolvedTitle}. ${detailLabel}`;

    return (
        <NotificationPill
            label={resolvedTitle}
            subtitle={detailLabel}
            ariaLabel={ariaLabel}
            title={detailLabel}
            onDismissStart={onDismissStart}
            onDismiss={onDismiss}
            layoutId={layoutId}
            className={cn(
                "border-emerald-150 bg-emerald-50/80 text-emerald-700",
                className,
            )}
        />
    );
}
