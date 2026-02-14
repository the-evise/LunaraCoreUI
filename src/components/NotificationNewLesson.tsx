import type { NewLessonNotification } from "./NotificationIsland";
import { cn } from "../utils/cn";
import NotificationPill from "./NotificationPill";

export default function NotificationNewLesson({
    title,
    subtitle,
    lessonCount,
    layoutId,
    onDismissStart,
    onDismiss,
    className,
}: NewLessonNotification) {
    const detailLabel =
        typeof subtitle === "string"
            ? subtitle
            : (typeof lessonCount === "number"
                  ? `${lessonCount} new ${lessonCount === 1 ? "lesson" : "lessons"}`
                  : undefined);
    const subtitleNode =
        subtitle ??
        (typeof lessonCount === "number"
            ? `${lessonCount} new ${lessonCount === 1 ? "lesson" : "lessons"}`
            : undefined);
    const ariaLabel = detailLabel ? `${title}. ${detailLabel}` : title;

    return (
        <NotificationPill
            label={title}
            subtitle={subtitleNode}
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
