import {useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent} from "react";
import {flushSync} from "react-dom";
import {AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion} from "motion/react";
import type {LegacyAnimationControls, PanInfo, Variants} from "motion";
import VocabularyCard from "./VocabularyCard";
import Progress from "./Progress";

export interface VocabularyItem {
    word: string;
    meaningEn: string;
    meaningFa: string;
    examples: string[];
    image: string;
}

interface VocabularyNavigatorProps {
    vocabularyItems: VocabularyItem[];
}

const SCROLL_BUTTON_CLASS =
    "hidden md:inline-flex justify-center items-center bg-white/80 border-1 border-space-150 text-space-500 text-center max-w-[140px] min-w-[50px] w-[140px] h-[50px] rounded-full shadow-sm hover:bg-space-50 transition-colors cursor-pointer disabled:cursor-not-allowed";

const MOBILE_DRAG_THRESHOLD = 80;
const NAVIGATION_DEBOUNCE_MS = 380;
const WHEEL_NAVIGATION_DEBOUNCE_MS = 650;

const baseTransition = {
    type: "spring",
    duration: 0.35,
} as const;

const cardVariants = {
    enter: (direction: 1 | -1) => ({
        opacity: 0.8,
        y: direction === 1 ? 36 : -36,
        scale: 0.96,
    }),
    center: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {...baseTransition, duration: 0.38},
    },
    exit: (direction: 1 | -1) => ({
        opacity: 0.8,
        y: direction === 1 ? -36 : 36,
        scale: 0.96,
        transition: {...baseTransition, duration: 0.26},
    }),
} as const;

type BaseVariant = "idle" | "hovered" | "pressed";
type WheelVariant = "wheelNext" | "wheelPrev" | "wheelEdgeNext" | "wheelEdgePrev";

const wheelEase = [0.33, 1, 0.68, 1] as const;

const cardFrameVariants: Variants = {
    idle: {scale: 1, rotate: 0, y: 0, transition: {type: "spring", stiffness: 320, damping: 30}},
    hovered: {scale: 1, rotate: 0, y: 0, transition: {type: "spring", stiffness: 260, damping: 28}},
    pressed: {scale: 0.98, rotate: 0, y: 4, transition: {type: "spring", stiffness: 480, damping: 32}},
    wheelNext: {
        rotate: [0, -0.5, 0],
        y: [0, -2, 0],
        scale: [1, 0.92, 1],
        transition: {duration: 0.55, ease: wheelEase, times: [0, 0.5, 1]},
    },
    wheelPrev: {
        rotate: [0, 0.5, 0],
        y: [0, 12, 0],
        scale: [1, 0.92, 1],
        transition: {duration: 0.55, ease: wheelEase, times: [0, 0.5, 1]},
    },
    // wheelEdgeNext: {
    //     rotate: [0, -4, 0],
    //     y: [0, -8, 0],
    //     scale: [1, 0.97, 1],
    //     transition: {duration: 0.45, ease: wheelEase, times: [0, 0.5, 1]},
    // },
    // wheelEdgePrev: {
    //     rotate: [0, 4, 0],
    //     y: [0, 8, 0],
    //     scale: [1, 0.97, 1],
    //     transition: {duration: 0.45, ease: wheelEase, times: [0, 0.5, 1]},
    // },
};

const scrollButtonVariants: Variants = {
    idle: {scale: 1, transition: {type: "spring", stiffness: 320, damping: 30}},
    hovered: {scale: 1.05, transition: {type: "spring", stiffness: 260, damping: 24}},
    pressed: {scale: 0.98, transition: {type: "spring", stiffness: 480, damping: 30}},
    wheelNext: {scale: [1, 1.05, 1], transition: {duration: 0.45, ease: wheelEase, times: [0, 0.45, 1]}},
    wheelPrev: {scale: [1, 1.05, 1], transition: {duration: 0.45, ease: wheelEase, times: [0, 0.45, 1]}},
    wheelEdgeNext: {scale: [1, 0.96, 1], transition: {duration: 0.35, ease: wheelEase, times: [0, 0.45, 1]}},
    wheelEdgePrev: {scale: [1, 0.96, 1], transition: {duration: 0.35, ease: wheelEase, times: [0, 0.45, 1]}},
};

type NavigationSource = "navigation" | "wheel";

function ScrollButton({
                          icon,
                          onClick,
                          disabled,
                          position,
                          ariaLabel,
                          controls,
                      }: {
    icon: string;
    onClick: () => void;
    disabled?: boolean;
    position: "top" | "bottom";
    ariaLabel: string;
    controls: LegacyAnimationControls;
}) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            data-vocab-scroll={position}
            className={`${SCROLL_BUTTON_CLASS} ${disabled ? "opacity-40" : ""}`}
            variants={scrollButtonVariants}
            initial="idle"
            whileHover="hovered"
            whileTap="pressed"
            animate={controls}
        >
            <span className="material-symbols-outlined !text-[30px]">{icon}</span>
        </motion.button>
    );
}

function VocabularyNavigator({vocabularyItems}: VocabularyNavigatorProps) {
    const itemCount = vocabularyItems.length;
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [isMobile, setIsMobile] = useState(false);
    const imageDragX = useMotionValue(0);
    const [transitionMode, setTransitionMode] = useState<NavigationSource>("navigation");

    const containerRef = useRef<HTMLDivElement | null>(null);
    const sharedControls = useAnimationControls();
    const prefersReducedMotion = useReducedMotion();
    const baseVariantRef = useRef<BaseVariant>("idle");
    const navigationCooldownRef = useRef(false);
    const navigationTimeoutRef = useRef<number | null>(null);
    const indexRef = useRef(index);
    const itemCountRef = useRef(itemCount);
    const resolvedIndex = itemCount > 0 ? Math.min(Math.max(index, 0), itemCount - 1) : 0;

    useEffect(() => {
        sharedControls.set("idle");
    }, [sharedControls]);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const update = () => {
            const mobile = mq.matches;
            setIsMobile(mobile);
        };
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        indexRef.current = itemCount > 0 ? Math.min(Math.max(index, 0), itemCount - 1) : 0;
        itemCountRef.current = itemCount;
    }, [index, itemCount]);

    useEffect(() => {
        if (itemCount === 0) {
            setIndex(0);
            return;
        }
        setIndex((current) => Math.min(Math.max(current, 0), itemCount - 1));
    }, [itemCount]);

    const setBaseInteraction = useCallback(
        (variant: BaseVariant) => {
            baseVariantRef.current = variant;
            sharedControls.start(variant);
        },
        [sharedControls],
    );

    const playWheelVariant = useCallback(
        async (variant: WheelVariant) => {
            await sharedControls.start(variant);
            await sharedControls.start(baseVariantRef.current);
        },
        [sharedControls],
    );

    useEffect(() => {
        imageDragX.set(0);
    }, [imageDragX, index, isMobile]);

    useEffect(
        () => () => {
            if (navigationTimeoutRef.current) window.clearTimeout(navigationTimeoutRef.current);
            navigationCooldownRef.current = false;
        },
        [],
    );

    const tryAcquireNavigationLock = useCallback((debounceMs: number) => {
        if (navigationCooldownRef.current) return false;

        navigationCooldownRef.current = true;
        if (navigationTimeoutRef.current) window.clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = window.setTimeout(() => {
            navigationCooldownRef.current = false;
            navigationTimeoutRef.current = null;
        }, debounceMs);

        return true;
    }, []);

    const updateIndex = useCallback(
        (targetIndex: number) => {
            setIndex((current) => {
                if (targetIndex === current || targetIndex < 0 || targetIndex >= itemCount) {
                    return current;
                }
                const nextDirection = targetIndex > current ? 1 : -1;
                setDirection(nextDirection);
                return targetIndex;
            });
        },
        [itemCount],
    );

    const [delayedIndex, setDelayedIndex] = useState(index + 1);

    useEffect(() => {
        if (transitionMode === "wheel") {
            const timout = setTimeout(() => setDelayedIndex(resolvedIndex + 1), 500);
            return () => clearTimeout(timout);
        } else setDelayedIndex(resolvedIndex + 1);
    }, [resolvedIndex, transitionMode]);

    const commitTransitionMode = useCallback(
        (mode: NavigationSource) => {
            flushSync(() => {
                setTransitionMode(mode);
            });
        },
        [],
    );

    const handlePrev = useCallback(() => {
        if (!tryAcquireNavigationLock(NAVIGATION_DEBOUNCE_MS)) return;
        commitTransitionMode("navigation");
        updateIndex(resolvedIndex - 1);
    }, [commitTransitionMode, resolvedIndex, tryAcquireNavigationLock, updateIndex]);

    const handleNext = useCallback(() => {
        if (!tryAcquireNavigationLock(NAVIGATION_DEBOUNCE_MS)) return;
        commitTransitionMode("navigation");
        updateIndex(resolvedIndex + 1);
    }, [commitTransitionMode, resolvedIndex, tryAcquireNavigationLock, updateIndex]);

    const goToNext = useCallback(() => {
        commitTransitionMode("navigation");
        updateIndex(indexRef.current + 1);
    }, [commitTransitionMode, updateIndex]);

    const goToPrev = useCallback(() => {
        commitTransitionMode("navigation");
        updateIndex(indexRef.current - 1);
    }, [commitTransitionMode, updateIndex]);

    useEffect(() => {
        if (isMobile) return;
        const node = containerRef.current;
        if (!node) return;

        const handleWheel = async (event: WheelEvent) => {
            if (Math.abs(event.deltaY) < 8) {
                return;
            }
            event.preventDefault();
            if (!tryAcquireNavigationLock(WHEEL_NAVIGATION_DEBOUNCE_MS)) {
                return;
            }

            const currentIndex = indexRef.current;
            const total = itemCountRef.current;
            const isNext = event.deltaY > 0;
            const targetIndex = isNext ? currentIndex + 1 : currentIndex - 1;
            const canMove = targetIndex >= 0 && targetIndex < total;

            setBaseInteraction("pressed");

            if (prefersReducedMotion) {
                if (canMove) {
                    commitTransitionMode("wheel");
                    updateIndex(targetIndex);
                }
                requestAnimationFrame(() => setBaseInteraction("idle"));
                return;
            }

            if (canMove) {
                commitTransitionMode("wheel");
                updateIndex(targetIndex);
                await playWheelVariant(isNext ? "wheelNext" : "wheelPrev");
            } else {
                await playWheelVariant(isNext ? "wheelEdgeNext" : "wheelEdgePrev");
            }

            requestAnimationFrame(() => setBaseInteraction("idle"));
        };

        node.addEventListener("wheel", handleWheel, {passive: false});
        return () => node.removeEventListener("wheel", handleWheel);
    }, [
        commitTransitionMode,
        isMobile,
        playWheelVariant,
        prefersReducedMotion,
        setBaseInteraction,
        tryAcquireNavigationLock,
        updateIndex,
    ]);

    if (itemCount === 0) return null;

    const current = vocabularyItems[resolvedIndex];
    const prevItem = resolvedIndex > 0 ? vocabularyItems[resolvedIndex - 1] : undefined;
    const nextItem = resolvedIndex < itemCount - 1 ? vocabularyItems[resolvedIndex + 1] : undefined;
    const progressValue = Math.min(Math.max(resolvedIndex + 1, 1), itemCount);
    const delayedProgressValue = Math.min(Math.max(delayedIndex, 1), itemCount);

    const dragMotionProps = useMemo(() => {
        if (!isMobile) return {};

        return {
            drag: "x" as const,
            dragConstraints: {left: -MOBILE_DRAG_THRESHOLD, right: MOBILE_DRAG_THRESHOLD},
            dragElastic: 0.22,
            dragMomentum: false,
            dragSnapToOrigin: true,
            onDragStart: () => {
                setBaseInteraction("pressed");
            },
            onDragEnd: (_event: unknown, info: PanInfo) => {
                setBaseInteraction("idle");
                const projected = info.offset.x + info.velocity.x * 0.2;

                if (projected >= MOBILE_DRAG_THRESHOLD && resolvedIndex > 0) goToPrev();
                else if (projected <= -MOBILE_DRAG_THRESHOLD && resolvedIndex < itemCount - 1) goToNext();
            },
        };
    }, [goToNext, goToPrev, itemCount, isMobile, resolvedIndex, setBaseInteraction]);

    const imageDragProps = useMemo(() => {
        if (!isMobile) return undefined;
        const threshold = MOBILE_DRAG_THRESHOLD;
        return {
            drag: "x" as const,
            dragConstraints: {left: -threshold, right: threshold} as const,
            dragElastic: 0.22,
            dragMomentum: false,
            dragSnapToOrigin: true,
            dragPropagation: false as const,
            onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
                event.stopPropagation();
            },
            onDragStart: () => {
                setBaseInteraction("pressed");
            },
            onDragEnd: (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
                setBaseInteraction("idle");
                const projected = info.offset.x + info.velocity.x * 0.2;

                if (projected >= threshold && resolvedIndex > 0) {
                    goToPrev();
                } else if (projected <= -threshold && resolvedIndex < itemCount - 1) {
                    goToNext();
                }
                imageDragX.set(0);
            },
            onDragCancel: () => {
                setBaseInteraction("idle");
                imageDragX.set(0);
            },
        };
    }, [goToPrev, goToNext, imageDragX, itemCount, isMobile, resolvedIndex, setBaseInteraction]);

    const cardMotionProps = useMemo(() => {
        const baseProps = {
            layout: true,
            ...(dragMotionProps ?? {}),
        };

        if (transitionMode === "wheel") {
            return baseProps;
        }

        return {
            custom: direction,
            variants: cardVariants,
            initial: "enter" as const,
            animate: "center" as const,
            exit: "exit" as const,
            layout: true,
            ...(dragMotionProps ?? {}),
        };
    }, [direction, dragMotionProps, transitionMode]);

    return (
        <AnimatePresence initial mode="sync" custom={direction}>

            <div
                ref={containerRef}
                className="flex w-full max-w-[1060px] flex-col items-center justify-center gap-4 px-3 sm:px-4 md:px-6 no-scrollbar"
            >
                <ScrollButton
                    icon="keyboard_arrow_up"
                    onClick={handlePrev}
                    disabled={resolvedIndex === 0}
                    position="top"
                    ariaLabel="Previous vocabulary item"
                    controls={sharedControls}
                />
                <div
                    className="relative w-full flex flex-col items-center"
                    data-vocab-shell
                >
                    <div
                        className="flex w-full max-w-[980px] items-center justify-center gap-4 md:gap-6"
                        data-vocab-progress-shell=""
                    >
                        <div
                            className="hidden h-[168px] w-[28px] items-center justify-center md:flex"
                            data-vocab-progress-desktop=""
                        >
                            <Progress
                                className="hidden h-[168px] w-[28px] items-center justify-center md:flex"
                                value={delayedProgressValue}
                                max={itemCount}
                                tone="space"
                                size="lg"
                                dotted
                                orientation="vertical"
                                animateOnInView={false}
                            />
                        </div>
                        <motion.div
                            className="flex w-full justify-center"
                            variants={cardFrameVariants}
                            initial="idle"
                            whileHover="hovered"
                            whileTap="pressed"
                            animate={sharedControls}>
                            <VocabularyCard
                                key={`${current.word}-${resolvedIndex}`}
                                imageSrc={current.image}
                                faText={current.meaningFa}
                                enWord={current.word}
                                definition={current.meaningEn}
                                examples={current.examples}
                                animationControlled
                                motionProps={cardMotionProps}
                                imageDragProps={imageDragProps}
                                imageDragValue={imageDragX}
                                // VocabularyCard uses `nextImage*` for the leading preview slot.
                                prevImageSrc={nextItem?.image}
                                prevImageLabel={nextItem?.word}
                                nextImageSrc={prevItem?.image}
                                nextImageLabel={prevItem?.word}
                                footer={
                                    <div
                                        className="mt-3 inline-flex items-center justify-center md:hidden"
                                        data-vocab-progress-mobile=""
                                        data-vocab-card-progress-mobile=""
                                    >
                                        <Progress
                                            value={progressValue}
                                            max={itemCount}
                                            tone="space"
                                            size="md"
                                            dotted
                                            orientation="horizontal"
                                            animateOnInView={false}
                                        />
                                    </div>
                                }
                            />
                        </motion.div>
                    </div>
                </div>
                <ScrollButton
                    icon="keyboard_arrow_down"
                    onClick={handleNext}
                    disabled={resolvedIndex === itemCount - 1}
                    position="bottom"
                    ariaLabel="Next vocabulary item"
                    controls={sharedControls}
                />
            </div>
        </AnimatePresence>

    );
}

export default VocabularyNavigator;
