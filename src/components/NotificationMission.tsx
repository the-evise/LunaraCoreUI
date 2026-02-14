import type { MissionNotification } from "./NotificationIsland";
import { cn } from "../utils/cn";
import NotificationPill from "./NotificationPill";

export default function NotificationMission({
    title,
    progress,
    total,
    tag,
    layoutId,
    onDismissStart,
    onDismiss,
    className,
}: MissionNotification) {
    const detailLabel = `${progress}/${total} steps`;
    const ariaLabel = `${title}. ${tag ?? "Mission"} - ${detailLabel}`;

    return (
        <NotificationPill
            label={title}
            subtitle={detailLabel}
            ariaLabel={ariaLabel}
            title={detailLabel}
            onDismissStart={onDismissStart}
            onDismiss={onDismiss}
            layoutId={layoutId}
            className={cn(
                "border-celestialblue-150 bg-celestialblue-50/80 text-celestialblue-700",
                className,
            )}
        />
    );
}
