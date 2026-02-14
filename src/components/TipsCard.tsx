import {
    Children,
    cloneElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { cn } from "../utils/cn";
import { motion, useAnimationControls, useInView, useReducedMotion } from "motion/react";
import Card from "./Card";
import DashboardMessage from "./DashboardMessage";
import Title from "./Title";

/* ----------------------------- Item ----------------------------- */

type TipItemProps = {
    children: ReactNode;
    index?: number;
    total?: number;
};

function TipItem({ children, index = 0, total = 1 }: TipItemProps) {
    const isLast = index >= total - 1;
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            className="flex w-full flex-col"
            initial={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: 18, scale: 0.97 }
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
            viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.45 }}
        >
            <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
                <motion.div
                    className="flex-1 min-w-[220px]"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
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
                    viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.45 }}
                >
                    {children}
                </motion.div>

                <motion.span
                    className="text-persianred-200/30 text-2xl md:text-[36px] lg:text-[44px] font-bold leading-[1] font-dmsans select-none justify-self-end"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8, rotate: -4 }}
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
                    viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.45 }}
                >
                    {String(index + 1).padStart(2, "0")}
                </motion.span>
            </div>

            {!isLast && (
                <motion.div
                    className="my-4 w-full border-t border-persianred-200/40"
                    aria-hidden
                    initial={prefersReducedMotion ? undefined : { scaleX: 0, opacity: 0 }}
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
                    viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.35 }}
                />
            )}
        </motion.div>
    );
}
TipItem.displayName = "TipCard.Item";

/* ----------------------------- Subcomponents ----------------------------- */

function TipTitle({ children }: { children: ReactNode }) {
    return (
        <Title
            tone="PersianRed_alt"
            size={4}
            className="mb-1 text-persianred-600 font-semibold tracking-tight"
        >
            {children}
        </Title>
    );
}

function TipBody({ children }: { children: ReactNode }) {
    return (
        <p className="text-persianred-800 text-[14px] sm:text-[17px] font-semibold leading-relaxed">
            {children}
        </p>
    );
}

function TipDescription({ children }: { children: ReactNode }) {
    return (
        <p className="text-space-700 text-[12px] sm:text-[15px] mt-1 leading-relaxed">
            {children}
        </p>
    );
}

/* ----------------------------- Main ----------------------------- */

function TipCard({ children, title="Tips" }: { children: ReactNode, title: string }) {
    const prefersReducedMotion = useReducedMotion();
    const shellControls = useAnimationControls();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(containerRef, { margin: "-12% 0px", once: true });

    useEffect(() => {
        if (prefersReducedMotion) {
            shellControls.set({ opacity: 1, y: 0 });
            return;
        }
        if (inView) {
            shellControls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
            });
        }
    }, [inView, prefersReducedMotion, shellControls]);

    const items = useMemo(
        () =>
            Children.toArray(children).filter(
                (child) =>
                    isValidElement(child) &&
                    ((child as any).type === TipItem ||
                        (child as any).type?.displayName === "TipCard.Item")
            ) as ReactElement<TipItemProps>[],
        [children]
    );

    return (
        <motion.div
            ref={containerRef}
            className="flex w-full flex-col items-center"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18, scale: 0.97 }}
            animate={shellControls}
        >
            <Card
                tone="White"
                padding="sm"
                rounded="3xl"
                align="left"
                className="flex w-full flex-col bg-space-10/40 border border-space-100"
            >
                <Title
                    tone="PersianRed_dark"
                    size={3}
                    className="text-[28px] font-light tracking-wide mb-2 mx-auto leading-[50px]"
                    >
                    {title.toUpperCase()}
                </Title>
                <Card
                    tone="PersianRed"
                    padding="md"
                    align="left"
                    rounded="xmd"
                    className="flex flex-col"
                >
                    {items.length > 0 ? (
                        items.map((child, index) =>
                            cloneElement(child, { index, total: items.length })
                        )
                    ) : (
                        <DashboardMessage
                            tone="warning"
                            align="left"
                            size="sm"
                            title="No tips yet"
                            description="Tips will appear after this lesson review is generated."
                            className="max-w-none border-persianred-200/60 bg-space-10/80"
                        >
                            Complete a section or refresh content to load practice tips.
                        </DashboardMessage>
                    )}
                </Card>
            </Card>
        </motion.div>
    );
}

/* ----------------------------- Compound API ----------------------------- */

TipCard.Item = TipItem;
TipCard.Title = TipTitle;
TipCard.Body = TipBody;
TipCard.Description = TipDescription;

export default TipCard;
