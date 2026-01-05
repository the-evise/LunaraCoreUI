import { cva } from "class-variance-authority";
import LessonIndicator from "./LessonIndicator";
import IconButton from "./IconButton";
import LessonProgressIndicator from "./LessonProgressIndicator";
import Badge, {BadgeProps} from "./Badge";
import BreadcrumbBar from "./BreadcrumbBar";
import Subtitle from "./Subtitle";
import { cn } from "../utils/cn";
import { AnimatePresence, PresenceContext, motion, useAnimate, usePresence } from "motion/react";
import {memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import EmptySection from "./EmptySection";
import {transform, type AnimationPlaybackControls} from "motion";

/* -------------------------------- Types -------------------------------- */

export type Section = "Vocabulary" | "Reading" | "Grammar" | "Review" | "Quiz";

export const sectionMap: Record<number, Section> = {
    1: "Vocabulary",
    2: "Reading",
    3: "Grammar",
    4: "Review",
    5: "Quiz",
};

const sectionKeys = Object.keys(sectionMap).map(Number);
const minSectionIndex = Math.min(...sectionKeys);
const maxSectionIndex = Math.max(...sectionKeys);

/* -------------------------------- Title -------------------------------- */

type TitleProps = { section: Section; className?: string };

const titleVariants = cva("!text-section-mobile md:!text-section", {
    variants: {
        section: {
            Vocabulary: "text-saffron-600 dark:text-saffron-150",
            Reading: "text-celestialblue-600 dark:text-celestialblue-150",
            Grammar: "text-persianred-600 dark:text-persianred-150",
            Review: "text-space-600 dark:text-space-150",
            Quiz: "text-emerald-600 dark:text-emerald-150",
        },
    },
});

function Title({ section, className }: TitleProps) {
    return (
        <motion.h1
            className={cn(titleVariants({ section }), className)}
            key={"title-" + section}
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.22, ease: [0.25, 1, 0.5, 1] },
            }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
        >
            {section}
        </motion.h1>
    );
}

/* ------------------------- Section Indicator ------------------------- */

const cardSectionVariants = cva(
    "relative flex flex-col justify-center items-center rounded-3xl min-w-[260px] w-[70%] h-[450px] max-w-[400px] min-h-[280px] border-1 border-space-10 dark:border-space-500 overflow-hidden box-content z-10 transition-all duration-300 md:border-2 md:min-w-[658px] md:max-w-[760px] md:h-[320px] p-[5px] md:p-[10px]",
    {
        variants: {
            section: {
                Vocabulary:
                    "bg-[linear-gradient(180deg,rgba(251,215,121,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(240,189,63,1)_0%,rgba(41,50,68,1)_73%)]",
                Reading:
                    "bg-[linear-gradient(180deg,rgba(107,212,249,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(29,129,192,1)_0%,rgba(41,50,68,1)_73%)]",
                Grammar:
                    "bg-[linear-gradient(180deg,rgba(255,143,131,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(155,15,24,1)_0%,rgba(41,50,68,1)_73%)]",
                Review:
                    "bg-[linear-gradient(180deg,rgba(177,187,206,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(74,83,100,1)_0%,rgba(41,50,68,1)_73%)]",
                Quiz: "bg-[linear-gradient(180deg,rgba(139,253,188,1)_0%,rgba(177,187,206,1)_73%)] dark:bg-[linear-gradient(180deg,rgba(14,177,106,1)_0%,rgba(41,50,68,1)_73%)]",
            },
        },
    }
);

type TransitionDirection = 1 | -1;
type DragInfo = { offset: { x: number }; velocity: { x: number } };
type SectionIndicatorProps = {
    section: Section;
    direction: TransitionDirection;
    isDraggable: boolean;
    canGoPrev: boolean;
    canGoNext: boolean;
    onDragNavigate?: (direction: TransitionDirection) => void;
};

export const SectionIndicator = memo(function SectionIndicator({
                                                                   section,
                                                                   direction,
                                                                   isDraggable,
                                                                   canGoPrev,
                                                                   canGoNext,
                                                                   onDragNavigate,
                                                               }: SectionIndicatorProps) {
    const [outerScope, animateOuter] = useAnimate();
    const [innerScope, animateInner] = useAnimate();
    const [isPresent, safeToRemove] = usePresence();
    const presenceContext = useContext(PresenceContext);
    const motionDirection =
        (presenceContext?.custom as TransitionDirection | undefined) ?? direction;

    const enterEase: any = [0.25, 1, 0.5, 1];
    const exitEase: any = [0.25, 0, 0.55, 1];
    const enterDirRef = useRef<TransitionDirection>(motionDirection);
    enterDirRef.current = motionDirection;

    // --- Enter ---
    useEffect(() => {
        const outer = outerScope.current;
        const inner = innerScope.current;
        if (!outer || !inner) return;

        const enterX = enterDirRef.current * 10;
        animateOuter(outer, { scale: 0.985, opacity: 0.1 }, { duration: 0 });
        animateInner(inner, { scale: 0.97, opacity: 0, filter: "blur(4px)", x: enterX }, { duration: 0 });

        Promise.all([
            animateOuter(outer, { scale: [0.9, 1.1, 1], opacity: 1 }, { duration: 0.3, ease: enterEase }),
            animateInner(
                inner,
                {
                    opacity: [0, 1],
                    x: [enterX, 0],
                    scale: [0.97, 1.005, 1],
                    filter: ["blur(4px)", "blur(0px)"],
                },
                { duration: 0.35, ease: enterEase, delay: 0.03 }
            ),
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Exit ---
    useEffect(() => {
        if (isPresent) return;
        const outer = outerScope.current;
        const inner = innerScope.current;
        if (!outer || !inner) return;

        const exitX = enterDirRef.current * -8;
        Promise.all([
            animateInner(inner, { opacity: 0, scale: 0.985, filter: "blur(2px)", x: [0, exitX] }, { duration: 0.22, ease: exitEase }),
            animateOuter(outer, { scale: [1, 1.1, 0.985], opacity: 0.95 }, { duration: 0.24, ease: exitEase }),
        ]).then(() => safeToRemove?.());
    }, [isPresent, animateOuter, animateInner, safeToRemove]);

    const handleDragEnd = useCallback(
        (_event: PointerEvent | MouseEvent | TouchEvent, info: DragInfo) => {
            if (!isDraggable) return;
            const projected = info.offset.x + info.velocity.x * 0.2;
            const threshold = 100;
            if (projected > threshold && canGoPrev) {
                onDragNavigate?.(-1);
            } else if (projected < -threshold && canGoNext) {
                onDragNavigate?.(1);
            }
        },
        [canGoNext, canGoPrev, isDraggable, onDragNavigate],
    );

    const dragProps = useMemo(() => {
        if (!isDraggable || (!canGoPrev && !canGoNext)) {
            return {};
        }
        const constraint = 60;
        return {
            drag: "x" as const,
            dragElastic: 0.2,
            dragMomentum: false,
            dragSnapToOrigin: true,
            dragConstraints: {
                left: canGoNext ? -constraint : 0,
                right: canGoPrev ? constraint : 0,
            } as const,
            onDragEnd: handleDragEnd,
        };
    }, [canGoNext, canGoPrev, handleDragEnd, isDraggable]);

    const sharedControlsRef = useRef<AnimationPlaybackControls | null>(null);
    const interactionStateRef = useRef({hovered: false, pressed: false});
    const lastPointerTypeRef = useRef<PointerEvent["pointerType"] | null>(null);

    const applySharedAnimation = useCallback(
        (state: {hovered: boolean; pressed: boolean}) => {
            const node = innerScope.current;
            if (!node) {
                return;
            }

            sharedControlsRef.current?.stop();

            const {hovered, pressed} = state;
            const cardScale = hovered || pressed ? 0.98 : 1;
            const badgeScale = pressed ? 0.97 : hovered ? 1.04 : 1;
            const badgeYActive = pressed ? 1 : hovered ? -6 : 0;
            const badgeYPassive = pressed ? 1 : 0;
            const spring = {type: "spring", duration: 0.22, bounce: 0.28} as const;

            sharedControlsRef.current = animateInner([
                [node, {scale: cardScale}, spring],
                ["[data-badge-controlled]", {scale: badgeScale}, spring],
                ["[data-badge-controlled][data-badge-nudge=\"true\"]", {y: badgeYActive}, spring],
                ["[data-badge-controlled][data-badge-nudge=\"false\"]", {y: badgeYPassive}, spring],
            ]);
        },
        [animateInner, innerScope],
    );

    const setInteractionState = useCallback(
        (partial: Partial<{hovered: boolean; pressed: boolean}>) => {
            const next = {...interactionStateRef.current, ...partial};
            if (partial.pressed === true) {
                next.hovered = true;
            }
            interactionStateRef.current = next;
            applySharedAnimation(next);
        },
        [applySharedAnimation],
    );

    useEffect(() => {
        applySharedAnimation(interactionStateRef.current);
    }, [applySharedAnimation]);

    useEffect(
        () => () => {
            sharedControlsRef.current?.stop();
        },
        [],
    );

    type RenderBadgeProps = Omit<BadgeProps, "size">;
    function RenderBadge(props: RenderBadgeProps) {
        const [size, setSize] = useState<"lg" | "md">("lg");

        useEffect(() => {
            const mq = window.matchMedia("(max-width: 640px)"); // Tailwind 'sm'
            const update = (e: MediaQueryListEvent | MediaQueryList) => {
                setSize(e.matches ? "md" : "lg");
            };
            update(mq);
            mq.addEventListener("change", update);
            return () => mq.removeEventListener("change", update);
        }, []);

        switch (props.type) {
            case "grade":
                return <Badge {...props} type="grade" grade={props.grade} size={size} />;
            case "time":
            case "xp":
                return (
                    <Badge type={props.type} size={size} animationControlled={props.animationControlled}>
                        {props.children}
                    </Badge>
                );
            default:
                return <Badge type="empty" size={size} animationControlled={props.animationControlled} />;
        }
    }

    return (
        <motion.div
            ref={outerScope}
            className={cn(
                cardSectionVariants({ section }),
                isDraggable && (canGoPrev || canGoNext) ? "cursor-grab touch-pan-y active:cursor-grabbing" : "",
            )}
            layout
            {...dragProps}
        >
            {/* Outer background glows */}
            <div
                className={`
          absolute top-80 left-1/2 w-[760px] h-[735px]
          rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] z-0 transition-all duration-300
          ${section === "Vocabulary" ? "bg-saffron-250/20 dark:bg-saffron-250/10" : ""}
          ${section === "Reading" ? "bg-celestialblue-250/20 dark:bg-celestialblue-250/10" : ""}
          ${section === "Grammar" ? "bg-persianred-250/20 dark:bg-persianred-250/10" : ""}
          ${section === "Review" ? "bg-space-500/10 dark:bg-space-250/10" : ""}
          ${section === "Quiz" ? "bg-emerald-500/20 dark:bg-emerald-500/10" : ""}
        `}
            />
            <div
                className={`
          absolute top-1/48 left-1/2 w-[274px] h-[265px]
          rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] z-0 transition-all duration-300
          ${section === "Vocabulary" ? "bg-persianred-200 dark:bg-persianred-250" : ""}
          ${section === "Reading" ? "bg-emerald-200 dark:bg-emerald-250" : ""}
          ${section === "Grammar" ? "bg-saffron-200 dark:bg-saffron-250" : ""}
          ${section === "Review" ? "bg-celestialblue-200 dark:bg-celestialblue-100" : ""}
          ${section === "Quiz" ? "bg-emerald-200 dark:bg-emerald-400" : ""}
        `}
            />

            {/* Inner card */}
            <motion.div
                ref={innerScope}
                key={"section-" + section}
                layout
                className="relative flex-1 flex flex-col justify-center items-center rounded-[18px] bg-space-10 dark:bg-space-900 z-10 shadow-[0_0_8px_rgba(0,0,0,0.3)] w-full h-full p-[5px]"
                initial={{ scale: 1 }}
                onHoverStart={(event) => {
                    const pointerType = (event as PointerEvent).pointerType ?? "mouse";
                    lastPointerTypeRef.current = pointerType;
                    setInteractionState({hovered: true, pressed: false});
                }}
                onHoverEnd={() => {
                    lastPointerTypeRef.current = null;
                    setInteractionState({hovered: false, pressed: false});
                }}
                onTapStart={(event) => {
                    const pointerType = (event as PointerEvent).pointerType ?? lastPointerTypeRef.current ?? "mouse";
                    lastPointerTypeRef.current = pointerType;
                    setInteractionState({pressed: true});
                }}
                onTapCancel={() => {
                    lastPointerTypeRef.current = null;
                    setInteractionState({
                        pressed: false,
                        hovered: false,
                    });
                }}
                onTap={(event) => {
                    const pointerType = (event as PointerEvent).pointerType ?? lastPointerTypeRef.current;
                    lastPointerTypeRef.current = pointerType === "mouse" ? pointerType : null;
                    setInteractionState({
                        pressed: false,
                        hovered: pointerType === "mouse" ? interactionStateRef.current.hovered : false,
                    });
                }}
            >
                <div className="flex flex-col gap-6 justify-between items-center w-full h-full mt-16 md:mt-20">
                    <div className="flex flex-col gap-1/2 md:gap-2 justify-center">
                        <Title section={section} className="mx-auto" />
                        <Subtitle
                            tone={
                                section === "Vocabulary"
                                    ? "Saffron"
                                    : section === "Reading"
                                        ? "CelestialBlue"
                                        : section === "Grammar"
                                            ? "PersianRed"
                                            : section === "Review"
                                                ? "Space"
                                                : "Emerald"
                            }
                            size={4}
                            animateFrom="bottom"
                        >
                            Robert at school
                        </Subtitle>
                    </div>

                    <div className="flex w-full flex-col items-center justify-center gap-6 md:mb-10">
                        <RenderBadge type="grade" grade="A" animationControlled />
                        <button className="flex mt-2 rounded-[12px] bg-space-800 text-space-10 py-2 text-[20px] leading-[36px] font-medium hover:bg-space-800 w-full justify-center items-center transition md:hidden">
                            مطالعه
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

const PREVIEW_EASE: [number, number, number, number] = [0.33, 1, 0.68, 1];

interface SidePreviewProps {
    enabled: boolean;
    onActivate: () => void;
    side: "left" | "right";
}

function SidePreview({ enabled, onActivate, side }: SidePreviewProps) {
    const showPeek = 0; // visible width when enabled
    const hidePeek = 24; // visible width when disabled

    const translateTarget = (peek: number) =>
        side === "left" ? `` : ``;

    const containerClass = cn(
        "absolute flex top-1/2 -translate-y-1/2 z-[5] w-[36px] sm:w-[72px] md:w-[48px] overflow-hidden",
        side === "left" ? "left-0 justify-end" : "right-0"
    );

    return (
        <div className={containerClass}>
            <motion.button
                type="button"
                className={
                cn(
                    cn("relative", !enabled && "pointer-events-none"),
                    side === "left"? "" : ""
                )

            }
                initial={{ translateX: translateTarget(hidePeek) }}
                animate={{
                    translateX: translateTarget(enabled ? showPeek : hidePeek),
                }}
                transition={{ duration: 0.32, ease: PREVIEW_EASE }}

                onClick={enabled ? onActivate : undefined}
            >
                <motion.div
                    className="select-none"
                    initial={{
                        opacity: 0.18,
                        scale: 0.88,
                        filter: "blur(3px)",
                    }}
                    animate={{
                        opacity: enabled ? 0.45 : 0.18,
                        scale: enabled ? 0.94 : 0.88,
                        filter: enabled ? "blur(1px)" : "blur(3px)",
                    }}
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 0.94 }}
                    transition={{ duration: 0.32, ease: PREVIEW_EASE }}
                >
                    <EmptySection />
                </motion.div>
            </motion.button>
        </div>
    );
}

/* --------------------------- SectionTracker --------------------------- */

type SectionTrackerProps = {
    lessons: string[];
    activeSectionIndex: number;
    onSectionSelect: (sectionIndex: number) => void;
    activeLessonIndex: number;
    onLessonSelect: (lessonIndex: number) => void;
};

export default function SectionTracker({
                                           lessons,
                                           activeSectionIndex,
                                           onSectionSelect,
                                           activeLessonIndex,
                                           onLessonSelect,
                                       }: SectionTrackerProps) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState<TransitionDirection>(1);
    const [isDragEnabled, setIsDragEnabled] = useState(false);

    const section = sectionMap[activeSectionIndex];
    if (!section) return <div>No Section Found!</div>;

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const update = () => setIsDragEnabled(!mediaQuery.matches);
        update();

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", update);
            return () => mediaQuery.removeEventListener("change", update);
        }

        mediaQuery.addListener(update);
        return () => mediaQuery.removeListener(update);
    }, []);

    const handleSectionChange = useCallback((nextIndex: number) => {
        if (isTransitioning || nextIndex === activeSectionIndex) {
            return;
        }

        const delta = nextIndex - activeSectionIndex;
        const nextDirection: TransitionDirection = delta > 0 ? 1 : -1;

        setDirection(nextDirection);
        setIsTransitioning(true);
        onSectionSelect(nextIndex);

        setTimeout(() => setIsTransitioning(false), 360);
    }, [activeSectionIndex, isTransitioning, onSectionSelect]);

    const handleDragNavigate = useCallback(
        (step: TransitionDirection) => {
            const target = Math.min(
                Math.max(activeSectionIndex + step, minSectionIndex),
                maxSectionIndex,
            );
            if (target !== activeSectionIndex) {
                handleSectionChange(target);
            }
        },
        [activeSectionIndex, handleSectionChange],
    );

    const canGoPrev = activeSectionIndex > minSectionIndex;
    const canGoNext = activeSectionIndex < maxSectionIndex;

    return (
        <div className="relative flex h-screen w-full flex-col items-center bg-space-100 dark:bg-celestialblue-950 pb-8 overflow-hidden transition-all duration-300 md:max-w-[1496px] md:h-[570px] md:rounded-[20px] md:gap-10 xl:gap-12 md:mx-auto">
            {/* Mobile header */}
            <div className="w-full md:hidden">
                <BreadcrumbBar
                    items={["Roadmap A2", lessons[activeLessonIndex]]}
                    onBack={() =>
                        handleSectionChange(Math.max(minSectionIndex, activeSectionIndex - 1))
                    }
                />
            </div>

            {/* Desktop header */}
            <div className="hidden md:flex">
                <LessonIndicator
                    lessons={lessons}
                    activeLessonIndex={activeLessonIndex}
                    onLessonSelect={onLessonSelect}
                />
            </div>

            {/* ---------------------- Main Content ---------------------- */}
            <div className="relative flex w-full flex-1 flex-col items-center gap-10 lg:gap-12">
                {/* -------- Mobile layout (side previews only visible here) -------- */}
                <div className="relative w-full flex-1 overflow-hidden lg:hidden flex flex-col justify-center items-center">
                    <SidePreview
                        side="left"
                        enabled={canGoPrev}
                        onActivate={() =>
                            handleSectionChange(activeSectionIndex - 1)
                        }
                    />


                    <AnimatePresence initial={false} mode="wait" custom={direction}>
                        <SectionIndicator
                            key={`${section}-${activeLessonIndex}`}
                            section={section}
                            direction={direction}
                            isDraggable={isDragEnabled}
                            canGoPrev={canGoPrev}
                            canGoNext={canGoNext}
                            onDragNavigate={handleDragNavigate}
                        />
                    </AnimatePresence>


                    <SidePreview
                        side="right"
                        enabled={canGoNext}
                        onActivate={() =>
                            handleSectionChange(activeSectionIndex + 1)
                        }
                    />
                </div>

                {/* -------- Desktop layout (buttons + centered card) -------- */}
                <div className="relative hidden w-full items-center justify-center gap-8 lg:flex lg:px-16 xl:px-24">
                    <IconButton
                        variant="default"
                        onClick={() =>
                            handleSectionChange(
                                Math.max(minSectionIndex, activeSectionIndex - 1)
                            )
                        }
                        isDisabled={isTransitioning || activeSectionIndex <= minSectionIndex}
                    >
                        arrow_back
                    </IconButton>

                    <div className="relative mx-auto w-fit">
                        <AnimatePresence initial={false} mode="wait" custom={direction}>
                            <SectionIndicator
                                key={`${section}-${activeLessonIndex}-desktop`}
                                section={section}
                                direction={direction}
                                isDraggable={false}
                                canGoPrev={canGoPrev}
                                canGoNext={canGoNext}
                            />
                        </AnimatePresence>
                    </div>

                    <IconButton
                        variant="default"
                        onClick={() =>
                            handleSectionChange(
                                Math.min(maxSectionIndex, activeSectionIndex + 1)
                            )
                        }
                        isDisabled={isTransitioning || activeSectionIndex >= maxSectionIndex}
                    >
                        arrow_forward
                    </IconButton>
                </div>

                {/* Background connector line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[3px] z-0 hidden lg:flex w-[65%] blur-[2px]
                  bg-[linear-gradient(90deg,rgba(222,229,242,1)_0%,rgba(255,255,255,1)_10%,rgba(255,255,255,1)_90%,rgba(222,229,242,1)_100%)]
                  dark:bg-[linear-gradient(90deg,rgba(45,54,73,1)_0%,rgba(73,84,109,1)_10%,rgba(73,84,109,1)_90%,rgba(45,54,73,1)_100%)]" />
                </div>

            {/* Progress (mobile) */}
            <div className="mt-6 w-full flex justify-center items-center md:hidden">
                <LessonProgressIndicator progress={activeSectionIndex} maxWidth={180} size="sm" />
            </div>

            {/* Progress (desktop) */}
            <div className="hidden w-full md:flex justify-center items-center">
                <LessonProgressIndicator progress={activeSectionIndex} maxWidth={400} size="md" />
            </div>
        </div>

    );
}
