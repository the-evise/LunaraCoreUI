import type {FC, ReactElement} from "react";
import {motion} from "motion/react";
import SectionStatus from "./SectionStatus";

/* ----------------------------- XP Badge ----------------------------- */
const XPBadge: FC<{ value: number }> = ({value}) => (
    <div className="w-fit flex px-[12px] py-[4px] rounded-full bg-emerald-500 text-saffron-50 font-black text-sm justify-center text-center">
        {value} <span className="hidden md:inline">XP</span>
    </div>
);

/* ----------------------------- Toast Body ----------------------------- */
const ToastBody: FC<{ message: string }> = ({message}) => (
    <p className="font-bold text-right text-space-400 text-[10px] md:text-base">
        {message}
    </p>
);

/* ----------------------------- Challenge Toast ----------------------------- */
interface ChallengeToastProps {
    message: string;
    xp: number;
    status?: "success" | "failed" | "neutral";
}

const ChallengeToast: FC<ChallengeToastProps> = ({message, xp, status = "neutral"}): ReactElement => {
    const statusAnimationKey = `${status}-${xp}-${message}`;

    return (
        <motion.div
            className="w-auto min-w-[300px] max-w-[800px] flex flex-row justify-between items-center overflow-hidden z-10 border-1 bg-space-50 border-space-150 rounded-full p-1 md:p-[12px] gap-4 md:gap-8"
            initial={{opacity: 0, y: -6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 6}}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.1,
            }}
        >
            <div className="flex flex-row gap-2 items-center">
                <SectionStatus key={statusAnimationKey} status={status} variant="mobile"/>
                <ToastBody message={message}/>
            </div>
            <XPBadge value={xp}/>
        </motion.div>
    );
};

export default ChallengeToast;
