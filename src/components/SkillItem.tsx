import * as React from "react";
import Badge, {type BadgeProps} from "./Badge";

type BadgeGrade = NonNullable<Extract<BadgeProps, {type: "grade"}>["grade"]>;

export type SkillGrade = BadgeGrade;

export type SkillItemProps = {
    title: string;
    grade?: SkillGrade;

    /** Icon element (SVG/component) */
    icon?: React.ReactNode;

    /** Optional secondary text (not shown in screenshot, useful later) */
    subtitle?: string;

    /** Click handler */
    onClick?: () => void;

    /** Disabled state */
    disabled?: boolean;

    /** Optional id for testing */
    id?: string;
};

export default function SkillItem({
                                      title,
                                      grade,
                                      icon,
                                      subtitle,
                                      onClick,
                                      disabled = false,
                                      id,
                                  }: SkillItemProps) {
    const isClickable = !!onClick && !disabled;
    const badgeGrade = grade;
    const gradeBackground: Record<BadgeGrade | "empty", string> = {
        S: "bg-emerald-10",
        A: "bg-emerald-10",
        B: "bg-emerald-10",
        C: "bg-space-50",
        D: "bg-persianred-10",
        F: "bg-persianred-50",
        empty: "bg-space-50",
    };
    const backgroundClass = gradeBackground[badgeGrade ?? "empty"];
    const badgeAriaLabel = badgeGrade ? `Grade ${badgeGrade}` : "No grade";

    return (
        <button
            id={id}
            type="button"
            onClick={onClick}
            disabled={!isClickable}
            className={[
                "w-full",
                "flex items-center justify-between gap-4",
                "rounded-full border",
                "px-1.5 py-1.5",
                "text-left",
                " disabled:cursor-not-allowed",
                backgroundClass,
            ].join(" ")}
            aria-disabled={!isClickable || undefined}
        >
            {/* Left: icon circle */}
            <div className="flex items-center gap-3">
                <div
                    className={[
                        "h-12 w-12 rounded-full border",
                        "flex items-center justify-center",
                        "shrink-0",
                    ].join(" ")}
                    aria-hidden="true"
                >
                    {icon}
                </div>

                {/* Center: title (+ optional subtitle) */}
                <div className="min-w-0">
                    <div className="font-semibold truncate">{title}</div>
                    {subtitle && (
                        <div className="text-sm opacity-70 truncate">{subtitle}</div>
                    )}
                </div>
            </div>

            {/* Right: grade */}
            <div className="shrink-0" aria-label={badgeAriaLabel}>
                {badgeGrade ? (
                    <Badge type="grade" grade={badgeGrade} size="item" />
                ) : (
                    <Badge type="empty" size="item" />
                )}
            </div>
        </button>
    );
}
