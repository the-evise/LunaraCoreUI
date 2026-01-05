import {memo, useContext, useRef} from "react";
import {cva} from "class-variance-authority";
import {cn} from "../utils/cn";
import {motion, useAnimate, usePresence, PresenceContext} from "motion/react";

/* ----------------------------- Types ----------------------------- */

export type Section = "Review";

type TransitionDirection = 1 | -1;

export interface SectionIndicatorSkeletonProps {
    section: Section;
    direction: TransitionDirection;
}

/* ----------------------------- Card Variant ----------------------------- */

const cardSectionVariant = cva(
    "relative flex flex-col justify-center items-center rounded-3xl min-w-[260px] w-[70%] h-[450px] max-w-[400px] min-h-[280px] overflow-hidden z-10 transition-all duration-300 md:min-w-[658px] md:max-w-[760px] md:h-[320px] p-[5px] md:p-[10px] bg-[linear-gradient(180deg,rgba(222,229,242,1)_0%,rgba(255,255,255,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(74,83,100,1)_0%,rgba(41,50,68,1)_73%)]"
);

/* ----------------------------- Component ----------------------------- */

export const SectionIndicatorSkeleton = memo(function SectionIndicatorSkeleton({
                                                                                   section,
                                                                                   direction,
                                                                               }: SectionIndicatorSkeletonProps) {
    const [outerScope] = useAnimate();
    const [innerScope] = useAnimate();
    const [isPresent, safeToRemove] = usePresence();
    const presenceContext = useContext(PresenceContext);
    const motionDirection = (presenceContext?.custom as TransitionDirection | undefined) ?? direction;
    const enterDirRef = useRef<TransitionDirection>(motionDirection);

    /* ----------------------------- Layout ----------------------------- */

    return (
        <motion.div
            ref={outerScope}
            className={cn(cardSectionVariant())}
            key={"skeleton-" + section}
            initial={{opacity: 0, scale: 0.96, y: 8}}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {duration: 0.3, ease: [0.25, 1, 0.5, 1]},
            }}
            exit={{
                opacity: 0,
                scale: 0.97,
                y: -8,
                transition: {duration: 0.25, ease: [0.25, 0, 0.55, 1]},
            }}
            layout
        >

            {/* Outer background glows */}
            <div className="absolute top-80 left-1/2 w-[760px] h-[735px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] z-0 transition-all duration-300 bg-celestialblue-50/50 dark:bg-space-250/10" />

            <div
                className="absolute top-1/48 left-1/2 w-[274px] h-[265px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] z-0 transition-all duration-300 bg-celestialblue-100 dark:bg-celestialblue-100"
            />

            {/* Inner skeleton */}
            <motion.div
                ref={innerScope}
                layout
                className="relative flex-1 flex flex-col justify-center items-center rounded-[15px] bg-space-10/50 dark:bg-space-900 z-10 shadow-[0_0_6px_rgba(0,0,0,0.1)] w-full h-full p-[5px]"
            >
                <div className="flex flex-col gap-6 justify-between items-center w-full h-full mt-16 md:mt-20">
                    {/* Title + Subtitle placeholders  --gap_changed*/}
                    <div className="flex flex-col gap-[14px] justify-center items-center">
                        <div
                            className="w-[180px] h-[40px] md:w-[150px] md:h-[48px] bg-space-150 border-1 border-celestialblue-50 dark:bg-space-700 rounded-3xl"/>
                        <div
                            className="w-[150px] h-[32px] md:w-[292px] md:h-[66px] bg-space-100 border-1 border-space-150 dark:bg-space-800 rounded-full"/>
                    </div>

                    {/* Badge + Button placeholders */}
                    <div className="flex w-full flex-col items-center justify-center gap-6 md:mb-10">
                        <div
                            className="w-[60px] h-[36px] md:w-[90px] md:h-[54px] bg-space-100 dark:bg-space-700 rounded-xl"/>
                        <div className="w-full h-[54px] bg-space-100/70 dark:bg-space-700 rounded-[12px] md:hidden"/>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});
