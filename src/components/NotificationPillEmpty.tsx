import { cn } from "../utils/cn";

type NotificationPillEmptyProps = {
    className?: string;
};

export default function NotificationPillEmpty({ className }: NotificationPillEmptyProps) {
    return (
        <div
            className={cn(
                "h-10 w-full min-w-[230px] rounded-full border border-dashed border-space-100 bg-space-50",
                className
            )}
            aria-hidden="true"
        />
    );
}
