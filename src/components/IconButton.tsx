import { cva } from "class-variance-authority";
import "material-symbols";
import type { ReactNode } from "react";

const iconButtonVariants = cva(
    "rounded-[6px] md:rounded-xl border-1 w-10 h-10 md:w-20 md:h-20 flex-inline p-auto items-center justify-center cursor-pointer",
    {
        variants: {
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
};

function IconButton({
                        children,
                        variant,
                        onClick,
                        isDisabled,
                        className,
                        rounded,
                    }: IconButtonProps) {
    return (
        <button
            type="button"
            className={iconButtonVariants({ tone: variant, rounded, className })}
            onClick={onClick}
            disabled={isDisabled}
        >
      <span className="material-symbols-rounded !text-xl md:!text-2xl">
        {children}
      </span>
        </button>
    );
}

export default IconButton;
