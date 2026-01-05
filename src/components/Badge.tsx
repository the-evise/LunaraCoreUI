import {cva, type VariantProps} from "class-variance-authority";
import {motion, useAnimate} from "motion/react";
import {forwardRef, type ReactNode, useCallback, useEffect} from "react";
import mergeRefs from "../utils/mergeRefs";

const badgeVariants = cva(
    "border-1 inline-flex items-center justify-center text-center cursor-default align-middle select-none transition-transform",
    {
        variants: {
            type: {
                empty: "border-space-100 bg-[repeating-linear-gradient(-55deg,#F2F6FE,#F2F6FE_10px,#ffffff_10px,#ffffff_20px)] bg-[length:200%_200%]",
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
            },
        },
        compoundVariants: [
            {
                type: "grade",
                className: "",
            },
            {
                type: "time",
                size: "2xl",
                className: "!font-light text-[30px]",
            },
            {
                type: "time",
                size: "md",
                className: "!font-normal text-[20px]",
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

type BadgeBaseProps = {
    className?: string;
    size?: BadgeVariants["size"];
    animationControlled?: boolean;
};

export type BadgeProps =
    | (BadgeBaseProps & {type: "grade"; grade: BadgeGrade | undefined; children?: ReactNode})
    | (BadgeBaseProps & {type?: "time" | "xp"; grade?: never; children: ReactNode})
    | (BadgeBaseProps & {type?: "empty"; grade?: never; children?: never});

const baseTransition = {
    type: "spring",
    duration: 0.35,
    bounce: 0.28,
} as const;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, forwardedRef) => {
    const [scope, animate] = useAnimate<HTMLSpanElement>();

    const {
        type: badgeType = "empty",
        grade,
        size = "lg",
        className,
        children,
        animationControlled = false,
    } = props;

    const isExternallyControlled = animationControlled === true;

    const composedRef = useCallback(mergeRefs(scope, forwardedRef), [scope, forwardedRef]);


    const displayContent =
        badgeType === "empty"
            ? null
            : badgeType === "grade" && !children
                ? grade
                : children;

    const isGradeS = badgeType === "grade" && grade === "S";

    useEffect(() => {
        if (!isGradeS || !scope.current) {
            return;
        }

        const controls = animate([
            [
                scope.current,
                {scale: [0.94, 1.08], rotate: [0, -10]},
                {...baseTransition, duration: 0.3, bounce: 0.45, delay: 0.12},
            ],
            [
                scope.current,
                {scale: [1.08, 0.98], rotate: [-10, 6]},
                {...baseTransition, duration: 0.26, bounce: 0.35},
            ],
            [
                scope.current,
                {scale: [0.98, 1], rotate: [6, 0]},
                {...baseTransition, duration: 0.24, bounce: 0.28},
            ],
        ]);

        return () => {
            controls.stop();
        };
    }, [animate, isGradeS, scope, displayContent]);

    const baseAnimate = {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            ...baseTransition,
            delay: 0.35,
        },
    };

    return (
        <motion.span
            ref={composedRef}
            className={badgeVariants({
                type: badgeType,
                grade: badgeType === "grade" ? grade : undefined,
                size,
                className,
            })}
            key={`badge-${badgeType}-${displayContent ?? "empty"}`}
            data-badge-controlled={isExternallyControlled ? "" : undefined}
            data-badge-type={badgeType}
            data-badge-nudge={badgeType === "empty" ? "false" : "true"}
            initial={{
                opacity: 0,
                scale: 0.92,
                y: 6,
            }}
            animate={baseAnimate}
            whileHover={
                isExternallyControlled
                    ? undefined
                    : {
                        scale: 1.04,
                        y: badgeType === "empty" ? 0 : -6,
                    }
            }
            whileTap={
                isExternallyControlled
                    ? undefined
                    : {
                        scale: 0.97,
                        y: 1,
                    }
            }
        >
            {displayContent}
        </motion.span>
    );
});

Badge.displayName = "Badge";

export default Badge;
