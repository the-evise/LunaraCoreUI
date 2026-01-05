import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import IconButton from "./IconButton";
import QuizCard from "./QuizCard";

function EvaluationFooter() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Toggleable container above footer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                        className="fixed bottom-[92px] left-0 w-full bg-white border-t border-b border-space-150 shadow-[0_0_10px_rgba(38,46,61,0.12)] z-40"
                    >
                        <QuizCard xp={54} grade={"D"} time={"02:23"} frameless/>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="w-full h-[92px] flex items-center justify-between px-4 bg-white shadow-[0_0_10px_rgba(38,46,61,0.12)] fixed bottom-0 left-0 z-50">
                <button className="flex-1 h-12 text-base font-bold rounded-full bg-celestialblue-400 text-celestialblue-10">
                    ارزیابی
                </button>

                <div className="ml-3">
                    <IconButton
                        variant="solid"
                        rounded
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        {!isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                    </IconButton>
                </div>
            </footer>
        </>
    );
}

export default EvaluationFooter;
