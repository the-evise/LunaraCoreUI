import * as React from "react";
import Badge, {type BadgeProps} from "./Badge";
import Icon, { type IconWeight } from "./Icon";

type BadgeGrade = NonNullable<Extract<BadgeProps, {type: "grade"}>["grade"]>;

export type SkillGrade = BadgeGrade;

export type SkillItemProps = {
    title: string;
    grade?: SkillGrade;

    /** Material icon name */
    icon?: string;
    iconWeight?: IconWeight;
    iconFill?: boolean;

    /** Optional secondary text (not shown in screenshot, useful later) */
    subtitle?: string;

    /** Click handler */
    onClick?: () => void;

    /** Disabled state */
    disabled?: boolean | "LOCKED";

    /** Render skeleton placeholder */
    isLoading?: boolean;

    /** Optional id for testing */
    id?: string;
};

const GRADE_BACKGROUND: Record<BadgeGrade | "empty", string> = {
    S: "bg-emerald-10",
    A: "bg-emerald-10",
    B: "bg-emerald-10",
    C: "bg-space-50",
    D: "bg-persianred-10",
    F: "bg-persianred-50",
    empty: "bg-space-50",
};

function SkillItemComponent({
    title,
    grade,
    icon,
    iconWeight,
    iconFill = false,
    subtitle,
    onClick,
    disabled = false,
    isLoading = false,
    id,
}: SkillItemProps) {
    if (isLoading) {
        return (
            <div
                id={id}
                className="w-full min-w-[300px] flex h-[62px] items-center justify-between gap-4 rounded-full border border-space-100/60 bg-space-50/60 px-3 animate-pulse"
                aria-live="polite"
                aria-busy="true"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-space-100" />
                    <div className="space-y-2">
                        <div className="h-3 w-28 rounded-full bg-space-150" />
                        <div className="h-3 w-20 rounded-full bg-space-100" />
                    </div>
                </div>
                <div className="h-7 w-10 rounded-full bg-space-100" />
            </div>
        );
    }

    const isLocked = disabled === "LOCKED";
    const isDisabled = disabled === true || isLocked;
    const isClickable = !!onClick && !isDisabled;
    const resolvedGrade = grade ?? "empty";
    const backgroundClass = GRADE_BACKGROUND[resolvedGrade];
    const badgeAriaLabel = isLocked
        ? grade
            ? `Locked, Grade ${grade}`
            : "Locked"
        : grade
            ? `Grade ${grade}`
            : "No grade";

    return (
        <button
            id={id}
            type="button"
            onClick={isClickable ? onClick : undefined}
            disabled={!isClickable}
            className={[
                "w-full min-w-[300px]",
                "flex items-center justify-between gap-4",
                "rounded-full border border-space-150 hover:border-celestialblue-400",
                "px-1.5 py-1.5",
                "text-left",
                "disabled:hover:border-space-100 transition-colors ease-in-out duration-200 transition-transform",
                "cursor-pointer active:scale-[0.98] disabled:active:scale-100",
                backgroundClass,
            ].join(" ")}
            aria-disabled={!isClickable || undefined}
        >
            {/* Left: icon circle */}
            <div className="flex items-center gap-3">
                <div
                    className={[
                        "h-12 w-12 rounded-full border border-space-100",
                        "flex items-center justify-center",
                        "shrink-0",
                    ].join(" ")}
                    aria-hidden="true"
                >
                    {icon ? (
                        <Icon
                            name={icon}
                            size="lg"
                            weight={iconWeight}
                            isFill={iconFill}
                        />
                    ) : null}
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
                {isLocked ? (
                    <Badge type="locked" size="item" />
                ) : grade ? (
                    <Badge type="grade" grade={grade} size="item" />
                ) : (
                    <Badge type="empty" size="item" />
                )}
            </div>
        </button>
    );
}

const SkillItem = React.memo(SkillItemComponent, (prev, next) => (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    prev.grade === next.grade &&
    prev.icon === next.icon &&
    prev.iconWeight === next.iconWeight &&
    prev.iconFill === next.iconFill &&
    prev.disabled === next.disabled &&
    prev.isLoading === next.isLoading &&
    prev.onClick === next.onClick
));
SkillItem.displayName = "SkillItem";

export default SkillItem;
