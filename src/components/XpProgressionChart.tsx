"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    type TooltipProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "../utils/cn";

type XpPoint = {
    date: string;
    xp: number;
};

const defaultData: XpPoint[] = (() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
        const day = new Date(today);
        day.setDate(today.getDate() - (6 - index));
        day.setHours(12, 0, 0, 0);
        return {
            date: day.toISOString(),
            xp: 320 + Math.round(Math.random() * 260) + index * 40,
        };
    });
})();

const formatDate = (value: string, options: Intl.DateTimeFormatOptions): string => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString(undefined, options);
};

interface NormalizedPoint extends XpPoint {
    tickLabel: string;
    fullLabel: string;
}

const useNormalizedData = (data?: XpPoint[]): NormalizedPoint[] =>
    useMemo(() => {
        const base = (data ?? defaultData).slice(-7);
        return base.map((point) => ({
            ...point,
            tickLabel: formatDate(point.date, { weekday: "short" }),
            fullLabel: formatDate(point.date, { weekday: "long", month: "short", day: "numeric" }),
        }));
    }, [data]);

const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

type ChartTooltipPayload = {
    value?: ValueType;
    payload: NormalizedPoint;
};

type ChartTooltipProps = TooltipProps<ValueType, NameType> & {
    payload?: ChartTooltipPayload[];
};

const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (!active || !payload?.length) {
        return null;
    }

    const [{ value, payload: point }] = payload;
    const normalized = point;

    return (
        <div className="flex min-w-[140px] flex-col gap-2 rounded-xl border border-space-500/30 bg-space-900/95 px-4 py-3 text-space-150 shadow-xl backdrop-blur-xl">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-space-300">
                {normalized?.tickLabel ?? "Day"}
            </span>
            <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-base font-semibold text-space-50">
                        {numberFormatter.format(Number(value ?? 0))} XP
                    </span>
                    <span className="text-xs text-space-150">{normalized?.fullLabel}</span>
                </div>
                <span
                    className="material-symbols-rounded text-emerald-100"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24", fontSize: "24px" }}
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
}

const EASE = [0.33, 1, 0.68, 1] as const;

const XpProgressionChart = ({ data, className, showSummary = true }: XpProgressionChartProps) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(containerRef, { amount: 0.4, once: true });

    const normalizedData = useNormalizedData(data);

    const totalXp = useMemo(
        () => normalizedData.reduce((acc, point) => acc + point.xp, 0),
        [normalizedData],
    );

    const [displayTotal, setDisplayTotal] = useState(prefersReducedMotion ? totalXp : 0);
    const displayRef = useRef(displayTotal);
    const previousTotalRef = useRef(displayTotal);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        displayRef.current = displayTotal;
    }, [displayTotal]);

    useEffect(() => {
        if (prefersReducedMotion) {
            setDisplayTotal(totalXp);
            previousTotalRef.current = totalXp;
            return;
        }

        const startValue = previousTotalRef.current;
        if (startValue === totalXp) {
            return;
        }

        const delta = totalXp - startValue;
        const duration = 900;
        const startTime = performance.now();

        const update = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const nextValue = Math.round(startValue + delta * eased);
            setDisplayTotal(nextValue);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(update);
            } else {
                previousTotalRef.current = totalXp;
            }
        };

        animationFrameRef.current = requestAnimationFrame(update);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            previousTotalRef.current = displayRef.current;
        };
    }, [totalXp, prefersReducedMotion]);

    const latest = normalizedData[normalizedData.length - 1];
    const previous = normalizedData[normalizedData.length - 2];
    const latestChange = latest && previous ? latest.xp - previous.xp : 0;
    const average = normalizedData.length ? Math.round(totalXp / normalizedData.length) : 0;

    return (
        <motion.div
            ref={containerRef}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -18 }}
            whileInView={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.7, ease: EASE } }
            }
            viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.4 }}
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : {
                        y: 0,
                        scale: 0.99,
                        transition: { type: "spring", stiffness: 420, damping: 40, mass: 0.9 },
                    }
            }
            className={cn(
                "group flex w-full max-w-[680px] flex-col gap-6 rounded-3xl border border-space-100 bg-space-10 p-6 transition-all duration-150 ease-in-out hover:ring-2 hover:ring-space-200",
                className,
            )}
        >
            {showSummary ? (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-[2px]">
                        <span className="text-xs font-iransans font-medium uppercase tracking-[0.35em] text-space-400">
                            آخرین ۷ روز
                        </span>
                        <motion.span className="text-3xl font-semibold text-space-600">
                            {numberFormatter.format(displayTotal)} XP
                        </motion.span>
                        <span className="text-sm font-iransans text-space-300">
                            میانگین روزانه {numberFormatter.format(average)} امتیاز تجربه
                        </span>
                    </div>

                    <motion.div
                        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                        animate={
                            prefersReducedMotion
                                ? undefined
                                : { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.5, ease: EASE } }
                        }
                        whileHover={
                            prefersReducedMotion
                                ? undefined
                                : { scale: 0.96, transition: { type: "spring", stiffness: 320, damping: 20, mass: 0.8 } }
                        }
                        whileTap={
                            prefersReducedMotion
                                ? undefined
                                : { scale: 1, transition: { duration: 0.14, ease: EASE } }
                        }
                        className={cn(
                            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium select-none pointer-default self-end transition-colors duration-150",
                            latestChange >= 0
                                ? "bg-emerald-600/30 text-emerald-600 hover:bg-emerald-500/20"
                                : "bg-persianred-600/30 text-persianred-600 hover:bg-persianred-500/20",
                        )}
                    >
                        <span className="material-symbols-rounded text-lg">
                            {latestChange >= 0 ? "trending_up" : "trending_down"}
                        </span>
                        {latestChange >= 0 ? "+" : ""}
                        {numberFormatter.format(latestChange)}
                        <span className="font-iransans">امروز</span>
                    </motion.div>
                </div>
            ) : null}

            <div className="h-64 w-full lg:h-72">
                <ResponsiveContainer>
                    <AreaChart data={normalizedData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(214, 253, 230, 1)" />
                                <stop offset="100%" stopColor="rgba(214, 253, 230, 0.1)" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="rgba(1, 6, 1, 0.14)" strokeDasharray="3 3" horizontal vertical={false} />

                        <XAxis
                            dataKey="tickLabel"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={12}
                            tick={{ fill: "rgba(1, 6, 1, 0.6)", fontSize: 12, fontWeight: 500 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={16}
                            width={56}
                            tick={{ fill: "rgba(1, 6, 1, 0.6)", fontSize: 12 }}
                            tickFormatter={(value) => numberFormatter.format(Number(value))}
                        />

                        <Tooltip cursor={{ stroke: "rgba(53, 223, 139, 0.35)", strokeWidth: 30 }} content={<ChartTooltip />} />

                        <Area
                            type="monotoneX"
                            dataKey="xp"
                            stroke="rgb(25, 135, 77)"
                            strokeWidth={3}
                            fill="url(#xpGradient)"
                            activeDot={{
                                r: 6,
                                strokeWidth: 3,
                                stroke: "rgba(25, 135, 77, 1)",
                                fill: "rgba(246, 254, 249, 1)",
                            }}
                            dot={{ r: 4, strokeWidth: 3, fillOpacity: 1, fill: "rgba(190, 252, 216, 1)" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export type { XpPoint };
export default XpProgressionChart;
