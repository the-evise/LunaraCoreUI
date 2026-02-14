import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactElement,
    type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../utils/cn";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Input from "./Input";
import Progress from "./Progress";
import RadioGroup from "./RadioGroup";

export type OnboardingOption = {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
};

type BaseQuestion = {
    id: string;
    title: string;
    description?: string;
    required?: boolean;
    helperText?: string;
};

export type OnboardingTextQuestion = BaseQuestion & {
    type: "text";
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    multiline?: boolean;
    autoComplete?: string;
    defaultValue?: string;
};

export type OnboardingSingleQuestion = BaseQuestion & {
    type: "single";
    options: OnboardingOption[];
    defaultValue?: string;
};

export type OnboardingMultiQuestion = BaseQuestion & {
    type: "multiple";
    options: OnboardingOption[];
    minSelected?: number;
    maxSelected?: number;
    defaultValue?: string[];
};

export type OnboardingSelectQuestion = BaseQuestion & {
    type: "select";
    options: OnboardingOption[];
    placeholder?: string;
    defaultValue?: string;
};

export type OnboardingRangeQuestion = BaseQuestion & {
    type: "range";
    min: number;
    max: number;
    step?: number;
    unit?: string;
    marks?: Array<{ value: number; label: string }>;
    defaultValue?: number;
};

export type OnboardingWizardQuestion =
    | OnboardingTextQuestion
    | OnboardingSingleQuestion
    | OnboardingMultiQuestion
    | OnboardingSelectQuestion
    | OnboardingRangeQuestion;

export type OnboardingWizardAnswerValue = string | string[] | number | null;
export type OnboardingWizardAnswers = Record<string, OnboardingWizardAnswerValue>;

type OnboardingWizardSharedProps = {
    questions: OnboardingWizardQuestion[];
    initialAnswers?: Partial<OnboardingWizardAnswers>;
    title?: string;
    subtitle?: string;
    backLabel?: string;
    nextLabel?: string;
    completeLabel?: string;
    onAnswersChange?: (answers: OnboardingWizardAnswers) => void;
    onStepChange?: (index: number, question: OnboardingWizardQuestion) => void;
    onComplete?: (answers: OnboardingWizardAnswers) => void | Promise<void>;
};

export interface OnboardingWizardProps extends OnboardingWizardSharedProps {
    className?: string;
    children?: ReactNode;
}

export interface OnboardingWizardRootProps extends OnboardingWizardSharedProps {
    children: ReactNode;
}

type OnboardingWizardShellProps = {
    className?: string;
    children: ReactNode;
};

type OnboardingWizardStepProps = {
    className?: string;
    children?: ReactNode;
};

type OnboardingWizardFieldProps = {
    question?: OnboardingWizardQuestion;
    className?: string;
};

type OnboardingWizardActionsProps = {
    className?: string;
};

type OnboardingWizardContextValue = {
    questions: OnboardingWizardQuestion[];
    title: string;
    subtitle?: string;
    backLabel: string;
    nextLabel: string;
    completeLabel: string;
    safeStep: number;
    currentQuestion: OnboardingWizardQuestion | undefined;
    isLastStep: boolean;
    answers: OnboardingWizardAnswers;
    currentValue: OnboardingWizardAnswerValue;
    progressValue: number;
    canContinue: boolean;
    isSubmitting: boolean;
    setAnswer: (questionId: string, value: OnboardingWizardAnswerValue) => void;
    handleBack: () => void;
    handleNext: () => Promise<void>;
};

const OnboardingWizardContext = createContext<OnboardingWizardContextValue | null>(null);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function buildInitialAnswer(question: OnboardingWizardQuestion): OnboardingWizardAnswerValue {
    switch (question.type) {
        case "text":
            return question.defaultValue ?? "";
        case "single":
            return question.defaultValue ?? null;
        case "multiple":
            return question.defaultValue ?? [];
        case "select":
            return question.defaultValue ?? "";
        case "range":
            return question.defaultValue ?? question.min;
        default:
            return null;
    }
}

function buildInitialAnswers(
    questions: OnboardingWizardQuestion[],
    initialAnswers?: Partial<OnboardingWizardAnswers>,
): OnboardingWizardAnswers {
    const next: OnboardingWizardAnswers = {};
    for (const question of questions) {
        next[question.id] = initialAnswers?.[question.id] ?? buildInitialAnswer(question);
    }
    return next;
}

function isQuestionValid(question: OnboardingWizardQuestion, value: OnboardingWizardAnswerValue): boolean {
    const isRequired = question.required ?? true;
    if (!isRequired) {
        return true;
    }

    switch (question.type) {
        case "text": {
            const text = typeof value === "string" ? value.trim() : "";
            if (!text.length) {
                return false;
            }
            if (typeof question.minLength === "number" && text.length < question.minLength) {
                return false;
            }
            return true;
        }
        case "single":
        case "select":
            return typeof value === "string" && value.trim().length > 0;
        case "multiple": {
            const selected = Array.isArray(value) ? value : [];
            const minSelected = question.minSelected ?? 1;
            const maxSelected = question.maxSelected ?? Number.POSITIVE_INFINITY;
            return selected.length >= minSelected && selected.length <= maxSelected;
        }
        case "range":
            return typeof value === "number" && Number.isFinite(value);
        default:
            return false;
    }
}

function normalizeRangeValue(question: OnboardingRangeQuestion, input: number) {
    const step = question.step ?? 1;
    const clamped = Math.min(Math.max(input, question.min), question.max);
    return Math.round(clamped / step) * step;
}

function useOnboardingWizardContext() {
    const context = useContext(OnboardingWizardContext);
    if (!context) {
        throw new Error("OnboardingWizard compound components must be used inside OnboardingWizard.Root.");
    }
    return context;
}

function OnboardingWizardRoot({
    questions,
    initialAnswers,
    title = "Set up your learning profile",
    subtitle = "Answer a few quick questions so we can personalize your journey.",
    backLabel = "Back",
    nextLabel = "Next",
    completeLabel = "Finish setup",
    onAnswersChange,
    onStepChange,
    onComplete,
    children,
}: OnboardingWizardRootProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<OnboardingWizardAnswers>(() =>
        buildInitialAnswers(questions, initialAnswers),
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setAnswers(buildInitialAnswers(questions, initialAnswers));
        setCurrentStep(0);
    }, [initialAnswers, questions]);

    const safeStep = Math.min(Math.max(currentStep, 0), Math.max(questions.length - 1, 0));
    const currentQuestion = questions[safeStep];
    const isLastStep = safeStep >= questions.length - 1;
    const progressValue = questions.length
        ? Math.round(((safeStep + 1) / questions.length) * 100)
        : 0;

    useEffect(() => {
        onAnswersChange?.(answers);
    }, [answers, onAnswersChange]);

    useEffect(() => {
        if (!currentQuestion) {
            return;
        }
        onStepChange?.(safeStep, currentQuestion);
    }, [currentQuestion, onStepChange, safeStep]);

    const currentValue = currentQuestion ? answers[currentQuestion.id] : null;
    const canContinue = currentQuestion ? isQuestionValid(currentQuestion, currentValue) : false;

    const setAnswer = (questionId: string, value: OnboardingWizardAnswerValue) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = async () => {
        if (!currentQuestion || !canContinue || isSubmitting) {
            return;
        }

        if (!isLastStep) {
            setCurrentStep((prev) => Math.min(prev + 1, questions.length - 1));
            return;
        }

        if (!onComplete) {
            return;
        }

        try {
            setIsSubmitting(true);
            await onComplete(answers);
        } finally {
            setIsSubmitting(false);
        }
    };

    const value: OnboardingWizardContextValue = {
        questions,
        title,
        subtitle,
        backLabel,
        nextLabel,
        completeLabel,
        safeStep,
        currentQuestion,
        isLastStep,
        answers,
        currentValue,
        progressValue,
        canContinue,
        isSubmitting,
        setAnswer,
        handleBack,
        handleNext,
    };

    return (
        <OnboardingWizardContext.Provider value={value}>
            {children}
        </OnboardingWizardContext.Provider>
    );
}

function OnboardingWizardShell({ className, children }: OnboardingWizardShellProps) {
    return (
        <div
            className={cn(
                "w-full max-w-[860px] rounded-3xl border border-space-100 bg-white p-5 shadow-[0_20px_48px_-36px_rgba(9,16,37,0.55)] sm:p-6",
                className,
            )}
        >
            {children}
        </div>
    );
}

function OnboardingWizardHeader() {
    const { title, subtitle, questions, safeStep } = useOnboardingWizardContext();

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-celestialblue-600">
                    Onboarding Wizard
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-space-900">{title}</h2>
                {subtitle ? <p className="mt-1 text-sm text-space-500">{subtitle}</p> : null}
            </div>
            <div className="rounded-full border border-space-150 bg-space-50 px-3 py-1 text-xs font-semibold text-space-600">
                Step {questions.length ? safeStep + 1 : 0}/{questions.length}
            </div>
        </div>
    );
}

function OnboardingWizardProgressBar() {
    const { progressValue } = useOnboardingWizardContext();
    return <Progress value={progressValue} size="sm" tone="celestial" />;
}

function OnboardingWizardPrompt() {
    const { currentQuestion } = useOnboardingWizardContext();

    if (!currentQuestion) {
        return (
            <div className="rounded-2xl border border-space-100 bg-space-10 p-5 text-space-600">
                No onboarding questions configured.
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <h3 className="text-xl font-semibold text-space-900">
                {currentQuestion.title}
            </h3>
            {currentQuestion.description ? (
                <p className="text-sm text-space-500">{currentQuestion.description}</p>
            ) : null}
            {currentQuestion.helperText ? (
                <p className="text-xs text-space-400">{currentQuestion.helperText}</p>
            ) : null}
        </div>
    );
}

function OnboardingWizardTextField({ question, className }: OnboardingWizardFieldProps) {
    const { currentQuestion, answers, setAnswer } = useOnboardingWizardContext();
    const resolvedQuestion = question ?? currentQuestion;

    if (!resolvedQuestion || resolvedQuestion.type !== "text") {
        return null;
    }

    const value = answers[resolvedQuestion.id];
    const resolvedValue = typeof value === "string" ? value : "";

    if (resolvedQuestion.multiline) {
        return (
            <textarea
                value={resolvedValue}
                onChange={(event) => setAnswer(resolvedQuestion.id, event.target.value)}
                placeholder={resolvedQuestion.placeholder}
                maxLength={resolvedQuestion.maxLength}
                rows={4}
                className={cn(
                    "w-full rounded-xl border border-space-150 bg-white px-4 py-3 text-sm text-space-800 outline-none transition-colors focus:border-celestialblue-300",
                    className,
                )}
            />
        );
    }

    return (
        <Input
            value={resolvedValue}
            onChange={(event) => setAnswer(resolvedQuestion.id, event.target.value)}
            placeholder={resolvedQuestion.placeholder}
            maxLength={resolvedQuestion.maxLength}
            autoComplete={resolvedQuestion.autoComplete}
            className={className}
        />
    );
}

function OnboardingWizardSingleField({ question, className }: OnboardingWizardFieldProps) {
    const { currentQuestion, answers, setAnswer } = useOnboardingWizardContext();
    const resolvedQuestion = question ?? currentQuestion;

    if (!resolvedQuestion || resolvedQuestion.type !== "single") {
        return null;
    }

    const value = answers[resolvedQuestion.id];
    const resolvedValue = typeof value === "string" ? value : "";

    return (
        <RadioGroup
            value={resolvedValue}
            onValueChange={(nextValue) => setAnswer(resolvedQuestion.id, nextValue)}
            options={resolvedQuestion.options.map((option) => ({
                value: option.id,
                label: option.label,
                description: option.description,
                disabled: option.disabled,
            }))}
            variant="ghost"
            itemVariant="card"
            itemTone="info"
            className={cn("border-0 bg-transparent p-0 shadow-none", className)}
            contentClassName="gap-2"
        />
    );
}

function OnboardingWizardMultipleField({ question, className }: OnboardingWizardFieldProps) {
    const { currentQuestion, answers, setAnswer } = useOnboardingWizardContext();
    const resolvedQuestion = question ?? currentQuestion;

    if (!resolvedQuestion || resolvedQuestion.type !== "multiple") {
        return null;
    }

    const value = answers[resolvedQuestion.id];
    const selectedValues = Array.isArray(value) ? value : [];
    const maxSelected = resolvedQuestion.maxSelected ?? Number.POSITIVE_INFINITY;

    return (
        <div className={cn("grid gap-2", className)}>
            {resolvedQuestion.options.map((option) => {
                const isSelected = selectedValues.includes(option.id);
                const wouldExceedMax = !isSelected && selectedValues.length >= maxSelected;
                const isDisabled = Boolean(option.disabled || wouldExceedMax);

                return (
                    <Checkbox
                        key={`${resolvedQuestion.id}-${option.id}`}
                        variant="card"
                        tone="info"
                        size="md"
                        label={option.label}
                        description={option.description}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={(event) => {
                            if (isDisabled) {
                                return;
                            }
                            if (event.target.checked) {
                                setAnswer(resolvedQuestion.id, [...selectedValues, option.id]);
                                return;
                            }
                            setAnswer(
                                resolvedQuestion.id,
                                selectedValues.filter((item) => item !== option.id),
                            );
                        }}
                    />
                );
            })}
        </div>
    );
}

function OnboardingWizardSelectField({ question, className }: OnboardingWizardFieldProps) {
    const { currentQuestion, answers, setAnswer } = useOnboardingWizardContext();
    const resolvedQuestion = question ?? currentQuestion;

    if (!resolvedQuestion || resolvedQuestion.type !== "select") {
        return null;
    }

    const value = answers[resolvedQuestion.id];
    const resolvedValue = typeof value === "string" ? value : "";

    return (
        <div className={cn("space-y-2", className)}>
            {resolvedQuestion.placeholder ? (
                <p className="text-xs text-space-400">{resolvedQuestion.placeholder}</p>
            ) : null}
            <RadioGroup
                value={resolvedValue}
                onValueChange={(nextValue) => setAnswer(resolvedQuestion.id, nextValue)}
                options={resolvedQuestion.options.map((option) => ({
                    value: option.id,
                    label: option.label,
                    description: option.description,
                    disabled: option.disabled,
                }))}
                variant="ghost"
                itemVariant="card"
                itemTone="info"
                className="border-0 bg-transparent p-0 shadow-none"
                contentClassName="gap-2"
            />
        </div>
    );
}

function OnboardingWizardRangeField({ question, className }: OnboardingWizardFieldProps) {
    const { currentQuestion, answers, setAnswer } = useOnboardingWizardContext();
    const resolvedQuestion = question ?? currentQuestion;

    if (!resolvedQuestion || resolvedQuestion.type !== "range") {
        return null;
    }

    const value = answers[resolvedQuestion.id];
    const numericValue =
        typeof value === "number" && Number.isFinite(value)
            ? value
            : resolvedQuestion.defaultValue ?? resolvedQuestion.min;
    const normalizedValue = normalizeRangeValue(resolvedQuestion, numericValue);
    const step = resolvedQuestion.step ?? 1;

    return (
        <div className={cn("space-y-3", className)}>
            <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                <div className="rounded-xl border border-space-100 bg-space-10 px-4 py-3">
                    <p className="text-sm text-space-500">Selected target</p>
                    <p className="text-2xl font-semibold text-space-800">
                        {normalizedValue}
                        {resolvedQuestion.unit ? (
                            <span className="ml-1 text-base font-medium text-space-500">
                                {resolvedQuestion.unit}
                            </span>
                        ) : null}
                    </p>
                </div>

                <Input
                    label="Set value"
                    type="number"
                    value={normalizedValue}
                    min={resolvedQuestion.min}
                    max={resolvedQuestion.max}
                    step={step}
                    suffix={resolvedQuestion.unit}
                    onChange={(event) => {
                        const parsed = Number(event.target.value);
                        if (!Number.isFinite(parsed)) {
                            return;
                        }
                        setAnswer(resolvedQuestion.id, normalizeRangeValue(resolvedQuestion, parsed));
                    }}
                />
            </div>

            <input
                type="range"
                min={resolvedQuestion.min}
                max={resolvedQuestion.max}
                step={step}
                value={normalizedValue}
                onChange={(event) =>
                    setAnswer(
                        resolvedQuestion.id,
                        normalizeRangeValue(resolvedQuestion, Number(event.target.value)),
                    )
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-space-100 accent-celestialblue-500"
            />
            {resolvedQuestion.marks?.length ? (
                <div className="flex items-center justify-between text-xs text-space-500">
                    {resolvedQuestion.marks.map((mark) => (
                        <span key={`${resolvedQuestion.id}-mark-${mark.value}`}>{mark.label}</span>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function OnboardingWizardAutoField({ question, className }: OnboardingWizardFieldProps) {
    const { currentQuestion } = useOnboardingWizardContext();
    const resolvedQuestion = question ?? currentQuestion;

    if (!resolvedQuestion) {
        return null;
    }

    switch (resolvedQuestion.type) {
        case "text":
            return <OnboardingWizardTextField question={resolvedQuestion} className={className} />;
        case "single":
            return <OnboardingWizardSingleField question={resolvedQuestion} className={className} />;
        case "multiple":
            return <OnboardingWizardMultipleField question={resolvedQuestion} className={className} />;
        case "select":
            return <OnboardingWizardSelectField question={resolvedQuestion} className={className} />;
        case "range":
            return <OnboardingWizardRangeField question={resolvedQuestion} className={className} />;
        default:
            return null;
    }
}

function OnboardingWizardStep({ className, children }: OnboardingWizardStepProps) {
    const { currentQuestion } = useOnboardingWizardContext();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestion?.id ?? "empty"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: EASE }}
                className={cn("space-y-4 rounded-2xl border border-space-100 bg-space-10/60 p-4", className)}
            >
                {children ?? (
                    <>
                        <OnboardingWizardPrompt />
                        <OnboardingWizardAutoField />
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

function OnboardingWizardActions({ className }: OnboardingWizardActionsProps) {
    const {
        safeStep,
        isSubmitting,
        backLabel,
        handleBack,
        handleNext,
        canContinue,
        questions,
        isLastStep,
        nextLabel,
        completeLabel,
    } = useOnboardingWizardContext();

    return (
        <div className={cn("flex items-center justify-between gap-2", className)}>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={safeStep === 0 || isSubmitting}
            >
                {backLabel}
            </Button>

            <Button
                size="sm"
                onClick={() => {
                    void handleNext();
                }}
                disabled={!canContinue || isSubmitting || !questions.length}
            >
                {isLastStep ? completeLabel : nextLabel}
            </Button>
        </div>
    );
}

function OnboardingWizardBase({
    className,
    children,
    ...rootProps
}: OnboardingWizardProps) {
    return (
        <OnboardingWizardRoot {...rootProps}>
            <OnboardingWizardShell className={className}>
                {children ?? (
                    <div className="space-y-4">
                        <OnboardingWizardHeader />
                        <OnboardingWizardProgressBar />
                        <OnboardingWizardStep />
                        <OnboardingWizardActions />
                    </div>
                )}
            </OnboardingWizardShell>
        </OnboardingWizardRoot>
    );
}

type OnboardingWizardCompoundComponent = ((props: OnboardingWizardProps) => ReactElement) & {
    Root: typeof OnboardingWizardRoot;
    Shell: typeof OnboardingWizardShell;
    Header: typeof OnboardingWizardHeader;
    Progress: typeof OnboardingWizardProgressBar;
    Step: typeof OnboardingWizardStep;
    Prompt: typeof OnboardingWizardPrompt;
    AutoField: typeof OnboardingWizardAutoField;
    TextField: typeof OnboardingWizardTextField;
    SingleField: typeof OnboardingWizardSingleField;
    MultipleField: typeof OnboardingWizardMultipleField;
    SelectField: typeof OnboardingWizardSelectField;
    RangeField: typeof OnboardingWizardRangeField;
    Actions: typeof OnboardingWizardActions;
    useWizard: typeof useOnboardingWizardContext;
};

const OnboardingWizard = OnboardingWizardBase as OnboardingWizardCompoundComponent;

OnboardingWizard.Root = OnboardingWizardRoot;
OnboardingWizard.Shell = OnboardingWizardShell;
OnboardingWizard.Header = OnboardingWizardHeader;
OnboardingWizard.Progress = OnboardingWizardProgressBar;
OnboardingWizard.Step = OnboardingWizardStep;
OnboardingWizard.Prompt = OnboardingWizardPrompt;
OnboardingWizard.AutoField = OnboardingWizardAutoField;
OnboardingWizard.TextField = OnboardingWizardTextField;
OnboardingWizard.SingleField = OnboardingWizardSingleField;
OnboardingWizard.MultipleField = OnboardingWizardMultipleField;
OnboardingWizard.SelectField = OnboardingWizardSelectField;
OnboardingWizard.RangeField = OnboardingWizardRangeField;
OnboardingWizard.Actions = OnboardingWizardActions;
OnboardingWizard.useWizard = useOnboardingWizardContext;

export default OnboardingWizard;
