import type { SystemNoticeNotification } from "./NotificationIsland";
import { cn } from "../utils/cn";
import NotificationPill from "./NotificationPill";

const severityStyles = {
    info: {
        border: "border-celestialblue-150",
        hover: "hover:border-celestialblue-200",
        bg: "bg-celestialblue-50/80",
        text: "text-celestialblue-700",
        ring: "focus-visible:ring-celestialblue-200",
        glow: "bg-celestialblue-200/30",
    },
    warning: {
        border: "border-saffron-150",
        hover: "hover:border-saffron-200",
        bg: "bg-saffron-50/80",
        text: "text-saffron-700",
        ring: "focus-visible:ring-saffron-200",
        glow: "bg-saffron-200/30",
    },
    danger: {
        border: "border-persianred-150",
        hover: "hover:border-persianred-200",
        bg: "bg-persianred-50/80",
        text: "text-persianred-700",
        ring: "focus-visible:ring-persianred-200",
        glow: "bg-persianred-200/30",
    },
} as const;

export default function NotificationSystemNotice({
    title,
    message,
    severity = "info",
    layoutId,
    onDismissStart,
    onDismiss,
    className,
}: SystemNoticeNotification) {
    const styles = severityStyles[severity];
    const ariaLabel = `${title}. ${message}`;

    return (
        <NotificationPill
            label={title}
            subtitle={message}
            ariaLabel={ariaLabel}
            title={message}
            onDismissStart={onDismissStart}
            onDismiss={onDismiss}
            layoutId={layoutId}
            className={cn(styles.border, styles.bg, styles.text, className)}
        />
    );
}
