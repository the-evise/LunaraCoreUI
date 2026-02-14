import Content from "./Content";
import {lessons} from "../mockLessons";
import {sectionMap} from "./SectionTracker";
import ReadingCard from "./ReadingCard";
import ReadingPoint from "./ReadingPoint";
import QuizCard from "./QuizCard"; // 🔗 Single source of truth

// ---------------- Types ----------------
export interface VocabularyItem {
    word: string;
    meaningEn: string;
    meaningFa: string;
    examples: string[];
    image: string;
}

interface Point {
    title: string;
    body: string;
    description?: string;
}

export interface Reading {
    title: string;
    readingText: string[];
    image: string;
    points?: Point[];
}

export interface Grammar {
    title: string;
    explanationImg: string;
    examples: string[];
}

export interface Review {
    reading: Reading;
    grammar: Grammar;
    tips: string[];
    reviewQuizData: QuizData;
}

export interface QuizQuestion {
    id?: string;
    question: string;
    options: string[];
    optionIds?: string[];
    correctIndex?: number;
}

export interface QuizData {
    questions: QuizQuestion[];
}

export interface Lesson {
    id: string;
    title: string;
    vocabularyItems: VocabularyItem[];
    reading: Reading;
    grammar: Grammar;
    review: Review;
    quiz: QuizData;
}

// ---------------- Subcomponents ----------------

function VocabularySection({items}: { items: Lesson["vocabularyItems"] }) {
    return (
        <div className="grid grid-cols-3 gap-6">
            {items.map((vocab) => (
                <div
                    key={vocab.word}
                    className="bg-space-800 border border-space-500 rounded-xl p-4 text-space-50"
                >
                    <img
                        src={vocab.image}
                        alt={vocab.word}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-xl font-semibold">{vocab.word}</h3>
                    <p className="text-sm text-space-200">{vocab.meaningEn}</p>
                    <p className="text-sm text-space-400">{vocab.meaningFa}</p>
                    <ul className="mt-2 text-sm text-space-300 list-disc pl-4">
                        {vocab.examples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

function ReadingSection({reading}: { reading: Lesson["reading"] }) {
    return (
        <>
            <ReadingCard>
                <ReadingCard.Image src={reading.image} alt={reading.title}/>
                <ReadingCard.Title>{reading.title}</ReadingCard.Title>
                <ReadingCard.Body reading={reading.readingText}/>
            </ReadingCard>

            <ReadingPoint>
                {(reading.points ?? []).map((point, i) => (
                    <ReadingPoint.Item key={point.title} index={i}>
                        <ReadingPoint.Title>{point.title}</ReadingPoint.Title>
                        <ReadingPoint.Body>{point.body}</ReadingPoint.Body>
                        <ReadingPoint.Description>{point.description}</ReadingPoint.Description>
                    </ReadingPoint.Item>
                ))}
            </ReadingPoint>

            {/*<QuizCard xp={} grade={} time={}></QuizCard>*/}
        </>

    );
}

function GrammarSection({grammar}: { grammar: Lesson["grammar"] }) {
    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold text-space-50">{grammar.title}</h2>
            <img
                src={grammar.explanationImg}
                alt="Grammar explanation"
                className="rounded-lg w-[600px] border border-space-600"
            />
            <ul className="text-space-200 list-disc pl-5">
                {grammar.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                ))}
            </ul>
        </div>
    );
}

function ReviewSection({review}: { review: Lesson["review"] }) {
    return (
        <div className="space-y-6 text-space-50">
            <h2 className="text-2xl font-semibold">{review.reading.title}</h2>
            {review.reading.readingText.map((t, i) => (
                <p key={i} className="text-space-200">
                    {t}
                </p>
            ))}

            <h3 className="text-xl font-semibold mt-6">{review.grammar.title}</h3>
            <img
                src={review.grammar.explanationImg}
                alt="Grammar summary"
                className="rounded-lg w-[500px] border border-space-600 mb-4"
            />
            <ul className="text-space-300 list-disc pl-5">
                {review.grammar.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                ))}
            </ul>

            <div className="bg-space-800 p-4 rounded-xl border border-space-600 mt-6">
                <h4 className="font-semibold mb-2">Tips</h4>
                <ul className="list-disc pl-5 text-space-300">
                    {review.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function QuizSection({quiz}: { quiz: Lesson["quiz"] }) {
    return (
        <div className="space-y-6 text-space-50">
            <h2 className="text-2xl font-semibold">Quiz</h2>
            {quiz.questions.map((q, i) => (
                <div
                    key={i}
                    className="bg-space-800 border border-space-600 rounded-xl p-4"
                >
                    <p className="font-semibold mb-2">
                        {i + 1}. {q.question}
                    </p>
                    <ul className="space-y-1">
                        {q.options.map((opt, j) => (
                            <li
                                key={j}
                                className="p-2 border border-space-700 rounded cursor-pointer hover:bg-space-700/40 transition"
                            >
                                {opt}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

// ---------------- Main Renderer ----------------
function LessonContent({
                                  lessonIndex,
                                  sectionIndex,
                              }: {
    lessonIndex: number;
    sectionIndex: number;
}) {
    const lesson = lessons[lessonIndex];
    if (!lesson) return <div>No Lesson Found!</div>;

    const section = sectionMap[sectionIndex];
    if (!section) return <div>Invalid Section</div>;

    const sectionRenderers = {
        Vocabulary: <VocabularySection items={lesson.vocabularyItems}/>,
        Reading: <ReadingSection reading={lesson.reading}/>,
        Grammar: <GrammarSection grammar={lesson.grammar}/>,
        Review: <ReviewSection review={lesson.review}/>,
        Quiz: <QuizSection quiz={lesson.quiz}/>,
    } as const;

    return <Content>{sectionRenderers[section]}</Content>;
}

export default LessonContent;
