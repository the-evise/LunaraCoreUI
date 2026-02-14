import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export type XpPoint = {
    date: string;
    xp: number;
};

export interface NormalizedXpPoint extends XpPoint {
    tickLabel: string;
    fullLabel: string;
}

const defaultPattern = [360, 410, 455, 520, 575, 620, 690];

const defaultData: XpPoint[] = (() => {
    const today = new Date();
    return defaultPattern.map((xp, index) => {
        const day = new Date(today);
        day.setDate(today.getDate() - (defaultPattern.length - 1 - index));
        day.setHours(12, 0, 0, 0);
        return {
            date: day.toISOString(),
            xp,
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

export const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
export const compactNumberFormatter = new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
});

type UseXpProgressionChartArgs = {
    data?: XpPoint[];
};

type UseXpProgressionChartResult = {
    prefersReducedMotion: boolean;
    normalizedData: NormalizedXpPoint[];
    hasData: boolean;
    totalXp: number;
    displayTotal: number;
    latestChange: number;
    latestLabel: string;
    average: number;
    peakPoint: NormalizedXpPoint | null;
    yDomain: [number, number];
    areaGradientId: string;
    strokeGradientId: string;
    lineGlowId: string;
};

const normalizeData = (data?: XpPoint[]): NormalizedXpPoint[] => {
    const base = (data?.length ? data : defaultData).slice(-7);
    return base.map((point) => ({
        ...point,
        tickLabel: formatDate(point.date, { weekday: "short" }),
        fullLabel: formatDate(point.date, { weekday: "long", month: "short", day: "numeric" }),
    }));
};

export const useXpProgressionChart = ({
    data,
}: UseXpProgressionChartArgs): UseXpProgressionChartResult => {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const normalizedData = useMemo(() => normalizeData(data), [data]);
    const chartId = useId().replace(/:/g, "");
    const areaGradientId = `xp-area-gradient-${chartId}`;
    const strokeGradientId = `xp-stroke-gradient-${chartId}`;
    const lineGlowId = `xp-line-glow-${chartId}`;

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
            setDisplayTotal(Math.round(startValue + delta * eased));

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
    }, [prefersReducedMotion, totalXp]);

    const latest = normalizedData[normalizedData.length - 1];
    const previous = normalizedData[normalizedData.length - 2];
    const latestChange = latest && previous ? latest.xp - previous.xp : 0;
    const average = normalizedData.length ? Math.round(totalXp / normalizedData.length) : 0;
    const latestLabel = latestChange >= 0 ? "up from previous day" : "down from previous day";

    const peakPoint = useMemo(
        () =>
            normalizedData.reduce<NormalizedXpPoint | null>(
                (peak, point) => (peak === null || point.xp > peak.xp ? point : peak),
                null,
            ),
        [normalizedData],
    );

    const yDomain = useMemo<[number, number]>(() => {
        if (!normalizedData.length) {
            return [0, 100];
        }
        const values = normalizedData.map((point) => point.xp);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const padding = Math.max(40, Math.round((maxValue - minValue) * 0.3));
        return [Math.max(0, minValue - padding), maxValue + padding];
    }, [normalizedData]);

    return {
        prefersReducedMotion,
        normalizedData,
        hasData: normalizedData.length > 0,
        totalXp,
        displayTotal,
        latestChange,
        latestLabel,
        average,
        peakPoint,
        yDomain,
        areaGradientId,
        strokeGradientId,
        lineGlowId,
    };
};
