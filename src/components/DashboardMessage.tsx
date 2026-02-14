import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import Title from "./Title";

const messageVariants = cva(
    "relative flex w-full max-w-[640px] flex-col gap-4 rounded-2xl border text-space-700",
    {
        variants: {
            tone: {
                default: "border-space-100/80 bg-white/80",
                info: "border-celestialblue-100/80 bg-celestialblue-50/40",
                success: "border-emerald-100/80 bg-emerald-50/35",
                warning: "border-saffron-100/80 bg-saffron-50/35",
                danger: "border-persianred-100/80 bg-persianred-50/35",
            },
            align: {
                left: "items-start text-left",
                center: "items-center text-center",
            },
            size: {
                sm: "px-4 py-4",
                md: "px-6 py-6",
                lg: "px-8 py-8",
            },
        },
        defaultVariants: {
            tone: "default",
            align: "center",
            size: "md",
        },
    }
);

const mediaVariants = cva(
    "flex w-full items-center justify-center overflow-hidden rounded-2xl border border-space-100/70 bg-space-25/70",
    {
        variants: {
            size: {
                sm: "min-h-[120px]",
                md: "min-h-[160px]",
                lg: "min-h-[200px]",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

export type DashboardMessageProps = Omit<HTMLMotionProps<"div">, "children"> &
    VariantProps<typeof messageVariants> & {
        title?: ReactNode;
        description?: ReactNode;
        action?: ReactNode;
        media?: ReactNode;
        mediaSize?: VariantProps<typeof mediaVariants>["size"];
        mediaClassName?: string;
        children: ReactNode;
    };

function DashboardMessage({
    title,
    description,
    action,
    media,
    mediaSize,
    mediaClassName,
    children,
    className,
    tone,
    align,
    size,
    ...props
}: DashboardMessageProps) {
    const prefersReducedMotion = useReducedMotion();
    const actionAlignment = align === "center" ? "justify-center" : "justify-start";
    const messageContent =
        typeof children === "string" || typeof children === "number" ? (
            <p className="text-sm text-space-600 leading-relaxed">{children}</p>
        ) : (
            <div className="text-sm text-space-600 leading-relaxed">{children}</div>
        );
    const descriptionContent =
        typeof description === "string" || typeof description === "number" ? (
            <p className="text-xs text-space-400 leading-relaxed">{description}</p>
        ) : description ? (
            <div className="text-xs text-space-400 leading-relaxed">{description}</div>
        ) : null;

    return (
        <motion.div
            className={cn(messageVariants({ tone, align, size }), className)}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={
                prefersReducedMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
                    }
            }
            {...props}
        >
            {media ? (
                <div className={cn(mediaVariants({ size: mediaSize }), mediaClassName)}>
                    {media}
                </div>
            ) : null}
            <div className="flex w-full flex-col gap-2">
                {title ? (
                    <Title tone="Space" size={5} animate={false} className="mb-0 text-space-900">
                        {title}
                    </Title>
                ) : null}
                {messageContent}
                {descriptionContent}
            </div>
            {action ? (
                <div className={cn("flex w-full pt-1", actionAlignment)}>{action}</div>
            ) : null}
        </motion.div>
    );
}

export default DashboardMessage;
