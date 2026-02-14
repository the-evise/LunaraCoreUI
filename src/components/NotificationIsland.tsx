"use client";

import {AnimatePresence, LayoutGroup, motion, useReducedMotion} from "motion/react";
import type {ReactNode} from "react";
import {useCallback, useEffect, useId, useMemo, useRef, useState} from "react";
import {cn} from "../utils/cn";
import NotificationAchievement from "./NotificationAchievement";
import NotificationBillingPlan from "./NotificationBillingPlan";
import NotificationDailyGoal from "./NotificationDailyGoal";
import NotificationMission from "./NotificationMission";
import NotificationNewLesson from "./NotificationNewLesson";
import NotificationSystemNotice from "./NotificationSystemNotice";

export type NotificationCategory =
    | "new-lesson"
    | "daily-goal"
    | "system-notice"
    | "billing-plan"
    | "mission"
    | "achievement";

export type NotificationBase = {
    id: string;
    type: NotificationCategory;
    badge?: string;
    priority?: number;
    timestamp?: string;
    subtitle?: ReactNode;
    scope?: "global" | "page";
    layoutId?: string;
    className?: string;
    onDismissStart?: () => void;
    onDismiss?: () => void;
};

export type NewLessonNotification = NotificationBase & {
    type: "new-lesson";
    title: string;
    image?: { src: string; alt?: string };
    lessonCount?: number;
    ctaLabel?: string;
    onCta?: () => void;
};

export type DailyGoalNotification = NotificationBase & {
    type: "daily-goal";
    title?: string;
    progress: number;
    target: number;
    unit?: string;
    ctaLabel?: string;
    onCta?: () => void;
};

export type SystemNoticeNotification = NotificationBase & {
    type: "system-notice";
    title: string;
    message: string;
    severity?: "info" | "warning" | "danger";
    battery?: { level: number; isCharging?: boolean };
    ctaLabel?: string;
    onCta?: () => void;
};

export type BillingPlanNotification = NotificationBase & {
    type: "billing-plan";
    planName: string;
    renewalDate: string;
    status?: "trial" | "active" | "expiring";
    priceLabel?: string;
    ctaLabel?: string;
    onCta?: () => void;
};

export type MissionNotification = NotificationBase & {
    type: "mission";
    title: string;
    progress: number;
    total: number;
    tag?: string;
    ctaLabel?: string;
    onCta?: () => void;
};

export type AchievementNotification = NotificationBase & {
    type: "achievement";
    title: string;
    reward?: string;
    streak?: number;
    xp?: number;
    ctaLabel?: string;
    onCta?: () => void;
};

export type NotificationIslandItem =
    | NewLessonNotification
    | DailyGoalNotification
    | SystemNoticeNotification
    | BillingPlanNotification
    | MissionNotification
    | AchievementNotification;

export type NotificationComponentMap = {
    "new-lesson": React.ComponentType<NewLessonNotification>;
    "daily-goal": React.ComponentType<DailyGoalNotification>;
    "system-notice": React.ComponentType<SystemNoticeNotification>;
    "billing-plan": React.ComponentType<BillingPlanNotification>;
    mission: React.ComponentType<MissionNotification>;
    achievement: React.ComponentType<AchievementNotification>;
};

export type NotificationIslandProps = {
    items?: NotificationIslandItem[];
    components?: Partial<NotificationComponentMap>;
    maxVisible?: number;
    order?: "priority" | "recent";
    displayMode?: "stack" | "queue";
    itemFilter?: (item: NotificationIslandItem) => boolean;
    renderQueueDismiss?: (args: {
        item: NotificationIslandItem;
        dismiss: () => void;
    }) => ReactNode;
    centerSlot?: ReactNode;
    emptyState?: ReactNode;
    className?: string;
    stackClassName?: string;
};

const defaultComponents: NotificationComponentMap = {
    "new-lesson": NotificationNewLesson,
    "daily-goal": NotificationDailyGoal,
    "system-notice": NotificationSystemNotice,
    "billing-plan": NotificationBillingPlan,
    mission: NotificationMission,
    achievement: NotificationAchievement,
};

export default function NotificationIsland({
    items = [],
    components,
    maxVisible,
    order = "priority",
    displayMode = "stack",
    itemFilter,
    renderQueueDismiss,
    centerSlot,
    emptyState,
    className,
    stackClassName,
}: NotificationIslandProps) {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const queueExitVariants = prefersReducedMotion
        ? undefined
        : {
              exit: (custom: {exitScale: number}) => ({
                  opacity: 0,
                  scale: custom.exitScale,
              }),
          };
    const sortedItems = useMemo(() => {
        const next = [...items];
        if (order === "priority") {
            next.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
            return next;
        }
        if (order === "recent") {
            next.sort((a, b) => {
                const timeA = a.timestamp ? Date.parse(a.timestamp) : 0;
                const timeB = b.timestamp ? Date.parse(b.timestamp) : 0;
                return timeB - timeA;
            });
        }
        return next;
    }, [items, order]);
    const filteredItems = useMemo(
        () => {
            const next = itemFilter ? sortedItems.filter(itemFilter) : sortedItems;
            return typeof maxVisible === "number"
                ? next.slice(0, Math.max(0, maxVisible))
                : next;
        },
        [itemFilter, maxVisible, sortedItems]
    );
    const [queueItems, setQueueItems] = useState<NotificationIslandItem[]>([]);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);
    const [displayedQueueItem, setDisplayedQueueItem] =
        useState<NotificationIslandItem | null>(null);
    const [isQueueTransitioning, setIsQueueTransitioning] = useState(false);
    const queueItemsRef = useRef<NotificationIslandItem[]>([]);
    const queueLayoutGroupId = useId();
    const sharedLayoutId = `notification-pill-${queueLayoutGroupId}`;
    const emptyDelayMs = 500;
    const hasSameQueueItems = useCallback(
        (prev: NotificationIslandItem[], next: NotificationIslandItem[]) =>
            prev.length === next.length &&
            prev.every(
                (item, index) =>
                    item.id === next[index]?.id && item === next[index]
            ),
        []
    );
    const queueSourceItems = useMemo(() => {
        if (displayMode !== "queue" || dismissedIds.length === 0) {
            return filteredItems;
        }
        const dismissedSet = new Set(dismissedIds);
        return filteredItems.filter((item) => !dismissedSet.has(item.id));
    }, [displayMode, dismissedIds, filteredItems]);

    useEffect(() => {
        if (displayMode === "queue") {
            setQueueItems((prev) => {
                if (queueSourceItems.length === 0) {
                    return prev.length === 0 ? prev : [];
                }
                const next = queueSourceItems;
                return hasSameQueueItems(prev, next) ? prev : next;
            });
        }
    }, [displayMode, hasSameQueueItems, queueSourceItems]);

    useEffect(() => {
        if (displayMode !== "queue") return;
        setDismissedIds((prev) => {
            const next = prev.filter((id) => filteredItems.some((item) => item.id === id));
            if (next.length === prev.length && next.every((id, index) => id === prev[index])) {
                return prev;
            }
            return next;
        });
    }, [displayMode, filteredItems]);

    useEffect(() => {
        if (displayMode !== "queue") {
            setDisplayedQueueItem(null);
            setIsQueueTransitioning(false);
        }
    }, [displayMode]);

    useEffect(() => {
        queueItemsRef.current = queueItems;
    }, [queueItems]);

    useEffect(() => {
        if (displayMode !== "queue") return;
        if (isQueueTransitioning) return;
        const nextItem = queueItems[0] ?? null;
        setDisplayedQueueItem((prev) => {
            if (!nextItem) return null;
            if (!prev) return nextItem;
            if (prev.id !== nextItem.id) return nextItem;
            return prev === nextItem ? prev : nextItem;
        });
    }, [displayMode, isQueueTransitioning, queueItems]);

    useEffect(() => {
        if (!isQueueTransitioning) return;
        const delayMs = prefersReducedMotion ? 0 : emptyDelayMs;
        const timeout = setTimeout(() => {
            const nextItem = queueItemsRef.current[0] ?? null;
            setDisplayedQueueItem(nextItem);
            setIsQueueTransitioning(false);
        }, delayMs);
        return () => clearTimeout(timeout);
    }, [emptyDelayMs, isQueueTransitioning, prefersReducedMotion]);

    const popQueueItem = useCallback((triggerDismissStart = false) => {
        setQueueItems((prev) => {
            const [current, ...rest] = prev;
            if (current?.id) {
                setDismissedIds((prevIds) =>
                    prevIds.includes(current.id)
                        ? prevIds
                        : [...prevIds, current.id]
                );
            }
            if (triggerDismissStart) {
                current?.onDismissStart?.();
            }
            if (current?.onDismiss) {
                current.onDismiss();
            }
            return rest;
        });
    }, []);

    const handleQueueDismiss = useCallback((options?: { triggerDismissStart?: boolean }) => {
        if (displayMode !== "queue") return;
        if (isQueueTransitioning) return;
        setDisplayedQueueItem(null);
        popQueueItem(Boolean(options?.triggerDismissStart));
        setIsQueueTransitioning(true);
    }, [displayMode, isQueueTransitioning, popQueueItem]);

    const hasItems =
        displayMode === "queue"
            ? Boolean(displayedQueueItem)
            : filteredItems.length > 0;

    const renderItem = <T extends NotificationIslandItem>(
        item: T,
        overrides?: Partial<T>
    ) => {
        const Component =
            components?.[item.type] ?? defaultComponents[item.type];
        if (!Component) return null;
        const TypedComponent = Component as React.ComponentType<T>;
        const mergedItem = overrides ? {...item, ...overrides} : item;
        return <TypedComponent {...mergedItem} />;
    };

    const stackedItems = (
        <div className={cn("flex flex-col gap-2", stackClassName)}>
            <AnimatePresence initial={false}>
                {filteredItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={
                            prefersReducedMotion
                                ? undefined
                                : {opacity: 0, y: -6}
                        }
                        animate={
                            prefersReducedMotion
                                ? undefined
                                : {opacity: 1, y: 0}
                        }
                        exit={
                            prefersReducedMotion
                                ? undefined
                                : {opacity: 0, y: -6}
                        }
                        transition={
                            prefersReducedMotion
                                ? undefined
                                : {
                                      duration: 0.2,
                                      ease: [0.33, 1, 0.68, 1],
                                      delay: index * 0.04,
                                  }
                        }
                    >
                        {renderItem(item)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
    const queuedItem = displayedQueueItem;
    const showQueueEmpty =
        Boolean(emptyState) &&
        (isQueueTransitioning || (!queuedItem && queueItems.length === 0));
    const queuedItems = (
        <div className={cn("flex flex-col gap-2", stackClassName)}>
            <LayoutGroup id={queueLayoutGroupId}>
                <div className="relative flex min-h-[40px] min-w-[230px] items-center justify-center">
                    <AnimatePresence initial={false} mode="wait">
                        {queuedItem ? (
                            <motion.div
                                key={queuedItem.id}
                                initial={false}
                                variants={queueExitVariants}
                                exit="exit"
                                custom={{exitScale: 0.98}}
                                transition={
                                    prefersReducedMotion
                                        ? undefined
                                        : {duration: 0.2, ease: [0.22, 1, 0.36, 1]}
                                }
                            >
                                {renderItem(queuedItem, {
                                    onDismiss: handleQueueDismiss,
                                    layoutId: sharedLayoutId,
                                })}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                    <AnimatePresence initial={false}>
                        {showQueueEmpty && emptyState ? (
                            <motion.div
                                key="queue-empty"
                                className="absolute inset-0 flex items-center justify-center"
                                initial={
                                    prefersReducedMotion ? undefined : {opacity: 0, scale: 0.98}
                                }
                                animate={
                                    prefersReducedMotion ? undefined : {opacity: 1, scale: 1}
                                }
                                exit={
                                    prefersReducedMotion ? undefined : {opacity: 0, scale: 0.98}
                                }
                                transition={
                                    prefersReducedMotion
                                        ? undefined
                                        : {duration: 0.2, ease: "easeOut"}
                                }
                            >
                                {emptyState}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </LayoutGroup>
            {queueItems.length > 0 && queuedItem
                ? renderQueueDismiss?.({
                      item: queuedItem,
                      dismiss: () => handleQueueDismiss({ triggerDismissStart: true }),
                  })
                : null}
        </div>
    );

    return (
        <div className={cn("w-full", className)}>
            <div className="flex-1 flex justify-center">
                <div className="min-w-[140px] max-w-[560px] w-full">
                    {centerSlot ??
                        (displayMode === "queue"
                            ? queuedItems
                            : hasItems
                                ? stackedItems
                                : emptyState ?? null)}
                </div>
            </div>
        </div>
    );
}
