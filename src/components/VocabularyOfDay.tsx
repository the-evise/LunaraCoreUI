import "material-symbols";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../utils/cn";

export type VocabularyOfDayImage = {
    src: string;
    alt?: string;
    label?: string;
};

export type VocabularyExample = {
    text: string;
    translation?: string;
};

export type VocabularyOfDayProps = {
    word: string;
    meaning: string;
    translation?: string;
    phonetic?: string;
    partOfSpeech?: string;
    examples?: VocabularyExample[];
    images?: VocabularyOfDayImage[];
    label?: string;
    subtitle?: string;
    badgeLabel?: string;
    className?: string;
};

const cardVariants = cva(
    "group w-full 2xl:w-[446px] h-[400px] flex flex-col rounded-3xl bg-white/80 text-space-900 ring-1 ring-space-100/70 transition-colors duration-300 ease-out select-none",
);

const EASE = [0.33, 1, 0.68, 1] as const;
const baseTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 0.1,
} as const;

export default function VocabularyOfDay({
    word,
    meaning,
    translation,
    phonetic,
    partOfSpeech,
    examples,
    images,
    label = "Vocabulary of the day",
    subtitle = "Daily focus",
    badgeLabel = "Today",
    className,
}: VocabularyOfDayProps) {
    const prefersReducedMotion = useReducedMotion();

    const resolvedImages = (images ?? []).slice(0, 1);
    const resolvedExamples = (examples ?? []).slice(0, 2);
    const primaryImage = resolvedImages[0];
    const showImage = Boolean(primaryImage);
    const showMeaning = !showImage;

    return (
        <motion.div
            className={cn(cardVariants(), className)}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={
                prefersReducedMotion
                    ? undefined
                    : { opacity: 1, y: 0, transition: baseTransition }
            }
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : { y: -4, transition: baseTransition }
            }
            style={{ willChange: prefersReducedMotion ? undefined : "transform, opacity" }}
        >
            <div className="flex items-center justify-between gap-3 px-4 pt-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600">
                        <span className="material-symbols-rounded text-2xl" aria-hidden="true">
                            auto_stories
                        </span>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-space-400">
                            {label}
                        </p>
                        <p className="text-sm text-space-500">{subtitle}</p>
                    </div>
                </div>
                <div className="rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-700 self-end">
                    {badgeLabel}
                </div>
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-between gap-4 m-4 rounded-2xl bg-space-50/80 p-2">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-3xl font-semibold text-space-900 font-dmsans">
                        {word}
                    </h3>
                    {partOfSpeech ? (
                        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-space-500">
                            {partOfSpeech}
                        </span>
                    ) : null}
                    {phonetic ? (
                        <span className="text-sm text-space-500 font-dmsans">
                            {phonetic}
                        </span>
                    ) : null}
                </div>

                <div>
                    {showMeaning ? (
                        <>
                            <p className="text-lg text-space-800">{meaning}</p>
                            {translation ? (
                                <p className="mt-1 text-sm text-space-500">{translation}</p>
                            ) : null}
                        </>
                    ) : null}
                    {showImage && primaryImage ? (
                        <div className="relative mt-3 overflow-hidden rounded-xl bg-white/70 self-end">
                            <img
                                src={primaryImage.src}
                                alt={primaryImage.alt ?? word}
                                className="h-36 w-full object-cover"
                                loading="lazy"
                            />
                            {primaryImage.label ? (
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-space-900/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-space-10">
                                    {primaryImage.label}
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                {!showImage ? (
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">
                            Examples
                        </p>
                        {resolvedExamples.length ? (
                            <div className="mt-2 space-y-2">
                                {resolvedExamples.map((example, index) => (
                                    <div
                                        key={`${example.text}-${index}`}
                                        className="rounded-xl bg-white/80 px-3 py-2"
                                    >
                                        <p className="text-sm text-space-700">
                                            {example.text}
                                        </p>
                                        {example.translation ? (
                                            <p className="mt-1 text-xs text-space-500">
                                                {example.translation}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-space-500">
                                Add examples to reinforce recall.
                            </p>
                        )}
                    </div>
                ) : null}
            </div>
        </motion.div>
    );
}
