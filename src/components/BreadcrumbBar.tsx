import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import IconButton from "./IconButton";
import type { ReactNode } from "react";

/* ----------------------------- Variants ----------------------------- */

const breadcrumbBarVariants = cva(
    "flex items-center justify-between w-full rounded-md transition-colors duration-300",
    {
        variants: {
            tone: {
                default: "bg-space-200/50 dark:bg-space-800/40",
                celestial: "bg-celestialblue-50 dark:bg-celestialblue-900/40",
            },
            size: {
                sm: "px-3 py-2 text-sm",
                md: "px-4 py-[14px] text-base",
            },
        },
        defaultVariants: {
            tone: "default",
            size: "md",
        },
    }
);

export type BreadcrumbBarVariants = VariantProps<typeof breadcrumbBarVariants>;

/* ----------------------------- Types ----------------------------- */

interface BreadcrumbBarProps extends BreadcrumbBarVariants {
    items: string[]; // e.g. ["RoadMap A2", "Airport"]
    onBack?: () => void;
    showBackButton?: boolean; // clearer boolean
}

/* ----------------------------- Component ----------------------------- */

export default function BreadcrumbBar({
                                          items,
                                          onBack,
                                          tone,
                                          size,
                                          showBackButton = true,
                                      }: BreadcrumbBarProps) {
    return (
        <div className={cn(breadcrumbBarVariants({ tone, size }))}>
            {/* Breadcrumb text group — keep LTR flow */}
            <div className="flex items-center gap-1/2 text-celestialblue-700 dark:text-celestialblue-200 font-medium">
                {items.map((item, index) => (
                    <span key={item} className="flex items-center gap-1/2">
            <span
                className={cn(
                    index === items.length - 1
                        ? "font-semibold"
                        : "hover:underline cursor-pointer"
                )}
            >
              {item}
            </span>
                        {index < items.length - 1 && (
                            <span className="material-symbols-rounded text-space-250 !text-xl">
                arrow_right
              </span>
                        )}
          </span>
                ))}
            </div>

            {/* Back button aligned to right (Persian layout) */}
            {showBackButton && (
                <div dir="rtl">
                    <IconButton
                        variant="solid"
                        onClick={onBack}
                    >
                        arrow_forward
                    </IconButton>
                </div>
            )}
        </div>
    );
}
