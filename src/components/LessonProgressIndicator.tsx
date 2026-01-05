import {useEffect, useMemo, useRef, useState} from "react";
import Progress from "./Progress";
import {cn} from "../utils/cn";
import {motion, useAnimationControls, useInView, useReducedMotion} from "motion/react";
import {animate} from "motion";

interface LessonProgressIndicatorProps {
    progress: number;
    maxWidth?: number;
    tone?: "celestial" | "saffron" | "emerald" | "space";
    size?: "sm" | "md" | "lg";
    label?: string;
    className?: string;
}

function LessonProgressIndicator({
                                            progress,
                                            maxWidth = 860,
                                            tone = "space",
                                            size = "md",
                                            label,
                                            className,
                                        }: LessonProgressIndicatorProps) {
    const [isDark, setIsDark] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const controls = useAnimationControls();
    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(indicatorRef, {margin: "-20% 0px"});

    useEffect(() => {
        const root = document.documentElement;
        const observer = new MutationObserver(() =>
            setIsDark(root.classList.contains("dark"))
        );
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        setIsDark(root.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);

    const appliedTone = isDark ? "celestial" : tone;
    const clampedProgress = useMemo(() => Math.max(progress, 0), [progress]);

    useEffect(() => {
        if (prefersReducedMotion || !inView) {
            controls.set({opacity: 1, y: 0});
            return;
        }
        controls.start({opacity: 1, y: 0, transition: {duration: 0.45, ease: [0.2, 0.8, 0.2, 1]}});
    }, [controls, inView, prefersReducedMotion]);

    useEffect(() => {
        if (prefersReducedMotion || !indicatorRef) return;
        if (clampedProgress < 4.999) return;

        const pulse = animate([
            [
                indicatorRef,
                {scale: [1, 1.02, 1], boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 18px rgba(79, 104, 255, 0.3)", "0px 0px 0px rgba(0,0,0,0)"]},
                {duration: 0.6, ease: [0.33, 1, 0.68, 1]},
            ],
        ]);
        return () => pulse.stop();
    }, [clampedProgress, indicatorRef, prefersReducedMotion]);

    return (
        <motion.div
            ref={indicatorRef}
            className={cn("flex w-full flex-col items-center gap-2", className)}
            initial={prefersReducedMotion ? undefined : {opacity: 0, y: 16, scale: 0.98}}
            animate={controls}
        >
            {label && (
                <div className="text-sm text-space-300 w-full" style={{ maxWidth }}>
                    {label}
                </div>
            )}
            <Progress
                value={clampedProgress}
                tone={appliedTone}
                size={size}
                maxWidth={maxWidth}
                max={5}
                hasStrips
            />
        </motion.div>
    );
}

export default LessonProgressIndicator;
