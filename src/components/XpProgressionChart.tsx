"use client";

import { useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
    type TooltipProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { motion } from "motion/react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import Tooltip from "./Tooltip";
import {
    compactNumberFormatter,
    numberFormatter,
    useXpProgressionChart,
    type NormalizedXpPoint,
    type XpPoint,
} from "../hooks/useXpProgressionChart";

type ChartTooltipPayload = {
    value?: ValueType;
    payload: ChartPoint;
};

type ChartTooltipProps = TooltipProps<ValueType, NameType> & {
    payload?: ChartTooltipPayload[];
};

const styles = {
    shell: cva(
        "relative isolate flex w-full flex-col overflow-hidden",
        {
            variants: {
                shellVariant: {
                    default:
                        "max-w-[760px] gap-5 rounded-[28px] border border-space-100/80 bg-white p-5 shadow-[0_16px_34px_rgba(31,48,83,0.1)] sm:p-6",
                    card:
                        "group dashboard-card justify-between gap-4 rounded-3xl bg-celestialblue-50/70 p-4 text-space-900 ring-1 ring-celestialblue-100/70 transition-colors duration-300 ease-out select-none sm:p-5",
                },
            },
            defaultVariants: {
                shellVariant: "default",
            },
        },
    ),
    glowTop: cva(
        "pointer-events-none absolute rounded-full bg-celestialblue-100/45 blur-3xl",
        {
            variants: {
                shellVariant: {
                    default: "-right-16 -top-16 h-56 w-56",
                    card: "-right-20 -top-20 h-44 w-44 opacity-70",
                },
            },
            defaultVariants: {
                shellVariant: "default",
            },
        },
    ),
    glowBottom: cva(
        "pointer-events-none absolute rounded-full bg-emerald-100/35 blur-3xl",
        {
            variants: {
                shellVariant: {
                    default: "-bottom-16 -left-16 h-52 w-52",
                    card: "-bottom-20 -left-20 h-40 w-40 opacity-70",
                },
            },
            defaultVariants: {
                shellVariant: "default",
            },
        },
    ),
    tooltip: cva(
        "min-w-[168px] rounded-2xl border border-celestialblue-100/80 bg-white/95 px-3 py-3 shadow-[0_14px_30px_rgba(36,59,96,0.16)] backdrop-blur-lg",
    ),
    tooltipKicker: cva("text-[10px] font-semibold uppercase tracking-[0.24em] text-space-400"),
    tooltipContent: cva("mt-2 flex items-end justify-between gap-4"),
    tooltipValueBlock: cva("space-y-1"),
    tooltipValue: cva("text-lg font-semibold leading-none text-space-800"),
    tooltipDate: cva("text-xs text-space-500"),
    tooltipMeta: cva("mt-1 text-[11px] text-space-500"),
    summary: cva("relative space-y-4"),
    summaryHeader: cva("flex flex-wrap items-start justify-between gap-4"),
    summaryLead: cva("space-y-2"),
    summaryTag: cva("inline-flex items-center gap-2 rounded-full border border-space-150 bg-space-50/85 px-3 py-1"),
    summaryTagLabel: cva("text-[10px] font-semibold uppercase tracking-[0.24em] text-space-500"),
    summaryTotal: cva("text-3xl font-semibold leading-none text-space-900 sm:text-4xl"),
    summaryTotalCaption: cva("mt-1 text-sm text-space-500"),
    deltaBlock: cva("flex flex-col items-end gap-2"),
    deltaBadge: cva(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        {
            variants: {
                trend: {
                    up: "border-emerald-200 bg-emerald-50/85 text-emerald-700",
                    down: "border-persianred-200 bg-persianred-50/85 text-persianred-700",
                },
            },
            defaultVariants: {
                trend: "up",
            },
        },
    ),
    deltaBadgeTrigger: cva("cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-300"),
    deltaInfoIcon: cva("material-symbols-rounded !text-[14px] !font-normal opacity-80"),
    statsGrid: cva("grid gap-2 sm:grid-cols-3"),
    statCard: cva("rounded-2xl border border-space-100 bg-space-25/85 px-3 py-2"),
    statLabel: cva("text-[10px] font-semibold uppercase tracking-[0.22em] text-space-400"),
    statValue: cva("mt-1 text-base font-semibold text-space-800"),
    cardOverview: cva(
        "relative flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-celestialblue-100/80 bg-white/70 px-3 py-3",
    ),
    cardOverviewLead: cva("min-w-[180px] space-y-1"),
    cardOverviewKickerRow: cva("inline-flex items-center gap-1.5"),
    cardOverviewKicker: cva("text-[10px] font-semibold uppercase tracking-[0.22em] text-celestialblue-700"),
    cardOverviewValue: cva("text-2xl font-semibold leading-none text-space-900"),
    cardOverviewLabel: cva("text-xs text-space-500"),
    cardOverviewMeta: cva("flex flex-col items-start gap-1 sm:items-end"),
    chartFrame: cva("relative rounded-2xl p-3", {
        variants: {
            shellVariant: {
                default: "border border-space-100/80 bg-space-10/65 sm:p-4",
                card: "border border-celestialblue-100/70 bg-white/75 sm:p-3",
            },
        },
        defaultVariants: {
            shellVariant: "default",
        },
    }),
    chartBody: cva("w-full", {
        variants: {
            shellVariant: {
                default: "h-52 sm:h-60",
                card: "h-44 sm:h-48",
            },
        },
        defaultVariants: {
            shellVariant: "default",
        },
    }),
    emptyState: cva(
        "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-space-200 bg-white/70 text-center",
        {
            variants: {
                shellVariant: {
                    default: "h-52 sm:h-60",
                    card: "h-44 sm:h-48",
                },
            },
            defaultVariants: {
                shellVariant: "default",
            },
        },
    ),
    emptyIcon: cva("material-symbols-rounded !text-4xl text-space-300"),
    emptyTitle: cva("text-sm font-semibold text-space-600"),
    emptyCaption: cva("text-xs text-space-500"),
};

type ChartPoint = NormalizedXpPoint & {
    previousXp?: number;
};

const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (!active || !payload?.length) {
        return null;
    }

    const [{ value, payload: point }] = payload;
    const numericValue = Number(value ?? 0);
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
    const previousNumericValue = Number(point?.previousXp);
    const hasPreviousValue = Number.isFinite(previousNumericValue);
    const previousValue = hasPreviousValue ? previousNumericValue : 0;
    const deltaFromPrevious = safeValue - previousValue;

    return (
        <div className={styles.tooltip()}>
            <p className={styles.tooltipKicker()}>
                {point?.tickLabel ?? "Day"}
            </p>
            <div className={styles.tooltipContent()}>
                <div className={styles.tooltipValueBlock()}>
                    <p className={styles.tooltipValue()}>
                        {numberFormatter.format(safeValue)} XP
                    </p>
                    <p className={styles.tooltipDate()}>{point?.fullLabel}</p>
                    <p className={styles.tooltipMeta()}>
                        {hasPreviousValue
                            ? `From previous day: ${numberFormatter.format(previousValue)} XP (${deltaFromPrevious >= 0 ? "+" : ""}${numberFormatter.format(deltaFromPrevious)} XP)`
                            : "From previous day: n/a"}
                    </p>
                </div>
                <span
                    className="material-symbols-rounded text-celestialblue-600"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24", fontSize: "20px" }}
                >
                    bolt
                </span>
            </div>
        </div>
    );
};

interface XpProgressionChartProps {
    data?: XpPoint[];
    className?: string;
    showSummary?: boolean;
    shellVariant?: "default" | "card";
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const XpProgressionChart = ({
    data,
    className,
    showSummary = true,
    shellVariant = "default",
}: XpProgressionChartProps) => {
    const {
        prefersReducedMotion,
        normalizedData,
        hasData,
        displayTotal,
        latestChange,
        latestLabel,
        average,
        peakPoint,
        yDomain,
        areaGradientId,
        strokeGradientId,
        lineGlowId,
    } = useXpProgressionChart({ data });
    const isCardVariant = shellVariant === "card";
    const shouldRenderSummary = showSummary && !isCardVariant;
    const latestPoint = normalizedData[normalizedData.length - 1];
    const latestPointDate = latestPoint ? new Date(latestPoint.date) : null;
    const now = new Date();
    const isLatestPointToday = latestPointDate
        ? latestPointDate.getFullYear() === now.getFullYear() &&
          latestPointDate.getMonth() === now.getMonth() &&
          latestPointDate.getDate() === now.getDate()
        : false;
    const currentDayKicker = isLatestPointToday ? "Today XP" : "Latest XP";
    const currentDayXp = latestPoint?.xp ?? 0;
    const currentDayLabel = latestPoint?.fullLabel ?? "No day available";
    const chartData = useMemo<ChartPoint[]>(
        () =>
            normalizedData.map((point, index) => ({
                ...point,
                previousXp: index > 0 ? normalizedData[index - 1]?.xp : undefined,
            })),
        [normalizedData],
    );

    return (
        <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }
            }
            viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.3 }}
            className={cn(
                styles.shell({ shellVariant }),
                className,
            )}
        >
            <span className={styles.glowTop({ shellVariant })} />
            <span className={styles.glowBottom({ shellVariant })} />

            {shouldRenderSummary ? (
                <div className={styles.summary()}>
                    <div className={styles.summaryHeader()}>
                        <div className={styles.summaryLead()}>
                            <div>
                                <p className={styles.summaryTotal()}>
                                    {numberFormatter.format(displayTotal)} XP
                                </p>
                                <p className={styles.summaryTotalCaption()}>
                                    Last {normalizedData.length || 0} days activity
                                </p>
                            </div>
                        </div>

                        <div className={styles.deltaBlock()}>
                            <Tooltip
                                content={latestLabel}
                                side="bottom"
                                align="end"
                                size="sm"
                                variant="soft"
                                tone={latestChange >= 0 ? "emerald" : "persianred"}
                            >
                                <button
                                    type="button"
                                    aria-label={latestLabel}
                                    className={cn(
                                        styles.deltaBadge({
                                            trend: latestChange >= 0 ? "up" : "down",
                                        }),
                                        styles.deltaBadgeTrigger(),
                                    )}
                                >
                                    <span className="material-symbols-rounded !text-base">
                                        {latestChange >= 0 ? "trending_up" : "trending_down"}
                                    </span>
                                    {latestChange >= 0 ? "+" : ""}
                                    {numberFormatter.format(latestChange)} XP
                                    <span className={styles.deltaInfoIcon()}>info</span>
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className={styles.statsGrid()}>
                        <div className={styles.statCard()}>
                            <p className={styles.statLabel()}>
                                Avg / day
                            </p>
                            <p className={styles.statValue()}>
                                {numberFormatter.format(average)}
                            </p>
                        </div>
                        <div className={styles.statCard()}>
                            <p className={styles.statLabel()}>
                                Peak day
                            </p>
                            <p className={styles.statValue()}>
                                {peakPoint ? numberFormatter.format(peakPoint.xp) : "-"}
                            </p>
                        </div>
                        <div className={styles.statCard()}>
                            <p className={styles.statLabel()}>
                                Peak label
                            </p>
                            <p className={styles.statValue()}>
                                {peakPoint?.tickLabel ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            {isCardVariant ? (
                <div className={styles.cardOverview()}>
                    <div className={styles.cardOverviewLead()}>
                        <div className={styles.cardOverviewKickerRow()}>
                            <span className="material-symbols-rounded !text-base text-celestialblue-600">
                                auto_graph
                            </span>
                            <span className={styles.cardOverviewKicker()}>{currentDayKicker}</span>
                        </div>
                        <p className={styles.cardOverviewValue()}>
                            {numberFormatter.format(currentDayXp)} XP
                        </p>
                        <p className={styles.cardOverviewLabel()}>{currentDayLabel}</p>
                    </div>

                    <div className={styles.cardOverviewMeta()}>
                        <div
                            className={styles.deltaBadge({
                                trend: latestChange >= 0 ? "up" : "down",
                            })}
                        >
                            <span className="material-symbols-rounded !text-base">
                                {latestChange >= 0 ? "trending_up" : "trending_down"}
                            </span>
                            {latestChange >= 0 ? "+" : ""}
                            {numberFormatter.format(latestChange)} XP
                        </div>
                    </div>
                </div>
            ) : null}

            <div className={styles.chartFrame({ shellVariant })}>
                {hasData ? (
                    <div className={styles.chartBody({ shellVariant })}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(79, 146, 255, 0.42)" />
                                        <stop offset="70%" stopColor="rgba(80, 195, 148, 0.16)" />
                                        <stop offset="100%" stopColor="rgba(80, 195, 148, 0.02)" />
                                    </linearGradient>
                                    <linearGradient id={strokeGradientId} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="rgba(67, 129, 232, 0.95)" />
                                        <stop offset="100%" stopColor="rgba(41, 172, 121, 0.95)" />
                                    </linearGradient>
                                    <filter id={lineGlowId} x="-40%" y="-40%" width="180%" height="180%">
                                        <feDropShadow
                                            dx="0"
                                            dy="2"
                                            stdDeviation="3.5"
                                            floodColor="rgba(67, 129, 232, 0.35)"
                                        />
                                    </filter>
                                </defs>

                                <CartesianGrid
                                    stroke="rgba(126, 144, 170, 0.22)"
                                    strokeDasharray="4 6"
                                    horizontal
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="tickLabel"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    tick={{ fill: "rgba(83, 97, 121, 0.82)", fontSize: 11, fontWeight: 600 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={12}
                                    width={42}
                                    domain={yDomain}
                                    tick={{ fill: "rgba(83, 97, 121, 0.72)", fontSize: 11, fontWeight: 500 }}
                                    tickFormatter={(value) => compactNumberFormatter.format(Number(value))}
                                />

                                <RechartsTooltip
                                    cursor={{ stroke: "rgba(66, 122, 212, 0.22)", strokeWidth: 22 }}
                                    content={<ChartTooltip />}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="xp"
                                    stroke={`url(#${strokeGradientId})`}
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    fill={`url(#${areaGradientId})`}
                                    activeDot={{
                                        r: 5,
                                        strokeWidth: 3,
                                        stroke: "rgba(57, 122, 224, 1)",
                                        fill: "rgba(255, 255, 255, 1)",
                                    }}
                                    dot={{
                                        r: 3.25,
                                        strokeWidth: 2,
                                        stroke: "rgba(57, 122, 224, 0.72)",
                                        fill: "rgba(220, 236, 255, 1)",
                                    }}
                                    style={{ filter: `url(#${lineGlowId})` }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className={styles.emptyState({ shellVariant })}>
                        <span className={styles.emptyIcon()}>bar_chart_off</span>
                        <p className={styles.emptyTitle()}>No XP data available</p>
                        <p className={styles.emptyCaption()}>Add progress points to visualize weekly growth.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export type { XpPoint };
export default XpProgressionChart;
