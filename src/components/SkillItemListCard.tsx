import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Card from "./Card";
import SkillItem, { type SkillGrade, type SkillItemProps } from "./SkillItem";

export type SkillItemModel = {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    iconWeight?: SkillItemProps["iconWeight"];
    iconFill?: SkillItemProps["iconFill"];
    grade?: SkillGrade;

    /** Optional: user cannot access */
    disabled?: boolean | "LOCKED";
};

export type SkillItemListCardProps = {
    /** Optional header for the card */
    title?: string;
    skills: SkillItemModel[];
    secondarySkills?: SkillItemModel[];

    /** Which skill is currently active (learning now) */
    activeSkillId?: string;

    /** Click handler */
    onSkillSelect?: (skillId: string) => void;

    /** Optional: card footer slot */
    footer?: React.ReactNode;

    /** Render skeleton state instead of skills */
    isLoading?: boolean;

    /** Number of skeleton rows when loading */
    skeletonCount?: number;

    /** Optional id for testing */
    id?: string;
};

type SkillRowProps = {
    skill: SkillItemModel;
    isActive: boolean;
    onSkillSelect?: (skillId: string) => void;
};

const SkillRow = React.memo(function SkillRow({ skill, isActive, onSkillSelect }: SkillRowProps) {
    const isDisabled = !!skill.disabled;
    const handleClick = React.useCallback(() => {
        if (!isDisabled && onSkillSelect) {
            onSkillSelect(skill.id);
        }
    }, [isDisabled, onSkillSelect, skill.id]);

    return (
        <div className="relative rounded-full bg-transparent border-transparent">
            {isActive && (
                <>
                    <ChevronRightIcon
                        className="pointer-events-none absolute -left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-celestialblue-400"
                        aria-hidden="true"
                    />
                    <ChevronLeftIcon
                        className="pointer-events-none absolute -right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-celestialblue-400"
                        aria-hidden="true"
                    />
                </>
            )}
            <SkillItem
                id={skill.id}
                title={skill.title}
                subtitle={skill.subtitle}
                icon={skill.icon}
                iconWeight={skill.iconWeight}
                iconFill={skill.iconFill}
                grade={skill.grade}
                disabled={skill.disabled}
                onClick={isDisabled ? undefined : handleClick}
            />
        </div>
    );
}, (prev, next) => (
    prev.isActive === next.isActive &&
    prev.onSkillSelect === next.onSkillSelect &&
    prev.skill.id === next.skill.id &&
    prev.skill.title === next.skill.title &&
    prev.skill.subtitle === next.skill.subtitle &&
    prev.skill.icon === next.skill.icon &&
    prev.skill.iconWeight === next.skill.iconWeight &&
    prev.skill.iconFill === next.skill.iconFill &&
    prev.skill.grade === next.skill.grade &&
    prev.skill.disabled === next.skill.disabled
));

export default function SkillItemListCard({
                                              title,
                                              skills,
                                              secondarySkills,
                                              activeSkillId,
                                              onSkillSelect,
                                              footer,
                                              isLoading = false,
                                              skeletonCount = 5,
                                              id,
                                          }: SkillItemListCardProps) {
    const hasSecondPage = secondarySkills !== undefined;

    const resolveActivePage = React.useCallback(() => {
        if (!activeSkillId) {
            return 0;
        }
        if (skills.some((skill) => skill.id === activeSkillId)) {
            return 0;
        }
        if (secondarySkills?.some((skill) => skill.id === activeSkillId)) {
            return 1;
        }
        return 0;
    }, [activeSkillId, skills, secondarySkills]);

    const [pageIndex, setPageIndex] = React.useState(resolveActivePage);

    React.useEffect(() => {
        if (!activeSkillId) {
            return;
        }
        const resolved = resolveActivePage();
        setPageIndex((current) => (current === resolved ? current : resolved));
    }, [activeSkillId, resolveActivePage]);

    const visibleSkills = React.useMemo(
        () => (pageIndex === 0 ? skills : secondarySkills ?? []),
        [pageIndex, skills, secondarySkills]
    );
    const canGoPrev = pageIndex > 0;
    const canGoNext = hasSecondPage && pageIndex === 0;
    const handlePrevPage = React.useCallback(() => {
        setPageIndex(0);
    }, []);
    const handleNextPage = React.useCallback(() => {
        setPageIndex(1);
    }, []);
    const normalizedSkeletonCount = Number.isFinite(skeletonCount)
        ? Math.max(1, Math.floor(skeletonCount))
        : 5;
    const skeletonRows = React.useMemo(
        () => Array.from({ length: normalizedSkeletonCount }, (_, index) => index),
        [normalizedSkeletonCount]
    );

    return (
        <div
            id={id}
        >
            <Card className={"lesson-panel-shell space-y-2"} tone={"default"} rounded={"2xl"} align={"center"} padding={"sm"} hoverable={false} flatEdges>
                    <div className="flex flex-col gap-2 w-full p-4">
                        {isLoading ? (
                            <div
                                className="space-y-4 animate-pulse"
                                aria-live="polite"
                                aria-busy="true"
                            >
                                {skeletonRows.map((rowIndex) => (
                                    <div
                                        key={`skill-skeleton-${rowIndex}`}
                                        className="flex h-[62px] items-center gap-4 rounded-full border border-space-100/60 bg-space-50/60 px-4"
                                    >
                                        <div className="h-9 w-9 rounded-full bg-space-100" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-40 rounded-full bg-space-150" />
                                            <div className="h-3 w-24 rounded-full bg-space-100" />
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-space-100" />
                                    </div>
                                ))}
                            </div>
                        ) : visibleSkills.length ? (
                            visibleSkills.map((skill) => (
                                <SkillRow
                                    key={skill.id}
                                    skill={skill}
                                    isActive={activeSkillId === skill.id && !skill.disabled}
                                    onSkillSelect={onSkillSelect}
                                />
                            ))
                        ) : (
                            <div className="rounded-full border border-dashed border-space-150 px-4 py-3 text-sm text-space-400">
                                No skills available for this page yet.
                            </div>
                        )}
                    </div>

                    {hasSecondPage && !isLoading && (
                        <div className="flex w-full items-center justify-between px-4 pb-1 text-xs text-space-400">
                            <span>Page {pageIndex + 1} of 2</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrevPage}
                                    disabled={!canGoPrev}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-space-150 text-space-500 transition disabled:opacity-40"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={!canGoNext}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-space-150 text-space-500 transition disabled:opacity-40"
                                    aria-label="Next page"
                                >
                                    <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    )}

                    {footer && <div className="pt-2 text-space-200 italic">{footer}</div>}
            </Card>
        </div>
    );
}
