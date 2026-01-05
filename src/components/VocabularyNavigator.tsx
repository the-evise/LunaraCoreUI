import {useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent} from "react";
import {flushSync} from "react-dom";
import {AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion} from "motion/react";
import type {LegacyAnimationControls, PanInfo, Variants} from "motion";
import VocabularyCard from "./VocabularyCard";
import Progress from "./Progress";

// TODO: image drag is not correct and shows wrong before/after images when drag-ing

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
    "hidden md:inline-flex justify-center items-center bg-transparent border-1 border-space-150 text-space-250 text-center max-w-[140px] min-w-[50px] w-[140px] h-[50px] rounded-full hover:bg-space-100 transition-colors cursor-pointer disabled:cursor-not-allowed";

const MOBILE_DRAG_THRESHOLD = 80;

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

const LOG_PREFIX = "[VocabularyNavigator]";

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

const shellVariants: Variants = {
    // idle: {y: 0, transition: {type: "spring", stiffness: 320, damping: 30}},
    // hovered: {y: -2, transition: {type: "spring", stiffness: 260, damping: 26}},
    // pressed: {y: 2, transition: {type: "spring", stiffness: 480, damping: 32}},
    // wheelNext: {y: [0, -6, 0], transition: {duration: 0.5, ease: wheelEase, times: [0, 0.5, 1]}},
    // wheelPrev: {y: [0, 6, 0], transition: {duration: 0.5, ease: wheelEase, times: [0, 0.5, 1]}},
    // wheelEdgeNext: {y: [0, -4, 0], transition: {duration: 0.4, ease: wheelEase, times: [0, 0.45, 1]}},
    // wheelEdgePrev: {y: [0, 4, 0], transition: {duration: 0.4, ease: wheelEase, times: [0, 0.45, 1]}},
};

const progressVariants: Variants = {
    idle: {scale: 1, y: 0, transition: {type: "spring", stiffness: 320, damping: 32}},
    hovered: {scale: 1.02, y: -2, transition: {type: "spring", stiffness: 260, damping: 28}},
    pressed: {scale: 0.96, y: 2, transition: {type: "spring", stiffness: 480, damping: 32}},
    wheelNext: {scale: [1, 0.9, 1], y: [0, 0, 0], transition: {duration: 0.5,delay:0.5, ease: wheelEase, times: [0, 0.45, 1]}},
    wheelPrev: {scale: [1, 0.9, 1], y: [0, 0, 0], transition: {duration: 0.5, delay:0.5, ease: wheelEase, times: [0, 0.45, 1]}},
    // wheelEdgeNext: {scale: [1, 0.95, 1], transition: {duration: 0.4, ease: wheelEase, times: [0, 0.45, 1]}},
    // wheelEdgePrev: {scale: [1, 0.95, 1], transition: {duration: 0.4, ease: wheelEase, times: [0, 0.45, 1]}},
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
    controls,
}: {
    icon: string;
    onClick: () => void;
    disabled?: boolean;
    position: "top" | "bottom";
    controls: LegacyAnimationControls;
}) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
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
    const wheelCooldownRef = useRef(false);
    const wheelTimeoutRef = useRef<number | null>(null);
    const lastPointerTypeRef = useRef<PointerEvent["pointerType"] | null>(null);
    const indexRef = useRef(index);
    const itemCountRef = useRef(itemCount);

    useEffect(() => {
        sharedControls.set("idle");
    }, [sharedControls]);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const update = () => {
            const mobile = mq.matches;
            console.log(LOG_PREFIX, "media query update", {mobile});
            setIsMobile(mobile);
        };
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        indexRef.current = index;
        itemCountRef.current = itemCount;
        console.log(LOG_PREFIX, "state sync", {index, itemCount, direction});
    }, [index, itemCount, direction]);

    const setBaseInteraction = useCallback(
        (variant: BaseVariant) => {
            baseVariantRef.current = variant;
            sharedControls.start(variant);
        },
        [sharedControls],
    );

    const playWheelVariant = useCallback(
        async (variant: WheelVariant) => {
            console.log(LOG_PREFIX, "wheel variant start", {variant});
            await sharedControls.start(variant);
            await sharedControls.start(baseVariantRef.current);
            console.log(LOG_PREFIX, "wheel variant end", {variant});
        },
        [sharedControls],
    );

    useEffect(() => {
        imageDragX.set(0);
    }, [imageDragX, index, isMobile]);

    useEffect(
        () => () => {
            if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
            wheelCooldownRef.current = false;
        },
        [],
    );

    const updateIndex = useCallback(
        (targetIndex: number) => {
            setIndex((current) => {
                if (targetIndex === current || targetIndex < 0 || targetIndex >= itemCount) {
                    console.log(LOG_PREFIX, "updateIndex noop", {
                        from: current,
                        to: targetIndex,
                        itemCount,
                    });
                    return current;
                }
                const nextDirection = targetIndex > current ? 1 : -1;
                console.log(LOG_PREFIX, "updateIndex", {
                    from: current,
                    to: targetIndex,
                    direction: nextDirection,
                    mode: transitionMode,
                });
                setDirection(nextDirection);
                return targetIndex;
            });
        },
        [itemCount, transitionMode],
    );

    const [delayedIndex, setDelayedIndex] = useState(index + 1);

    useEffect(() => {
        if (transitionMode === "wheel") {
            const timout = setTimeout(() => setDelayedIndex(index + 1), 500);
            return () => clearTimeout(timout);
        } else setDelayedIndex(index + 1);
    }, [index, transitionMode]);

    const commitTransitionMode = useCallback(
        (mode: NavigationSource) => {
            flushSync(() => {
                console.log(LOG_PREFIX, "transitionMode change", {mode});
                setTransitionMode(mode);
            });
        },
        [],
    );

    const handlePrev = useCallback(() => {
        commitTransitionMode("navigation");
        console.log(LOG_PREFIX, "handlePrev", {index});
        updateIndex(index - 1);
    }, [commitTransitionMode, index, updateIndex]);

    const handleNext = useCallback(() => {
        commitTransitionMode("navigation");
        console.log(LOG_PREFIX, "handleNext", {index});
        updateIndex(index + 1);
    }, [commitTransitionMode, index, updateIndex]);

    const goToNext = useCallback(() => {
        commitTransitionMode("navigation");
        console.log(LOG_PREFIX, "goToNext", {index: indexRef.current});
        updateIndex(indexRef.current + 1);
    }, [commitTransitionMode, updateIndex]);

    const goToPrev = useCallback(() => {
        commitTransitionMode("navigation");
        console.log(LOG_PREFIX, "goToPrev", {index: indexRef.current});
        updateIndex(indexRef.current - 1);
    }, [commitTransitionMode, updateIndex]);

    useEffect(() => {
        if (isMobile) return;
        const node = containerRef.current;
        if (!node) return;

        const handleWheel = async (event: WheelEvent) => {
            console.log(LOG_PREFIX, "wheel event start", {
                deltaY: event.deltaY,
                shiftKey: event.shiftKey,
                ctrlKey: event.ctrlKey,
            });
            if (Math.abs(event.deltaY) < 8) {
                console.log(LOG_PREFIX, "wheel ignored - small delta", {deltaY: event.deltaY});
                return;
            }
            event.preventDefault();
            if (wheelCooldownRef.current) {
                console.log(LOG_PREFIX, "wheel ignored - cooldown");
                return;
            }

            const currentIndex = indexRef.current;
            const total = itemCountRef.current;
            const isNext = event.deltaY > 0;
            const targetIndex = isNext ? currentIndex + 1 : currentIndex - 1;
            const canMove = targetIndex >= 0 && targetIndex < total;
            console.log(LOG_PREFIX, "wheel evaluation", {
                currentIndex,
                targetIndex,
                total,
                isNext,
                canMove,
            });

            wheelCooldownRef.current = true;
            if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
            wheelTimeoutRef.current = window.setTimeout(() => {
                wheelCooldownRef.current = false;
                wheelTimeoutRef.current = null;
                console.log(LOG_PREFIX, "wheel cooldown cleared");
            }, 1100);

            lastPointerTypeRef.current = "mouse";
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
    }, [commitTransitionMode, isMobile, playWheelVariant, prefersReducedMotion, setBaseInteraction, updateIndex]);

    if (itemCount === 0) return null;

    const current = vocabularyItems[index];
    const prevItem = index > 0 ? vocabularyItems[index - 1] : undefined;
    const nextItem = index < itemCount - 1 ? vocabularyItems[index + 1] : undefined;

    const dragMotionProps = useMemo(() => {
        if (!isMobile) return {};

        return {
            drag: "x" as const,
            dragConstraints: {left: -MOBILE_DRAG_THRESHOLD, right: MOBILE_DRAG_THRESHOLD},
            dragElastic: 0.22,
            dragMomentum: false,
            dragSnapToOrigin: true,
            onDragStart: () => {
                lastPointerTypeRef.current = "touch";
                setBaseInteraction("pressed");
            },
            onDragEnd: (_event: unknown, info: PanInfo) => {
                lastPointerTypeRef.current = null;
                setBaseInteraction("idle");
                const projected = info.offset.x + info.velocity.x * 0.2;

                if (projected >= MOBILE_DRAG_THRESHOLD && index > 0) goToPrev();
                else if (projected <= -MOBILE_DRAG_THRESHOLD && index < itemCount - 1) goToNext();
            },
        };
    }, [goToNext, goToPrev, index, isMobile, setBaseInteraction]);

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
                lastPointerTypeRef.current = "touch";
                setBaseInteraction("pressed");
            },
            onDragEnd: (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
                lastPointerTypeRef.current = null;
                setBaseInteraction("idle");
                const projected = info.offset.x + info.velocity.x * 0.2;

                if (projected >= threshold && index > 0) {
                    goToPrev();
                } else if (projected <= -threshold && index < itemCount - 1) {
                    goToNext();
                }
                imageDragX.set(0);
            },
            onDragCancel: () => {
                lastPointerTypeRef.current = null;
                setBaseInteraction("idle");
                imageDragX.set(0);
            },
        };
    }, [goToPrev, goToNext, imageDragX, index, isMobile, setBaseInteraction]);

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
            className="flex w-full max-w-[1060px] flex-col items-center justify-center gap-5 no-scrollbar"
        >
            <ScrollButton
                icon="keyboard_arrow_up"
                onClick={handlePrev}
                disabled={index === 0}
                position="top"
                controls={sharedControls}
            />
            <motion.div
                className="relative w-full flex flex-col items-center"
                data-vocab-shell
                variants={shellVariants}
                animate={sharedControls}
            >
                <motion.div
                    className="flex w-[98%] max-w-[1060px] items-center justify-center gap-6 sm:w-[80%] lg:w-[95%] lg:max-w-[980px]"
                    data-vocab-progress-shell=""
                    variants={shellVariants}
                    animate={sharedControls}
                >
                    <motion.div
                        className="hidden h-[168px] w-[28px] items-center justify-center md:flex"
                        data-vocab-progress-desktop=""
                        variants={progressVariants}
                        initial="idle"
                        whileHover="hovered"
                        whileTap="pressed"
                        animate={sharedControls}
                    >
                        <Progress
                            className="hidden h-[168px] w-[28px] items-center justify-center md:flex"
                            value={delayedIndex}
                            max={itemCount}
                            tone="space"
                            size="lg"
                            dotted
                            orientation="vertical"
                        />
                    </motion.div>
                    <motion.div
                        className="flex w-full justify-center"
                        variants={cardFrameVariants}
                        initial="idle"
                        whileHover="hovered"
                        whileTap="pressed"
                        animate={sharedControls}>
                            <VocabularyCard
                                key={`${current.word}-${index}`}
                                imageSrc={current.image}
                                faText={current.meaningFa}
                                enWord={current.word}
                                definition={current.meaningEn}
                                examples={current.examples}
                                animationControlled
                                motionProps={cardMotionProps}
                                imageDragProps={imageDragProps}
                                imageDragValue={imageDragX}
                                prevImageSrc={prevItem?.image}
                                prevImageLabel={prevItem?.word}
                                nextImageSrc={nextItem?.image}
                                nextImageLabel={nextItem?.word}
                                footer={
                                    <motion.div
                                        className="mt-4 inline-flex items-center justify-center md:hidden"
                                        data-vocab-progress-mobile=""
                                        data-vocab-card-progress-mobile=""
                                        variants={progressVariants}
                                        animate={sharedControls}
                                    >
                                        <Progress
                                            value={index + 1}
                                            max={itemCount}
                                            tone="space"
                                            size="lg"
                                            dotted
                                        />
                                    </motion.div>
                                }
                            />
                    </motion.div>
                </motion.div>
            </motion.div>
            <ScrollButton
                icon="keyboard_arrow_down"
                onClick={handleNext}
                disabled={index === itemCount - 1}
                position="bottom"
                controls={sharedControls}
            />
        </div>
        </AnimatePresence>

    );
}

export default VocabularyNavigator;
