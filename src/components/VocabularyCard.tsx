import {forwardRef, useLayoutEffect, useMemo, useRef, useState} from "react";
import type {ReactNode} from "react";
import {motion, useMotionValue} from "motion/react";
import type {HTMLMotionProps} from "motion/react";
import type {MotionValue} from "motion";
import Card from "./Card";
import Title from "./Title";

const CARD_LOG_PREFIX = "[VocabularyCard]";


type ImageDragMotionProps = Omit<HTMLMotionProps<"div">, "style" | "className" | "children">;

type RenderImageProps = {
    imageSrc: string;
    enWord: string;
    faText: string;
    prevImageSrc?: string;
    prevImageLabel?: string;
    nextImageSrc?: string;
    nextImageLabel?: string;
    dragValue?: MotionValue<number>;
    dragMotionProps?: ImageDragMotionProps;
};

function RenderImage({
    imageSrc,
    enWord,
    faText,
    prevImageSrc,
    prevImageLabel,
    nextImageSrc,
    nextImageLabel,
    dragValue,
    dragMotionProps,
}: RenderImageProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [baseOffset, setBaseOffset] = useState(0);
    const internalDragValue = useMotionValue(0);
    const activeDragValue = dragValue ?? internalDragValue;

    console.log(CARD_LOG_PREFIX, "RenderImage render", {
        imageSrc,
        enWord,
        prevImageSrc,
        nextImageSrc,
        hasDragValue: Boolean(dragValue),
        hasDragMotionProps: Boolean(dragMotionProps),
    });

    useLayoutEffect(() => {
        const node = containerRef.current;
        if (!node) {
            console.log(CARD_LOG_PREFIX, "RenderImage effect skipped - missing node");
            return;
        }

        let frame: number | null = null;
        const updateBaseOffset = () => {
            const width = node.clientWidth;
            setBaseOffset(nextImageSrc ? -width : 0);
            console.log(CARD_LOG_PREFIX, "RenderImage updateBaseOffset", {
                width,
                nextImageSrc,
                baseOffset: nextImageSrc ? -width : 0,
            });
        };

        console.log(CARD_LOG_PREFIX, "RenderImage effect mount", {
            nextImageSrc,
            prevImageSrc,
        });
        updateBaseOffset();

        const handleResize = () => {
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
            frame = requestAnimationFrame(updateBaseOffset);
            console.log(CARD_LOG_PREFIX, "RenderImage handleResize scheduled");
        };

        window.addEventListener("resize", handleResize);
        return () => {
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
            window.removeEventListener("resize", handleResize);
            console.log(CARD_LOG_PREFIX, "RenderImage effect cleanup");
        };
    }, [nextImageSrc, prevImageSrc]);

    const trackImages = useMemo(() => {
        const images: Array<{
            key: string;
            src: string;
            alt: string;
            role: "current" | "next" | "prev";
        }> = [];

        if (nextImageSrc) {
            images.push({
                key: `next-${nextImageSrc}`,
                src: nextImageSrc,
                alt: nextImageLabel ?? enWord,
                role: "next",
            });
        }

        images.push({
            key: `current-${imageSrc}`,
            src: imageSrc,
            alt: enWord,
            role: "current",
        });

        if (prevImageSrc) {
            images.push({
                key: `prev-${prevImageSrc}`,
                src: prevImageSrc,
                alt: prevImageLabel ?? enWord,
                role: "prev",
            });
        }

        console.log(CARD_LOG_PREFIX, "RenderImage trackImages", {
            imageSrc,
            prevImageSrc,
            nextImageSrc,
            count: images.length,
            roles: images.map((item) => item.role),
        });

        return images;
    }, [enWord, imageSrc, nextImageLabel, nextImageSrc, prevImageLabel, prevImageSrc]);

    console.log(CARD_LOG_PREFIX, "RenderImage ready", {
        baseOffset,
        imageCount: trackImages.length,
    });

    return (
        <div
            ref={containerRef}
            className="relative h-auto w-full md:h-[368px] md:w-[360px] md:flex-shrink-0 md:rounded-xl md:border-3 md:border-white"
            data-vocab-card-image=""
        >
            <div className="relative h-full w-full">
                <div
                    className="flex h-full items-stretch"
                    style={{transform: `translateX(${baseOffset}px)`}}
                >
                    <motion.div
                        className="flex h-full items-stretch"
                        style={{x: activeDragValue}}
                        {...(dragMotionProps ?? {})}
                    >
                        {trackImages.map(({key, src, alt, role}) => (
                            <div key={key} className="relative h-full w-full flex-shrink-0 basis-full">
                                <img
                                    src={src}
                                    alt={alt}
                                    className="h-auto w-full aspect-10/7 object-cover md:h-full md:aspect-square md:rounded-xl"
                                    loading="lazy"
                                    aria-hidden={role !== "current"}
                                />
                                {role === "current" ? (
                                    <div className="absolute bottom-3 left-1/2 flex w-auto -translate-x-1/2 select-none items-center justify-center whitespace-nowrap rounded-full border border-black/20 bg-black/65 px-5 py-2 text-center text-[20px] font-medium text-celestialblue-50 backdrop-blur-lg md:bottom-6 md:w-[90%]">
                                        {faText}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

type ExamplesListProps = {
    examples: VocabularyCardProps["examples"];
};

const baseTransition = {
    type: "spring",
    duration: 0.35,
} as const;
const childTransition = {
    duration: 0.18,
    ease: [0.33, 1, 0.68, 1],
} as const;

function ExamplesList({examples}: ExamplesListProps) {
    console.log(CARD_LOG_PREFIX, "ExamplesList render", { count: examples.length });

    return (
        <motion.div
            className="flex w-full flex-col gap-2"
            data-vocab-card-examples=""
            initial={{opacity: 0, y: 8}}
            animate={{
                opacity: 1,
                y: 0,
                transition: {...childTransition, delay: 0.08},
            }}
        >
            {examples.map((example, index) => (
                <motion.div
                    key={`${example}-${index}`}
                    className="flex items-start gap-2 rounded-lg border-1 border-saffron-150 bg-saffron-50 px-2 py-2 dark:border-saffron-800 dark:bg-saffron-950/20"
                    initial={{opacity: 0, x: -6}}
                    animate={{
                        opacity: 1,
                        x: 0,
                        transition: {...childTransition, delay: 0.12 + index * 0.04},
                    }}
                >
                    <span className="text-[15px] font-medium text-saffron-400 dark:text-saffron-300">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base leading-relaxed text-saffron-700 dark:text-space-200">
                        {example}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
}

export interface VocabularyCardProps {
    imageSrc: string;
    faText: string;
    enWord: string;
    definition: string;
    examples: string[];
    className?: string;
    animationControlled?: boolean;
    motionProps?: HTMLMotionProps<"div">;
    prevImageSrc?: string;
    prevImageLabel?: string;
    nextImageSrc?: string;
    nextImageLabel?: string;
    imageDragProps?: ImageDragMotionProps;
    imageDragValue?: MotionValue<number>;
    footer?: ReactNode;
}

/**
 * VocabularyCard - Responsive bilingual vocabulary display component.
 * Excludes navigation buttons; caller provides layout controls.
 */
const VocabularyCard = forwardRef<HTMLDivElement, VocabularyCardProps>(
    function VocabularyCard(
        {
            imageSrc,
            faText,
            enWord,
            definition,
            examples,
            className,
            animationControlled = false,
            motionProps,
            prevImageSrc,
            prevImageLabel,
            nextImageSrc,
            nextImageLabel,
            imageDragProps,
            imageDragValue,
            footer,
        },
        ref,
    ) {
        const {
            initial: overrideInitial,
            animate: overrideAnimate,
            exit: overrideExit,
            className: motionClassName,
            ...restMotion
        } = motionProps ?? {};

        const rootClassName = [
            "flex w-full flex-col items-center justify-center gap-5",
            className,
        ]
            .filter(Boolean)
            .join(" ");
        const motionContainerClassName = [
            "flex w-full justify-center origin-center [transform-style:preserve-3d]",
            motionClassName,
        ]
            .filter(Boolean)
            .join(" ");

        const initial = overrideInitial ?? (animationControlled ? false : {opacity: 0, scale: 0.92, y: 6});
        const animate =
            overrideAnimate ??
            (animationControlled
                ? undefined
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {...baseTransition, delay: 0.12},
                });

        console.log(CARD_LOG_PREFIX, "VocabularyCard render", {
            enWord,
            animationControlled,
            hasMotionOverrides: Boolean(motionProps),
            initial,
            animate,
            exit: overrideExit,
            hasFooter: Boolean(footer),
        });

        return (
            <div className={rootClassName} data-vocab-card-root="">
                {/* Mobile image */}
                <div className="block w-full md:hidden" data-vocab-card-mobile-image="">
                    <RenderImage
                        imageSrc={imageSrc}
                        enWord={enWord}
                        faText={faText}
                        prevImageSrc={prevImageSrc}
                        prevImageLabel={prevImageLabel}
                        nextImageSrc={nextImageSrc}
                        nextImageLabel={nextImageLabel}
                        dragMotionProps={imageDragProps}
                        dragValue={imageDragValue}
                    />
                </div>

                {/* Card container */}
                <motion.div
                    ref={ref}
                    data-vocab-card-container=""
                    {...restMotion}
                    initial={initial}
                    animate={animate}
                    exit={overrideExit}
                    className={motionContainerClassName}
                >
                    <Card
                        tone="White"
                        rounded="xl"
                        elevation="none"
                        align="left"
                        padding="lg"
                        className="transition-all duration-300 hover:ring-2 ring-celestialblue-100/50"
                    >
                        <div
                            className="flex w-full flex-col items-center gap-6 md:flex-col lg:flex-row"
                            data-vocab-card-panel=""
                        >
                            {/* Image section (desktop) */}
                            <div className="hidden md:block" data-vocab-card-image-desktop="">
                                <RenderImage imageSrc={imageSrc} enWord={enWord} faText={faText} />
                            </div>

                            {/* Content section */}
                            <div
                                className="flex w-full h-full p-1 flex-col items-start justify-between gap-4 md:max-w-[628px] md:justify-between"
                                data-vocab-card-content=""
                            >
                                <motion.div
                                    className="flex flex-col items-start justify-center"
                                    initial={{opacity: 0, y: 10}}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {...childTransition, delay: 0.05},
                                    }}
                                >
                                    <Title className="md:mt-10" tone={"Saffron"}>{enWord}</Title>
                                    <motion.p
                                        className="text-base text-saffron-700 dark:text-space-200 md:text-[20px]"
                                        initial={{opacity: 0, y: 6}}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            transition: {...childTransition, delay: 0.08},
                                        }}
                                    >
                                        {definition}
                                    </motion.p>
                                </motion.div>
                                <ExamplesList examples={examples} />
                            </div>
                        </div>
                    </Card>
                </motion.div>
                {footer ? (
                    <>
                        {console.log(CARD_LOG_PREFIX, "Footer render", { enWord })}
                        {footer}
                    </>
                ) : null}
            </div>
        );
    },
);

export default VocabularyCard;
