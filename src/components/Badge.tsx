import {cva, type VariantProps} from "class-variance-authority";
import {LockClosedIcon} from "@heroicons/react/24/solid";
import {motion} from "motion/react";
import {forwardRef, type ReactNode} from "react";

const badgeVariants = cva(
    "border-1 inline-flex items-center justify-center text-center cursor-default align-middle select-none transition-colors",
    {
        variants: {
            type: {
                empty: "border-space-100 bg-[repeating-linear-gradient(-55deg,#F2F6FE,#F2F6FE_10px,#ffffff_10px,#ffffff_20px)] bg-[length:200%_200%]",
                locked: "border-space-100 bg-[repeating-linear-gradient(-55deg,#F2F6FE,#F2F6FE_10px,#ffffff_10px,#ffffff_20px)] bg-[length:200%_200%] text-space-300",
                time: "bg-space-10 border-space-100 text-space-800 text-time",
                xp: "bg-space-10 border-saffron-300 text-saffron-500",
                grade: "",
            },
            grade: {
                S: "bg-emerald-400 text-emerald-10 inset-ring-emerald-300",
                A: "bg-emerald-150 text-emerald-500 inset-ring-emerald-250",
                B: "bg-emerald-50 text-emerald-600 inset-ring-emerald-100",
                C: "bg-space-200 text-space-700 inset-ring-space-150",
                D: "bg-persianred-150 text-persianred-500 inset-ring-persianred-250",
                F: "bg-persianred-300 text-persianred-700 inset-ring-persianred-150",
            },
            size: {
                "2xl": "h-[80px] w-[148px] text-2xl !font-black rounded-3xl",
                xl: "h-[64px] w-[90px] text-[27px] font-black rounded-2xl",
                lg: "h-[54px] w-[90px] text-[36px] font-black rounded-xl",
                md: "h-[40px] w-[74px] text-xl font-black rounded-lg",
                sm: "h-[36px] w-[60px] text-xl font-black rounded-lg",
                item: "size-[48px] text-[30px] font-normal rounded-full"
            },
        },
        compoundVariants: [
            {
                type: "grade",
                className: "",
            },
            {
                type: "grade",
                size: "item",
                className: "bg-transparent border-none",
            },
            {
                type: "grade",
                size: "item",
                grade: "S",
                className: "!bg-emerald-400 border-none",
            },
            {
                type: "time",
                size: "2xl",
                className: "!font-light !text-[30px]",
            },
            {
                type: "time",
                size: "xl",
                className: "!font-light !text-[26px]",
            },
            {
                type: "time",
                size: "lg",
                className: "!font-light !text-[24px]",
            },
            {
                type: "time",
                size: "md",
                className: "!font-normal !text-[20px]",
            },
            {
                type: "time",
                size: "sm",
                className: "!font-normal !text-[18px]",
            },
        ],
        defaultVariants: {
            type: "empty",
            size: "md",
        },
    },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;
type BadgeGrade = "S" | "A" | "B" | "C" | "D" | "F";
type BadgeNonItemSize = Exclude<BadgeVariants["size"], "item">;

type BadgeBaseProps = {
    className?: string;
    size?: BadgeVariants["size"];
    animationControlled?: boolean;
};

export type BadgeProps =
    | (BadgeBaseProps & {type: "grade"; grade: BadgeGrade | undefined; children?: ReactNode})
    | (Omit<BadgeBaseProps, "size"> & {type?: "time" | "xp"; grade?: never; children: ReactNode; size?: BadgeNonItemSize})
    | (BadgeBaseProps & {type?: "empty" | "locked"; grade?: never; children?: never});

const baseTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 0.1,
} as const;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, forwardedRef) => {
    const {
        type: badgeType = "empty",
        grade,
        size = "lg",
        className,
        children,
        animationControlled = false,
    } = props;
    const resolvedSize = size ?? "lg";

    const isExternallyControlled = animationControlled;

    const lockIconClassName = {
        "2xl": "size-11",
        xl: "size-8",
        lg: "size-7",
        md: "size-6",
        sm: "size-5",
        item: "size-7",
    }[resolvedSize];

    const displayContent =
        badgeType === "empty"
            ? null
            : badgeType === "locked"
                ? <LockClosedIcon className={lockIconClassName} aria-hidden="true" />
                : badgeType === "grade" && !children
                    ? grade
                    : children;

    const isEmptyStyle = badgeType === "empty" || badgeType === "locked";

    const baseAnimate = {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: baseTransition,
    };

    return (
        <motion.span
            ref={forwardedRef}
            className={badgeVariants({
                type: badgeType,
                grade: badgeType === "grade" ? grade : undefined,
                size: resolvedSize,
                className,
            })}
            key={`badge-${badgeType}-${displayContent ?? "empty"}`}
            data-badge-controlled={isExternallyControlled ? "" : undefined}
            data-badge-type={badgeType}
            data-badge-nudge={isEmptyStyle ? "false" : "true"}
            initial={{
                opacity: 0,
                scale: 0.96,
                y: (resolvedSize === "item" && (badgeType === "grade" || badgeType === "locked") || badgeType === "empty") ? 0 : 6,
            }}
            animate={baseAnimate}
            whileHover={
                isExternallyControlled
                    ? undefined
                    : {
                        scale: 1.02,
                    }
            }
            whileTap={
                isExternallyControlled
                    ? undefined
                    : {
                        scale: 0.98,
                        transition:{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                            mass: 0.1,
                        },
                    }
            }
        >
            {displayContent}
        </motion.span>
    );
});

Badge.displayName = "Badge";

export default Badge;
