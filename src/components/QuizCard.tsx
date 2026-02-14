import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import "material-symbols";
import Badge, { type BadgeProps } from "./Badge";
import Button from "./Button";
import Card from "./Card";
import SectionStatus from "./SectionStatus";
import Title from "./Title";

export { default as SectionStatus } from "./SectionStatus";

/* --------------------------- ResultItem --------------------------- */

const resultVariants = cva("inline-flex flex-col justify-center items-center");

interface ResultProps {
    badgeProps: BadgeProps;
}

const typeConfig: Record<
    Exclude<NonNullable<BadgeProps["type"]>, "empty">,
    { icon: string; label: string }
> = {
    xp: { icon: "poker_chip", label: "XP" },
    time: { icon: "alarm", label: "Time" },
    grade: { icon: "ar_stickers", label: "Grade" },
    locked: { icon: "lock", label: "Locked" },
};

function ResultItem({ badgeProps }: ResultProps) {
    let normalizedBadgeProps: BadgeProps = badgeProps;

    if (badgeProps.type === "grade" && !badgeProps.grade) {
        normalizedBadgeProps = { type: "empty" };
    } else if (
        (badgeProps.type === "xp" || badgeProps.type === "time") &&
        !badgeProps.children
    ) {
        normalizedBadgeProps = { type: "empty" };
    }

    const currentType =
        badgeProps.type && badgeProps.type !== "empty" ? badgeProps.type : "xp";

    const { icon, label } = typeConfig[currentType as keyof typeof typeConfig];

    return (
        <div className={resultVariants()}>
            <span className="material-symbols-rounded !text-3xl font-normal md:!text-7xl text-celestialblue-700">
                {icon}
            </span>
            <Title tone="Space_alt" size={5}>
                {label}
            </Title>
            <Badge {...normalizedBadgeProps} size="2xl" />
        </div>
    );
}

/* --------------------------- Style Variants --------------------------- */

const resultsSectionVariants = cva(
    "flex w-full flex-col items-center justify-center p-4 md:p-6 md:rounded-[10px] md:flex-row md:justify-center transition-all duration-300",
    {
        variants: {
            frameless: {
                false:
                    "border border-space-150/60 bg-space-50/60 backdrop-blur-md hidden md:flex",
                true:
                    "border-t border-b border-space-150 backdrop-blur-0 shadow-none md:w-fit md:border-1",
            },
            status: {
                success: "bg-emerald-10",
                failed: "bg-persianred-10",
                neutral: "",
            },
        },
        defaultVariants: { frameless: false },
    }
);

/* --------------------------- QuizCard --------------------------- */

interface QuizCardProps {
    xp?: ReactNode;
    time?: ReactNode;
    grade?: "S" | "A" | "B" | "C" | "D" | "F";
    frameless?: boolean;
    statusVisible?: boolean;
    title?: string;
    onReview?: () => void;
    actionLabel?: string;
}

const EASE = [0.33, 1, 0.68, 1] as const;

function QuizCard({
    xp,
    time,
    grade,
    frameless = false,
    statusVisible = true,
    title = "Section",
    onReview,
    actionLabel = "Review",
}: QuizCardProps) {
    const prefersReducedMotion = useReducedMotion();
    const cardMotionProps = prefersReducedMotion
        ? {}
        : {
              initial: { opacity: 0, y: 16, scale: 0.985 },
              whileInView: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 12, scale: 0.985 },
              transition: { duration: 0.35, ease: EASE },
              viewport: { once: true, amount: 0.4 },
          };
    const status =
        grade === "S" || grade === "A" || grade === "B" || grade === "C"
            ? "success"
            : grade === "D" || grade === "F"
              ? "failed"
              : "neutral";

    const statusConfig = {
        success: {
            bg: "bg-emerald-10",
            glow: "bg-emerald-300/10",
        },
        failed: {
            bg: "bg-persianred-10",
            glow: "bg-persianred-300/10",
        },
        neutral: {
            bg: "bg-space-50",
            glow: "bg-space-50/10",
        },
    }[status];

    const canReview = Boolean(onReview);

    const resultsSection = (
        <div className={resultsSectionVariants({ frameless, status })}>
            <div className="flex w-full justify-center items-center px-8 md:px-16 gap-12 md:gap-16 md:w-auto lg:gap-20 md:justify-center">
                <ResultItem badgeProps={{ type: "xp", children: xp }} />
                <ResultItem badgeProps={{ type: "time", children: time }} />
                <ResultItem badgeProps={{ type: "grade", grade }} />
            </div>
        </div>
    );

    const mobileSection = (
        <div className="flex flex-row-reverse w-full justify-between items-center p-4 md:hidden">
            <SectionStatus status={status} title={title} variant="mobile" />
            {status === "failed" || status === "neutral" ? (
                <button
                    className="text-celestialblue-500 text-base flex gap-0 justify-center items-center h-16 disabled:text-space-400"
                    dir="rtl"
                    onClick={onReview}
                    disabled={!canReview}
                >
                    {actionLabel}
                    <span className={"material-symbols-rounded text-xl"}>
                        chevron_backward
                    </span>
                </button>
            ) : (
                <Badge type="grade" grade={grade} size="xl" />
            )}
        </div>
    );

    if (frameless) {
        return (
            <motion.div className="quiz-card-root w-full" {...cardMotionProps}>
                {statusVisible && (
                    <div className="absolute top-2 left-4 flex items-center gap-1" />
                )}
                {resultsSection}
            </motion.div>
        );
    }

    return (
        <motion.div className="quiz-card-root quiz-card-root--mobile-full w-full" {...cardMotionProps}>
            <Card
                padding="sm"
                rounded="2xl"
                flatEdges
                className={`quiz-card-shell relative overflow-hidden !min-w-0 ${statusConfig.bg}`}
            >
                <div
                    className={`
                        absolute top-80 left-1/2 w-[905px] h-[905px]
                        rounded-full -translate-x-1/2 -translate-y-1/2 blur-[80px] z-0 transition-all duration-300
                        ${statusConfig.glow}
                    `}
                />
                {resultsSection}
                {mobileSection}

                {/* Desktop footer */}
                <div className="hidden md:flex flex-row justify-between items-center mt-6 w-full">
                    <SectionStatus status={status} title={title} variant="desktop" />
                    {canReview ? (
                        <Button
                            variant="quiz"
                            size="xl"
                            hasIcon
                            icon="north_east"
                            isMagnetic
                            onClick={onReview}
                        >
                            {actionLabel}
                        </Button>
                    ) : null}
                </div>
            </Card>
        </motion.div>
    );
}

export default QuizCard;
