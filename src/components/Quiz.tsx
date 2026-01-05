import {cva, type VariantProps} from "class-variance-authority";
import "material-symbols";
import React, {
    Children,
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    useCallback,
    useContext,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import LessonProgressIndicator from "./LessonProgressIndicator";
import {cn} from "../utils/cn";
import {QuizData, QuizQuestion} from "./LessonContent";
import Progress from "./Progress";

/* --------------------------- Question Component --------------------------- */

const questionVariants = cva(
    "inline-block align-middle items-center w-full px-6 py-4 text-xl font-normal text-space-800 leading-[38px] select-none break-words lg:max-w-[860px] lg:px-8 lg:py-6 lg:text-3xl lg:leading-[60px]",
);

interface QuestionProps {
    children: ReactNode;
    className?: string;
}

const blankVariants = cva(
    "inline-flex min-h-[40px] min-w-[100px] justify-center rounded-md px-3 text-lg transition-all duration-200 ease-in-out text-center border border-solid align-middle items-center relative bottom-[2px] lg:min-h-[50px] lg:min-w-[130px] lg:rounded-lg lg:px-4 lg:text-xl lg:bottom-[3px]",
    {
        variants: {
            state: {
                empty: "border-space-100 bg-space-50 text-space-150 items-end",
                correct: "items-center",
                incorrect: "items-center",
            },
            mode: {
                quiz: "",
                review: "",
            },
        },
        compoundVariants: [
            // --- QUIZ MODE ---
            {
                mode: "quiz",
                state: ["correct", "incorrect"],
                class: "border-saffron-400 bg-saffron-800 text-saffron-100",
            },

            // --- REVIEW MODE ---
            {
                mode: "review",
                state: "correct",
                class: "border-emerald-400 bg-emerald-800 text-emerald-100",
            },
            {
                mode: "review",
                state: "incorrect",
                class: "border-persianred-400 bg-persianred-800 text-persianred-100",
            },
        ],
        defaultVariants: {
            state: "empty",
            mode: "quiz",
        },
    }
);

type BlankState = VariantProps<typeof blankVariants>["state"];

interface BlankProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    children?: ReactNode;
    placeholder?: string;
    state?: BlankState;
    mode?: "quiz" | "review";
    className?: string;
}

function QuestionBase({children, className}: QuestionProps) {
    return (
        <p className={cn(questionVariants(), className)}>
            {children}
        </p>
    );
}

function Blank({
                   children,
                   placeholder = "________",
                   state,
                   mode = "quiz",
                   className,
                   ...rest
               }: BlankProps) {
    return (
        <span
            aria-live="polite"
            className={cn(blankVariants({state, mode}), className)}
            {...rest}
        >
            {children ?? placeholder}
        </span>
    );
}

export const Question = Object.assign(QuestionBase, {Blank});

/* -------------------------- Answer Options Group -------------------------- */

interface AnswerSelection {
    label: string;
    isCorrect: boolean;
}

interface AnswerOptionsContextValue {
    correctIndex: number;
    selectedIndex: number | null;
    selectOption: (index: number, label: string) => void;
    mode: "quiz" | "review";
    disabled?: boolean;
}

const AnswerOptionsContext = createContext<AnswerOptionsContextValue | null>(null);

function useAnswerOptionsContext() {
    const ctx = useContext(AnswerOptionsContext);
    if (!ctx) throw new Error("AnswerOptions.Option must be used inside <AnswerOptions>");
    return ctx;
}

const containerVariants = cva("flex w-full flex-col gap-3 max-w-[480px] lg:max-w-[620px] lg:gap-4");

const optionVariants = cva(
    "flex w-full items-center gap-3 rounded-lg border-2 px-4 py-4 text-lg text-left transition-all duration-200 ease-in-out select-none lg:gap-4 lg:rounded-xl lg:border-3 lg:px-6 lg:py-5 lg:text-xl",
    {
        variants: {
            tone: {
                idle: "cursor-pointer",
                correct: "",
                incorrect: "",
            },
            mode: {
                quiz: "",
                review: "",
            },
            disabled: {
                true: "pointer-events-none",
                false: ""
            },
        },
        compoundVariants: [
            // --- QUIZ MODE ---
            {
                mode: "quiz",
                tone: "idle",
                class:
                    "border-space-150 bg-space-10 text-space-800 hover:border-saffron-200 hover:bg-saffron-10 hover:text-saffron-700 [&>span:last-child]:text-space-200 hover:[&>span:last-child]:text-saffron-200",
            },
            {
                mode: "quiz",
                tone: ["correct", "incorrect"], // ✅ both treated as "selected"
                class:
                    "border-saffron-300 bg-saffron-50 text-saffron-800 [&>span:last-child]:text-saffron-400",
            },

            // --- REVIEW MODE ---
            {
                mode: "review",
                tone: "idle",
                class:
                    "border-space-100 bg-space-10 text-space-700 hover:border-space-200 hover:text-space-800 [&>span:last-child]:text-space-200 hover:[&>span:last-child]:text-space-250",
            },
            {
                mode: "review",
                tone: "correct",
                class:
                    "border-emerald-500 bg-emerald-10 text-emerald-800 [&>span:last-child]:text-emerald-400",
            },
            {
                mode: "review",
                tone: "incorrect",
                class:
                    "border-persianred-500 bg-persianred-10 text-persianred-800 [&>span:last-child]:text-persianred-400",
            },
        ],
        defaultVariants: {
            tone: "idle",
            mode: "quiz",
            disabled: false,
        },
    }
);


interface AnswerOptionProps {
    correctIndex: number;
    children: ReactNode;
    className?: string;
    onAnswer: (result: AnswerSelection) => void;
}

interface OptionProps {
    children: ReactNode;
    value?: string;
    className?: string;
    optionIndex?: number;
}

function Option({
                    children,
                    value,
                    className,
                    optionIndex,
                }: OptionProps) {
    const {correctIndex, selectedIndex, selectOption, mode, disabled} = useAnswerOptionsContext();

    if (optionIndex == null) {
        throw new Error("AnswerOptions.Option expects an index.");
    }

    const isSelected = selectedIndex === optionIndex;
    const isCorrect = correctIndex === optionIndex;

    // Determine tone based on mode and selection logic
    const tone: VariantProps<typeof optionVariants>["tone"] =
        mode === "review"
            ? isSelected
                ? isCorrect
                    ? "correct"
                    : "incorrect"
                : "idle"
            : isSelected
                ? "correct" // ✅ use correct to trigger saffron "selected" state in quiz mode
                : "idle";


    const label =
        value ??
        (typeof children === "string" ? children : `Option ${optionIndex}`);

    return (
        <button
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => !disabled && selectOption(optionIndex, label)}
            disabled={disabled}
            className={cn(optionVariants({ tone, mode, disabled }), className)}
        >
            <span className="flex-1">{children}</span>
            <span className="flex h-9 w-9 items-center justify-center">{optionIndex}</span>
        </button>
    );
}

interface AnswerOptionsProps {
    correctIndex: number;
    children: ReactNode;
    className?: string;
    onAnswer?: (result: AnswerSelection) => void;
    mode?: "quiz" | "review";
    disabled?: boolean;
}

function AnswerOptionsBase({
                               correctIndex,
                               children,
                               className,
                               onAnswer,
                               mode = "quiz",
                               disabled = false,
                           }: AnswerOptionsProps,
                           ref: React.Ref<{ selectByKey: (index: number) => void }>
) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selectOption = useCallback(
        (index: number, label: string) => {
            if (disabled) return;
            setSelectedIndex(index);
            onAnswer?.({
                label,
                isCorrect: index === correctIndex,
            });
        },
        [correctIndex, onAnswer],
    );

    // expose selection to parent (Quiz)
    useImperativeHandle(ref, () => ({
        selectByKey(index: number) {
            const label = React.Children.toArray(children)[index - 1];
            if (!label) return;
            const stringLabel= typeof label === "string" ? label : (label as any).props.value || `Option ${index}`;
            selectOption(index, stringLabel);
        }
    }));

    const contextValue = useMemo(
        () => ({correctIndex, selectedIndex, selectOption, mode, disabled}),
        [correctIndex, selectedIndex, selectOption, mode, disabled],
    );
    const enhancedChildren = Children.map(children, (child, i) => isValidElement(child)
        ? cloneElement(child as ReactElement<OptionProps>, {optionIndex: i + 1})
        : child);

    return (
        <AnswerOptionsContext.Provider value={contextValue}>
            <div className={cn(containerVariants(), className)} role="radiogroup">
                {enhancedChildren}
            </div>
        </AnswerOptionsContext.Provider>
    );
}

export const AnswerOptions = Object.assign(forwardRef(AnswerOptionsBase), {Option});

/* ---------------------------------- Alert --------------------------------- */

const alertVariants = cva(
    "pointer-events-auto absolute bottom-0 inset-x-0 w-full border-t px-2 py-6 text-space-800 flex items-center justify-center lg:border-t-2 lg:py-9",
    {
        variants: {
            status: {
                success: "border-emerald-250 bg-emerald-100 text-emerald-300",
                failure: "border-persianred-150 bg-persianred-100",
            },
        },
        defaultVariants: {status: "success"},
    }
);

type AlertStatus = VariantProps<typeof alertVariants>["status"];

interface AlertProps {
    status: AlertStatus;
    message?: ReactNode; // ✅ Accept ReactNode, not only string
}

function Alert({status, message}: AlertProps) {
    return (
        <div className={alertVariants({status})}>
            <div
                aria-live="polite"
                role="status"
                className="max-w-[960px] w-[90%] flex items-center justify-center"
            >
                {message}
            </div>
        </div>
    );
}

/* ----------------------------------- Quiz --------------------------------- */

type QuizMode = "review" | "quiz";

interface QuizProps {
    data: QuizData;          // quiz data model
    mode?: QuizMode;     // controls behavior
    onComplete?: (score: number) => void; // optional callback
}

function Quiz({data, mode = "quiz", onComplete}: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [answers, setAnswers] = useState<Record<number, AnswerSelection>>({});
    const [alertVisible, setAlertVisible] = useState(false);

    const answerOptionsRef = useRef<{ selectByKey: (index: number) => void }>(null);

    const total = data.questions.length;
    const current = data.questions[displayedIndex];
    const currentAnswer = answers[displayedIndex];
    const isReviewMode = mode === "review";
    const hasSelected = Boolean(answers[displayedIndex]);

    /* ---------------------- Transition Logic ---------------------- */

    const goToQuestion = (newIndex: number) => {
        if (newIndex === displayedIndex) return;

        setIsTransitioning(true);
        setTimeout(
            () => {
                setDisplayedIndex(newIndex);
                setAlertVisible(false);
                requestAnimationFrame(() => setIsTransitioning(false)); // fade-in smoothly
                setIsTransitioning(false);
            }, 350);
        // match fade timing
        setCurrentIndex(newIndex);
    };

    const goNext = useCallback(
        () => goToQuestion(Math.min(displayedIndex + 1, total - 1)),
        [displayedIndex, total]
    );

    const goPrev = useCallback(
        () => goToQuestion(Math.max(displayedIndex - 1, 0)),
        [displayedIndex]
    );

    /* ---------------------- Answer Handlers ---------------------- */

    const handleAnswer = useCallback(
        (res: AnswerSelection) => {
            setAnswers((prev) => ({
                ...prev,
                [displayedIndex]: {label: res.label, isCorrect: res.isCorrect},
            }));

            if (isReviewMode) {
                setAlertVisible(true);
                return;
            }

            // quiz mode
            const isLast = displayedIndex === total - 1;
            const newAnswers = {...answers, [displayedIndex]: res};

            if (isLast) {
                const score = Object.values(newAnswers).filter((a) => a.isCorrect).length;
                onComplete?.(score);
            }
        },
        [answers, displayedIndex, total, onComplete, isReviewMode]
    );


    /* ---------------------- Render Helpers ---------------------- */

    const getBlankState = () => !currentAnswer ? "empty" : currentAnswer.isCorrect ? "correct" : "incorrect";

    const getAlertMessage = (): ReactNode => {
        if (!currentAnswer) return null;

        const isCorrect = currentAnswer.isCorrect;

        const icon = (
            <span
                className={cn(isCorrect ? "text-emerald-600" : "text-persianred-600", "material-symbols-rounded material-symbols-fill mr-2 !text-[56px]")}
                aria-hidden="true"
            >
                {isCorrect ? "check_circle" : "cancel"}
            </span>
        );

        // pick the proper text from your constant messages
        const messages: Record<"success" | "failure", string> = {
            success: "",
            failure: "",
        };

        const button = (
            <button
                className="ml-auto rounded-md border-2 border-space-500 px-3 py-1 text-sm font-medium text-space-800 hover:bg-space-50 transition"
                onClick={() => goNext()}
            >
                {isReviewMode ? "Continue" : "Next"}
            </button>
        );

        const messageText = messages[isCorrect ? "success" : "failure"];

        return (
            <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center">
                    {icon}
                    <span>{messageText}</span>
                </div>
                {button}
            </div>
        );
    };

    // ---------------------- Keyboard Shortcuts ----------------------

    useKeyboardShortcut(
        ["1", "2", "3", "4", "Numpad1", "Numpad2", "Numpad3", "Numpad4"],

        (e) => {
            if (isReviewMode && alertVisible) return; // ← block when locked
            const key = e?.key ?? "";
            const num = parseInt(key.replace("Numpad", ""), 10);
            if (Number.isNaN(num)) return;
            const current = data.questions[displayedIndex];
            if (!current || num < 1 || num > current.options.length) return;

            answerOptionsRef.current?.selectByKey(num);
        },

        [data, displayedIndex, isReviewMode, alertVisible]
    );

    useKeyboardShortcut(["Enter", "NumpadEnter"], () => {
        if (hasSelected) goNext(); // only advance if user selected an answer
    }, [goNext, hasSelected]);

    /* -------------------------- Render -------------------------- */

    const [before, after] = current.question.split("...");

    // mode-based tone for AnswerOptions
    const blankValue = currentAnswer?.label ?? "";
    const renderQuestion = (q: QuizQuestion, i: number) => (
        <>
            <div key={i}
                 className="flex flex-col items-center gap-31 justify-center align-middle content-center w-full">
                <div className={cn(
                    "flex flex-col items-center justify-center w-full gap-16 pt-12 transition-all duration-300 ease-in-out text-center",
                    mode === "quiz" && "bg-space-50 border-b-2 border-space-150",
                    isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                )}
                >
                    <Progress value={i + 1} maxWidth={860} max={total} tone="white" hasStrips/>
                    <Question>
                        {q.question.split("...")[0]}{" "}
                        <Question.Blank state={getBlankState()} mode={mode}>
                            {blankValue}
                        </Question.Blank>
                        {q.question.split("...")[1]}
                    </Question>
                </div>

                <AnswerOptions
                    key={i}
                    ref={answerOptionsRef}
                    mode={mode}
                    className={cn("transition-all duration-300 ease-in-out", isTransitioning ? "opacity-0" : "opacity-100")}
                    correctIndex={q.correctIndex} onAnswer={handleAnswer}
                    disabled={isReviewMode && alertVisible} // lock options once alert is shown in review mode
                >
                    {q.options.map((opt) => (
                        <AnswerOptions.Option key={opt} value={opt}>
                            {opt}
                        </AnswerOptions.Option>
                    ))}
                </AnswerOptions>

            </div>
        </>


    );

    /* -------------------------- Render -------------------------- */
    console.log(displayedIndex, currentIndex)
    return (
        <>
            <div className="flex w-full flex-col items-center gap-8 overflow-hidden">
                {renderQuestion(current, displayedIndex)}
            </div>

            {mode === "quiz" ? (
                // QUIZ MODE -> show navigation button
                <div className={"flex justify-center items-center mt-30"}>
                    <button
                        onClick={goNext}
                        className="rounded-lg bg-celestialblue-500 px-5 py-2 text-space-950 font-medium hover:bg-celestialblue-400 transition disabled:bg-space-200 disabled:text-space-400"
                        disabled={!hasSelected || displayedIndex === total - 1} // disable when no selection
                    >
                        Next Question
                    </button>
                </div>
            ) : (
                // REVIEW MODE -> show feedback Alert
                alertVisible && currentAnswer && (
                    <Alert
                        status={currentAnswer.isCorrect ? "success" : "failure"}
                        message={getAlertMessage()}
                    />
                )
            )}
        </>
    );
}

import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
export default Quiz;



