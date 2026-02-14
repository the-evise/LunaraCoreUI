import { motion, useReducedMotion } from "motion/react";

interface SectionStatusProps {
    status: "success" | "failed" | "neutral";
    title?: string;
    variant?: "desktop" | "mobile";
}

const SectionStatus = ({
    status,
    title,
    variant = "desktop",
}: SectionStatusProps) => {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const isMobile = variant === "mobile";
    const baseTransition = { duration: 0.35, ease: [0.33, 1, 0.68, 1] as const };
    const desktopBase = { opacity: [0.92, 1], y: [6, 0] };
    const desktopAnimation =
        status === "success"
            ? {
                ...desktopBase,
                scale: [1, 1.06, 1],
                transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const },
            }
            : status === "failed"
                ? {
                    ...desktopBase,
                    x: [0, -3, 3, -2, 2, 0],
                    transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] as const },
                }
                : {
                    ...desktopBase,
                    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] as const },
                };
    const animation = prefersReducedMotion
        ? undefined
        : isMobile
            ? { opacity: [0, 1], y: [4, 0], transition: baseTransition }
            : desktopAnimation;

    return (
        <div className="flex items-center gap-2 text-space-600 select-none">
            <motion.div
                className={`flex justify-center items-center rounded-full ${
                    isMobile ? "w-8 h-8" : "w-15 h-15"
                } ${
                    status === "success"
                        ? "bg-gradient-to-b from-[#32DE8A] to-[#32D284]"
                        : status === "failed"
                            ? "bg-persianred-400"
                            : isMobile
                                ? "bg-gradient-to-b from-[#E3E5EA] to-[#E9EBEF] shadow-[inset_0_-1px_2px_rgba(38,46,64,0.1)]"
                                : "bg-gradient-to-b from-[#E3E5EA] to-[#E9EBEF] shadow-[inset_0_-1px_4px_rgba(38,46,64,0.1)]"
                }`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={animation}
            >
                <div
                    className={`flex items-center justify-center rounded-full ${
                        isMobile ? "w-6 h-6" : "w-12 h-12"
                    } ${status === "neutral" ? "bg-transparent" : "bg-white"}`}
                >
                    <span
                        className={`${
                            status === "neutral" ? "material-symbols-fill" : ""
                        } material-symbols-rounded !font-bold ${
                            status === "success"
                                ? `${
                                    isMobile
                                        ? "text-[#10BB67] !text-[22px] -translate-x-[1px]"
                                        : "!text-4xl text-[#10BB67] -translate-x-[1px]"
                                }`
                                : status === "failed"
                                    ? `${
                                        isMobile
                                            ? "text-persianred-400 !text-[22px]"
                                            : "!text-4xl text-persianred-400"
                                    }`
                                    : `${
                                        isMobile
                                            ? "text-space-10 drop-shadow-[0_0_4px_rgba(38,46,64,0.1)] !text-[22px]"
                                            : "text-space-10 drop-shadow-[0_0_6px_rgba(38,46,64,0.1)] !text-[26px]"
                                    }`
                        }`}
                    >
                        {status === "success"
                            ? "check"
                            : status === "failed"
                                ? "priority_high"
                                : "brightness_1"}
                    </span>
                </div>
            </motion.div>
            <div className="text-space-600 text-base" dir="rtl">
                {title}
            </div>
        </div>
    );
};

export type { SectionStatusProps };
export default SectionStatus;
