import Card from "./Card";
import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import "material-symbols";
import Title from "./Title";
import Badge, { type BadgeProps } from "./Badge";

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
        badgeProps.type && badgeProps.type !== "empty"
            ? badgeProps.type
            : "xp";

    const { icon, label } = typeConfig[currentType as "xp" | "time" | "grade"];

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

/* --------------------------- SectionStatus --------------------------- */

interface SectionStatusProps {
    status: "success" | "failed" | "neutral";
    title?: string;
    variant?: "desktop" | "mobile";
}

export const SectionStatus = ({
                           status,
                           title,
                           variant = "desktop",
                       }: SectionStatusProps) => (
    <div className="flex items-center gap-2 text-space-600">
        <div className="text-space-600 text-base" dir="rtl">
            {title}
        </div>
        <div
            className={`flex justify-center items-center rounded-full ${
                variant === "mobile" ? "w-8 h-8" : "w-15 h-15"
            } ${
                status === "success"
                    ? "bg-gradient-to-b from-[#32DE8A] to-[#32D284]"
                    : status === "failed"
                        ? "bg-persianred-400"
                        : variant === "mobile"
                            ? "bg-gradient-to-b from-[#E3E5EA] to-[#E9EBEF] shadow-[inset_0_-1px_2px_rgba(38,46,64,0.1)]"
                            : "bg-gradient-to-b from-[#E3E5EA] to-[#E9EBEF] shadow-[inset_0_-1px_4px_rgba(38,46,64,0.1)]"
            }`}
        >
            <div
                className={`flex items-center justify-center rounded-full ${
                    variant === "mobile" ? "w-6 h-6" : "w-12 h-12"
                } ${status === "neutral" ? "bg-transparent" : "bg-white"}`}
            >
        <span
            className={`${
                status === "neutral" ? "material-symbols-fill" : ""
            } material-symbols-rounded !font-bold ${
                status === "success"
                    ? `${
                        variant === "mobile"
                            ? "text-[#10BB67] text-[16px]"
                            : "!text-4xl text-[#10BB67]"
                    }`
                    : status === "failed"
                        ? `${
                            variant === "mobile"
                                ? "text-persianred-400 text-[16px]"
                                : "!text-4xl text-persianred-400"
                        }`
                        : `${
                            variant === "mobile"
                                ? "text-space-10 drop-shadow-[0_0_4px_rgba(38,46,64,0.1)] !text-[16px]"
                                : "text-space-10 drop-shadow-[0_0_6px_rgba(38,46,64,0.1)] !text-[26px]"
                        }`
            }`}
        >
          {status === "success"
              ? "check"
              : status === "failed"
                  ? "exclamation"
                  : "brightness_1"}
        </span>
            </div>
        </div>
    </div>
);

/* --------------------------- QuizCard --------------------------- */

interface QuizCardProps {
    xp?: ReactNode;
    time?: ReactNode;
    grade?: "S" | "A" | "B" | "C" | "D" | "F";
    frameless?: boolean;
    statusVisible?: boolean;
    title?: string;
}

function QuizCard({
                      xp,
                      time,
                      grade,
                      frameless = false,
                      statusVisible = true,
                      title = "Section",
                  }: QuizCardProps) {
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
                <button className="text-celestialblue-500 text-base flex gap-0 justify-center items-center h-16" dir={"rtl"}>
                    ارزیابی
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
            <>
                {statusVisible && (
                    <div className="absolute top-2 left-4 flex items-center gap-1" />
                )}
                {resultsSection}
            </>
        );
    }

    return (
        <Card
            padding="sm"
            rounded="2xl"
            flatEdges
            className={`relative overflow-hidden max-w-200 ${statusConfig.bg}`}
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
                <button
                    type="button"
                    className="px-5 py-2 rounded-full bg-celestialblue-400 text-white font-semibold text-sm"
                >
                    Evaluate
                </button>

                <SectionStatus status={status} title={title} variant="desktop" />
            </div>
        </Card>
    );
}

export default QuizCard;
