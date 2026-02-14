import type { BillingPlanNotification } from "./NotificationIsland";
import { cn } from "../utils/cn";
import NotificationPill from "./NotificationPill";

const statusStyles = {
    trial: {
        border: "border-saffron-150",
        hover: "hover:border-saffron-200",
        bg: "bg-saffron-50/80",
        text: "text-saffron-700",
        ring: "focus-visible:ring-saffron-200",
        shimmer: "via-saffron-100/60",
    },
    active: {
        border: "border-emerald-150",
        hover: "hover:border-emerald-200",
        bg: "bg-emerald-50/80",
        text: "text-emerald-700",
        ring: "focus-visible:ring-emerald-200",
        shimmer: "via-emerald-100/60",
    },
    expiring: {
        border: "border-persianred-150",
        hover: "hover:border-persianred-200",
        bg: "bg-persianred-50/80",
        text: "text-persianred-700",
        ring: "focus-visible:ring-persianred-200",
        shimmer: "via-persianred-100/60",
    },
} as const;

export default function NotificationBillingPlan({
    planName,
    renewalDate,
    status = "active",
    priceLabel,
    layoutId,
    onDismissStart,
    onDismiss,
    className,
}: BillingPlanNotification) {
    const styles = statusStyles[status];
    const detailLabel = [renewalDate, priceLabel].filter(Boolean).join(" - ");
    const ariaLabel = detailLabel ? `${planName}. ${detailLabel}` : planName;

    return (
        <NotificationPill
            label={planName}
            subtitle={detailLabel || undefined}
            ariaLabel={ariaLabel}
            title={detailLabel || undefined}
            onDismissStart={onDismissStart}
            onDismiss={onDismiss}
            layoutId={layoutId}
            className={cn(styles.border, styles.bg, styles.text, className)}
        />
    );
}
