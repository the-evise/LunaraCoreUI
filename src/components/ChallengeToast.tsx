import type { FC, ReactElement } from "react";
import { SectionStatus } from "./QuizCard";

/* ----------------------------- XP Badge ----------------------------- */
const XPBadge: FC<{ value: number }> = ({ value }) => (
    <div className="w-fit flex px-[12px] py-[2px] rounded-full bg-emerald-500 text-saffron-50 font-black text-sm">
        {value} XP
    </div>
);

/* ----------------------------- Toast Body ----------------------------- */
const ToastBody: FC<{ message: string }> = ({ message }) => (
    <p className="font-bold text-right text-space-400 text-sm md:text-base">
        {message}
    </p>
);

/* ----------------------------- Challenge Toast ----------------------------- */
interface ChallengeToastProps {
    message: string;
    xp: number;
    status?: "success" | "failed" | "neutral";
}

const ChallengeToast: FC<ChallengeToastProps> = ({ message, xp, status="neutral" }): ReactElement => {
    return (
        <div className="w-auto min-w-[400px] max-w-[600px] flex flex-row-reverse justify-between items-center overflow-hidden z-10 border-1 bg-space-50 border-space-150 rounded-full p-[12px]">
            <div className="flex flex-row-reverse gap-2 items-center">
                <SectionStatus status={status} variant="mobile" />
                <ToastBody message={message} />
            </div>
            <XPBadge value={xp} />
        </div>
    );
};

export default ChallengeToast;
