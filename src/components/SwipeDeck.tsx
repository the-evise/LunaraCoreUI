"use client";

import * as motion from "motion/react-client";
import { AnimatePresence, usePresenceData, wrap } from "motion/react";
import { useCallback, useState } from "react";
import { cn } from "../utils/cn";

export interface SwipeDeckProps<T> {
    items: T[];
    activeIndex: number;
    onChange: (next: number) => void;
    renderCard: (item: T, isActive: boolean) => React.ReactNode;
    cardWidth?: number | string;
    previewLeft?: React.ReactNode;
    previewRight?: React.ReactNode;
    placeholderColor?: string;
}

export function SwipeDeck<T>({
                                 items,
                                 activeIndex,
                                 onChange,
                                 renderCard,
                                 cardWidth = "min(82vw,380px)",
                                 previewLeft,
                                 previewRight,
                                 placeholderColor = "rgba(255,255,255,0.6)",
                             }: SwipeDeckProps<T>) {
    const [isTransitioning, setIsTransitioning] = useState(false);

    const setSlide = useCallback(
        (dir: 1 | -1) => {
            if (isTransitioning) return;
            setIsTransitioning(true);

            const next = wrap(0, items.length, activeIndex + dir);
            console.log(next);

            // Delay change to sync with exit animation
            setTimeout(() => {
                onChange(next);
                setIsTransitioning(false);
            }, 280);
        },
        [activeIndex, items.length, onChange, isTransitioning]
    );
    console.log(isTransitioning);

    return (
        <div className="relative flex w-full items-center justify-center overflow-hidden">
            {/* Static left preview */}
            <div className="hidden sm:block scale-90 opacity-50">{previewLeft}</div>

            {/* Active animated card */}
            <div className="relative" style={{ width: cardWidth }}>
                <AnimatePresence custom={1}  initial={false}>
                    <Slide
                        key={activeIndex}
                        item={items[activeIndex]}
                        renderCard={renderCard}
                        onSwipeLeft={() => setSlide(1)}
                        onSwipeRight={() => setSlide(-1)}
                        placeholderColor={placeholderColor}
                    />
                </AnimatePresence>
            </div>

            {/* Static right preview */}
            <div className="hidden sm:block scale-90 opacity-50">{previewRight}</div>
        </div>
    );
}

/* ----------------------------- Central Slide ----------------------------- */
function Slide<T>({
                      item,
                      onSwipeLeft,
                      onSwipeRight,
                      renderCard,
                      placeholderColor,
                  }: {
    item: T;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    renderCard: (item: T, isActive: boolean) => React.ReactNode;
    placeholderColor: string;
}) {
    const direction = usePresenceData() as 1 | -1 | undefined;

    return (
        <motion.div
            key={String(item)}
            layout={false}
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={(_, info) => {
                const travel = info.offset.x + info.velocity.x * 120;
                if (travel < -80) onSwipeLeft();
                else if (travel > 80) onSwipeRight();
            }}
            style={{ y: 0 }}
            initial={{ opacity: 0, x: (direction ?? 1) * 80, y: 0, scale: 0.98 }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                transition: {
                    type: "spring",
                    visualDuration: 0.35,
                    bounce: 0.25,
                    delay: 0.05,
                },
            }}
            exit={{
                opacity: 0,
                x: -1 * (direction ?? 1) * 80,
                y: 0,
                scale: 0.98,
                transition: { duration: 0.25 },
            }}
            className="relative z-10 cursor-grab active:cursor-grabbing"
        >
            {/* Placeholder layer — creates illusion of an empty card sliding in */}
            <motion.div
                key="placeholder"
                className="absolute inset-0 rounded-3xl"
                style={{ backgroundColor: placeholderColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
            />
            <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.15 } }}
                exit={{ opacity: 1, transition: { duration: 0.2 } }}
            >
                {renderCard(item, true)}
            </motion.div>
        </motion.div>
    );
}
