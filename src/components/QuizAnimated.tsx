import { cva, type VariantProps } from "class-variance-authority";
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
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useAnimationControls,
} from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { cn } from "../utils/cn";
import Progress from "./Progress";
import { QuizData, QuizQuestion } from "./LessonContent";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
/* --------------------------- Question Component --------------------------- */ const questionVariants =
  cva(
    "inline-block align-middle items-center w-full px-6 py-4 text-xl font-normal text-space-800 leading-[38px] select-none break-words lg:max-w-[860px] lg:px-8 lg:py-6 lg:text-3xl lg:leading-[60px]",
  );
interface QuestionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}
const blankVariants = cva(
  "inline-flex min-h-[40px] min-w-[100px] justify-center rounded-md px-3 text-lg text-center border border-solid align-middle items-center relative bottom-[2px] lg:min-h-[50px] lg:min-w-[130px] lg:rounded-lg lg:px-4 lg:text-xl lg:bottom-[3px]",
  {
    variants: {
      state: {
        empty: "border-space-100 bg-space-50 text-space-150 items-end",
        correct: "items-center",
        incorrect: "items-center",
      },
      mode: { quiz: "", review: "" },
    },
    compoundVariants: [
      {
        mode: "quiz",
        state: ["correct", "incorrect"],
        class: "border-saffron-400 bg-saffron-800 text-saffron-100",
      },
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
    defaultVariants: { state: "empty", mode: "quiz" },
  },
);
type BlankState = VariantProps<typeof blankVariants>["state"];
const blankMotionVariants: Record<NonNullable<BlankState>, any> = {
  empty: {
    scale: 1,
    boxShadow: "0 0 0 rgba(2, 6, 23, 0)",
    filter: "brightness(1)",
  },
  correct: {
    scale: [0.98, 1.05, 1],
    boxShadow: [
      "0 0 0 rgba(14, 125, 67, 0)",
      "0 0 18px rgba(16, 185, 129, 0.28)",
      "0 0 0 rgba(14, 125, 67, 0)",
    ],
    filter: ["brightness(0.98)", "brightness(1.08)", "brightness(1)"],
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
  incorrect: {
    scale: [0.98, 1.04, 1],
    boxShadow: [
      "0 0 0 rgba(185, 28, 28, 0)",
      "0 0 18px rgba(248, 113, 113, 0.3)",
      "0 0 0 rgba(185, 28, 28, 0)",
    ],
    filter: ["brightness(0.98)", "brightness(1.05)", "brightness(1)"],
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
};
function QuestionBase({ children, className, ...props }: QuestionProps) {
  return (
    <p {...props} className={cn(questionVariants(), className)}>
      {" "}
      {children}{" "}
    </p>
  );
}
interface AnimatedBlankProps extends HTMLMotionProps<"span"> {
  children?: ReactNode;
  placeholder?: string;
  state?: BlankState;
  mode?: "quiz" | "review";
}

function Blank({
  children,
  placeholder = "______",
  state,
  mode = "quiz",
  className,
  ...rest
}: AnimatedBlankProps) {
  const resolvedState: NonNullable<BlankState> = state ?? "empty";
  return (
    <motion.span
      aria-live="polite"
      data-quiz-blank
      className={cn(blankVariants({ state: resolvedState, mode }), className)}
      variants={blankMotionVariants}
      initial="empty"
      animate={resolvedState}
      transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      layout
      {...rest}
    >
      {children ?? placeholder}
    </motion.span>
  );
}
export const Question = Object.assign(QuestionBase, { Blank });
/* -------------------------- Answer Options Group -------------------------- */ interface AnswerSelection {
  label: string;
  isCorrect: boolean;
}
interface AnswerOptionsContextValue {
  correctIndex: number;
  selectedIndex: number | null;
  selectOption: (index: number, label: string) => void;
  mode: "quiz" | "review";
  disabled?: boolean;
  revealCorrect: boolean;
}
const AnswerOptionsContext = createContext<AnswerOptionsContextValue | null>(
  null,
);
function useAnswerOptionsContext() {
  const ctx = useContext(AnswerOptionsContext);
  if (!ctx)
    throw new Error("AnswerOptions.Option must be used inside <AnswerOptions>");
  return ctx;
}
const containerVariants = cva(
  "flex w-full flex-col gap-3 max-w-[480px] lg:max-w-[620px] lg:gap-4",
);
const optionVariants = cva(
  "flex w-full items-center gap-3 rounded-lg border-2 px-4 py-4 text-lg text-left transition-all duration-200 ease-in-out select-none lg:gap-4 lg:rounded-xl lg:border-3 lg:px-6 lg:py-5 lg:text-xl",
  {
    variants: {
      tone: { idle: "cursor-pointer", correct: "", incorrect: "" },
      mode: { quiz: "", review: "" },
      disabled: { true: "pointer-events-none", false: "" },
    },
    compoundVariants: [
      {
        mode: "quiz",
        tone: "idle",
        class:
          "border-space-150 bg-space-10 text-space-800 hover:border-saffron-200 hover:bg-saffron-10 hover:text-saffron-700 [&>span:last-child]:text-space-200 hover:[&>span:last-child]:text-saffron-200",
      },
      {
        mode: "quiz",
        tone: ["correct", "incorrect"],
        class:
          "border-saffron-300 bg-saffron-50 text-saffron-800 [&>span:last-child]:text-saffron-400",
      },
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
    defaultVariants: { tone: "idle", mode: "quiz", disabled: false },
  },
);

const optionMotionVariants = {
  idle: {
    scale: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 420, damping: 32 },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 420, damping: 32 },
  },
  active: {
    scale: 1.04,
    filter: "brightness(1.05)",
    transition: { type: "spring" as const, stiffness: 420, damping: 32 },
  },
  incorrect: {
    scale: 1,
    x: [0, -4, 4, -3, 2, 0],
    transition: { duration: 0.45, ease: "easeInOut" as const },
  },
};
function Option({
  children,
  value,
  className,
  optionIndex,
}: {
  children: ReactNode;
  value?: string;
  className?: string;
  optionIndex?: number;
}) {
  const {
    correctIndex,
    selectedIndex,
    selectOption,
    mode,
    disabled,
    revealCorrect,
  } = useAnswerOptionsContext();
  const controls = useAnimationControls();
  useEffect(() => {
    controls.set("idle");
  }, [controls]);
  if (optionIndex == null)
    throw new Error("AnswerOptions.Option expects an index.");
  const isSelected = selectedIndex === optionIndex;
  const isCorrect = correctIndex === optionIndex;
  const shouldReveal = revealCorrect && isCorrect;
  const tone: VariantProps<typeof optionVariants>["tone"] = (() => {
    if (isSelected) {
      return isCorrect ? "correct" : "incorrect";
    }
    if (shouldReveal) {
      return "correct";
    }
    return "idle";
  })();

  const animationState = (() => {
    if (isSelected) {
      return isCorrect ? "active" : "incorrect";
    }
    if (shouldReveal) {
      return "active";
    }
    return "idle";
  })();

  const label =
    value ??
    (typeof children === "string" ? children : `Option ${optionIndex}`);

  useEffect(() => {
    if (animationState === "incorrect") {
      controls.stop();
      controls.set("idle");
      controls.start("incorrect");
      return;
    }
    controls.start(animationState);
  }, [animationState, controls]);

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => !disabled && selectOption(optionIndex, label)}
      disabled={disabled}
      className={cn(optionVariants({ tone, mode, disabled }), className)}
      data-quiz-option
      variants={optionMotionVariants}
      initial="idle"
      animate={controls}
      whileHover={disabled ? undefined : "hover"}
      whileFocus={disabled ? undefined : "hover"}
      layout
    >
      <span className="flex-1">{children}</span>
      <span className="flex h-9 w-9 items-center justify-center">
        {optionIndex}
      </span>
    </motion.button>
  );
}
function AnswerOptionsBase(
  {
    correctIndex,
    children,
    className,
    onAnswer,
    mode = "quiz",
    disabled = false,
    revealCorrect = false,
    questionId,
  }: {
    correctIndex: number;
    children: ReactNode;
    className?: string;
    onAnswer?: (result: AnswerSelection) => void;
    mode?: "quiz" | "review";
    disabled?: boolean;
    revealCorrect?: boolean;
    questionId?: string | number;
  },
  ref: React.Ref<{ selectByKey: (index: number) => void }>,
) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectOption = useCallback(
    (index: number, label: string) => {
      if (disabled) return;
      setSelectedIndex(index);
      onAnswer?.({ label, isCorrect: index === correctIndex });
    },
    [correctIndex, onAnswer, disabled],
  );
  useImperativeHandle(ref, () => ({
    selectByKey(index: number) {
      const label = React.Children.toArray(children)[index - 1];
      if (!label) return;
      const stringLabel =
        typeof label === "string"
          ? label
          : (label as any).props.value || `Option ${index}`;
      selectOption(index, stringLabel);
    },
  }));
  useEffect(() => {
    setSelectedIndex(null);
  }, [correctIndex, questionId]);

  const contextValue = useMemo(
    () => ({
      correctIndex,
      selectedIndex,
      selectOption,
      mode,
      disabled,
      revealCorrect,
    }),
    [correctIndex, selectedIndex, selectOption, mode, disabled, revealCorrect],
  );
  const enhancedChildren = Children.map(children, (child, i) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<any>, { optionIndex: i + 1 })
      : child,
  );
  return (
    <AnswerOptionsContext.Provider value={contextValue}>
      {" "}
      <div className={cn(containerVariants(), className)} role="radiogroup">
        {" "}
        {enhancedChildren}{" "}
      </div>{" "}
    </AnswerOptionsContext.Provider>
  );
}
export const AnswerOptions = Object.assign(forwardRef(AnswerOptionsBase), {
  Option,
});
/* ---------------------------------- Alert --------------------------------- */ const alertVariants =
  cva(
    "pointer-events-auto absolute bottom-0 inset-x-0 w-full border-t px-2 py-6 text-space-800 flex flex-col items-center justify-center gap-4 lg:border-t-2 lg:py-9",
    {
      variants: {
        status: {
          success: "border-emerald-250 bg-emerald-100 text-emerald-300",
          failure: "border-persianred-150 bg-persianred-100",
        },
      },
      defaultVariants: { status: "success" },
    },
  );
function Alert({
  status,
  message,
  actionLabel,
  onAction,
}: {
  status: "success" | "failure";
  message?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className={alertVariants({ status })}>
      <div
        aria-live="polite"
        role="status"
        className="w-[90%] max-w-[960px] text-center"
      >
        {message}
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-space-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-space-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-space-500 focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
/* ----------------------------------- Quiz --------------------------------- */ const pageVariants =
  {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 72 : -72,
      scale: 0.98,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -72 : 72,
      scale: 0.98,
    }),
  };
function Quiz({
  data,
  mode = "quiz",
  onComplete,
}: {
  data: QuizData;
  mode?: "quiz" | "review";
  onComplete?: (score: number) => void;
}) {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerSelection>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const total = data.questions.length;
  const current = data.questions[displayedIndex];
  const currentAnswer = answers[displayedIndex];
  const isReviewMode = mode === "review";
  const hasSelected = Boolean(answers[displayedIndex]);
  const answerOptionsRef = useRef<{ selectByKey: (index: number) => void }>(
    null,
  );
  const [scope, animate] = useAnimate();
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  const goToQuestion = useCallback(
    (newIndex: number) => {
      const nextIndex = Math.max(0, Math.min(newIndex, total - 1));
      if (nextIndex === displayedIndex) return;
      setDirection(nextIndex > displayedIndex ? 1 : -1);
      setAlertVisible(false);
      clearRevealTimer();
      setRevealCorrect(false);
      setDisplayedIndex(nextIndex);
    },
    [clearRevealTimer, displayedIndex, total],
  );
  const goNext = useCallback(
    () => goToQuestion(displayedIndex + 1),
    [displayedIndex, goToQuestion],
  );
  const handleAnswer = useCallback(
    (res: AnswerSelection) => {
      setAnswers((prev) => ({
        ...prev,
        [displayedIndex]: { label: res.label, isCorrect: res.isCorrect },
      }));
      if (isReviewMode) {
        clearRevealTimer();
        setRevealCorrect(false);
        setAlertVisible(true);
        revealTimerRef.current = setTimeout(() => {
          setRevealCorrect(true);
        }, 250);
        return;
      }
      const isLast = displayedIndex === total - 1;
      const newAnswers = { ...answers, [displayedIndex]: res };
      if (isLast) {
        const score = Object.values(newAnswers).filter(
          (a) => a.isCorrect,
        ).length;
        onComplete?.(score);
      }
    },
    [
      answers,
      clearRevealTimer,
      displayedIndex,
      isReviewMode,
      onComplete,
      total,
    ],
  );
  useKeyboardShortcut(
    ["1", "2", "3", "4", "Numpad1", "Numpad2", "Numpad3", "Numpad4"],
    (e) => {
      if (!e) return;
      if (isReviewMode && alertVisible) return;
      const num = parseInt(e.key.replace("Numpad", ""), 10);
      const current = data.questions[displayedIndex];
      if (!current || num < 1 || num > current.options.length) return;
      answerOptionsRef.current?.selectByKey(num);
    },
    [data, displayedIndex, isReviewMode, alertVisible],
  );
  useEffect(() => () => clearRevealTimer(), [clearRevealTimer]);
  useEffect(() => {
    clearRevealTimer();
    setRevealCorrect(false);
  }, [clearRevealTimer, displayedIndex]);
  useEffect(() => {
    if (!scope.current) return;
    const entryEase = [0.33, 1, 0.68, 1] as const;
    const controls = animate([
      [
        "[data-quiz-question]",
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, ease: entryEase, at: "<0.05" },
      ],
      [
        "[data-quiz-blank]",
        {
          scale: [0.94, 1.04, 1],
          filter: ["brightness(0.98)", "brightness(1.08)", "brightness(1)"],
          boxShadow: [
            "0 0 0 rgba(12, 74, 110, 0)",
            "0 0 22px rgba(59, 130, 246, 0.18)",
            "0 0 0 rgba(12, 74, 110, 0)",
          ],
        },
        { duration: 0.45, ease: entryEase, at: "<0.02" },
      ],
      [
        "[data-quiz-option]",
        { opacity: [0, 1], y: [18, 0] },
        { duration: 0.3, ease: entryEase, at: "<0.1" },
      ],
    ]);
    return () => controls.stop();
  }, [animate, displayedIndex, scope]);
  const [before, after] = current.question.split("...");
  const isLastQuestion = displayedIndex === total - 1;
  const reviewActionLabel = isLastQuestion ? "Finish Review" : "Next Question";
  const handleReviewContinue = useCallback(() => {
    if (isLastQuestion) {
      clearRevealTimer();
      setAlertVisible(false);
      setRevealCorrect(false);
      return;
    }
    goToQuestion(displayedIndex + 1);
  }, [clearRevealTimer, displayedIndex, goToQuestion, isLastQuestion]);
  const getBlankState = () =>
    !currentAnswer
      ? "empty"
      : currentAnswer.isCorrect
        ? "correct"
        : "incorrect";
  return (
    <div
      ref={scope}
      className="flex w-full flex-col items-center gap-8 overflow-hidden"
    >
      <div
        className="flex w-full flex-col items-center justify-center gap-14 border-b-2 border-space-150 bg-space-50 pt-12 text-center"
        data-quiz-header
      >
        <div className="flex w-full justify-center">
          <Progress
            value={displayedIndex + 1}
            maxWidth={860}
            max={total}
            tone="white"
            hasStrips
          />
        </div>
        <Question data-quiz-question>
          {before}{" "}
          <Question.Blank state={getBlankState()} mode={mode}>
            {currentAnswer?.label ?? ""}
          </Question.Blank>{" "}
          {after}
        </Question>
      </div>

      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={displayedIndex}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex w-full flex-col items-center gap-8"
        >
          <AnswerOptions
            ref={answerOptionsRef}
            mode={mode}
            correctIndex={current.correctIndex}
            onAnswer={handleAnswer}
            disabled={isReviewMode && alertVisible}
            revealCorrect={revealCorrect}
            questionId={displayedIndex}
          >
            {current.options.map((opt) => (
              <AnswerOptions.Option key={opt} value={opt}>
                {opt}
              </AnswerOptions.Option>
            ))}
          </AnswerOptions>

          {mode === "quiz" ? (
            <div className="mt-30 flex items-center justify-center">
              <button
                onClick={goNext}
                className="rounded-lg bg-celestialblue-500 px-5 py-2 font-medium text-space-950 transition hover:bg-celestialblue-400 disabled:bg-space-200 disabled:text-space-400"
                disabled={!hasSelected || displayedIndex === total - 1}
              >
                Next Question
              </button>
            </div>
          ) : (
            alertVisible &&
            currentAnswer && (
              <Alert
                status={currentAnswer.isCorrect ? "success" : "failure"}
                message={
                  <span>
                    {currentAnswer.isCorrect
                      ? "Correct! Continue to the next question."
                      : "Incorrect. Continue when you're ready."}
                  </span>
                }
                actionLabel={reviewActionLabel}
                onAction={handleReviewContinue}
              />
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default Quiz;
