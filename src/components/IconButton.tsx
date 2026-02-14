import { cva } from "class-variance-authority";
import "material-symbols";
import type { ReactNode } from "react";

const iconButtonVariants = cva(
    "rounded-[6px] md:rounded-xl border-1 inline-flex items-center justify-center cursor-pointer",
    {
        variants: {
            size: {
                sm: "w-8 h-8 md:w-8 md:h-8",
                md: "w-10 h-10 md:w-20 md:h-20",
            },
            tone: {
                default:
                    "border-space-50 text-space-200 hover:text-space-250 hover:bg-space-50 dark:border-space-500 dark:hover:bg-space-900 dark:hover:border-space-400 disabled:border-space-10/50 disabled:text-space-200/50 disabled:hover:bg-space-100 dark:disabled:border-space-700 dark:disabled:text-space-700 dark:disabled:bg-space-950/20 disabled:cursor-not-allowed transition-all duration-300 ease-in-out",
                secondary: "",
                solid:
                    "border-transparent bg-space-100 text-space-500 transition-all duration-300 ease-in-out",
            },
            rounded: {
                true: "rounded-full",
                false: "",
            },
        },
        defaultVariants: {
            rounded: false,
            size: "md",
        },
    }
);

type IconButtonProps = {
    children: ReactNode;
    variant: "default" | "secondary" | "solid";
    onClick?: () => void;
    isDisabled?: boolean;
    className?: string;
    rounded?: boolean;
    size?: "sm" | "md";
};

function IconButton({
                        children,
                        variant,
                        onClick,
                        isDisabled,
                        className,
                        rounded,
                        size,
                    }: IconButtonProps) {
    return (
        <button
            type="button"
            className={iconButtonVariants({
                tone: variant,
                rounded,
                size,
                className,
            })}
            onClick={onClick}
            disabled={isDisabled}
        >
      <span
          className={[
              "material-symbols-rounded",
              size === "sm" ? "text-base" : "text-xl md:text-2xl",
          ].join(" ")}
      >
        {children}
      </span>
        </button>
    );
}

export default IconButton;
