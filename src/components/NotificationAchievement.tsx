import type { AchievementNotification } from "./NotificationIsland";
import { cn } from "../utils/cn";
import NotificationPill from "./NotificationPill";

export default function NotificationAchievement({
    title,
    subtitle,
    reward,
    streak,
    xp,
    layoutId,
    onDismissStart,
    onDismiss,
    className,
}: AchievementNotification) {
    const detailParts = [
        subtitle,
        typeof xp === "number" ? `+${xp} xp` : null,
        typeof streak === "number"
            ? `${streak} day${streak === 1 ? "" : "s"} streak`
            : null,
        reward,
    ].filter(Boolean);
    const detailLabel = detailParts.join(" - ");
    const ariaLabel = detailLabel ? `${title}. ${detailLabel}` : title;

    return (
        <NotificationPill
            label={title}
            subtitle={subtitle ?? detailLabel}
            ariaLabel={ariaLabel}
            title={detailLabel || undefined}
            onDismissStart={onDismissStart}
            onDismiss={onDismiss}
            layoutId={layoutId}
            className={cn(
                "border-saffron-150 bg-saffron-50/80 text-saffron-700",
                className,
            )}
        />
    );
}
