import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../utils/cn";
import InfoButtons from "./InfoButtons";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {useState} from "react";

/* ----------------------------- Variants ----------------------------- */

const breadcrumbVariants = cva(
    "flex items-left justify-between w-full rounded-md transition-colors duration-300",
    {
        variants: {
            tone: {
                default: "text-space-400",
            },
        },
        defaultVariants: {
            tone: "default",
        },
    }
);

export type BreadcrumbVariants = VariantProps<typeof breadcrumbVariants>;

/* ----------------------------- Types ----------------------------- */

interface BreadcrumbProps extends BreadcrumbVariants {
    items: Array<{title: string; href: string}>;
}

/* ----------------------------- Component ----------------------------- */

export default function Breadcrumb({
    items,
    tone,
}: BreadcrumbProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const prefersReducedMotion = useReducedMotion() ?? false;
    const hasMultiple = items.length > 1;
    const lastItem = items[items.length - 1];
    return (
        <motion.div
            className={cn(breadcrumbVariants({tone}), "relative")}
            initial={prefersReducedMotion ? undefined : {opacity: 0, y: 6}}
            whileInView={prefersReducedMotion ? undefined : {opacity: 1, y: 0}}
            transition={prefersReducedMotion ? undefined : {duration: 0.35, ease: [0.33, 1, 0.68, 1]}}
            viewport={prefersReducedMotion ? undefined : {once: true, amount: 0.6}}
        >
            {/* Breadcrumb text group — keep LTR flow */}
            <div className="flex min-w-0 flex-1 items-center text-celestialblue-700 dark:text-celestialblue-200">
                <div className="hidden items-center gap-1/2 font-medium md:flex">
                    {items.map((item, index) => (
                        <span key={`${item.title}-${item.href}`} className="flex items-center gap-1/2">
                            <a
                                href={item.href}
                                className={cn(
                                    index === items.length - 1
                                        ? "font-semibold"
                                        : "hover:underline cursor-pointer"
                                )}
                            >
                                {item.title}
                            </a>
                            {index < items.length - 1 && (
                                <span className="text-space-150">/</span>
                            )}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    {lastItem ? (
                        <a href={lastItem.href} className="font-semibold">
                            {lastItem.title}
                        </a>
                    ) : null}
                    {hasMultiple ? (
                        <button
                            type="button"
                            aria-label="Show breadcrumb items"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-space-100 bg-white text-space-500 shadow-sm transition hover:text-space-700 cursor-pointer"
                        >
                            <span className="material-symbols-rounded !text-lg">menu</span>
                        </button>
                    ) : null}
                </div>

                {hasMultiple ? (
                    <AnimatePresence>
                        {isMenuOpen ? (
                            <motion.div
                                className="absolute left-0 top-full mt-2 w-fit max-w-[300px] rounded-xl border border-space-100 bg-white p-2 shadow-lg md:hidden"
                                initial={
                                    prefersReducedMotion
                                        ? undefined
                                        : {opacity: 0, y: -6}
                                }
                                animate={
                                    prefersReducedMotion
                                        ? undefined
                                        : {opacity: 1, y: 0}
                                }
                                exit={
                                    prefersReducedMotion
                                        ? undefined
                                        : {opacity: 0, y: -6}
                                }
                                transition={
                                    prefersReducedMotion
                                        ? undefined
                                        : {duration: 0.2, ease: [0.33, 1, 0.68, 1]}
                                }
                            >
                                <div className="flex flex-col divide-y divide-space-100 text-sm">
                                    {items.map((item, index) => (
                                        <a
                                            key={`${item.title}-${item.href}-mobile`}
                                            href={item.href}
                                            className={cn(
                                                "px-3 py-2 text-space-700 transition hover:text-celestialblue-600",
                                                index === items.length - 1 ? "font-semibold" : null
                                            )}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                ) : null}
            </div>
            <div className="flex items-center gap-1.5">
                <InfoButtons variant={"info"} hasIcon icon={"info"} label={"About"} />
                <InfoButtons variant={"level"} band={5.5} />
            </div>

        </motion.div>
    );
}
