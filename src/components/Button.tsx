import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { forwardRef } from "react";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const buttonVariants = cva(
    // Structural essentials only
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none select-none",
    {
        variants: {
            variant: {
                primary: "",
                secondary: "",
                quiz: "",
                ghost: "",
                outline: "",
            },
            size: {
                sm: "px-3 py-1.5 text-sm",
                md: "px-4 py-2 text-base",
                lg: "px-5 py-3 text-lg",
            },
            hasIcon: {
                true: "gap-2",
                false: "",
            },
            hasKey: {
                true: "gap-2",
                false: "",
            },
        },
        compoundVariants: [
            // Example: special spacing when both icon and key exist
            { hasIcon: true, hasKey: true, class: "gap-3" },
        ],
        defaultVariants: {
            variant: "primary",
            size: "md",
            hasIcon: false,
            hasKey: false,
        },
    }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        ButtonVariants {
    icon?: React.ReactNode; // left icon
    keyIcon?: React.ReactNode; // right-side key symbol icon
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            hasIcon,
            hasKey,
            icon,
            keyIcon,
            className,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                data-variant={variant}
                className={cn(buttonVariants({ variant, size, hasIcon, hasKey }), className)}
                {...props}
            >
                {/* Left icon */}
                {hasIcon && icon && (
                    <span
                        className={cn(
                            "flex items-center justify-center text-xl",
                            variant === "quiz" && "text-celestialblue-400"
                        )}
                    >
            {icon}
          </span>
                )}

                {/* Label */}
                <span>{children}</span>

                {/* Right special key icon */}
                {hasKey && keyIcon && (
                    <span
                        className={cn(
                            "flex items-center justify-center text-lg",
                            variant === "primary" && "text-space-950",
                            variant === "secondary" && "text-space-200"
                        )}
                    >
            {keyIcon}
          </span>
                )}
            </button>
        );
    }
);

export default Button;
Button.displayName = "Button";
