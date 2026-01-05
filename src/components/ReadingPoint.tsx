import {
    Children,
    cloneElement,
    isValidElement,
    useEffect,
    useMemo,
    useRef,
    type ReactElement,
    type ReactNode,
} from "react";
import Card from "./Card";
import Title from "./Title";
import {cn} from "../utils/cn";
import {motion, useAnimationControls, useInView, useReducedMotion} from "motion/react";

/* ----------------------------- Item ----------------------------- */
type ReadingPointItemProps = {
    children: ReactNode;
    index?: number;
    total?: number;
};

function Item({children, index = 0, total = 1}: ReadingPointItemProps) {
    const isLast = index >= total - 1;
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            className="flex w-full flex-col"
            initial={
                prefersReducedMotion
                    ? undefined
                    : {opacity: 0, y: 18, scale: 0.97}
            }
            whileInView={
                prefersReducedMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                            duration: 0.5,
                            ease: [0.2, 0.8, 0.2, 1],
                            delay: Math.min(index * 0.08, 0.4),
                        },
                    }
            }
            viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.45}}
        >
            <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
                <motion.div
                    className="flex-1 min-w-[220px]"
                    initial={prefersReducedMotion ? undefined : {opacity: 0, y: 8}}
                    whileInView={
                        prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.35,
                                    ease: [0.33, 1, 0.68, 1],
                                    delay: Math.min(0.1 + index * 0.05, 0.25),
                                },
                            }
                    }
                    viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.45}}
                >
                    {children}
                </motion.div>
                <motion.span
                    className="text-celestialblue-300/30 text-2xl md:text-[36px] lg:text-[44px] font-bold leading-[1] font-dmsans select-none justify-self-end"
                    initial={prefersReducedMotion ? undefined : {opacity: 0, scale: 0.8, rotate: -4}}
                    whileInView={
                        prefersReducedMotion
                            ? undefined
                            : {
                                opacity: 1,
                                scale: 1,
                                rotate: 0,
                                transition: {
                                    type: "spring",
                                    stiffness: 320,
                                    damping: 26,
                                    delay: Math.min(0.12 + index * 0.06, 0.28),
                                },
                            }
                    }
                    viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.45}}
                >
                    {String(index + 1).padStart(2, "0")}
                </motion.span>
            </div>

            {!isLast && (
                // line
                <motion.div
                    className="my-4 w-full border-t border-celestialblue-150/50"
                    aria-hidden
                    initial={prefersReducedMotion ? undefined : {scaleX: 0, opacity: 0}}
                    whileInView={
                        prefersReducedMotion
                            ? undefined
                            : {
                                scaleX: 1,
                                opacity: 1,
                                transition: {
                                    duration: 0.4,
                                    ease: [0.33, 1, 0.68, 1],
                                    delay: Math.min(0.18 + index * 0.05, 0.35),
                                },
                            }
                    }
                    viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.35}}
                />
            )}
        </motion.div>
    );
}
Item.displayName = "ReadingPoint.Item";

/* ----------------------------- Subcomponents ----------------------------- */
function PointTitle({children}: {children: ReactNode}) {
    return (
        <Title
            tone="CelestialBlue_alt"
            size={4}
            className="mb-1 text-celestialblue-400 font-semibold tracking-tight"
        >
            {children}
        </Title>
    );
}

function PointBody({children}: {children: ReactNode}) {
    return (
        <p className="text-celestialblue-600 text-[14px] sm:text-[17px] font-semibold leading-relaxed">
            {children}
        </p>
    );
}

function PointDescription({children}: {children: ReactNode}) {
    return (
        <p className="text-space-700 text-[12px] sm:text-[15px] mt-1 leading-relaxed">
            {children}
        </p>
    );
}

/* ----------------------------- Main ----------------------------- */
function ReadingPoint({children}: {children: ReactNode}) {
    const prefersReducedMotion = useReducedMotion();
    const shellControls = useAnimationControls();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(containerRef, {margin: "-12% 0px", once: true});

    useEffect(() => {
        if (prefersReducedMotion) {
            shellControls.set({opacity: 1, y: 0});
            return;
        }
        if (inView) {
            shellControls.start({
                opacity: 1,
                y: 0,
                transition: {duration: 0.55, ease: [0.2, 0.8, 0.2, 1]},
            });
        }
    }, [inView, prefersReducedMotion, shellControls]);

    const items = useMemo(
        () =>
            Children.toArray(children).filter(
                (child) =>
                    isValidElement(child) &&
                    ((child as any).type === Item ||
                        (child as any).type?.displayName === "ReadingPoint.Item")
            ) as ReactElement<ReadingPointItemProps>[],
        [children],
    );

    return (
        <motion.div
            ref={containerRef}
            className="flex w-full flex-col items-center"
            initial={prefersReducedMotion ? undefined : {opacity: 0, y: 18, scale: 0.97}}
            animate={shellControls}
        >
            <Card
                tone="White"
                padding="sm"
                rounded="3xl"
                align="left"
                className={cn(
                    "flex w-full flex-col bg-space-25/40 border border-space-100"
                )}
            >
                <Card
                    tone={"CelestialBlue"}
                    padding={"md"}
                    align={"left"}
                    rounded={"xmd"}
                    className={"flex flex-col"}
                >
                    {items.map((child, index) =>
                        cloneElement(child, {index, total: items.length})
                    )}
                </Card>
            </Card>
        </motion.div>
    );
}

/* ----------------------------- Compound API ----------------------------- */
type ReadingPointCompound = typeof ReadingPoint & {
    Item: typeof Item;
    Title: typeof PointTitle;
    Body: typeof PointBody;
    Description: typeof PointDescription;
};

const ReadingPointComponent = ReadingPoint as ReadingPointCompound;
ReadingPointComponent.Item = Item;
ReadingPointComponent.Title = PointTitle;
ReadingPointComponent.Body = PointBody;
ReadingPointComponent.Description = PointDescription;

export default ReadingPointComponent;
