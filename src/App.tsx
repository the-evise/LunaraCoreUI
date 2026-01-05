import {useId, useState} from "react";
import type {ReactNode} from "react";
import "material-symbols";

import {lessons} from "@/mockLessons";
import Badge from "@/components/Badge";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ChallengeToast from "@/components/ChallengeToast";
import {ChapterCard} from "@/components/ChapterCard";
import ChapterStepper from "@/components/ChapterStepper";
import Content from "@/components/Content";
import DashboardCard from "@/components/DashboardCard";
import EmptySection from "@/components/EmptySection";
import EvaluationFooter from "@/components/EvaluationFooter";
import IconButton from "@/components/IconButton";
import IELTSLevelIndicator from "@/components/IELTSLevelIndicator";
import LessonContent from "@/components/LessonContent";
import LessonIndicator from "@/components/LessonIndicator";
import LessonProgressIndicator from "@/components/LessonProgressIndicator";
import Navigation, {Logo as NavigationLogo, NavItem} from "@/components/Navigation";
import Progress from "@/components/Progress";
import Quiz from "@/components/Quiz";
import QuizAnimated from "@/components/QuizAnimated";
import QuizCard from "@/components/QuizCard";
import QuizCompletion from "@/components/QuizCompletion";
import ReadingCard from "@/components/ReadingCard";
import ReadingPoint from "@/components/ReadingPoint";
import Roadmap from "@/components/Roadmap";
import RoadmapCard from "@/components/RoadmapCard";
import {SectionIndicatorSkeleton} from "@/components/SectionIndicatorSkeleton";
import SectionTracker from "@/components/SectionTracker";
import SkillItem from "@/components/SkillItem";
import SkillItemListCard from "@/components/SkillItemListCard";
import Subtitle from "@/components/Subtitle";
import {SwipeDeck} from "@/components/SwipeDeck";
import TipCard from "@/components/TipsCard";
import Title from "@/components/Title";
import VocabularyCard from "@/components/VocabularyCard";
import VocabularyNavigator from "@/components/VocabularyNavigator";
import XpProgressionChart from "@/components/XpProgressionChart";
import SuccessAnimation from "@/components/animations/SuccessAnimation";

type DemoSection = {
    id: string;
    label: string;
    description?: string;
    preview: ReactNode;
};

type SwipeDeckItem = {
    id: string;
    title: string;
    description: string;
};

const SwipeDeckDemo = ({items}: { items: SwipeDeckItem[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    if (items.length === 0) return null;
    return (
        <SwipeDeck
            items={items}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
            renderCard={(item) => (
                <Card tone="CelestialBlue" padding="md" rounded="3xl" className="text-left">
                    <Title tone="Space" size={4}>{item.title}</Title>
                    <p className="text-space-600">{item.description}</p>
                </Card>
            )}
        />
    );
};

const LessonIndicatorDemo = ({lessonTitles}: { lessonTitles: string[] }) => {
    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    return (
        <LessonIndicator
            lessons={lessonTitles}
            activeLessonIndex={activeLessonIndex}
            onLessonSelect={setActiveLessonIndex}
        />
    );
};

const SectionTrackerDemo = ({lessonTitles}: { lessonTitles: string[] }) => {
    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    const [activeSectionIndex, setActiveSectionIndex] = useState(1);

    return (
        <div className="rounded-3xl border border-space-100 bg-space-10/40 p-4 lg:p-8">
            <SectionTracker
                lessons={lessonTitles}
                activeLessonIndex={activeLessonIndex}
                onLessonSelect={setActiveLessonIndex}
                activeSectionIndex={activeSectionIndex}
                onSectionSelect={setActiveSectionIndex}
            />
        </div>
    );
};

const EvaluationFooterDemo = () => {
    const scopeId = useId();
    return (
        <div id={scopeId} className="relative rounded-3xl border border-space-100 bg-white p-4">
            <style>{`
                #${scopeId} .fixed {
                    position: static !important;
                    inset: auto !important;
                }
            `}</style>
            <EvaluationFooter/>
        </div>
    );
};

const NavigationDemo = () => (

        <Navigation>
            <NavigationLogo/>
                <NavItem icon="empty_dashboard" active/>
                <NavItem icon="automation"/>
                <NavItem icon="book_3"/>
                <NavItem icon="radio"/>
                <NavItem icon="forum"/>
            <NavItem icon="account_circle"/>
        </Navigation>
);

const ChapterStepperDemo = () => {
    const [activeStepId, setActiveStepId] = useState("lesson-2");
    const steps = [
        {id: "lesson-1", title: "Lesson 1", progressText: "7/7", isCompleted: true},
        {id: "lesson-2", title: "Lesson 2", progressText: "3/7"},
        {id: "lesson-3", title: "Lesson 3", progressText: "0/7", isLocked: true},
    ];

    return (
        <ChapterStepper
            heading="In search of discovery"
            steps={steps}
            activeStepId={activeStepId}
            onStepSelect={setActiveStepId}
        />
    );
};

const SkillItemDemo = () => {
    const skillItems: Array<{
        id: string;
        title: string;
        subtitle: string;
        grade?: "S" | "A" | "B" | "C" | "D" | "F";
        icon: string;
    }> = [
        {id: "skill-s", title: "Listening", subtitle: "Near-perfect", grade: "S", icon: "graphic_eq"},
        {id: "skill-a", title: "Reading", subtitle: "Strong", grade: "A", icon: "menu_book"},
        {id: "skill-b", title: "Vocabulary", subtitle: "On track", grade: "B", icon: "auto_stories"},
        {id: "skill-c", title: "Grammar", subtitle: "Needs polish", grade: "C", icon: "edit_note"},
        {id: "skill-d", title: "Pronunciation", subtitle: "Early progress", grade: "D", icon: "record_voice_over"},
        {id: "skill-f", title: "Writing", subtitle: "Restart focus", grade: "F", icon: "draw"},
        {id: "skill-empty", title: "Review", subtitle: "No grade yet", icon: "history"},
    ];

    return (
        <div className="space-y-3">
            {skillItems.map((item) => (
                <SkillItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    grade={item.grade}
                    icon={<span className="material-symbols-rounded text-xl">{item.icon}</span>}
                />
            ))}
        </div>
    );
};

const SkillItemListCardDemo = () => {
    const [activeSkillId, setActiveSkillId] = useState("skill-a");
    const skills = [
        {
            id: "skill-a",
            title: "Reading",
            subtitle: "Active lesson",
            grade: "A" as const,
            icon: <span className="material-symbols-rounded text-xl">menu_book</span>,
        },
        {
            id: "skill-b",
            title: "Vocabulary",
            subtitle: "Word bank",
            grade: "B" as const,
            icon: <span className="material-symbols-rounded text-xl">auto_stories</span>,
        },
        {
            id: "skill-c",
            title: "Grammar",
            subtitle: "Practice set",
            grade: "C" as const,
            icon: <span className="material-symbols-rounded text-xl">edit_note</span>,
        },
        {
            id: "skill-empty",
            title: "Speaking",
            subtitle: "Not graded",
            icon: <span className="material-symbols-rounded text-xl">forum</span>,
        },
        {
            id: "skill-locked",
            title: "Writing",
            subtitle: "Locked",
            grade: "F" as const,
            disabled: true,
            icon: <span className="material-symbols-rounded text-xl">draw</span>,
        },
    ];

    return (
        <SkillItemListCard
            title="Skill Overview"
            skills={skills}
            activeSkillId={activeSkillId}
            onSkillSelect={setActiveSkillId}
            footer={<span className="text-sm text-space-500">Tap a skill to continue.</span>}
        />
    );
};

function App() {
    const primaryLesson = lessons[0];

    if (!primaryLesson) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-space-25 text-space-500">
                No mock lessons available.
            </div>
        );
    }

    const lessonTitles = lessons.map((lesson) => lesson.title);
    const sampleVocabulary = lessons.flatMap((lesson) => lesson.vocabularyItems).slice(0, 4);
    const vocabularyItems = sampleVocabulary.length
        ? sampleVocabulary
        : [{
            word: "checkpoint",
            meaningEn: "a quick placeholder entry",
            meaningFa: "�?�?�?�?�?�? �?�?�?�?�?",
            examples: ["Use sample data to preview layouts."],
            image: "https://placehold.co/400x260?text=Vocab",
        }];
    const deckItems: SwipeDeckItem[] = vocabularyItems.map((item) => ({
        id: item.word,
        title: item.word,
        description: item.meaningEn,
    }));

    const readingPoints = primaryLesson.reading.points?.length
        ? primaryLesson.reading.points
        : [{
            title: "Read twice",
            body: "Skim for topic, then scan for details.",
            description: "Use quick passes to find airport facts.",
        }];

    const tipItems = primaryLesson.review.tips.length
        ? primaryLesson.review.tips
        : ["Use present continuous for ongoing actions.", "Keep sentences short and clear."];

    const chapterLessons = [
        {id: "l1", title: "Lesson 1", progress: "completed" as const},
        {id: "l2", title: "Lesson 2", progress: "unlocked" as const},
        {id: "l3", title: "Lesson 3", progress: "locked" as const},
    ];

    const quizData = primaryLesson.quiz;

    const demoSections: DemoSection[] = [
        {
            id: "badge",
            label: "Badge",
            preview: (
                <div className="flex flex-wrap gap-3">
                    <Badge type="xp">120</Badge>
                    <Badge type="time">02:32</Badge>
                    <Badge type="grade" grade="A"/>
                    <Badge/>
                </div>
            ),
        },
        {
            id: "breadcrumb-bar",
            label: "BreadcrumbBar",
            preview: (
                <BreadcrumbBar
                    items={["Roadmap A2", "Airport", "Vocabulary"]}
                    onBack={() => console.log("Back clicked")}
                />
            ),
        },
        {
            id: "button",
            label: "Button",
            preview: (
                <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="quiz" hasIcon icon={<span className="material-symbols-rounded">bolt</span>}>
                        Quiz CTA
                    </Button>
                </div>
            ),
        },
        {
            id: "card",
            label: "Card",
            preview: (
                <Card tone="CelestialBlue" rounded="3xl">
                    <Title>Reusable Card</Title>
                    <p className="text-space-600">Wrap any content inside tone, padding, and elevation variants.</p>
                </Card>
            ),
        },
        {
            id: "challenge-toast",
            label: "ChallengeToast",
            preview: <ChallengeToast message="Finish a lesson today for bonus XP." xp={25} status="success"/>,
        },
        {
            id: "chapter-card",
            label: "ChapterCard",
            preview: (
                <ChapterCard
                    id="chapter-1"
                    title="Travel Basics"
                    lessons={chapterLessons}
                    onLessonClick={(lessonId) => console.log("open", lessonId)}
                />
            ),
        },
        {
            id: "chapter-stepper",
            label: "ChapterStepper",
            preview: <ChapterStepperDemo/>,
        },
        {
            id: "skill-item",
            label: "SkillItem",
            preview: <SkillItemDemo/>,
        },
        {
            id: "skill-item-list-card",
            label: "SkillItemListCard",
            preview: <SkillItemListCardDemo/>,
        },
        {
            id: "content",
            label: "Content",
            preview: (
                <Content>
                    <p className="text-space-600">
                        Content aligns blocks vertically with even spacing. Use FullBleed to break the width when needed.
                    </p>
                    <Content.FullBleed>
                        <div className="rounded-2xl border border-dashed border-space-200 p-3 text-center text-sm text-space-500">
                            Full-bleed sample area
                        </div>
                    </Content.FullBleed>
                </Content>
            ),
        },
        {
            id: "dashboard-card",
            label: "DashboardCard",
            preview: (
                <div className="grid gap-4 md:grid-cols-3">
                    <DashboardCard
                        title={[{text: "�?�?�?�?�?�?�? �?�?�?�?", lang: "fa"}]}
                        type="roadmap"
                        path={["Roadmap A1", "Grammar"]}
                        progress={45}
                    />
                    <DashboardCard
                        title={[
                            {text: "�?�?�?�?", lang: "fa"},
                            {text: "Oxford Word Skills 2", lang: "en"},
                        ]}
                        type="book"
                        path={["Trip with Robert", "Lesson 23"]}
                        progress={58}
                    />
                    <DashboardCard
                        title={[{text: "Playlist", lang: "en"}]}
                        type="music"
                        path={["This is not America"]}
                        progress={98}
                    />
                </div>
            ),
        },
        {
            id: "empty-section",
            label: "EmptySection",
            preview: (
                <div className="flex gap-6 overflow-x-auto">
                    <EmptySection section="Vocabulary"/>
                    <EmptySection section="Reading"/>
                </div>
            ),
        },
        {
            id: "evaluation-footer",
            label: "EvaluationFooter",
            preview: <EvaluationFooterDemo/>,
        },
        {
            id: "icon-button",
            label: "IconButton",
            preview: (
                <div className="flex gap-3">
                    <IconButton variant="default">chevron_left</IconButton>
                    <IconButton variant="solid" rounded>play_arrow</IconButton>
                </div>
            ),
        },
        {
            id: "ielts-level-indicator",
            label: "IELTSLevelIndicator",
            preview: <IELTSLevelIndicator score={6.5}/>,
        },
        {
            id: "lesson-content",
            label: "LessonContent",
            preview: (
                <div className="rounded-3xl border border-space-100 bg-space-900 text-space-50">
                    <LessonContent lessonIndex={0} sectionIndex={2}/>
                </div>
            ),
        },
        {
            id: "lesson-indicator",
            label: "LessonIndicator",
            preview: <LessonIndicatorDemo lessonTitles={lessonTitles}/>,
        },
        {
            id: "lesson-progress-indicator",
            label: "LessonProgressIndicator",
            preview: (
                <LessonProgressIndicator
                    progress={3}
                    maxWidth={320}
                    label="Current Section"
                    tone="celestial"
                />
            ),
        },
        {
            id: "navigation",
            label: "Navigation",
            preview: <NavigationDemo/>,
        },
        {
            id: "progress",
            label: "Progress",
            preview: (
                <div className="flex flex-col gap-4">
                    <Progress value={65} hasStrips tone="space"/>
                    <div className="flex gap-4">
                        <Progress value={2} max={5} dotted size="lg" tone="celestial" orientation="vertical"/>
                        <Progress value={4} max={5} dotted size="lg" tone="celestial" orientation="vertical"/>
                    </div>
                </div>
            ),
        },
        {
            id: "quiz",
            label: "Quiz",
            preview: (
                <div className="rounded-3xl border border-space-100 bg-white p-4">
                    <Quiz data={quizData} mode="quiz"/>
                </div>
            ),
        },
        {
            id: "quiz-animated",
            label: "QuizAnimated",
            preview: (
                <div className="rounded-3xl border border-space-100 bg-white p-4">
                    <QuizAnimated data={quizData} mode="quiz"/>
                </div>
            ),
        },
        {
            id: "quiz-card",
            label: "QuizCard",
            preview: <QuizCard xp={120} time="02:32" grade="S"/>,
        },
        {
            id: "quiz-completion",
            label: "QuizCompletion",
            preview: (
                <QuizCompletion
                    message="Great job! Keep the streak going."
                    result={{xp: 25, time: "05:23", grade: "A"}}
                    status="success"
                    animation={<SuccessAnimation/>}
                    actionLabel="Continue"
                />
            ),
        },
        {
            id: "reading-card",
            label: "ReadingCard",
            preview: (
                <ReadingCard>
                    <ReadingCard.Image src={primaryLesson.reading.image} alt={primaryLesson.reading.title}/>
                    <ReadingCard.Title>{primaryLesson.reading.title}</ReadingCard.Title>
                    <ReadingCard.Body reading={primaryLesson.reading.readingText}/>
                </ReadingCard>
            ),
        },
        {
            id: "reading-point",
            label: "ReadingPoint",
            preview: (
                <ReadingPoint>
                    {readingPoints.map((point, index) => (
                        <ReadingPoint.Item key={point.title}>
                            <ReadingPoint.Title>{point.title}</ReadingPoint.Title>
                            <ReadingPoint.Body>{point.body}</ReadingPoint.Body>
                            {point.description && (
                                <ReadingPoint.Description>{point.description}</ReadingPoint.Description>
                            )}
                        </ReadingPoint.Item>
                    ))}
                </ReadingPoint>
            ),
        },
        {
            id: "roadmap",
            label: "Roadmap",
            preview: (
                <div className="rounded-3xl border border-space-100 bg-space-10/50 p-4">
                    <Roadmap lessons={lessonTitles}/>
                </div>
            ),
        },
        {
            id: "roadmap-card",
            label: "RoadmapCard",
            preview: (
                <RoadmapCard
                    title="Madagascar Journey"
                    description="Discover airports, transportation, and travel essentials across the island."
                    rating={7.5}
                    progress={34}
                    imageSrc="/roadmap-1.jpg"
                    onNavigate={() => console.log("Navigate to roadmap")}
                />
            ),
        },
        {
            id: "section-indicator-skeleton",
            label: "SectionIndicatorSkeleton",
            preview: (
                <div className="flex gap-4">
                    <SectionIndicatorSkeleton section="Review" direction={1}/>
                </div>
            ),
        },
        {
            id: "section-tracker",
            label: "SectionTracker",
            preview: <SectionTrackerDemo lessonTitles={lessonTitles}/>,
        },
        {
            id: "subtitle",
            label: "Subtitle",
            preview: (
                <div className="flex flex-wrap gap-3">
                    <Subtitle tone="CelestialBlue" size={4}>Reading Highlights</Subtitle>
                    <Subtitle tone="Saffron" size={5}>Vocabulary tip</Subtitle>
                </div>
            ),
        },
        {
            id: "swipe-deck",
            label: "SwipeDeck",
            preview: <SwipeDeckDemo items={deckItems}/>,
        },
        {
            id: "tips-card",
            label: "TipCard",
            preview: (
                <TipCard title="Tips">
                    {tipItems.map((tip, index) => (
                        <TipCard.Item key={tip}>
                            <TipCard.Title>Tip {index + 1}</TipCard.Title>
                            <TipCard.Body>{tip}</TipCard.Body>
                        </TipCard.Item>
                    ))}
                </TipCard>
            ),
        },
        {
            id: "title",
            label: "Title",
            preview: (
                <div className="flex flex-col gap-2">
                    <Title size={2}>Primary heading</Title>
                    <Title tone="PersianRed" size={4}>Secondary heading</Title>
                </div>
            ),
        },
        {
            id: "vocabulary-card",
            label: "VocabularyCard",
            preview: (
                <VocabularyCard
                    imageSrc={vocabularyItems[0]?.image ?? "https://placehold.co/400"}
                    faText={vocabularyItems[0]?.meaningFa ?? "�?���?�?�?�?�? �?�?�?�?"}
                    enWord={vocabularyItems[0]?.word ?? "passport"}
                    definition={vocabularyItems[0]?.meaningEn ?? "ID document for travel"}
                    examples={vocabularyItems[0]?.examples ?? ["He forgot his passport.", "Show it at the gate."]}
                />
            ),
        },
        {
            id: "vocabulary-navigator",
            label: "VocabularyNavigator",
            preview: <VocabularyNavigator vocabularyItems={vocabularyItems}/>,
        },
        {
            id: "xp-progression-chart",
            label: "XpProgressionChart",
            preview: <XpProgressionChart/>,
        },
        {
            id: "success-animation",
            label: "SuccessAnimation",
            preview: (
                <div className="flex justify-center">
                    <div className="w-60">
                        <SuccessAnimation/>
                    </div>
                </div>
            ),
        },
    ];

    const allSectionIds = demoSections.map((section) => section.id);
    const defaultEnabledSections = new Set(["chapter-stepper", "skill-item", "skill-item-list-card"]);
    const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(
        () => Object.fromEntries(allSectionIds.map((id) => [id, defaultEnabledSections.has(id)])),
    );

    const handleToggleSection = (sectionId: string) => {
        setEnabledSections((prev) => ({
            ...prev,
            [sectionId]: !(prev[sectionId] ?? true),
        }));
    };

    const handleSelectAll = () => {
        setEnabledSections(Object.fromEntries(allSectionIds.map((id) => [id, true])));
    };

    const handleSelectNone = () => {
        setEnabledSections(Object.fromEntries(allSectionIds.map((id) => [id, false])));
    };

    const visibleSections = demoSections.filter((section) => enabledSections[section.id] ?? true);
    const totalSections = demoSections.length;
    const enabledCount = visibleSections.length;
    const isAllSelected = enabledCount === totalSections;
    const isNoneSelected = enabledCount === 0;

    return (
        <div className="min-h-screen bg-space-25 text-space-900">
            <div className="flex min-h-screen">
                <nav className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col gap-4 overflow-y-auto border-r border-space-100 bg-white p-6 lg:flex">
                    <div className="space-y-2">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-space-400">Components</p>
                            <p className="text-lg font-semibold text-space-900">{enabledCount} / {totalSections} visible</p>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-space-100 bg-space-50 px-3 py-2 text-xs font-semibold text-space-500">
                            <span>Toggle All</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="rounded-full border border-space-200 px-3 py-1 text-xs font-medium text-space-600 transition hover:border-celestialblue-200 hover:text-celestialblue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={handleSelectAll}
                                    disabled={isAllSelected}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-space-200 px-3 py-1 text-xs font-medium text-space-600 transition hover:border-persianred-200 hover:text-persianred-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={handleSelectNone}
                                    disabled={isNoneSelected}
                                >
                                    None
                                </button>
                            </div>
                        </div>
                    </div>
                    <ul className="flex flex-col gap-1 text-sm">
                        {demoSections.map((section) => {
                            const isChecked = enabledSections[section.id] ?? true;
                            return (
                            <li key={section.id}>
                                <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-space-50">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={isChecked}
                                        onChange={() => handleToggleSection(section.id)}
                                        aria-label={`Toggle ${section.label}`}
                                    />
                                    <a
                                        href={`#${section.id}`}
                                        className="flex-1 text-space-600 transition hover:text-space-900"
                                    >
                                        {section.label}
                                    </a>
                                </div>
                            </li>
                        );})}
                    </ul>
                </nav>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
                    <div className="space-y-16">
                        {visibleSections.length > 0 ? (
                            visibleSections.map((section) => (
                                <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                                    <header>
                                        <h2 className="text-2xl font-semibold text-space-900">{section.label}</h2>
                                        {section.description && (
                                            <p className="text-sm text-space-500">{section.description}</p>
                                        )}
                                    </header>
                                    <div className="rounded-3xl border border-space-100 bg-white p-6 shadow-sm">
                                        {section.preview}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-dashed border-space-200 bg-white p-10 text-center text-space-500">
                                Enable components from the checklist to preview them here.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
