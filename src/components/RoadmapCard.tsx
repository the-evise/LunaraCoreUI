"use client";

import Card from "./Card";
import { formatRating } from "../utils/formatRating";
import Button from "./Button";
import Tooltip from "./Tooltip";

export type RoadmapCardProps = {
    title: string;
    description: string;

    /** 0-10 */
    rating: number;

    /** 0-100; undefined means locked unless `isLocked` is set */
    progress?: number;
    isLocked?: boolean;

    imageSrc?: string;
    imageAlt?: string;

    onNavigate?: () => void;

    /** Optional display-only level label */
    levelLabel?: string;
    actionLabel?: string;
    actionDisabled?: boolean;
    actionDisabledReason?: string;
    actionVariant?: "primary" | "secondary" | "quiz" | "ghost" | "outline";
};

export default function RoadmapCard({
    title,
    description,
    rating,
    progress,
    isLocked,
    imageSrc,
    imageAlt = "",
    onNavigate,
    levelLabel,
    actionLabel,
    actionDisabled,
    actionDisabledReason,
    actionVariant,
}: RoadmapCardProps) {
    const hasProgress = typeof progress === "number" && Number.isFinite(progress);
    const resolvedLocked = typeof isLocked === "boolean" ? isLocked : false;
    const resolvedProgress = hasProgress ? Math.min(100, Math.max(0, progress)) : 0;
    const isNew = !hasProgress && !resolvedLocked;
    const resolvedActionLabel = actionLabel ?? (isNew ? "Begin" : "Continue");
    const resolvedActionDisabled =
        actionDisabled ?? (resolvedLocked || typeof onNavigate === "undefined");
    const resolvedActionDisabledReason = resolvedActionDisabled
        ? actionDisabledReason
        : undefined;
    const resolvedActionVariant =
        actionVariant ?? (resolvedActionLabel === "Begin" ? "primary" : "ghost");
    const actionButton = (
        <Button
            type="button"
            onClick={onNavigate}
            disabled={resolvedActionDisabled}
            title={resolvedActionLabel}
            size="md"
            variant={resolvedActionVariant}
        >
            {resolvedActionLabel}
        </Button>
    );

    return (
        <Card
            tone="default"
            rounded="3xl"
            padding="sm"
            align="left"
            hoverable
            elevation="none"
            className="overflow-hidden font-iransans !min-w-[200px] !w-[300px] sm:!w-[368px] lg:!w-[880px]"
            aria-label={title}
        >
            <div className="flex w-full flex-col lg:flex-row">
                <div className="aspect-auto w-full max-w-[350px] min-h-[200px] overflow-hidden rounded-[10px] border border-space-150 bg-space-100 sm:min-h-[250px]">
                    {imageSrc && (
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                    {levelLabel && (
                        <span className="text-sm opacity-70">
                            {levelLabel}
                        </span>
                    )}

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-between">
                            <h3 className="text-xl font-extrabold lg:text-[36px]" dir="ltr">
                                {title}
                            </h3>

                            {!resolvedLocked && (
                                <div className="flex w-14 flex-col-reverse items-start gap-2">
                                    <div className="text-[12px]">
                                        {resolvedProgress}%
                                    </div>

                                    <div className="h-1 w-full rounded bg-gray-200">
                                        <div
                                            className="h-full rounded bg-green-600"
                                            style={{ width: `${resolvedProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="w-full text-[12px] leading-relaxed md:text-sm" dir="ltr">
                            {description}
                        </p>
                    </div>

                    <div className="mt-2 flex flex-row-reverse items-center justify-between">
                        {resolvedActionDisabled && resolvedActionDisabledReason ? (
                            <Tooltip content={resolvedActionDisabledReason} variant="solid" tone="persianred" size="lg" side="left">
                                {actionButton}
                            </Tooltip>
                        ) : (
                            actionButton
                        )}

                        <span className="rounded-sm border border-space-150 bg-space-10 px-3 py-1 text-[10px] font-medium text-celestialblue-700/50 [&>*:last-child]:text-celestialblue-600 [&>*:last-child]:text-sm md:text-[12px] [&>*:last-child]:md:text-base">
                            User rating: <span>{formatRating(rating)}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
