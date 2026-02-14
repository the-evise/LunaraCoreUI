import {useId, useMemo, useState} from "react";
import type {ReactNode} from "react";
import "material-symbols";

import {lessons} from "@/mockLessons";
import Badge from "@/components/Badge";
import Breadcrumb from "@/components/Breadcrumb";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ChallengeToast from "@/components/ChallengeToast";
import Checkbox from "@/components/Checkbox";
import ComingSoonCard from "@/components/ComingSoonCard";
import {ChapterCard} from "@/components/ChapterCard";
import ChapterStepper from "@/components/ChapterStepper";
import Content from "@/components/Content";
import DashboardCard from "@/components/DashboardCard";
import DashboardMessage from "@/components/DashboardMessage";
import EmptySection from "@/components/EmptySection";
import EvaluationFooter from "@/components/EvaluationFooter";
import GrammarCard from "@/components/GrammarCard";
import IconButton from "@/components/IconButton";
import BandIndicator from "@/components/BandIndicator";
import InfoButtons from "@/components/InfoButtons";
import Input from "@/components/Input";
import InputGroup from "@/components/InputGroup";
import LessonContent from "@/components/LessonContent";
import type { QuizData, Reading } from "@/components/LessonContent";
import LessonIndicator from "@/components/LessonIndicator";
import LessonProgressIndicator from "@/components/LessonProgressIndicator";
import LunaraLogo from "@/components/LunaraLogo";
import MermaidDiagram from "@/components/MermaidDiagram";
import MilestoneTrackerCard from "@/components/MilestoneTrackerCard";
import MenuPanel, { type MenuPanelOpenReason } from "@/components/MenuPanel";
import Navigation, {Logo as NavigationLogo, NavItem} from "@/components/Navigation";
import NotificationIsland from "@/components/NotificationIsland";
import type { NotificationIslandItem } from "@/components/NotificationIsland";
import NotificationPill from "@/components/NotificationPill";
import NotificationPillEmpty from "@/components/NotificationPillEmpty";
import Progress from "@/components/Progress";
import Quiz from "@/components/Quiz";
import QuizAnimated from "@/components/QuizAnimated";
import QuizCard from "@/components/QuizCard";
import SectionStatus from "@/components/SectionStatus";
import QuizCompletion from "@/components/QuizCompletion";
import OnboardingWizard, {
    type OnboardingWizardAnswers,
    type OnboardingWizardQuestion,
} from "@/components/OnboardingWizard";
import Radio from "@/components/Radio";
import RadioGroup from "@/components/RadioGroup";
import ReadingCard from "@/components/ReadingCard";
import ReadingPoint from "@/components/ReadingPoint";
import Roadmap from "@/components/Roadmap";
import RoadmapCard from "@/components/RoadmapCard";
import {SectionIndicatorSkeleton} from "@/components/SectionIndicatorSkeleton";
import SectionTracker from "@/components/SectionTracker";
import SkillItem from "@/components/SkillItem";
import SkillItemListCard from "@/components/SkillItemListCard";
import StreakButton from "@/components/StreakButton";
import StreakCard from "@/components/StreakCard";
import Subtitle from "@/components/Subtitle";
import {SwipeDeck} from "@/components/SwipeDeck";
import Tabs from "@/components/Tabs";
import TipCard from "@/components/TipsCard";
import Toggle from "@/components/Toggle";
import ToggleGroup from "@/components/ToggleGroup";
import TopBar from "@/components/TopBar";
import Title from "@/components/Title";
import Tooltip from "@/components/Tooltip";
import VocabularyOfDay from "@/components/VocabularyOfDay";
import VocabularyCard from "@/components/VocabularyCard";
import VocabularyNavigator, { type VocabularyItem as VocabularyNavigatorItem } from "@/components/VocabularyNavigator";
import XpProgressionChart, { type XpPoint } from "@/components/XpProgressionChart";
import SuccessAnimation from "@/components/animations/SuccessAnimation";
import RoadmapCardSkeleton from "@/components/RoadmapCardSkeleton";

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

type WizardRoutePreset = {
    path: string;
    title: string;
    subtitle: string;
    questions: OnboardingWizardQuestion[];
};

const badgeSizeOptions = ["default", "2xl", "xl", "lg", "md", "sm", "item"] as const;
const badgeTypeOptions = ["empty", "locked", "time", "xp", "grade"] as const;
const badgeGradeOptions = ["S", "A", "B", "C", "D", "F"] as const;
const titleToneOptions = [
    "CelestialBlue",
    "CelestialBlue_alt",
    "Saffron",
    "PersianRed",
    "PersianRed_alt",
    "PersianRed_dark",
    "Emerald",
    "Space",
    "Space_alt",
] as const;
const titleSizeOptions = [1, 2, 3, 4, 5, 6] as const;

type BadgeSizeOption = typeof badgeSizeOptions[number];
type BadgeTypeOption = typeof badgeTypeOptions[number];
type BadgeGradeOption = typeof badgeGradeOptions[number];

const createFlagRecord = <T extends readonly string[]>(items: T, initial = true) =>
    Object.fromEntries(items.map((item) => [item, initial])) as Record<T[number], boolean>;

const matchesDemoSectionQuery = (section: DemoSection, query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        return true;
    }

    return [
        section.id,
        section.label,
        section.description ?? "",
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
};

const BadgeDemo = () => {
    const [sizeFilters, setSizeFilters] = useState<Record<BadgeSizeOption, boolean>>(
        () => createFlagRecord(badgeSizeOptions),
    );
    const [typeFilters, setTypeFilters] = useState<Record<BadgeTypeOption, boolean>>(
        () => createFlagRecord(badgeTypeOptions),
    );
    const [gradeFilters, setGradeFilters] = useState<Record<BadgeGradeOption, boolean>>(
        () => createFlagRecord(badgeGradeOptions),
    );
    const [showGradeCustom, setShowGradeCustom] = useState(true);
    const [showGradeUndefined, setShowGradeUndefined] = useState(true);

    const selectedSizes = badgeSizeOptions.filter((size) => sizeFilters[size]);
    const selectedTypes = badgeTypeOptions.filter((type) => typeFilters[type]);
    const selectedGrades = badgeGradeOptions.filter((grade) => gradeFilters[grade]);

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="flex flex-wrap gap-3">
                            {badgeSizeOptions.map((size) => (
                                <label key={`badge-size-${size}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={sizeFilters[size]}
                                        onChange={() => setSizeFilters((prev) => ({...prev, [size]: !prev[size]}))}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Types</p>
                        <div className="flex flex-wrap gap-3">
                            {badgeTypeOptions.map((type) => (
                                <label key={`badge-type-${type}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={typeFilters[type]}
                                        onChange={() => setTypeFilters((prev) => ({...prev, [type]: !prev[type]}))}
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Grades</p>
                        <div className="flex flex-wrap gap-3">
                            {badgeGradeOptions.map((grade) => (
                                <label key={`badge-grade-${grade}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={gradeFilters[grade]}
                                        onChange={() => setGradeFilters((prev) => ({...prev, [grade]: !prev[grade]}))}
                                    />
                                    <span>{grade}</span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 text-xs font-medium text-space-500">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                    checked={showGradeCustom}
                                    onChange={() => setShowGradeCustom((prev) => !prev)}
                                />
                                <span>Custom grade</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-medium text-space-500">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                    checked={showGradeUndefined}
                                    onChange={() => setShowGradeUndefined((prev) => !prev)}
                                />
                                <span>Grade undefined</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
        {selectedSizes.map((sizeOption) => {
                    const sizeProp = sizeOption === "default" ? undefined : sizeOption;
                    return (
                        <div key={`badge-row-${sizeOption}`} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                                    {sizeOption}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {selectedTypes.includes("empty") ? (
                                    <Badge key={`badge-${sizeOption}-empty`} type="empty" size={sizeProp} />
                                ) : null}
                                {selectedTypes.includes("locked") ? (
                                    <Badge key={`badge-${sizeOption}-locked`} type="locked" size={sizeProp} />
                                ) : null}
                                {selectedTypes.includes("time") && sizeOption !== "item" ? (
                                    <Badge
                                        key={`badge-${sizeOption}-time`}
                                        type="time"
                                        size={sizeOption === "default" ? undefined : sizeOption}
                                    >
                                        02:32
                                    </Badge>
                                ) : null}
                                {selectedTypes.includes("xp") && sizeOption !== "item" ? (
                                    <Badge
                                        key={`badge-${sizeOption}-xp`}
                                        type="xp"
                                        size={sizeOption === "default" ? undefined : sizeOption}
                                    >
                                        120
                                    </Badge>
                                ) : null}
                                {selectedTypes.includes("grade") ? (
                                    <>
                                        {selectedGrades.map((grade) => (
                                            <Badge
                                                key={`badge-${sizeOption}-grade-${grade}`}
                                                type="grade"
                                                size={sizeProp}
                                                grade={grade}
                                            />
                                        ))}
                                        {showGradeCustom ? (
                                            <Badge
                                                key={`badge-${sizeOption}-grade-custom`}
                                                type="grade"
                                                size={sizeProp}
                                                grade="B"
                                            >
                                                B+
                                            </Badge>
                                        ) : null}
                                        {showGradeUndefined ? (
                                            <Badge
                                                key={`badge-${sizeOption}-grade-undefined`}
                                                type="grade"
                                                size={sizeProp}
                                                grade={undefined}
                                            />
                                        ) : null}
                                    </>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
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

const MenuPanelDemo = () => {
    const [selectedAction, setSelectedAction] = useState("No action selected");
    const [pinnedMode, setPinnedMode] = useState(false);
    const [controlledOpen, setControlledOpen] = useState(false);
    const [lastChangeReason, setLastChangeReason] = useState<MenuPanelOpenReason | null>(null);
    const triggerVariants = ["primary", "secondary", "quiz", "outline", "ghost"] as const;
    const contentVariants = ["default", "soft", "elevated", "ghost"] as const;
    const itemVariants = ["primary", "outline", "ghost"] as const;
    const placementChecks = [
        { label: "Bottom / Start", side: "bottom", align: "start" },
        { label: "Bottom / End", side: "bottom", align: "end" },
        { label: "Top / Start", side: "top", align: "start" },
        { label: "Top / Center", side: "top", align: "center" },
    ] as const;

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">State</p>
                        <p className="text-xs text-space-500">Last action: {selectedAction}</p>
                        <p className="text-xs text-space-500">Controlled open: {controlledOpen ? "true" : "false"}</p>
                        <p className="text-xs text-space-500">Last reason: {lastChangeReason ?? "none"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            icon={controlledOpen ? "visibility_off" : "visibility"}
                            onClick={() => setControlledOpen((prev) => !prev)}
                        >
                            Toggle controlled
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            icon="restart_alt"
                            onClick={() => {
                                setSelectedAction("No action selected");
                                setPinnedMode(false);
                                setControlledOpen(false);
                                setLastChangeReason(null);
                            }}
                        >
                            Reset states
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Trigger variants</p>
                <div className="flex flex-wrap gap-3">
                    {triggerVariants.map((variant) => (
                        <MenuPanel key={`menu-trigger-variant-${variant}`}>
                            <MenuPanel.Trigger variant={variant} icon="menu">
                                {variant}
                            </MenuPanel.Trigger>
                            <MenuPanel.Content variant="default" align="start" className="min-w-[220px]">
                                <MenuPanel.Label className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-space-400">
                                    {variant} trigger
                                </MenuPanel.Label>
                                <MenuPanel.Separator className="my-1 h-px bg-space-100" />
                                <MenuPanel.Item
                                    variant="outline"
                                    icon="touch_app"
                                    onSelect={() => setSelectedAction(`Triggered from ${variant}`)}
                                >
                                    Select action
                                </MenuPanel.Item>
                            </MenuPanel.Content>
                        </MenuPanel>
                    ))}
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Content variants</p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {contentVariants.map((variant) => (
                        <MenuPanel key={`menu-content-variant-${variant}`}>
                            <MenuPanel.Trigger variant="outline" icon="palette">
                                {variant}
                            </MenuPanel.Trigger>
                            <MenuPanel.Content variant={variant} className="min-w-[240px]">
                                <MenuPanel.Label className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-space-400">
                                    {variant} surface
                                </MenuPanel.Label>
                                <MenuPanel.Separator className="my-1 h-px bg-space-100" />
                                <MenuPanel.Item variant="ghost" icon="stylus_note">
                                    Content preview
                                </MenuPanel.Item>
                            </MenuPanel.Content>
                        </MenuPanel>
                    ))}
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Item variants + edge cases</p>
                <MenuPanel
                    open={controlledOpen}
                    onOpenChange={(nextOpen, reason) => {
                        setControlledOpen(nextOpen);
                        setLastChangeReason(reason);
                    }}
                >
                    <MenuPanel.Trigger asChild>
                        <Button variant="secondary" size="sm" icon="more_horiz" className="!h-10 !rounded-xl">
                            Controlled + asChild
                        </Button>
                    </MenuPanel.Trigger>
                    <MenuPanel.Content variant="elevated" align="start" className="min-w-[300px]">
                        <MenuPanel.Label className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-space-400">
                            Items + edge behavior
                        </MenuPanel.Label>
                        <MenuPanel.Separator className="my-1 h-px bg-space-100" />
                        <div className="space-y-1">
                            {itemVariants.map((variant) => (
                                <MenuPanel.Item
                                    key={`menu-item-variant-${variant}`}
                                    variant={variant}
                                    icon="done"
                                    onSelect={() => setSelectedAction(`Selected ${variant} item`)}
                                >
                                    {variant} item
                                </MenuPanel.Item>
                            ))}
                            <MenuPanel.Item
                                variant="ghost"
                                icon="push_pin"
                                closeOnSelect={false}
                                isToggle
                                toggled={pinnedMode}
                                onToggleChange={setPinnedMode}
                            >
                                Persistent mode (closeOnSelect=false)
                            </MenuPanel.Item>
                            <MenuPanel.Item
                                variant="outline"
                                icon="checklist"
                                iconPosition="end"
                                onSelect={(event) => {
                                    event.preventDefault();
                                    setSelectedAction("Prevented close via event.preventDefault()");
                                }}
                            >
                                Prevent close on select
                            </MenuPanel.Item>
                            <MenuPanel.Item
                                variant="outline"
                                icon="article"
                                onSelect={() => setSelectedAction("Long label clicked")}
                            >
                                <span className="truncate">
                                    Very long menu label to test overflow behavior across narrower panel widths
                                </span>
                            </MenuPanel.Item>
                            <MenuPanel.Item variant="outline" icon="block" disabled>
                                Disabled item
                            </MenuPanel.Item>
                        </div>
                    </MenuPanel.Content>
                </MenuPanel>
                <div className="flex flex-wrap items-center gap-2">
                    <MenuPanel>
                        <MenuPanel.Trigger
                            variant="ghost"
                            icon="more_vert"
                            className="h-10 w-10 !p-0"
                            aria-label="Icon-only menu trigger"
                        />
                        <MenuPanel.Content variant="ghost" align="end" className="min-w-[180px]">
                            <MenuPanel.Item variant="ghost" icon="bolt">Icon-only trigger menu</MenuPanel.Item>
                        </MenuPanel.Content>
                    </MenuPanel>
                    <MenuPanel>
                        <MenuPanel.Trigger variant="outline" icon="lock" disabled>
                            Disabled trigger
                        </MenuPanel.Trigger>
                        <MenuPanel.Content>
                            <MenuPanel.Item>Should never open</MenuPanel.Item>
                        </MenuPanel.Content>
                    </MenuPanel>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Placement + direction checks</p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {placementChecks.map((placement) => (
                        <MenuPanel key={`menu-placement-${placement.label}`}>
                            <MenuPanel.Trigger variant="outline" icon="open_with">
                                {placement.label}
                            </MenuPanel.Trigger>
                            <MenuPanel.Content
                                variant="soft"
                                side={placement.side}
                                align={placement.align}
                                className="min-w-[210px]"
                            >
                                <MenuPanel.Label className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-space-400">
                                    {placement.label}
                                </MenuPanel.Label>
                                <MenuPanel.Separator className="my-1 h-px bg-space-100" />
                                <MenuPanel.Item variant="ghost" icon="animation">
                                    Check slide direction
                                </MenuPanel.Item>
                            </MenuPanel.Content>
                        </MenuPanel>
                    ))}
                </div>
            </div>
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
        {id: "lesson-1", title: "Lesson 1: the box", progressText: "7/7", isCompleted: true},
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
        disabled?: boolean | "LOCKED";
    }> = [
        {id: "skill-s", title: "Listening", subtitle: "Near-perfect", grade: "S", icon: "graphic_eq"},
        {id: "skill-a", title: "Reading", subtitle: "Strong", grade: "A", icon: "menu_book"},
        {id: "skill-b", title: "Vocabulary", subtitle: "On track", grade: "B", icon: "auto_stories"},
        {id: "skill-c", title: "Grammar", subtitle: "Needs polish", grade: "C", icon: "edit_note"},
        {id: "skill-d", title: "Pronunciation", subtitle: "Early progress", grade: "D", icon: "record_voice_over"},
        {id: "skill-f", title: "Writing", subtitle: "Restart focus", grade: "F", icon: "draw"},
        {id: "skill-locked-a", title: "Speaking", subtitle: "Locked with prior grade", grade: "A", icon: "forum", disabled: "LOCKED"},
        {id: "skill-empty", title: "Review", subtitle: "No grade yet", icon: "history"},
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Default</p>
                {skillItems.map((item) => (
                    <SkillItem
                        key={item.id}
                        title={item.title}
                        subtitle={item.subtitle}
                        grade={item.grade}
                        icon={item.icon}
                        disabled={item.disabled}
                    />
                ))}
            </div>
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Skeleton</p>
                {Array.from({length: 3}).map((_, index) => (
                    <SkillItem
                        key={`skill-skeleton-demo-${index}`}
                        title=""
                        isLoading
                    />
                ))}
            </div>
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
            icon: "menu_book",
        },
        {
            id: "skill-b",
            title: "Vocabulary",
            subtitle: "Word bank",
            grade: "B" as const,
            icon: "auto_stories",
        },
        {
            id: "skill-c",
            title: "Grammar",
            subtitle: "Practice set",
            grade: "C" as const,
            icon: "edit_note",
        },
        {
            id: "skill-empty",
            title: "Speaking",
            subtitle: "Not graded",
            icon: "forum",
        },
        {
            id: "skill-locked",
            title: "Writing",
            subtitle: "Locked",
            grade: "F" as const,
            disabled: "LOCKED" as const,
            icon: "draw",
        },
    ];

    return (
        <div className="space-y-6">
            <SkillItemListCard
                title="Skill Overview"
                skills={skills}
                activeSkillId={activeSkillId}
                onSkillSelect={setActiveSkillId}
                footer={<span>Tap a skill to continue.</span>}
            />
            <SkillItemListCard
                title="Skill Overview (Loading)"
                skills={skills}
                isLoading
                skeletonCount={5}
            />
        </div>
    );
};

const TabsDemo = () => {
    const tabsVariantOptions = ["primary", "secondary", "quiz", "ghost", "outline"] as const;
    const tabsSizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;
    const tabsOrientationOptions = ["horizontal", "vertical"] as const;
    type TabsVariantOption = typeof tabsVariantOptions[number];
    type TabsSizeOption = typeof tabsSizeOptions[number];
    type TabsOrientationOption = typeof tabsOrientationOptions[number];

    const [activeTab, setActiveTab] = useState("overview");
    const [variantFilters, setVariantFilters] = useState<Record<TabsVariantOption, boolean>>(
        () => createFlagRecord(tabsVariantOptions),
    );
    const [sizeFilters, setSizeFilters] = useState<Record<TabsSizeOption, boolean>>(
        () => createFlagRecord(tabsSizeOptions),
    );
    const [orientationFilters, setOrientationFilters] = useState<Record<TabsOrientationOption, boolean>>(
        () => createFlagRecord(tabsOrientationOptions),
    );

    const selectedVariants = tabsVariantOptions.filter((variant) => variantFilters[variant]);
    const selectedSizes = tabsSizeOptions.filter((size) => sizeFilters[size]);
    const selectedOrientations = tabsOrientationOptions.filter((orientation) => orientationFilters[orientation]);
    const selectedVariant = selectedVariants[0] ?? "primary";
    const selectedSize = selectedSizes[0] ?? "md";
    const selectedOrientation = selectedOrientations[0] ?? "horizontal";
    const hasSelections = selectedVariants.length && selectedSizes.length && selectedOrientations.length;

    const tabItems = [
        {
            value: "overview",
            label: "Overview",
            content: (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Mission</p>
                    <p className="text-sm text-space-600">
                        Track streaks, complete a short lesson, and wrap with a quick review.
                    </p>
                </div>
            ),
        },
        {
            value: "details",
            label: "Details",
            content: (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Session</p>
                    <p className="text-sm text-space-600">
                        3 reading drills, 2 vocabulary rounds, and 1 grammar checkpoint.
                    </p>
                </div>
            ),
        },
        {
            value: "notes",
            label: "Notes",
            content: (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Coach</p>
                    <p className="text-sm text-space-600">
                        Keep sentences short and track unfamiliar verbs for later review.
                    </p>
                </div>
            ),
        },
        {
            value: "archive",
            label: "Archive",
            content: (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Locked</p>
                    <p className="text-sm text-space-600">
                        Unlock after finishing three sessions.
                    </p>
                </div>
            ),
            disabled: true,
        },
    ];

    return (
        <div className="space-y-8">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            {tabsVariantOptions.map((variant) => (
                                <label key={`tabs-variant-${variant}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={variantFilters[variant]}
                                        onChange={() => setVariantFilters((prev) => ({...prev, [variant]: !prev[variant]}))}
                                    />
                                    <span>{variant}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="flex flex-wrap gap-3">
                            {tabsSizeOptions.map((size) => (
                                <label key={`tabs-size-${size}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={sizeFilters[size]}
                                        onChange={() => setSizeFilters((prev) => ({...prev, [size]: !prev[size]}))}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Orientation</p>
                        <div className="flex flex-wrap gap-3">
                            {tabsOrientationOptions.map((orientation) => (
                                <label key={`tabs-orientation-${orientation}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={orientationFilters[orientation]}
                                        onChange={() => setOrientationFilters((prev) => ({...prev, [orientation]: !prev[orientation]}))}
                                    />
                                    <span>{orientation}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Controlled</p>
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    items={tabItems}
                    size={selectedSize}
                    variant={selectedVariant}
                    orientation={selectedOrientation}
                />
            </div>

            <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Variants grid</p>
        {hasSelections ? (
                    <div className="space-y-6">
                        {selectedVariants.map((variant) => (
                            <div key={`tabs-variant-${variant}`} className="space-y-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">{variant}</p>
                                <div className="space-y-5">
                                    {selectedSizes.map((size) => (
                                        <div key={`tabs-${variant}-${size}`} className="space-y-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{size}</p>
                                            <div className="grid gap-4">
                                                {selectedOrientations.map((orientation) => (
                                                    <div key={`tabs-${variant}-${size}-${orientation}`} className="space-y-2">
                                                        <p className="text-[11px] uppercase tracking-[0.2em] text-space-400">{orientation}</p>
                                                        <Tabs
                                                            defaultValue="overview"
                                                            items={tabItems}
                                                            size={size}
                                                            variant={variant}
                                                            orientation={orientation}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                        Select at least one option in each filter to preview Tabs.
                    </div>
                )}
            </div>
        </div>
    );
};

const ProgressDemo = () => {
    const progressVariantOptions = ["default", "card"] as const;
    const progressSizeOptions = ["sm", "md", "lg", "xl"] as const;
    const progressToneOptions = [
        "celestial",
        "saffron",
        "emerald",
        "space",
        "white",
        "roadmap",
        "book",
        "music",
    ] as const;
    const progressOrientationOptions = ["horizontal", "vertical"] as const;
    type ProgressVariantOption = typeof progressVariantOptions[number];
    type ProgressSizeOption = typeof progressSizeOptions[number];
    type ProgressToneOption = typeof progressToneOptions[number];
    type ProgressOrientationOption = typeof progressOrientationOptions[number];

    const [variantFilters, setVariantFilters] = useState<Record<ProgressVariantOption, boolean>>(
        () => createFlagRecord(progressVariantOptions),
    );
    const [sizeFilters, setSizeFilters] = useState<Record<ProgressSizeOption, boolean>>(
        () => createFlagRecord(progressSizeOptions),
    );
    const [toneFilters, setToneFilters] = useState<Record<ProgressToneOption, boolean>>(
        () => createFlagRecord(progressToneOptions),
    );
    const [orientationFilters, setOrientationFilters] = useState<Record<ProgressOrientationOption, boolean>>(
        () => createFlagRecord(progressOrientationOptions),
    );
    const [showStriped, setShowStriped] = useState(true);
    const [showDotted, setShowDotted] = useState(true);
    const [linearValue, setLinearValue] = useState(62);
    const [linearMax, setLinearMax] = useState(100);
    const [dottedValue, setDottedValue] = useState(4);
    const [dottedMax, setDottedMax] = useState(6);

    const selectedVariants = progressVariantOptions.filter((variant) => variantFilters[variant]);
    const selectedSizes = progressSizeOptions.filter((size) => sizeFilters[size]);
    const selectedTones = progressToneOptions.filter((tone) => toneFilters[tone]);
    const selectedOrientations = progressOrientationOptions.filter(
        (orientation) => orientationFilters[orientation],
    );
    const hasSelections = Boolean(
        selectedVariants.length &&
        selectedSizes.length &&
        selectedTones.length &&
        selectedOrientations.length &&
        (showStriped || showDotted)
    );

    const renderProgress = ({
        variant,
        size,
        tone,
        orientation,
        dotted,
        hasStrips,
        value,
        max,
    }: {
        variant: ProgressVariantOption;
        size: ProgressSizeOption;
        tone: ProgressToneOption;
        orientation: ProgressOrientationOption;
        dotted: boolean;
        hasStrips: boolean;
        value?: number;
        max?: number;
    }) => {
        const resolvedMax = max ?? (dotted ? dottedMax : linearMax);
        const resolvedValue = value ?? (dotted ? dottedValue : variant === "card" ? linearValue + 10 : linearValue);
        const maxWidth = orientation === "horizontal" ? 260 : "fit-content";
        return (
            <Progress
                value={resolvedValue}
                max={resolvedMax}
                variant={variant}
                size={size}
                tone={tone}
                dotted={dotted}
                hasStrips={hasStrips}
                orientation={orientation}
                maxWidth={maxWidth}
            />
        );
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            {progressVariantOptions.map((variant) => (
                                <label key={`progress-variant-${variant}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={variantFilters[variant]}
                                        onChange={() => setVariantFilters((prev) => ({...prev, [variant]: !prev[variant]}))}
                                    />
                                    <span>{variant}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="flex flex-wrap gap-3">
                            {progressSizeOptions.map((size) => (
                                <label key={`progress-size-${size}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={sizeFilters[size]}
                                        onChange={() => setSizeFilters((prev) => ({...prev, [size]: !prev[size]}))}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Orientation</p>
                        <div className="flex flex-wrap gap-3">
                            {progressOrientationOptions.map((orientation) => (
                                <label key={`progress-orientation-${orientation}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={orientationFilters[orientation]}
                                        onChange={() => setOrientationFilters((prev) => ({...prev, [orientation]: !prev[orientation]}))}
                                    />
                                    <span>{orientation}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tones</p>
                        <div className="flex flex-wrap gap-3">
                            {progressToneOptions.map((tone) => (
                                <label key={`progress-tone-${tone}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={toneFilters[tone]}
                                        onChange={() => setToneFilters((prev) => ({...prev, [tone]: !prev[tone]}))}
                                    />
                                    <span>{tone}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Display</p>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 text-xs font-medium text-space-500">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                    checked={showStriped}
                                    onChange={() => setShowStriped((prev) => !prev)}
                                />
                                <span>Striped</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-medium text-space-500">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                    checked={showDotted}
                                    onChange={() => setShowDotted((prev) => !prev)}
                                />
                                <span>Dotted</span>
                            </label>
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sample Values</p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl border border-space-100 bg-white p-2 text-xs text-space-500">
                                <p className="font-semibold text-space-600">Linear value: {linearValue}</p>
                                <div className="mt-2 flex gap-2">
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setLinearValue((prev) => prev - 20)}>-20</button>
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setLinearValue((prev) => prev + 20)}>+20</button>
                                </div>
                            </div>
                            <div className="rounded-xl border border-space-100 bg-white p-2 text-xs text-space-500">
                                <p className="font-semibold text-space-600">Linear max: {linearMax}</p>
                                <div className="mt-2 flex gap-2">
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setLinearMax((prev) => prev - 20)}>-20</button>
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setLinearMax((prev) => prev + 20)}>+20</button>
                                </div>
                            </div>
                            <div className="rounded-xl border border-space-100 bg-white p-2 text-xs text-space-500">
                                <p className="font-semibold text-space-600">Dotted value: {dottedValue}</p>
                                <div className="mt-2 flex gap-2">
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setDottedValue((prev) => prev - 1)}>-1</button>
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setDottedValue((prev) => prev + 1)}>+1</button>
                                </div>
                            </div>
                            <div className="rounded-xl border border-space-100 bg-white p-2 text-xs text-space-500">
                                <p className="font-semibold text-space-600">Dotted max: {dottedMax}</p>
                                <div className="mt-2 flex gap-2">
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setDottedMax((prev) => prev - 1)}>-1</button>
                                    <button type="button" className="rounded-full border border-space-200 px-2 py-1" onClick={() => setDottedMax((prev) => prev + 1)}>+1</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {hasSelections ? (
                <div className="space-y-6">
                    {selectedVariants.map((variant) => (
                        <div key={`progress-variant-row-${variant}`} className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">{variant}</p>
                            {selectedSizes.map((size) => (
                                <div key={`progress-${variant}-${size}`} className="space-y-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{size}</p>
                                    {selectedOrientations.map((orientation) => (
                                        <div key={`progress-${variant}-${size}-${orientation}`} className="space-y-3">
                                            <p className="text-[11px] uppercase tracking-[0.2em] text-space-400">{orientation}</p>
                                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                                {selectedTones.map((tone) => (
                                                    <div key={`progress-${variant}-${size}-${orientation}-${tone}`} className="space-y-2 rounded-2xl border border-space-100 bg-white p-3">
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{tone}</p>
                                                        <div className="space-y-2">
                                                            {showStriped ? (
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-space-400">striped</p>
                                                                    {orientation === "vertical" ? (
                                                                        <p className="text-[10px] text-space-400">
                                                                            Striped mode is disabled for vertical orientation.
                                                                        </p>
                                                                    ) : (
                                                                        renderProgress({
                                                                            variant,
                                                                            size,
                                                                            tone,
                                                                            orientation,
                                                                            dotted: false,
                                                                            hasStrips: true,
                                                                        })
                                                                    )}
                                                                </div>
                                                            ) : null}
                                                            {showDotted ? (
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-space-400">dotted</p>
                                                                    {variant === "card" ? (
                                                                        <p className="text-[10px] text-space-400">
                                                                            Dotted mode is not supported for card variant.
                                                                        </p>
                                                                    ) : (
                                                                        renderProgress({
                                                                            variant,
                                                                            size,
                                                                            tone,
                                                                            orientation,
                                                                            dotted: true,
                                                                            hasStrips: false,
                                                                        })
                                                                    )}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Edge cases</p>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <div className="space-y-2 rounded-2xl border border-space-100 bg-white p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Negative value</p>
                                {renderProgress({
                                    variant: "default",
                                    size: "md",
                                    tone: "celestial",
                                    orientation: "horizontal",
                                    dotted: false,
                                    hasStrips: true,
                                    value: -20,
                                    max: 100,
                                })}
                            </div>
                            <div className="space-y-2 rounded-2xl border border-space-100 bg-white p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Overflow value</p>
                                {renderProgress({
                                    variant: "default",
                                    size: "md",
                                    tone: "emerald",
                                    orientation: "horizontal",
                                    dotted: false,
                                    hasStrips: true,
                                    value: 145,
                                    max: 100,
                                })}
                            </div>
                            <div className="space-y-2 rounded-2xl border border-space-100 bg-white p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Zero max</p>
                                {renderProgress({
                                    variant: "default",
                                    size: "md",
                                    tone: "space",
                                    orientation: "horizontal",
                                    dotted: false,
                                    hasStrips: true,
                                    value: 45,
                                    max: 0,
                                })}
                            </div>
                            <div className="space-y-2 rounded-2xl border border-space-100 bg-white p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Dotted max fallback</p>
                                {renderProgress({
                                    variant: "default",
                                    size: "md",
                                    tone: "roadmap",
                                    orientation: "horizontal",
                                    dotted: true,
                                    hasStrips: false,
                                    value: 3,
                                    max: 0,
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                    Select at least one option in each filter to preview Progress.
                </div>
            )}
        </div>
    );
};

const InputDemo = () => {
    const inputVariantOptions = ["default", "subtle", "ghost", "search"] as const;
    const inputSizeOptions = ["sm", "md", "lg"] as const;
    const inputToneOptions = ["default", "info", "success", "warning", "danger"] as const;
    type InputVariantOption = typeof inputVariantOptions[number];
    type InputSizeOption = typeof inputSizeOptions[number];
    type InputToneOption = typeof inputToneOptions[number];

    const [variantFilters, setVariantFilters] = useState<Record<InputVariantOption, boolean>>(
        () => createFlagRecord(inputVariantOptions),
    );
    const [sizeFilters, setSizeFilters] = useState<Record<InputSizeOption, boolean>>(
        () => createFlagRecord(inputSizeOptions),
    );
    const [toneFilters, setToneFilters] = useState<Record<InputToneOption, boolean>>(
        () => createFlagRecord(inputToneOptions),
    );

    const selectedVariants = inputVariantOptions.filter((variant) => variantFilters[variant]);
    const selectedSizes = inputSizeOptions.filter((size) => sizeFilters[size]);
    const selectedTones = inputToneOptions.filter((tone) => toneFilters[tone]);
    const hasSelections = selectedVariants.length && selectedSizes.length && selectedTones.length;

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            {inputVariantOptions.map((variant) => (
                                <label key={`input-variant-${variant}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={variantFilters[variant]}
                                        onChange={() => setVariantFilters((prev) => ({...prev, [variant]: !prev[variant]}))}
                                    />
                                    <span>{variant}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="flex flex-wrap gap-3">
                            {inputSizeOptions.map((size) => (
                                <label key={`input-size-${size}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={sizeFilters[size]}
                                        onChange={() => setSizeFilters((prev) => ({...prev, [size]: !prev[size]}))}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tones</p>
                        <div className="flex flex-wrap gap-3">
                            {inputToneOptions.map((tone) => (
                                <label key={`input-tone-${tone}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={toneFilters[tone]}
                                        onChange={() => setToneFilters((prev) => ({...prev, [tone]: !prev[tone]}))}
                                    />
                                    <span>{tone}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {hasSelections ? (
                <div className="space-y-6">
                    {selectedVariants.map((variant) => (
                        <div key={`input-variant-row-${variant}`} className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">{variant}</p>
                            {selectedSizes.map((size) => (
                                <div key={`input-${variant}-${size}`} className="space-y-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{size}</p>
                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        {selectedTones.map((tone) => (
                                            <Input
                                                key={`input-${variant}-${size}-${tone}`}
                                                label={`${tone} tone`}
                                                placeholder="you@lunara.io"
                                                variant={variant}
                                                size={size}
                                                tone={tone}
                                                leadingIcon={
                                                    variant === "search"
                                                        ? <span className="material-symbols-rounded">search</span>
                                                        : undefined
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                    Select at least one option in each filter to preview Inputs.
                </div>
            )}
        </div>
    );
};

const ButtonDemo = () => {
    const buttonVariantOptions = ["primary", "secondary", "quiz", "ghost", "outline"] as const;
    const buttonSizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;
    type ButtonVariantOption = typeof buttonVariantOptions[number];
    type ButtonSizeOption = typeof buttonSizeOptions[number];

    const [variantFilters, setVariantFilters] = useState<Record<ButtonVariantOption, boolean>>(
        () => createFlagRecord(buttonVariantOptions),
    );
    const [sizeFilters, setSizeFilters] = useState<Record<ButtonSizeOption, boolean>>(
        () => createFlagRecord(buttonSizeOptions),
    );

    const selectedVariants = buttonVariantOptions.filter((variant) => variantFilters[variant]);
    const selectedSizes = buttonSizeOptions.filter((size) => sizeFilters[size]);
    const hasSelections = selectedVariants.length && selectedSizes.length;
    const hasVariantSelections = selectedVariants.length;

    return (
        <div className="space-y-8">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            {buttonVariantOptions.map((variant) => (
                                <label key={`button-variant-${variant}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={variantFilters[variant]}
                                        onChange={() => setVariantFilters((prev) => ({...prev, [variant]: !prev[variant]}))}
                                    />
                                    <span>{variant}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="flex flex-wrap gap-3">
                            {buttonSizeOptions.map((size) => (
                                <label key={`button-size-${size}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={sizeFilters[size]}
                                        onChange={() => setSizeFilters((prev) => ({...prev, [size]: !prev[size]}))}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {hasSelections ? (
                <div className="space-y-6">
                    {selectedVariants.map((variant) => (
                        <div key={`button-variant-row-${variant}`} className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">{variant}</p>
                            <div className="flex flex-wrap gap-3">
                                {selectedSizes.map((size) => (
                                    <Button
                                        key={`button-${variant}-${size}`}
                                        variant={variant}
                                        size={size}
                                    >
                                        {size.toUpperCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                    Select at least one variant and size to preview Buttons.
                </div>
            )}

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Toggle Mode</p>
        {hasVariantSelections ? (
                    <div className="space-y-4">
                        {selectedVariants.map((variant) => (
                            <div key={`button-toggle-${variant}`} className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{variant}</p>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant={variant} isToggle defaultToggled>
                                        On
                                    </Button>
                                    <Button variant={variant} isToggle>
                                        Off
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                        Select at least one variant to preview toggle states.
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Icon + Key</p>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="primary"
                        hasIcon
                        icon="bolt"
                        isKeyable
                        keyShortcut="Enter"
                    >
                        Continue
                    </Button>
                    <Button
                        variant="secondary"
                        isKeyable
                        keyShortcut="1"
                    >
                        Pick first
                    </Button>
                    <Button
                        variant="secondary"
                        hasIcon
                        icon="auto_stories"
                    >
                        View words
                    </Button>
                    <Button
                        variant="outline"
                        hasIcon
                        icon="download"
                        static
                    >
                        Static
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Icon-only</p>
                <div className="flex flex-wrap items-center gap-3">
                    {buttonSizeOptions.map((size) => (
                        <Button
                            key={`button-icon-only-${size}`}
                            variant="secondary"
                            size={size}
                            iconOnly
                            icon="favorite"
                            aria-label={`Favorite (${size})`}
                        />
                    ))}
                    <Button
                        variant="primary"
                        size="md"
                        iconOnly
                        icon="play_arrow"
                        aria-label="Play"
                    />
                    <Button
                        variant="quiz"
                        size="md"
                        iconOnly
                        icon="bolt"
                        aria-label="Quick quiz"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">CTA</p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                        variant="primary"
                        size="xl"
                        hasIcon
                        icon="north_east"
                        className="w-full"
                    >
                        Start lesson
                    </Button>
                    <Button variant="quiz" size="lg" className="w-full">
                        Take a quick quiz
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">States</p>
                <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" disabled>
                        Disabled
                    </Button>
                    <Button variant="outline" disabled>
                        Disabled
                    </Button>
                    <Button variant="primary" isToggle defaultToggled disabled>
                        Disabled on
                    </Button>
                    <Button variant="secondary" isToggle disabled>
                        Disabled off
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ToggleDemo = () => {
    const toggleVariantOptions = ["default", "card", "ghost"] as const;
    const toggleSizeOptions = ["sm", "md", "lg"] as const;
    const toggleToneOptions = ["default", "info", "success", "warning", "danger"] as const;
    type ToggleVariantOption = typeof toggleVariantOptions[number];
    type ToggleSizeOption = typeof toggleSizeOptions[number];
    type ToggleToneOption = typeof toggleToneOptions[number];

    const [variantFilters, setVariantFilters] = useState<Record<ToggleVariantOption, boolean>>(
        () => createFlagRecord(toggleVariantOptions),
    );
    const [sizeFilters, setSizeFilters] = useState<Record<ToggleSizeOption, boolean>>(
        () => createFlagRecord(toggleSizeOptions),
    );
    const [toneFilters, setToneFilters] = useState<Record<ToggleToneOption, boolean>>(
        () => createFlagRecord(toggleToneOptions),
    );

    const selectedVariants = toggleVariantOptions.filter((variant) => variantFilters[variant]);
    const selectedSizes = toggleSizeOptions.filter((size) => sizeFilters[size]);
    const selectedTones = toggleToneOptions.filter((tone) => toneFilters[tone]);
    const hasSelections = selectedVariants.length && selectedSizes.length && selectedTones.length;

    return (
        <div className="space-y-8">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            {toggleVariantOptions.map((variant) => (
                                <label key={`toggle-variant-${variant}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={variantFilters[variant]}
                                        onChange={() => setVariantFilters((prev) => ({...prev, [variant]: !prev[variant]}))}
                                    />
                                    <span>{variant}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="flex flex-wrap gap-3">
                            {toggleSizeOptions.map((size) => (
                                <label key={`toggle-size-${size}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={sizeFilters[size]}
                                        onChange={() => setSizeFilters((prev) => ({...prev, [size]: !prev[size]}))}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tones</p>
                        <div className="flex flex-wrap gap-3">
                            {toggleToneOptions.map((tone) => (
                                <label key={`toggle-tone-${tone}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={toneFilters[tone]}
                                        onChange={() => setToneFilters((prev) => ({...prev, [tone]: !prev[tone]}))}
                                    />
                                    <span>{tone}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {hasSelections ? (
                <div className="space-y-6">
                    {selectedVariants.map((variant) => (
                        <div key={`toggle-variant-row-${variant}`} className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">{variant}</p>
                            {selectedSizes.map((size) => (
                                <div key={`toggle-${variant}-${size}`} className="space-y-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{size}</p>
                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        {selectedTones.map((tone) => (
                                            <Toggle
                                                key={`toggle-${variant}-${size}-${tone}`}
                                                variant={variant}
                                                size={size}
                                                tone={tone}
                                                label={`${tone} tone`}
                                                description={`${variant} ${size}`}
                                                defaultChecked={tone === "success" || tone === "info"}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                    Select at least one option in each filter to preview Toggles.
                </div>
            )}

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">States</p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Toggle
                        label="Helper text"
                        description="Optional guidance."
                        helperText="Shown under the toggle."
                        defaultChecked
                    />
                    <Toggle
                        label="Error"
                        description="Needs attention."
                        errorText="Toggle is required."
                    />
                    <Toggle
                        label="Disabled off"
                        description="Unavailable."
                        disabled
                    />
                    <Toggle
                        label="Disabled on"
                        description="Locked setting."
                        defaultChecked
                        disabled
                    />
                </div>
            </div>
        </div>
    );
};

const ToggleGroupDemo = () => {
    const toggleGroupVariantOptions = ["default", "subtle", "outline", "ghost"] as const;
    const toggleGroupSizeOptions = ["sm", "md", "lg"] as const;
    const toggleGroupToneOptions = ["default", "info", "success", "warning", "danger"] as const;
    const toggleGroupLayoutOptions = ["vertical", "horizontal", "grid"] as const;
    type ToggleGroupVariantOption = typeof toggleGroupVariantOptions[number];
    type ToggleGroupSizeOption = typeof toggleGroupSizeOptions[number];
    type ToggleGroupToneOption = typeof toggleGroupToneOptions[number];
    type ToggleGroupLayoutOption = typeof toggleGroupLayoutOptions[number];

    const [variantFilters, setVariantFilters] = useState<Record<ToggleGroupVariantOption, boolean>>(
        () => createFlagRecord(toggleGroupVariantOptions),
    );
    const [sizeFilters, setSizeFilters] = useState<Record<ToggleGroupSizeOption, boolean>>(
        () => createFlagRecord(toggleGroupSizeOptions),
    );
    const [toneFilters, setToneFilters] = useState<Record<ToggleGroupToneOption, boolean>>(
        () => createFlagRecord(toggleGroupToneOptions),
    );
    const [layoutFilters, setLayoutFilters] = useState<Record<ToggleGroupLayoutOption, boolean>>(
        () => createFlagRecord(toggleGroupLayoutOptions),
    );

    const selectedVariants = toggleGroupVariantOptions.filter((variant) => variantFilters[variant]);
    const selectedSizes = toggleGroupSizeOptions.filter((size) => sizeFilters[size]);
    const selectedTones = toggleGroupToneOptions.filter((tone) => toneFilters[tone]);
    const selectedLayouts = toggleGroupLayoutOptions.filter((layout) => layoutFilters[layout]);
    const hasSelections = selectedVariants.length && selectedSizes.length && selectedTones.length;
    const hasLayoutSelections = selectedLayouts.length;

    const toggleGroupOptions = [
        { value: "boost", label: "Boost mode", description: "Extra practice." },
        { value: "review", label: "Review loop", description: "Spaced repetition." },
        { value: "coach", label: "Coach cues", description: "Guided prompts." },
    ];
    const layoutMeta: Record<ToggleGroupLayoutOption, { label: string; description: string }> = {
        vertical: { label: "Vertical stack", description: "Default flow." },
        horizontal: { label: "Horizontal row", description: "Wraps as needed." },
        grid: { label: "Grid layout", description: "Structured columns." },
    };

    return (
        <div className="space-y-8">
            <div className="rounded-2xl border border-space-100 bg-space-10/40 p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            {toggleGroupVariantOptions.map((variant) => (
                                <label key={`toggle-group-variant-${variant}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={variantFilters[variant]}
                                        onChange={() => setVariantFilters((prev) => ({...prev, [variant]: !prev[variant]}))}
                                    />
                                    <span>{variant}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="flex flex-wrap gap-3">
                            {toggleGroupSizeOptions.map((size) => (
                                <label key={`toggle-group-size-${size}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={sizeFilters[size]}
                                        onChange={() => setSizeFilters((prev) => ({...prev, [size]: !prev[size]}))}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tones</p>
                        <div className="flex flex-wrap gap-3">
                            {toggleGroupToneOptions.map((tone) => (
                                <label key={`toggle-group-tone-${tone}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={toneFilters[tone]}
                                        onChange={() => setToneFilters((prev) => ({...prev, [tone]: !prev[tone]}))}
                                    />
                                    <span>{tone}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Layouts</p>
                        <div className="flex flex-wrap gap-3">
                            {toggleGroupLayoutOptions.map((layout) => (
                                <label key={`toggle-group-layout-${layout}`} className="flex items-center gap-2 text-xs font-medium text-space-500">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                        checked={layoutFilters[layout]}
                                        onChange={() => setLayoutFilters((prev) => ({...prev, [layout]: !prev[layout]}))}
                                    />
                                    <span>{layout}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {hasSelections ? (
                <div className="space-y-6">
                    {selectedVariants.map((variant) => (
                        <div key={`toggle-group-variant-row-${variant}`} className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">{variant}</p>
                            {selectedSizes.map((size) => (
                                <div key={`toggle-group-${variant}-${size}`} className="space-y-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{size}</p>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {selectedTones.map((tone) => (
                                            <ToggleGroup
                                                key={`toggle-group-${variant}-${size}-${tone}`}
                                                label={`${tone} tone`}
                                                description={`${variant} ${size}`}
                                                variant={variant}
                                                size={size}
                                                tone={tone}
                                                selectionMode="multiple"
                                                layout="grid"
                                                columns={2}
                                                options={toggleGroupOptions}
                                                defaultValue={[toggleGroupOptions[0].value]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                    Select at least one option in each filter to preview Toggle groups.
                </div>
            )}

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Layouts</p>
        {hasLayoutSelections ? (
                    <div className="grid gap-4 lg:grid-cols-3">
                        {selectedLayouts.map((layout) => {
                            const meta = layoutMeta[layout];
                            return (
                                <ToggleGroup
                                    key={`toggle-group-layout-${layout}`}
                                    label={meta.label}
                                    description={meta.description}
                                    selectionMode="multiple"
                                    layout={layout}
                                    columns={layout === "grid" ? 2 : undefined}
                                    options={toggleGroupOptions}
                                    defaultValue={[toggleGroupOptions[0].value]}
                                    variant="outline"
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-space-200 bg-white p-4 text-xs text-space-500">
                        Select at least one layout filter to preview layouts.
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">States</p>
                <div className="grid gap-4 md:grid-cols-2">
                    <ToggleGroup
                        label="Single select"
                        description="Pick exactly one."
                        selectionMode="single"
                        allowNone={false}
                        options={toggleGroupOptions}
                        defaultValue={toggleGroupOptions[0].value}
                        tone="info"
                    />
                    <ToggleGroup
                        label="Disabled group"
                        description="Controls are locked."
                        helperText="Managed by your admin."
                        selectionMode="multiple"
                        options={toggleGroupOptions}
                        defaultValue={[toggleGroupOptions[0].value]}
                        disabled
                    />
                    <ToggleGroup
                        label="Error state"
                        description="Requires one toggle."
                        errorText="At least one toggle is required."
                        selectionMode="multiple"
                        options={toggleGroupOptions}
                        defaultValue={[toggleGroupOptions[0].value]}
                        tone="danger"
                    />
                </div>
            </div>
        </div>
    );
};

const CardStressDemo = () => {
    const toneCases = [
        { label: "Default", tone: undefined, description: "Baseline tone with inherited text colors." },
        { label: "Space", tone: "Space", description: "Low-contrast neutral background." },
        { label: "CelestialBlue", tone: "CelestialBlue", description: "Informational emphasis and cool accent." },
        { label: "Saffron", tone: "Saffron", description: "Warning-style warm background." },
        { label: "PersianRed", tone: "PersianRed", description: "Critical state highlight." },
        { label: "Emerald", tone: "Emerald", description: "Success state highlight." },
        { label: "White", tone: "White", description: "Surface card on a tinted parent." },
    ] as const;
    const longUnbrokenText =
        "token_without_breakpoints__airportroute_vocabularygrammarreviewquizcheckpoint".repeat(2);

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tone coverage</p>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {toneCases.map((toneCase) => (
                        <Card
                            key={`card-tone-${toneCase.label}`}
                            tone={toneCase.tone}
                            padding="sm"
                            rounded="xl"
                            elevation="sm"
                            className="max-w-none"
                        >
                            <Title size={5}>{toneCase.label}</Title>
                            <p className="text-sm">{toneCase.description}</p>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Spacing, alignment, and elevation</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card tone="White" padding="none" rounded="md" elevation="none" className="max-w-none !min-w-0">
                        <div className="rounded-md border border-dashed border-space-200 p-2 text-xs text-space-500">
                            padding="none" with compact child spacing
                        </div>
                    </Card>
                    <Card tone="CelestialBlue" padding="2xl" align="center" rounded="3xl" elevation="lg" className="max-w-none">
                        <Title size={4}>Center + 2XL</Title>
                        <p className="text-sm text-celestialblue-800">Heavy content inset with strong elevation.</p>
                        <Button size="sm">Primary CTA</Button>
                    </Card>
                    <Card tone="Space" padding="xsm" align="right" rounded="xmd" hoverable elevation="md" className="max-w-none">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-500">Compact / Right</p>
                        <p className="text-sm">Tiny inset and right alignment stress.</p>
                    </Card>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Media payloads</p>
                <div className="grid gap-4 xl:grid-cols-3">
                    <Card tone="White" padding="none" rounded="3xl" elevation="md" className="max-w-none overflow-hidden">
                        <img
                            src="https://placehold.co/960x540/png?text=Image+Media+Case"
                            alt="Image media stress case"
                            loading="lazy"
                            className="aspect-video w-full object-cover"
                        />
                        <div className="space-y-2 p-4">
                            <Title size={5}>Image Header</Title>
                            <p className="text-sm text-space-600">Checks clipping, border radius, and media-first layout.</p>
                        </div>
                    </Card>

                    <Card tone="Space" padding="none" rounded="3xl" elevation="sm" className="max-w-none overflow-hidden text-space-100">
                        <video
                            className="aspect-video w-full bg-space-900 object-cover"
                            controls
                            muted
                            preload="metadata"
                            poster="https://placehold.co/960x540/png?text=Video+Poster"
                        >
                            <source
                                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                                type="video/mp4"
                            />
                        </video>
                        <div className="space-y-2 p-4">
                            <Title size={5} tone="Space">Video Container</Title>
                            <p className="text-sm text-space-300">Verifies controls, overflow, and dark-surface readability.</p>
                        </div>
                    </Card>

                    <Card tone="CelestialBlue" padding="sm" rounded="2xl" elevation="sm" className="max-w-none">
                        <div className="flex items-start justify-between gap-3">
                            <Title size={5} tone="Space">Mixed Media Metadata</Title>
                            <Badge type="xp" size="sm">+120</Badge>
                        </div>
                        <div className="grid gap-2 text-sm text-celestialblue-800">
                            <div className="flex items-center justify-between rounded-lg bg-celestialblue-100/70 px-3 py-2">
                                <span>PNG</span>
                                <span>2.3 MB</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-celestialblue-100/70 px-3 py-2">
                                <span>MP4</span>
                                <span>12.8 MB</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-celestialblue-100/70 px-3 py-2">
                                <span>Subtitles</span>
                                <span>EN / FA</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Edge behavior</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card tone="PersianRed" padding="sm" rounded="md" elevation="sm" className="max-w-none">
                        <p className="text-xs uppercase tracking-[0.2em] text-persianred-700">Long unbroken text</p>
                        <p className="overflow-x-auto font-mono text-xs text-persianred-900">
                            {longUnbrokenText}
                        </p>
                        <p className="text-sm text-persianred-800">
                            Horizontal scrolling should stay inside the card.
                        </p>
                    </Card>

                    <div className="space-y-2 rounded-2xl border border-space-100 bg-white p-2">
                        <Card tone="White" flatEdges rounded="3xl" padding="sm" className="max-w-none">
                            <p className="text-sm font-semibold text-space-700">flatEdges row 1</p>
                        </Card>
                        <Card tone="White" flatEdges rounded="3xl" padding="sm" className="max-w-none">
                            <p className="text-sm font-semibold text-space-700">flatEdges row 2</p>
                        </Card>
                        <Card tone="White" flatEdges rounded="3xl" padding="sm" className="max-w-none">
                            <p className="text-sm font-semibold text-space-700">flatEdges row 3</p>
                        </Card>
                    </div>
                </div>

                <div className="rounded-2xl border border-space-100 bg-space-10 p-3">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-space-400">Constrained width override</p>
                    <div className="w-[248px] overflow-x-auto rounded-xl border border-dashed border-space-200 p-2">
                        <Card
                            tone="Saffron"
                            padding="sm"
                            rounded="xl"
                            className="max-w-none !min-w-[220px]"
                        >
                            <Title size={6} tone="Saffron">Small viewport fit</Title>
                            <p className="text-xs text-saffron-800">
                                Uses className override to test the built-in min-width constraint.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChallengeToastStressDemo = () => {
    const statusOptions = ["neutral", "success", "failed"] as const;
    const [liveStatusIndex, setLiveStatusIndex] = useState(0);
    const [liveXp, setLiveXp] = useState(25);
    const [remountKey, setRemountKey] = useState(0);

    const liveStatus = statusOptions[liveStatusIndex] ?? "neutral";
    const longToastMessage =
        "Finish vocabulary drills, review grammar checkpoints, and submit your reflection before the timer ends.";
    const unbrokenToastMessage =
        "challenge_checkpoint_without_spaces__reading_vocabulary_grammar_review".repeat(2);

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Status matrix</p>
                <div className="grid gap-3">
                    {statusOptions.map((status) => (
                        <div key={`challenge-toast-status-${status}`} className="overflow-x-auto rounded-xl border border-space-100 bg-white p-2">
                            <ChallengeToast
                                message={`Status ${status}: complete one more activity to keep momentum.`}
                                xp={25}
                                status={status}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Message and xp extremes</p>
                <div className="grid gap-4">
                    <div className="overflow-x-auto rounded-xl border border-space-100 bg-white p-2">
                        <ChallengeToast
                            message={longToastMessage}
                            xp={999999}
                            status="success"
                        />
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-space-100 bg-white p-2">
                        <ChallengeToast
                            message={unbrokenToastMessage}
                            xp={0}
                            status="neutral"
                        />
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-space-100 bg-white p-2">
                        <ChallengeToast
                            message="Penalty example for negative rewards in challenge mode."
                            xp={-15}
                            status="failed"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Constrained width</p>
                <div className="w-[290px] overflow-x-auto rounded-xl border border-dashed border-space-200 bg-space-10 p-2">
                    <ChallengeToast
                        message="This container is intentionally narrower than the toast minimum width."
                        xp={12}
                        status="neutral"
                    />
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setLiveStatusIndex((prev) => (prev + 1) % statusOptions.length)}
                    >
                        Cycle status
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveXp((prev) => prev + 5)}>
                        +5 XP
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveXp((prev) => prev - 5)}>
                        -5 XP
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemountKey((prev) => prev + 1)}>
                        Replay enter animation
                    </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-space-100 bg-white p-2">
                    <ChallengeToast
                        key={`challenge-toast-live-${remountKey}`}
                        message={`Live toast: ${liveStatus} state with ${liveXp} XP.`}
                        xp={liveXp}
                        status={liveStatus}
                    />
                </div>
            </div>
        </div>
    );
};

const DashboardCardStressDemo = () => {
    const [liveWidth, setLiveWidth] = useState(399);
    const [liveProgress, setLiveProgress] = useState(45);
    const livePathToken = "superlongpathsegment_without_breakpoints_for_overflow_checks".repeat(2);

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Type coverage</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[{text: "Airport Essentials", lang: "en"}]}
                        type="roadmap"
                        path={["Roadmap A1", "Grammar"]}
                        progress={45}
                    />
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[{text: "Transit Reading Pack", lang: "en"}]}
                        type="book"
                        path={["Library", "Travel Stories"]}
                        progress={72}
                    />
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[{text: "Listening Warmup", lang: "en"}]}
                        type="music"
                        path={["Audio Lab", "Podcast"]}
                        progress={18}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Text and path edge cases</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[
                            {text: "Global Mobility Vocabulary and Transit Coordination", lang: "en"},
                            {text: " - نسخه تمريني", lang: "fa"},
                        ]}
                        type="roadmap"
                        path={["Roadmap A2", "Reading", "Vocabulary", livePathToken]}
                        progress={63.6}
                    />
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[
                            {text: "Compact title", lang: "en"},
                            {text: " / خلاصه", lang: "fa"},
                        ]}
                        type="book"
                        path={[]}
                        progress={8}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Progress boundaries</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[{text: "Negative progress input", lang: "en"}]}
                        type="roadmap"
                        path={["Edge Cases", "Progress"]}
                        progress={-20}
                    />
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[{text: "Zero progress", lang: "en"}]}
                        type="book"
                        path={["Edge Cases", "Progress"]}
                        progress={0}
                    />
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[{text: "Complete boundary", lang: "en"}]}
                        type="music"
                        path={["Edge Cases", "Progress"]}
                        progress={100}
                    />
                    <DashboardCard
                        className="2xl:!w-full"
                        title={[{text: "Overflow progress input", lang: "en"}]}
                        type="roadmap"
                        path={["Edge Cases", "Progress"]}
                        progress={145}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Container width icon test (hide below 400px)</p>
                <div className="flex flex-wrap items-start gap-4">
                    <div className="w-[360px] space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">360px</p>
                        <DashboardCard
                            className="2xl:!w-full"
                            title={[{text: "Narrow card", lang: "en"}]}
                            type="roadmap"
                            path={["Width", "360"]}
                            progress={39}
                        />
                    </div>
                    <div className="w-[399px] space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">399px</p>
                        <DashboardCard
                            className="2xl:!w-full"
                            title={[{text: "Threshold minus one", lang: "en"}]}
                            type="book"
                            path={["Width", "399"]}
                            progress={54}
                        />
                    </div>
                    <div className="w-[401px] space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">401px</p>
                        <DashboardCard
                            className="2xl:!w-full"
                            title={[{text: "Threshold plus one", lang: "en"}]}
                            type="music"
                            path={["Width", "401"]}
                            progress={66}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setLiveWidth((prev) => Math.max(320, prev - 20))}>
                        -20px width
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveWidth((prev) => Math.min(460, prev + 20))}>
                        +20px width
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setLiveWidth(399)}>
                        Reset width 399px
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveProgress((prev) => prev + 15)}>
                        +15 progress
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveProgress((prev) => prev - 15)}>
                        -15 progress
                    </Button>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live container width: {liveWidth}px | progress input: {liveProgress}
                </p>
                <div className="overflow-x-auto rounded-xl border border-space-200 bg-white p-2">
                    <div style={{width: liveWidth}}>
                        <DashboardCard
                            className="2xl:!w-full"
                            title={[{text: "Interactive width and progress test", lang: "en"}]}
                            type="roadmap"
                            path={["Live", "Preview"]}
                            progress={liveProgress}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardMessageStressDemo = () => {
    const toneOptions = ["default", "info", "success", "warning", "danger"] as const;
    const alignOptions = ["center", "left"] as const;
    const sizeOptions = ["sm", "md", "lg"] as const;
    const mediaSizeOptions = ["sm", "md", "lg"] as const;

    const [toneIndex, setToneIndex] = useState(0);
    const [alignIndex, setAlignIndex] = useState(0);
    const [sizeIndex, setSizeIndex] = useState(1);
    const [mediaSizeIndex, setMediaSizeIndex] = useState(1);
    const [showMedia, setShowMedia] = useState(true);
    const [messageMode, setMessageMode] = useState<"text" | "node" | "numeric">("text");
    const [remountKey, setRemountKey] = useState(0);

    const tone = toneOptions[toneIndex] ?? "default";
    const align = alignOptions[alignIndex] ?? "center";
    const size = sizeOptions[sizeIndex] ?? "md";
    const mediaSize = mediaSizeOptions[mediaSizeIndex] ?? "md";
    const longUnbrokenMessage =
        "dashboard_message_token_without_breakpoints_for_overflow_testing__".repeat(2);
    const liveChildren: ReactNode =
        messageMode === "numeric"
            ? 0
            : messageMode === "node"
                ? (
                    <span>
                        Mixed content: <strong>bold</strong>, <em>emphasis</em>, and inline{" "}
                        <code className="rounded bg-space-100 px-1 py-[1px]">code</code>.
                    </span>
                )
                : "Live text mode with standard string children.";

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tone and alignment coverage</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    {toneOptions.map((toneOption) => (
                        <DashboardMessage
                            key={`dashboard-message-tone-${toneOption}`}
                            title={`Tone: ${toneOption}`}
                            tone={toneOption}
                            align="left"
                            description="Title + description + action baseline."
                            action={<Button variant="secondary" size="sm">Open</Button>}
                        >
                            Verify color, spacing, and readable contrast on each tone.
                        </DashboardMessage>
                    ))}
                    <DashboardMessage
                        title="Center aligned"
                        tone="info"
                        align="center"
                        description="Center alignment with action."
                        action={<Button variant="outline" size="sm">View details</Button>}
                    >
                        This case confirms centered text flow and centered action alignment.
                    </DashboardMessage>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Media and size combinations</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <DashboardMessage
                        title="Media sm"
                        tone="default"
                        size="sm"
                        mediaSize="sm"
                        media={<img src="https://placehold.co/360x180/png?text=Media+SM" alt="small media sample" className="h-full w-full object-cover" />}
                    >
                        Compact spacing with media slot.
                    </DashboardMessage>
                    <DashboardMessage
                        title="Media md + custom frame"
                        tone="success"
                        size="md"
                        mediaSize="md"
                        mediaClassName="border-emerald-200 bg-emerald-50/50"
                        media={<div className="flex h-full w-full items-center justify-center text-sm font-semibold text-emerald-700">Custom media node</div>}
                        action={<Button variant="secondary" size="sm">Continue</Button>}
                    >
                        Mid-size message with custom media styling.
                    </DashboardMessage>
                    <DashboardMessage
                        title="Media lg"
                        tone="warning"
                        size="lg"
                        mediaSize="lg"
                        media={<video className="h-full w-full object-cover" controls muted preload="metadata" poster="https://placehold.co/640x360/png?text=Video+Poster" />}
                    >
                        Large media area with native control chrome.
                    </DashboardMessage>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Edge content cases</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    <DashboardMessage
                        title="Long wrapped content"
                        tone="danger"
                        align="left"
                        description="Very long description text to verify spacing and wrapping behavior across breakpoints."
                    >
                        Finish reading practice, review checkpoint answers, run vocabulary recall, then submit one reflection paragraph before your timer expires.
                    </DashboardMessage>
                    <DashboardMessage
                        title="Unbroken token"
                        tone="info"
                        align="left"
                        className="overflow-x-auto"
                    >
                        <span className="font-mono text-xs">{longUnbrokenMessage}</span>
                    </DashboardMessage>
                    <DashboardMessage tone="default" align="left">
                        0
                    </DashboardMessage>
                    <DashboardMessage
                        tone="success"
                        align="left"
                        description={<span>Description as node with <strong>inline emphasis</strong>.</span>}
                    >
                        Children as React node with <a href="/" className="underline underline-offset-2">inline link</a>.
                    </DashboardMessage>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Constrained width</p>
                <div className="flex flex-wrap gap-4">
                    <div className="w-[260px]">
                        <DashboardMessage
                            title="260px wrapper"
                            tone="warning"
                            align="left"
                            size="sm"
                            action={<Button variant="ghost" size="sm">Retry</Button>}
                        >
                            Small container width to stress line-wrap and action placement.
                        </DashboardMessage>
                    </div>
                    <div className="w-[340px]">
                        <DashboardMessage
                            title="340px wrapper"
                            tone="info"
                            align="left"
                            size="md"
                            mediaSize="sm"
                            media={<div className="h-full w-full bg-celestialblue-100/70" />}
                        >
                            Medium narrow container with media section.
                        </DashboardMessage>
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setToneIndex((prev) => (prev + 1) % toneOptions.length)}>
                        Cycle tone
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setAlignIndex((prev) => (prev + 1) % alignOptions.length)}>
                        Cycle align
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setSizeIndex((prev) => (prev + 1) % sizeOptions.length)}>
                        Cycle size
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setMediaSizeIndex((prev) => (prev + 1) % mediaSizeOptions.length)}>
                        Cycle media size
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setShowMedia((prev) => !prev)}>
                        Toggle media
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setMessageMode((prev) => (prev === "text" ? "node" : prev === "node" ? "numeric" : "text"))}
                    >
                        Cycle children mode
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemountKey((prev) => prev + 1)}>
                        Replay enter animation
                    </Button>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: tone={tone}, align={align}, size={size}, mediaSize={mediaSize}, mode={messageMode}
                </p>
                <DashboardMessage
                    key={`dashboard-message-live-${remountKey}`}
                    title="Interactive playground"
                    tone={tone}
                    align={align}
                    size={size}
                    description="Use controls above to stress prop combinations."
                    action={<Button variant="secondary" size="sm">Inspect</Button>}
                    mediaSize={mediaSize}
                    media={
                        showMedia
                            ? <img src="https://placehold.co/640x320/png?text=Interactive+Media" alt="interactive media" className="h-full w-full object-cover" />
                            : undefined
                    }
                >
                    {liveChildren}
                </DashboardMessage>
            </div>
        </div>
    );
};

const TooltipStressDemo = () => {
    const variantOptions = ["solid", "soft", "outline"] as const;
    const toneOptions = ["space", "celestial", "saffron", "persianred", "emerald"] as const;
    const sideOptions = ["top", "right", "bottom", "left"] as const;
    const alignOptions = ["start", "center", "end"] as const;
    const sizeOptions = ["sm", "md", "lg"] as const;

    const [variantIndex, setVariantIndex] = useState(0);
    const [toneIndex, setToneIndex] = useState(0);
    const [sideIndex, setSideIndex] = useState(0);
    const [alignIndex, setAlignIndex] = useState(1);
    const [sizeIndex, setSizeIndex] = useState(1);
    const [offset, setOffset] = useState(10);
    const [controlledOpen, setControlledOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [openEvents, setOpenEvents] = useState<string[]>([]);

    const variant = variantOptions[variantIndex] ?? "solid";
    const tone = toneOptions[toneIndex] ?? "space";
    const side = sideOptions[sideIndex] ?? "top";
    const align = alignOptions[alignIndex] ?? "center";
    const size = sizeOptions[sizeIndex] ?? "md";
    const longUnbrokenText =
        "tooltip_token_without_breakpoints_for_horizontal_overflow_checks__".repeat(2);

    const pushOpenEvent = (next: boolean) => {
        setOpenEvents((prev) => [`${next ? "open" : "close"} @ ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 4));
    };

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variant and tone matrix</p>
                <div className="grid gap-3 lg:grid-cols-3">
                    {variantOptions.map((variantOption) => (
                        <div key={`tooltip-variant-${variantOption}`} className="space-y-2 rounded-xl border border-space-100 bg-space-10/40 p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{variantOption}</p>
                            <div className="flex flex-wrap gap-2">
                                {toneOptions.map((toneOption) => (
                                    <Tooltip
                                        key={`tooltip-tone-${variantOption}-${toneOption}`}
                                        content={`${variantOption} / ${toneOption}`}
                                        variant={variantOption}
                                        tone={toneOption}
                                        size="sm"
                                    >
                                        <Button size="sm" variant="ghost">{toneOption}</Button>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Placement and alignment</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-space-100 bg-white p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {sideOptions.map((sideOption) => (
                                <div key={`tooltip-side-${sideOption}`} className="flex min-h-28 items-center justify-center rounded-lg border border-space-100 bg-space-10/60">
                                    <Tooltip
                                        content={`side=${sideOption}, align=center`}
                                        side={sideOption}
                                        align="center"
                                        variant="soft"
                                        tone="celestial"
                                        size="sm"
                                    >
                                        <Button size="sm" variant="secondary">{sideOption}</Button>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-xl border border-space-100 bg-white p-4">
                        <div className="grid min-h-28 grid-cols-3 items-center gap-3 rounded-lg border border-space-100 bg-space-10/60 p-3">
                            {alignOptions.map((alignOption) => (
                                <div key={`tooltip-align-${alignOption}`} className="flex justify-center">
                                    <Tooltip
                                        content={`align=${alignOption}`}
                                        side="top"
                                        align={alignOption}
                                        variant="outline"
                                        tone="space"
                                        size="sm"
                                    >
                                        <Button size="sm" variant="outline">{alignOption}</Button>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Content and size edge cases</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <Tooltip content="Short tooltip" size="sm" tone="space">
                        <Button size="sm" variant="secondary">SM</Button>
                    </Tooltip>
                    <Tooltip
                        content="Rich tooltip with bold and inline code."
                        size="md"
                        variant="soft"
                        tone="celestial"
                    >
                        <Button size="sm" variant="ghost">MD Rich</Button>
                    </Tooltip>
                    <Tooltip
                        content={longUnbrokenText}
                        size="lg"
                        variant="outline"
                        tone="saffron"
                        contentClassName="max-w-[280px] overflow-x-auto"
                    >
                        <Button size="sm" variant="outline">LG Overflow</Button>
                    </Tooltip>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setVariantIndex((prev) => (prev + 1) % variantOptions.length)}>
                        Cycle variant
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setToneIndex((prev) => (prev + 1) % toneOptions.length)}>
                        Cycle tone
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setSideIndex((prev) => (prev + 1) % sideOptions.length)}>
                        Cycle side
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setAlignIndex((prev) => (prev + 1) % alignOptions.length)}>
                        Cycle align
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setSizeIndex((prev) => (prev + 1) % sizeOptions.length)}>
                        Cycle size
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setOffset((prev) => (prev >= 20 ? 0 : prev + 5))}>
                        Cycle offset
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDisabled((prev) => !prev)}>
                        {disabled ? "Enable" : "Disable"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setControlledOpen((prev) => !prev)}>
                        {controlledOpen ? "Close controlled" : "Open controlled"}
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: variant={variant}, tone={tone}, side={side}, align={align}, size={size}, offset={offset}, disabled={String(disabled)}
                </p>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Controlled</p>
                        <div className="flex min-h-24 items-center justify-center">
                            <Tooltip
                                content="Controlled tooltip state"
                                variant={variant}
                                tone={tone}
                                side={side}
                                align={align}
                                size={size}
                                offset={offset}
                                disabled={disabled}
                                open={controlledOpen}
                                onOpenChange={pushOpenEvent}
                            >
                                <Button size="sm" variant="secondary">Controlled trigger</Button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Default open</p>
                        <div className="flex min-h-24 items-center justify-center">
                            <Tooltip content="Starts open (uncontrolled)" defaultOpen variant="soft" tone="emerald">
                                <Button size="sm" variant="outline">Default open</Button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Event log</p>
                        <div className="min-h-24 space-y-1 text-xs text-space-500">
                            {openEvents.length > 0 ? (
                                openEvents.map((eventLine) => (
                                    <p key={eventLine} className="rounded bg-space-50 px-2 py-1">{eventLine}</p>
                                ))
                            ) : (
                                <p className="rounded bg-space-50 px-2 py-1">No events yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-[220px] overflow-hidden rounded-xl border border-dashed border-space-200 bg-white p-3">
                    <Tooltip
                        content="Overflow clipping check in a constrained parent"
                        side="right"
                        align="center"
                        variant="outline"
                        tone="persianred"
                    >
                        <Button size="sm" variant="ghost">Clipping case</Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

const MermaidDiagramStressDemo = () => {
    const themeOptions = ["default", "neutral", "forest", "dark", "base"] as const;
    const widthOptions = [320, 440, 620, 820, 980] as const;
    const syntaxPresets = [
        {
            id: "simple-present",
            label: "Simple present",
            syntax: `flowchart LR
Start([Start]) --> Habit{Habit or fact?}
Habit -- Yes --> Rule[Use simple present]
Rule --> Third{Subject is he/she/it?}
Third -- Yes --> AddS[Add -s or -es to verb]
Third -- No --> Base[Use base verb]
Habit -- No --> Now{Action happening now?}
Now -- Yes --> Continuous[Use present continuous]
Now -- No --> Other[Choose another tense]`,
        },
        {
            id: "parts-of-speech",
            label: "Parts of speech",
            syntax: `flowchart TD
POS[Parts of Speech] --> N[Noun]
POS --> P[Pronoun]
POS --> V[Verb]
POS --> A[Adjective]
POS --> R[Adverb]
POS --> PR[Preposition]
POS --> C[Conjunction]
POS --> I[Interjection]`,
        },
        {
            id: "sentence-pattern",
            label: "SVO pattern",
            syntax: `flowchart LR
S[Subject] --> V[Verb] --> O[Object]
S --> ExS[I, She, They]
V --> ExV[read, studies, play]
O --> ExO[a book, tennis, music]`,
        },
        {
            id: "simple-present-question",
            label: "Question form",
            syntax: `flowchart TD
Q[Simple present question] --> Aux{Subject is he/she/it?}
Aux -- Yes --> Does[Use does]
Aux -- No --> Do[Use do]
Does --> Base[Base verb only]
Do --> Base
Base --> Example[Does she work? / Do they work?]`,
        },
    ] as const;

    const [themeIndex, setThemeIndex] = useState(0);
    const [presetIndex, setPresetIndex] = useState(0);
    const [widthIndex, setWidthIndex] = useState(2);
    const [showSource, setShowSource] = useState(false);
    const [errorLog, setErrorLog] = useState<string[]>([]);

    const theme = themeOptions[themeIndex] ?? "default";
    const activePreset = syntaxPresets[presetIndex] ?? syntaxPresets[0];
    const width = widthOptions[widthIndex] ?? 620;

    const pushError = (error: Error) => {
        setErrorLog((prev) => {
            const stamp = new Date().toLocaleTimeString();
            return [`${stamp} - ${error.message}`, ...prev].slice(0, 5);
        });
    };

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Preset matrix</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Simple present concept / default</p>
                        <MermaidDiagram syntax={syntaxPresets[0].syntax} theme="default" />
                    </div>
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Parts of speech / neutral</p>
                        <MermaidDiagram syntax={syntaxPresets[1].syntax} theme="neutral" />
                    </div>
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">SVO sentence pattern / forest</p>
                        <MermaidDiagram syntax={syntaxPresets[2].syntax} theme="forest" />
                    </div>
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Simple present question form / base</p>
                        <MermaidDiagram
                            syntax={syntaxPresets[3].syntax}
                            theme="base"
                            showSourceOnError
                            onRenderError={pushError}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setPresetIndex((prev) => (prev + 1) % syntaxPresets.length)}>
                        Cycle syntax
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setThemeIndex((prev) => (prev + 1) % themeOptions.length)}>
                        Cycle theme
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWidthIndex((prev) => (prev + 1) % widthOptions.length)}>
                        Cycle width
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowSource((prev) => !prev)}>
                        Source: {showSource ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setErrorLog([])}>
                        Clear errors
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: syntax={activePreset.id}, theme={theme}, width={width}px, source={String(showSource)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="mx-auto transition-all" style={{ width: `${width}px`, maxWidth: "100%" }}>
                        <MermaidDiagram
                            syntax={activePreset.syntax}
                            theme={theme}
                            showSourceOnError
                            onRenderError={pushError}
                        />
                    </div>
                </div>

                {showSource ? (
                    <pre className="max-h-52 overflow-auto rounded-xl border border-space-100 bg-white p-3 text-xs text-space-600">
                        {activePreset.syntax}
                    </pre>
                ) : null}

                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Render errors</p>
                    <div className="space-y-1 text-xs text-space-500">
                        {errorLog.length > 0 ? (
                            errorLog.map((line) => (
                                <p key={line} className="rounded bg-space-50 px-2 py-1">{line}</p>
                            ))
                        ) : (
                            <p className="rounded bg-space-50 px-2 py-1">No errors recorded.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SubtitleStressDemo = () => {
    const toneOptions = [
        "CelestialBlue",
        "Saffron",
        "PersianRed",
        "Emerald",
        "Space",
    ] as const;
    const sizeOptions = [3, 4, 5, 6] as const;
    const paddingOptions = ["sm", "md", "lg"] as const;
    const alignOptions = ["left", "center", "right"] as const;
    const animateOptions = ["none", "left", "right", "top", "bottom"] as const;
    const widthOptions = [220, 320, 460, 620] as const;

    const [toneIndex, setToneIndex] = useState(0);
    const [sizeIndex, setSizeIndex] = useState(1);
    const [paddingIndex, setPaddingIndex] = useState(1);
    const [alignIndex, setAlignIndex] = useState(1);
    const [animateIndex, setAnimateIndex] = useState(0);
    const [widthIndex, setWidthIndex] = useState(2);
    const [longLabel, setLongLabel] = useState(false);
    const [isTransparent, setIsTransparent] = useState(false);
    const [remountKey, setRemountKey] = useState(0);

    const tone = toneOptions[toneIndex] ?? "CelestialBlue";
    const size = sizeOptions[sizeIndex] ?? 4;
    const padding = paddingOptions[paddingIndex] ?? "md";
    const align = alignOptions[alignIndex] ?? "center";
    const animateFromRaw = animateOptions[animateIndex] ?? "none";
    const animateFrom = animateFromRaw === "none" ? undefined : animateFromRaw;
    const width = widthOptions[widthIndex] ?? 460;
    const liveText = longLabel
        ? "Extended subtitle label for simple-present grammar checkpoint and parts-of-speech practice"
        : "Reading Highlights";

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tone and size matrix</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    {toneOptions.map((toneOption) => (
                        <div key={`subtitle-tone-${toneOption}`} className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{toneOption}</p>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map((sizeOption) => (
                                    <Subtitle
                                        key={`subtitle-${toneOption}-${sizeOption}`}
                                        tone={toneOption}
                                        size={sizeOption}
                                        padding="md"
                                    >
                                        Size {sizeOption}
                                    </Subtitle>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Constrained width edge cases</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="w-[200px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <Subtitle tone="Space" size={6} padding="sm" align="left" className="max-w-full whitespace-normal break-words">
                            Compact width subtitle text
                        </Subtitle>
                    </div>
                    <div className="w-[280px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <Subtitle tone="PersianRed" size={5} padding="md" align="center" className="max-w-full whitespace-normal break-words">
                            Extended subtitle for narrower container wrapping behavior
                        </Subtitle>
                    </div>
                    <div className="w-[380px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <Subtitle tone="Emerald" size={4} padding="lg" align="right" className="max-w-full whitespace-normal break-words">
                            <span>Node child: <strong>simple present</strong> checkpoint</span>
                        </Subtitle>
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setToneIndex((prev) => (prev + 1) % toneOptions.length)}>
                        Cycle tone
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setSizeIndex((prev) => (prev + 1) % sizeOptions.length)}>
                        Cycle size
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setPaddingIndex((prev) => (prev + 1) % paddingOptions.length)}>
                        Cycle padding
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setAlignIndex((prev) => (prev + 1) % alignOptions.length)}>
                        Cycle align
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setAnimateIndex((prev) => (prev + 1) % animateOptions.length)}>
                        Cycle animation
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWidthIndex((prev) => (prev + 1) % widthOptions.length)}>
                        Cycle width
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setLongLabel((prev) => !prev)}>
                        Long label: {longLabel ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsTransparent((prev) => !prev)}>
                        Transparent: {isTransparent ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemountKey((prev) => prev + 1)}>
                        Replay animation
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: tone={tone}, size={size}, padding={padding}, align={align}, animate={animateFromRaw}, width={width}px, transparent={String(isTransparent)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="mx-auto transition-all" style={{ width: `${width}px`, maxWidth: "100%" }}>
                        <Subtitle
                            key={`subtitle-live-${remountKey}`}
                            tone={tone}
                            size={size}
                            padding={padding}
                            align={align}
                            isTransparent={isTransparent}
                            animateFrom={animateFrom}
                            className="max-w-full whitespace-normal break-words"
                        >
                            {liveText}
                        </Subtitle>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TitleStressDemo = () => {
    const asOptions = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
    const widthOptions = [220, 320, 520] as const;
    const longUnbrokenToken = "titletoken_without_breakpoints_".repeat(3);

    const [toneIndex, setToneIndex] = useState(0);
    const [sizeIndex, setSizeIndex] = useState(2);
    const [asIndex, setAsIndex] = useState(2);
    const [widthIndex, setWidthIndex] = useState(2);
    const [animate, setAnimate] = useState(true);
    const [longText, setLongText] = useState(false);
    const [nodeChild, setNodeChild] = useState(false);
    const [remountKey, setRemountKey] = useState(0);

    const tone = titleToneOptions[toneIndex] ?? "CelestialBlue";
    const size = titleSizeOptions[sizeIndex] ?? 3;
    const asTag = asOptions[asIndex] ?? "h3";
    const width = widthOptions[widthIndex] ?? 520;
    const liveText = longText
        ? `Simple present checkpoint heading for reading and grammar practice ${longUnbrokenToken}`
        : "Simple present checkpoint";
    const liveChildren: ReactNode = nodeChild
        ? (
            <span>
                Node child: <strong>Simple present</strong> + <em>parts of speech</em>
            </span>
        )
        : liveText;

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tone and size matrix</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    {titleToneOptions.map((toneOption) => (
                        <div key={`title-tone-${toneOption}`} className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">{toneOption}</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {titleSizeOptions.map((sizeOption) => (
                                    <Title
                                        key={`title-${toneOption}-${sizeOption}`}
                                        tone={toneOption}
                                        size={sizeOption}
                                        animate={false}
                                    >
                                        {toneOption} {sizeOption}
                                    </Title>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Semantic tag override (`as`) with stable visual size</p>
                <div className="grid gap-2 rounded-xl border border-space-100 bg-white p-3 sm:grid-cols-2 lg:grid-cols-3">
                    {asOptions.map((tag) => (
                        <Title key={`title-as-${tag}`} as={tag} size={4} tone="Space" animate={false}>
                            Visual size 4 as &lt;{tag}&gt;
                        </Title>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Constrained width edge cases</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="w-[200px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <Title tone="Space_alt" size={6} animate={false} className="max-w-full whitespace-normal break-words">
                            Compact width title text
                        </Title>
                    </div>
                    <div className="w-[300px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <Title tone="PersianRed" size={5} animate={false} className="max-w-full whitespace-normal break-words">
                            Extended heading for grammar checkpoint and simple-present practice
                        </Title>
                    </div>
                    <div className="w-[380px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <Title tone="CelestialBlue" size={4} animate={false} className="max-w-full whitespace-normal break-words">
                            {longUnbrokenToken}
                        </Title>
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setToneIndex((prev) => (prev + 1) % titleToneOptions.length)}>
                        Cycle tone
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setSizeIndex((prev) => (prev + 1) % titleSizeOptions.length)}>
                        Cycle size
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setAsIndex((prev) => (prev + 1) % asOptions.length)}>
                        Cycle as
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWidthIndex((prev) => (prev + 1) % widthOptions.length)}>
                        Cycle width
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setAnimate((prev) => !prev)}>
                        Animate: {animate ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setLongText((prev) => !prev)}>
                        Long text: {longText ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setNodeChild((prev) => !prev)}>
                        Node child: {nodeChild ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemountKey((prev) => prev + 1)}>
                        Replay animation
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: tone={tone}, size={size}, as={asTag}, animate={String(animate)}, width={width}px, node={String(nodeChild)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="mx-auto transition-all" style={{ width: `${width}px`, maxWidth: "100%" }}>
                        <Title
                            key={`title-live-${remountKey}`}
                            tone={tone}
                            size={size}
                            as={asTag}
                            animate={animate}
                            className="max-w-full whitespace-normal break-words"
                        >
                            {liveChildren}
                        </Title>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TipCardStressDemo = ({ baseTips }: { baseTips: string[] }) => {
    const constrainedWidths = [320, 400, 540] as const;
    const fallbackTips = [
        "Focus on subject-verb agreement before choosing an option.",
        "Read every answer choice to the end before selecting.",
        "Use context clues in nearby sentences to confirm tense.",
    ];
    const longUnbrokenToken = "tipcontent_without_breakpoints_for_overflow_verification_".repeat(2);

    const [widthIndex, setWidthIndex] = useState(2);
    const [liveCount, setLiveCount] = useState(5);
    const [showDescription, setShowDescription] = useState(true);
    const [showMedia, setShowMedia] = useState(true);
    const [remountKey, setRemountKey] = useState(0);

    const width = constrainedWidths[widthIndex] ?? 540;
    const boundedCount = Math.max(1, Math.min(12, liveCount));
    const seedTips = baseTips.length > 0 ? baseTips : fallbackTips;
    const standardTips = seedTips.slice(0, 3);
    const liveTips = Array.from({length: boundedCount}, (_, index) => {
        const baseTip = seedTips[index % seedTips.length];
        if (index === boundedCount - 1) {
            return `${baseTip} ${longUnbrokenToken}`;
        }
        return baseTip;
    });

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Core states and content shapes</p>
                <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Standard with description</p>
                        <TipCard title="Grammar tips">
                            {standardTips.map((tip, index) => (
                                <TipCard.Item key={`tip-standard-${index}`}>
                                    <TipCard.Title>Tip {index + 1}</TipCard.Title>
                                    <TipCard.Body>{tip}</TipCard.Body>
                                    <TipCard.Description>
                                        Quick reminder for simple-present and sentence structure checks.
                                    </TipCard.Description>
                                </TipCard.Item>
                            ))}
                        </TipCard>
                    </div>

                    <div className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Media and rich body content</p>
                        <TipCard title="Practice flow tips">
                            <TipCard.Item>
                                <TipCard.Title>Before reading</TipCard.Title>
                                <TipCard.Body>Skim the passage headline and first sentence for topic clues.</TipCard.Body>
                                <TipCard.Description>
                                    This supports faster elimination in multiple-choice items.
                                </TipCard.Description>
                            </TipCard.Item>
                            <TipCard.Item>
                                <TipCard.Title>While answering</TipCard.Title>
                                <TipCard.Body>
                                    Confirm pronoun references and tense consistency line by line.
                                </TipCard.Body>
                                {showMedia ? (
                                    <div className="mt-2 overflow-hidden rounded-xl border border-persianred-200/40 bg-white">
                                        <img
                                            src="https://placehold.co/640x220/png?text=Tip+Media+Sample"
                                            alt="Tip media sample"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : null}
                            </TipCard.Item>
                        </TipCard>
                    </div>

                    <div className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Non-item children filtering</p>
                        <TipCard title="Filter behavior">
                            <div className="rounded-lg border border-dashed border-space-200 bg-space-10/50 px-3 py-2 text-xs text-space-500">
                                This raw div is not a TipCard.Item and should not render inside the tips list.
                            </div>
                            {null}
                            {false}
                            <TipCard.Item>
                                <TipCard.Title>Only valid item</TipCard.Title>
                                <TipCard.Body>
                                    If this appears as item 01, child filtering is working as expected.
                                </TipCard.Body>
                            </TipCard.Item>
                        </TipCard>
                    </div>

                    <div className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Empty data state</p>
                        <TipCard title="Tips unavailable">{null}</TipCard>
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setLiveCount((prev) => Math.min(12, prev + 1))}>
                        +1 item
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveCount((prev) => Math.max(1, prev - 1))}>
                        -1 item
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWidthIndex((prev) => (prev + 1) % constrainedWidths.length)}>
                        Cycle width
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowDescription((prev) => !prev)}>
                        Description: {showDescription ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowMedia((prev) => !prev)}>
                        Media: {showMedia ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemountKey((prev) => prev + 1)}>
                        Remount card
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: items={boundedCount}, width={width}px, description={String(showDescription)}, media={String(showMedia)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="mx-auto transition-all" style={{width: `${width}px`, maxWidth: "100%"}}>
                        <TipCard key={`tip-card-live-${remountKey}`} title="Interactive stress card">
                            {liveTips.map((tip, index) => (
                                <TipCard.Item key={`tip-live-${index}`}>
                                    <TipCard.Title>Dynamic tip {index + 1}</TipCard.Title>
                                    <TipCard.Body>{tip}</TipCard.Body>
                                    {showDescription ? (
                                        <TipCard.Description>
                                            Item {index + 1} description slot checks wrapping and spacing behavior.
                                        </TipCard.Description>
                                    ) : null}
                                    {showMedia && index % 3 === 1 ? (
                                        <div className="mt-2 h-14 rounded-lg border border-persianred-200/50 bg-persianred-50/40" />
                                    ) : null}
                                </TipCard.Item>
                            ))}
                        </TipCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoButtonsStressDemo = () => {
    const variantOptions = ["default", "info", "level"] as const;
    const iconWeightOptions = [100, 300, 400, 600, 700] as const;
    const bandEdgeCases = [-2, 0, 4.25, 6.5, 8.75, 12] as const;

    const [variantIndex, setVariantIndex] = useState(0);
    const [weightIndex, setWeightIndex] = useState(2);
    const [liveBand, setLiveBand] = useState(6.5);
    const [hasIcon, setHasIcon] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [iconFill, setIconFill] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const liveVariant = variantOptions[variantIndex] ?? "default";
    const liveWeight = iconWeightOptions[weightIndex] ?? 400;

    const pushClick = (label: string) => {
        setClickCount((prev) => prev + 1);
        console.log(`[InfoButtons demo] click: ${label}`);
    };

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variant matrix</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">default</p>
                        <div className="flex flex-wrap gap-2">
                            <InfoButtons label="Details" onClick={() => pushClick("default / details")} />
                            <InfoButtons label="Long default label for overflow check" onClick={() => pushClick("default / long")} />
                            <InfoButtons label="Icon mode" hasIcon icon="info" iconWeight={600} onClick={() => pushClick("default / icon")} />
                        </div>
                    </div>
                    <div className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">info</p>
                        <div className="flex flex-wrap gap-2">
                            <InfoButtons variant="info" label="About" onClick={() => pushClick("info / text")} />
                            <InfoButtons variant="info" hasIcon icon="info" label="About score" iconWeight={300} onClick={() => pushClick("info / icon")} />
                            <InfoButtons variant="info" hasIcon icon="info" label="Filled icon" iconFill onClick={() => pushClick("info / fill")} />
                        </div>
                    </div>
                    <div className="space-y-3 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">level</p>
                        <div className="flex flex-wrap gap-2">
                            <InfoButtons variant="level" band={5.5} onClick={() => pushClick("level / 5.5")} />
                            <InfoButtons variant="level" band={7.5} label="IELTS" hasIcon icon="info" onClick={() => pushClick("level / 7.5")} />
                            <InfoButtons variant="level" band={9} label="Academic" hasIcon icon="info" iconWeight={700} onClick={() => pushClick("level / 9")} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Band edge cases (level clamp behavior)</p>
                <div className="flex flex-wrap gap-2 rounded-xl border border-space-100 bg-space-10/50 p-3">
                    {bandEdgeCases.map((bandValue) => (
                        <InfoButtons
                            key={`info-buttons-band-${bandValue}`}
                            variant="level"
                            band={bandValue}
                            label={`Band in: ${bandValue}`}
                            hasIcon
                            icon="info"
                            onClick={() => pushClick(`level / input ${bandValue}`)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Constrained width + disabled</p>
                <div className="flex flex-wrap items-start gap-4">
                    <div className="w-[150px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <InfoButtons
                            label="Narrow container label stress case"
                            hasIcon
                            icon="info"
                            className="max-w-full"
                            onClick={() => pushClick("narrow / default")}
                        />
                    </div>
                    <div className="w-[190px] rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <InfoButtons
                            variant="info"
                            label="Disabled state"
                            hasIcon
                            icon="info"
                            isDisabled
                            className="max-w-full"
                            onClick={() => pushClick("narrow / disabled")}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setVariantIndex((prev) => (prev + 1) % variantOptions.length)}>
                        Cycle variant
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWeightIndex((prev) => (prev + 1) % iconWeightOptions.length)}>
                        Cycle weight
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveBand((prev) => Number((prev + 0.5).toFixed(1)))}>
                        +0.5 band
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLiveBand((prev) => Number((prev - 0.5).toFixed(1)))}>
                        -0.5 band
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setHasIcon((prev) => !prev)}>
                        Toggle icon
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIconFill((prev) => !prev)}>
                        Toggle fill
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsDisabled((prev) => !prev)}>
                        {isDisabled ? "Enable" : "Disable"}
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: variant={liveVariant}, weight={liveWeight}, band={liveBand}, hasIcon={String(hasIcon)}, fill={String(iconFill)}, disabled={String(isDisabled)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    {liveVariant === "level" ? (
                        <InfoButtons
                            variant="level"
                            band={liveBand}
                            label="Interactive level"
                            hasIcon={hasIcon}
                            icon="info"
                            iconWeight={liveWeight}
                            iconFill={iconFill}
                            isDisabled={isDisabled}
                            onClick={() => pushClick("live / level")}
                        />
                    ) : (
                        <InfoButtons
                            variant={liveVariant}
                            label={liveVariant === "info" ? "Interactive info" : "Interactive default"}
                            hasIcon={hasIcon}
                            icon="info"
                            iconWeight={liveWeight}
                            iconFill={iconFill}
                            isDisabled={isDisabled}
                            onClick={() => pushClick(`live / ${liveVariant}`)}
                        />
                    )}
                </div>

                <p className="text-xs text-space-500">Click count: {clickCount}</p>
            </div>
        </div>
    );
};

const QuizCardStressDemo = () => {
    const gradeOptions = [undefined, "S", "A", "C", "D", "F"] as const;
    const widthOptions = [320, 360, 420, 520, 760, 960] as const;

    const [gradeIndex, setGradeIndex] = useState(1);
    const [widthIndex, setWidthIndex] = useState(3);
    const [frameless, setFrameless] = useState(false);
    const [statusVisible, setStatusVisible] = useState(true);
    const [withAction, setWithAction] = useState(true);
    const [clickCount, setClickCount] = useState(0);

    const liveGrade = gradeOptions[gradeIndex];
    const liveWidth = widthOptions[widthIndex];

    const pushReview = (label: string) => {
        setClickCount((prev) => prev + 1);
        console.log(`[QuizCard demo] review click: ${label}`);
    };

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">State matrix</p>
                <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Success + action</p>
                        <QuizCard xp={120} time="02:32" grade="S" title="Vocabulary" onReview={() => pushReview("success")} />
                    </div>
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Failed + action</p>
                        <QuizCard xp={54} time="05:21" grade="F" title="Grammar" onReview={() => pushReview("failed")} />
                    </div>
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Neutral + no action</p>
                        <QuizCard xp={0} time="--:--" title="Review" />
                    </div>
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">Frameless</p>
                        <QuizCard xp={88} time="03:40" grade="B" frameless statusVisible={false} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Container query width checks</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="w-[340px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <QuizCard xp={33} time="01:25" grade="D" title="Narrow 340px" onReview={() => pushReview("narrow-340")} />
                    </div>
                    <div className="w-[480px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <QuizCard xp={77} time="03:11" grade="A" title="Medium 480px" onReview={() => pushReview("medium-480")} />
                    </div>
                    <div className="w-[640px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <QuizCard xp={92} time="04:07" grade="C" title="Wide 640px" onReview={() => pushReview("wide-640")} />
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setGradeIndex((prev) => (prev + 1) % gradeOptions.length)}>
                        Cycle grade
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWidthIndex((prev) => (prev + 1) % widthOptions.length)}>
                        Cycle width
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setFrameless((prev) => !prev)}>
                        Frameless: {frameless ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setStatusVisible((prev) => !prev)}>
                        Status visible: {statusVisible ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setWithAction((prev) => !prev)}>
                        Action: {withAction ? "on" : "off"}
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: width={liveWidth}px, grade={liveGrade ?? "undefined"}, frameless={String(frameless)}, statusVisible={String(statusVisible)}, action={String(withAction)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="mx-auto transition-all" style={{ width: `${liveWidth}px`, maxWidth: "100%" }}>
                        <QuizCard
                            xp={120}
                            time="02:32"
                            grade={liveGrade}
                            frameless={frameless}
                            statusVisible={statusVisible}
                            title="Interactive"
                            actionLabel="Review answers"
                            onReview={withAction ? () => pushReview("interactive") : undefined}
                        />
                    </div>
                </div>

                <p className="text-xs text-space-500">Review clicks: {clickCount}</p>
            </div>
        </div>
    );
};

const ReadingCardStressDemo = ({ baseReading }: { baseReading: Reading }) => {
    const toneOptions = ["white", "space"] as const;
    const paddingOptions = ["sm", "md", "lg"] as const;
    const contentModes = ["default", "long", "single", "empty"] as const;
    const widthOptions = [320, 420, 560, 760, 960] as const;

    const [toneIndex, setToneIndex] = useState(0);
    const [paddingIndex, setPaddingIndex] = useState(1);
    const [modeIndex, setModeIndex] = useState(0);
    const [widthIndex, setWidthIndex] = useState(3);
    const [showImage, setShowImage] = useState(true);
    const [longTitle, setLongTitle] = useState(false);

    const tone = toneOptions[toneIndex] ?? "white";
    const padding = paddingOptions[paddingIndex] ?? "md";
    const contentMode = contentModes[modeIndex] ?? "default";
    const width = widthOptions[widthIndex] ?? 760;

    const fallbackReading: Reading = {
        title: "Airport Check-In Guide",
        image: "https://placehold.co/1200x675/png?text=Reading+Card",
        readingText: [
            "Passengers should check flight details and have travel documents ready before arriving at the counter.",
            "Keep answers clear and concise when staff ask security or baggage questions.",
            "Use present continuous for actions happening now, such as waiting, boarding, or checking in.",
        ],
    };

    const resolvedReading: Reading = {
        title: baseReading.title || fallbackReading.title,
        image: baseReading.image || fallbackReading.image,
        readingText: baseReading.readingText.length ? baseReading.readingText : fallbackReading.readingText,
    };

    const longBody = [
        "This is an intentionally long paragraph to stress wrapping behavior, rhythm, and readability across narrow and wide containers. It should remain legible without breaking layout.",
        "When users scan reading cards, spacing and hierarchy should remain stable as copy grows. This case checks paragraph stacking, line length, and animated reveal consistency.",
    ];

    const bodyByMode: Record<(typeof contentModes)[number], string[]> = {
        default: resolvedReading.readingText,
        long: longBody,
        single: [resolvedReading.readingText[0] ?? fallbackReading.readingText[0]],
        empty: [],
    };

    const body = bodyByMode[contentMode];
    const computedTitle = longTitle
        ? `${resolvedReading.title} - Extended scenario with a very long headline to stress text wrapping behavior`
        : resolvedReading.title;

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variant matrix</p>
                <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        <ReadingCard tone="white" padding="md">
                            <ReadingCard.Image src={resolvedReading.image} alt={resolvedReading.title} />
                            <ReadingCard.Title>{resolvedReading.title}</ReadingCard.Title>
                            <ReadingCard.Body reading={resolvedReading.readingText} />
                        </ReadingCard>
                    </div>
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        <ReadingCard tone="space" padding="lg">
                            <ReadingCard.Image src={resolvedReading.image} alt={resolvedReading.title} />
                            <ReadingCard.Title>Space tone / larger padding</ReadingCard.Title>
                            <ReadingCard.Body reading={longBody} />
                        </ReadingCard>
                    </div>
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        <ReadingCard tone="white" padding="sm">
                            <ReadingCard.Title>No image composition</ReadingCard.Title>
                            <ReadingCard.Body reading={[resolvedReading.readingText[0] ?? fallbackReading.readingText[0]]} />
                        </ReadingCard>
                    </div>
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        <ReadingCard tone="space" padding="md">
                            <ReadingCard.Image src="https://placehold.co/1200x675/png?text=Alternative+Media" alt="Alternative media demo" />
                            <ReadingCard.Title>Alternative media source</ReadingCard.Title>
                            <ReadingCard.Body reading={["Checks fallback media and title/body rendering under a changed image source."]} />
                        </ReadingCard>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Constrained width checks</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="w-[340px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <ReadingCard tone="white" padding="sm">
                            <ReadingCard.Image src={resolvedReading.image} alt={resolvedReading.title} />
                            <ReadingCard.Title>Narrow 340px</ReadingCard.Title>
                            <ReadingCard.Body reading={[resolvedReading.readingText[0] ?? fallbackReading.readingText[0]]} />
                        </ReadingCard>
                    </div>
                    <div className="w-[500px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <ReadingCard tone="space" padding="md">
                            <ReadingCard.Image src={resolvedReading.image} alt={resolvedReading.title} />
                            <ReadingCard.Title>Medium 500px</ReadingCard.Title>
                            <ReadingCard.Body reading={resolvedReading.readingText.slice(0, 2)} />
                        </ReadingCard>
                    </div>
                    <div className="w-[700px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        <ReadingCard tone="white" padding="lg">
                            <ReadingCard.Image src={resolvedReading.image} alt={resolvedReading.title} />
                            <ReadingCard.Title>Wide 700px</ReadingCard.Title>
                            <ReadingCard.Body reading={resolvedReading.readingText} />
                        </ReadingCard>
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setToneIndex((prev) => (prev + 1) % toneOptions.length)}>
                        Cycle tone
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setPaddingIndex((prev) => (prev + 1) % paddingOptions.length)}>
                        Cycle padding
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setModeIndex((prev) => (prev + 1) % contentModes.length)}>
                        Cycle content mode
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWidthIndex((prev) => (prev + 1) % widthOptions.length)}>
                        Cycle width
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowImage((prev) => !prev)}>
                        Image: {showImage ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setLongTitle((prev) => !prev)}>
                        Long title: {longTitle ? "on" : "off"}
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: tone={tone}, padding={padding}, mode={contentMode}, width={width}px, image={String(showImage)}, longTitle={String(longTitle)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="mx-auto transition-all" style={{ width: `${width}px`, maxWidth: "100%" }}>
                        <ReadingCard tone={tone} padding={padding}>
                            {showImage ? (
                                <ReadingCard.Image src={resolvedReading.image} alt={computedTitle} />
                            ) : null}
                            <ReadingCard.Title>{computedTitle}</ReadingCard.Title>
                            {body.length > 0 ? (
                                <ReadingCard.Body reading={body} />
                            ) : (
                                <p className="px-2 text-sm text-space-500 md:px-[10px]">No reading paragraphs in this mode.</p>
                            )}
                        </ReadingCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReadingPointStressDemo = ({
    basePoints,
}: {
    basePoints: Array<{ title: string; body: string; description?: string }>;
}) => {
    const datasetOptions = ["default", "single", "long-copy", "many-items", "missing-description"] as const;
    const widthOptions = [320, 420, 560, 760] as const;

    const [datasetIndex, setDatasetIndex] = useState(0);
    const [widthIndex, setWidthIndex] = useState(2);
    const [showDescription, setShowDescription] = useState(true);

    const fallbackPoints = [
        {
            title: "Skim First",
            body: "Identify topic words and dates before reading details.",
            description: "This improves speed and gives context for the next pass.",
        },
        {
            title: "Scan for Details",
            body: "Find names, locations, and exact times in the text.",
            description: "Focus on concrete facts that answers usually reference.",
        },
        {
            title: "Validate Meaning",
            body: "Re-read the surrounding sentence before finalizing an answer.",
            description: "This avoids picking options that look right but shift meaning.",
        },
    ];

    const resolvedBasePoints = basePoints.length ? basePoints : fallbackPoints;
    const manyItems = Array.from({ length: 6 }, (_, i) => ({
        title: `Step ${i + 1}`,
        body: `Checklist guidance point ${i + 1} for long list stress testing.`,
        description: i % 2 === 0 ? `Optional detail block for item ${i + 1}.` : undefined,
    }));
    const longCopyPoints = [
        {
            title: "Use layered reading strategy for long airport announcements and service updates",
            body: "Read once for topic and intent, then re-read sections with time or location markers to avoid missing the operational detail that changes your answer.",
            description:
                "Long-body test: this verifies wrapping and spacing when description text is significantly longer than the default content.",
        },
        {
            title: "Compare similar options before selecting",
            body: "When two options appear close, identify the exact grammatical cue that separates present action from general truth.",
            description:
                "Long-body test: this description intentionally contains extra words to stress paragraph rhythm and line length behavior in the card.",
        },
    ];

    const datasetMap: Record<(typeof datasetOptions)[number], Array<{ title: string; body: string; description?: string }>> = {
        default: resolvedBasePoints,
        single: [resolvedBasePoints[0] ?? fallbackPoints[0]],
        "long-copy": longCopyPoints,
        "many-items": manyItems,
        "missing-description": resolvedBasePoints.map((item) => ({
            title: item.title,
            body: item.body,
        })),
    };

    const datasetKey = datasetOptions[datasetIndex] ?? "default";
    const width = widthOptions[widthIndex] ?? 560;
    const livePoints = datasetMap[datasetKey];

    const renderPoints = (
        points: Array<{ title: string; body: string; description?: string }>,
        keyPrefix: string
    ) => (
        <ReadingPoint>
            {points.map((point, index) => (
                <ReadingPoint.Item key={`${keyPrefix}-${point.title}-${index}`}>
                    <ReadingPoint.Title>{point.title}</ReadingPoint.Title>
                    <ReadingPoint.Body>{point.body}</ReadingPoint.Body>
                    {showDescription && point.description ? (
                        <ReadingPoint.Description>{point.description}</ReadingPoint.Description>
                    ) : null}
                </ReadingPoint.Item>
            ))}
        </ReadingPoint>
    );

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variant matrix</p>
                <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        {renderPoints(resolvedBasePoints, "rp-default")}
                    </div>
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        {renderPoints(longCopyPoints, "rp-long")}
                    </div>
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        {renderPoints([resolvedBasePoints[0] ?? fallbackPoints[0]], "rp-single")}
                    </div>
                    <div className="rounded-xl border border-space-100 bg-white p-3">
                        {renderPoints(datasetMap["missing-description"], "rp-no-desc")}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Constrained width checks</p>
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="w-[320px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        {renderPoints([resolvedBasePoints[0] ?? fallbackPoints[0]], "rp-width-320")}
                    </div>
                    <div className="w-[460px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        {renderPoints(resolvedBasePoints.slice(0, 2), "rp-width-460")}
                    </div>
                    <div className="w-[640px] max-w-full rounded-xl border border-dashed border-space-200 bg-white p-2">
                        {renderPoints(resolvedBasePoints, "rp-width-640")}
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setDatasetIndex((prev) => (prev + 1) % datasetOptions.length)}
                    >
                        Cycle dataset
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setWidthIndex((prev) => (prev + 1) % widthOptions.length)}
                    >
                        Cycle width
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowDescription((prev) => !prev)}
                    >
                        Description: {showDescription ? "on" : "off"}
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: dataset={datasetKey}, width={width}px, description={String(showDescription)}, items={livePoints.length}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="mx-auto transition-all" style={{ width: `${width}px`, maxWidth: "100%" }}>
                        {renderPoints(livePoints, "rp-live")}
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuizAnimatedStressDemo = ({ baseData }: { baseData: QuizData }) => {
    const [mode, setMode] = useState<"quiz" | "review">("quiz");
    const [datasetKey, setDatasetKey] = useState<"default" | "duplicates" | "long-copy" | "many-options" | "empty">("default");
    const [useCustomFeedback, setUseCustomFeedback] = useState(true);
    const [instanceSeed, setInstanceSeed] = useState(0);
    const [answersSeen, setAnswersSeen] = useState(0);
    const [lastScore, setLastScore] = useState<number | null>(null);
    const [eventLog, setEventLog] = useState<string[]>([]);

    const pushEvent = (message: string) => {
        const stamp = new Date().toLocaleTimeString();
        setEventLog((prev) => [`${stamp} - ${message}`, ...prev].slice(0, 10));
    };

    const fallbackData: QuizData = {
        questions: [
            {
                id: "fallback-1",
                question: "The traveler is ... at the counter.",
                options: ["waiting", "wait", "waited", "waits"],
                optionIds: ["A", "B", "C", "D"],
                correctIndex: 1,
            },
            {
                id: "fallback-2",
                question: "Choose the best synonym for ...",
                options: ["brief", "rapid", "empty", "quiet"],
                optionIds: ["A", "B", "C", "D"],
                correctIndex: 2,
            },
        ],
    };

    const resolvedBaseData = baseData.questions.length ? baseData : fallbackData;
    const datasetMap: Record<"default" | "duplicates" | "long-copy" | "many-options" | "empty", QuizData> = {
        default: resolvedBaseData,
        duplicates: {
            questions: [
                {
                    id: "dup-1",
                    question: "Pick the correct answer for ...",
                    options: ["quick", "quick", "quiet", "late"],
                    optionIds: ["dup-a", "dup-b", "dup-c", "dup-d"],
                    correctIndex: 1,
                },
                {
                    id: "dup-2",
                    question: "The passenger will ... at gate 4.",
                    options: ["arrive", "arrive", "arrived", "arriving"],
                    optionIds: ["dup-e", "dup-f", "dup-g", "dup-h"],
                    correctIndex: 1,
                },
            ],
        },
        "long-copy": {
            questions: [
                {
                    id: "long-1",
                    question: "The announcement explains that passengers with oversized carry-on luggage should ... before entering the final boarding lane.",
                    options: [
                        "visit the secondary check counter for manual tagging and validation",
                        "continue directly to the aircraft bridge",
                        "skip identification checks for faster movement",
                        "leave luggage unattended in the waiting zone",
                    ],
                    optionIds: ["long-a", "long-b", "long-c", "long-d"],
                    correctIndex: 1,
                },
                {
                    id: "long-2",
                    question: "Choose the best replacement for ... in the sentence about delayed departures.",
                    options: [
                        "unexpected operational limitations",
                        "brief and casual greeting",
                        "small decorative detail",
                        "friendly weather",
                    ],
                    optionIds: ["long-e", "long-f", "long-g", "long-h"],
                    correctIndex: 1,
                },
            ],
        },
        "many-options": {
            questions: [
                {
                    id: "many-1",
                    question: "Select the strongest transition word: ...",
                    options: ["however", "because", "also", "then", "meanwhile", "besides"],
                    optionIds: ["m1", "m2", "m3", "m4", "m5", "m6"],
                    correctIndex: 1,
                },
                {
                    id: "many-2",
                    question: "Pick the tense that fits ... now.",
                    options: ["is boarding", "boarded", "boards", "was board", "has board", "board"],
                    optionIds: ["m7", "m8", "m9", "m10", "m11", "m12"],
                    correctIndex: 1,
                },
            ],
        },
        empty: {
            questions: [],
        },
    };

    const activeData = datasetMap[datasetKey];
    const totalQuestions = activeData.questions.length;
    const quizKey = `${datasetKey}-${mode}-${instanceSeed}`;

    return (
        <div className="w-full max-w-[1180px] space-y-6">
            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setMode((prev) => (prev === "quiz" ? "review" : "quiz"))}
                    >
                        Mode: {mode}
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setUseCustomFeedback((prev) => !prev)}
                    >
                        Custom feedback: {useCustomFeedback ? "on" : "off"}
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setInstanceSeed((prev) => prev + 1)}
                    >
                        Reset instance
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setEventLog([]);
                            setLastScore(null);
                            setAnswersSeen(0);
                        }}
                    >
                        Clear telemetry
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: "default", label: "Default" },
                        { id: "duplicates", label: "Duplicate labels" },
                        { id: "long-copy", label: "Long copy" },
                        { id: "many-options", label: "6 options" },
                        { id: "empty", label: "Empty dataset" },
                    ].map((dataset) => (
                        <Button
                            key={`quiz-animated-dataset-${dataset.id}`}
                            size="sm"
                            variant={datasetKey === dataset.id ? "secondary" : "ghost"}
                            onClick={() => {
                                setDatasetKey(dataset.id as "default" | "duplicates" | "long-copy" | "many-options" | "empty");
                                setInstanceSeed((prev) => prev + 1);
                                setLastScore(null);
                                setAnswersSeen(0);
                                pushEvent(`dataset switched: ${dataset.id}`);
                            }}
                        >
                            {dataset.label}
                        </Button>
                    ))}
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Active dataset={datasetKey}, questions={totalQuestions}, answers tracked={answersSeen}, last score={lastScore ?? "-"}
                </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0 rounded-3xl border border-space-100 bg-white p-4">
                    <QuizAnimated
                        key={quizKey}
                        data={activeData}
                        mode={mode}
                        onAnswerChange={(answers) => {
                            const answerCount = Object.keys(answers).length;
                            setAnswersSeen(answerCount);
                            pushEvent(`onAnswerChange: ${answerCount} answer(s)`);
                        }}
                        onComplete={(score) => {
                            setLastScore(score);
                            pushEvent(`onComplete: score ${score}`);
                        }}
                        renderFeedback={useCustomFeedback
                            ? (context) => (
                                <div className="w-full max-w-[960px] rounded-2xl border border-space-100 bg-space-50 p-4 text-sm text-space-700">
                                    <p className="font-semibold text-space-800">
                                        {context.isCorrect ? "Correct answer" : "Needs review"} - Q{context.questionIndex + 1}
                                    </p>
                                    <p className="mt-1">
                                        Selected: <span className="font-medium">{context.answerLabel ?? "n/a"}</span>
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => {
                                                pushEvent(`feedback continue q${context.questionIndex + 1}`);
                                                context.onContinue();
                                            }}
                                        >
                                            {context.actionLabel}
                                        </Button>
                                        <span className="text-xs text-space-500">
                                            lastQuestion={String(context.isLastQuestion)}
                                        </span>
                                    </div>
                                </div>
                            )
                            : undefined}
                    />
                </div>

                <div className="space-y-2 rounded-2xl border border-space-100 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">Telemetry</p>
                    <div className="space-y-1 text-xs text-space-500">
                        {eventLog.length > 0 ? (
                            eventLog.map((eventLine, idx) => (
                                <p key={`quiz-animated-event-${idx}-${eventLine}`} className="rounded bg-space-50 px-2 py-1">
                                    {eventLine}
                                </p>
                            ))
                        ) : (
                            <p className="rounded bg-space-50 px-2 py-1">No events yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OnboardingWizardDemo = () => {
    const [submissionSeed, setSubmissionSeed] = useState(0);
    const [submittedAnswers, setSubmittedAnswers] = useState<OnboardingWizardAnswers | null>(null);
    const [compoundSeed, setCompoundSeed] = useState(0);
    const [compoundSubmittedAnswers, setCompoundSubmittedAnswers] = useState<OnboardingWizardAnswers | null>(null);
    const questions: OnboardingWizardQuestion[] = [
        {
            id: "display_name",
            type: "text",
            title: "How should we address you?",
            description: "This appears in your profile and progress surfaces.",
            placeholder: "Type your preferred name",
            minLength: 2,
        },
        {
            id: "native_language",
            type: "text",
            title: "What is your native language?",
            placeholder: "Example: Persian, Turkish, Arabic",
        },
        {
            id: "timezone",
            type: "select",
            title: "Which timezone should we use?",
            placeholder: "Select timezone",
            options: [
                { id: "UTC", label: "UTC" },
                { id: "America/New_York", label: "America/New_York" },
                { id: "Europe/London", label: "Europe/London" },
                { id: "Asia/Tehran", label: "Asia/Tehran" },
                { id: "Asia/Dubai", label: "Asia/Dubai" },
            ],
        },
        {
            id: "learning_goal",
            type: "single",
            title: "What is your primary goal?",
            options: [
                { id: "ielts", label: "IELTS", description: "Band-focused preparation." },
                { id: "conversation", label: "Conversation", description: "Daily speaking fluency." },
                { id: "travel", label: "Travel", description: "Practical travel communication." },
                { id: "business", label: "Business", description: "Professional communication." },
            ],
        },
        {
            id: "weekly_target_minutes",
            type: "range",
            title: "How many minutes per week can you commit?",
            min: 60,
            max: 420,
            step: 30,
            unit: "min/week",
            marks: [
                { value: 60, label: "60" },
                { value: 240, label: "240" },
                { value: 420, label: "420" },
            ],
            defaultValue: 240,
        },
    ];
    const compoundQuestions: OnboardingWizardQuestion[] = [
        {
            id: "target_focus",
            type: "single",
            title: "Which track should we prioritize first?",
            options: [
                { id: "reading", label: "Reading intensity" },
                { id: "vocab", label: "Vocabulary expansion" },
                { id: "grammar", label: "Grammar accuracy" },
            ],
        },
        {
            id: "study_preferences",
            type: "multiple",
            title: "Which practice styles work best for you?",
            minSelected: 1,
            maxSelected: 2,
            options: [
                { id: "quick-drills", label: "Quick drills", description: "10-minute focused sessions." },
                { id: "long-reads", label: "Long reading blocks", description: "Deep concentration practice." },
                { id: "flashcards", label: "Flashcards", description: "Spaced repetition vocabulary." },
            ],
        },
        {
            id: "daily_minutes",
            type: "range",
            title: "How many minutes can you study daily?",
            min: 10,
            max: 120,
            step: 5,
            unit: "min/day",
            defaultValue: 30,
        },
    ];

    return (
        <div className="w-full max-w-[980px] space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        setSubmissionSeed((prev) => prev + 1);
                        setSubmittedAnswers(null);
                    }}
                >
                    Reset wizard
                </Button>
                <p className="text-xs uppercase tracking-[0.18em] text-space-400">
                    Submission seed: {submissionSeed}
                </p>
            </div>

            <div className="rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Quick custom route links
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {onboardingWizardRoutePresets.map((preset) => (
                        <a
                            key={`quick-onboarding-route-${preset.path}`}
                            href={preset.path}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-celestialblue-200 bg-celestialblue-50 px-3 py-1 text-xs font-semibold text-celestialblue-700 transition hover:border-celestialblue-300 hover:bg-celestialblue-100"
                        >
                            <span className="material-symbols-rounded !text-[16px]">open_in_new</span>
                            {preset.path}
                        </a>
                    ))}
                </div>
            </div>

            <OnboardingWizard
                key={`onboarding-wizard-demo-${submissionSeed}`}
                questions={questions}
                onComplete={async (answers) => {
                    await new Promise((resolve) => setTimeout(resolve, 350));
                    setSubmittedAnswers(answers);
                }}
            />

            <div className="rounded-2xl border border-space-100 bg-space-10/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Submitted payload preview
                </p>
                <pre className="mt-2 overflow-auto rounded-xl bg-white p-3 text-xs text-space-700">
                    {JSON.stringify(submittedAnswers ?? {}, null, 2)}
                </pre>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                            Compound API demo
                        </p>
                        <p className="text-sm text-space-500">
                            Composable wizard layout using `OnboardingWizard` subcomponents.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                            setCompoundSeed((prev) => prev + 1);
                            setCompoundSubmittedAnswers(null);
                        }}
                    >
                        Reset compound demo
                    </Button>
                </div>

                <OnboardingWizard
                    key={`onboarding-wizard-compound-demo-${compoundSeed}`}
                    questions={compoundQuestions}
                    title="Adaptive study setup"
                    subtitle="Same engine, custom shell composition."
                    onComplete={async (answers) => {
                        await new Promise((resolve) => setTimeout(resolve, 350));
                        setCompoundSubmittedAnswers(answers);
                    }}
                >
                    <div className="space-y-4">
                        <OnboardingWizard.Header />
                        <OnboardingWizard.Progress />
                        <OnboardingWizard.Step>
                            <OnboardingWizard.Prompt />
                            <OnboardingWizard.AutoField />
                        </OnboardingWizard.Step>
                        <OnboardingWizard.Actions />
                    </div>
                </OnboardingWizard>

                <pre className="overflow-auto rounded-xl bg-white p-3 text-xs text-space-700">
                    {JSON.stringify(compoundSubmittedAnswers ?? {}, null, 2)}
                </pre>
            </div>
        </div>
    );
};

const onboardingWizardRoutePresets: WizardRoutePreset[] = [
    {
        path: "/wizard/ielts-jumpstart",
        title: "IELTS Jumpstart Wizard",
        subtitle: "Estimate your current band and set a realistic target plan.",
        questions: [
            {
                id: "current_band",
                type: "range",
                title: "What is your current IELTS band estimate?",
                min: 3,
                max: 9,
                step: 0.5,
                marks: [
                    { value: 3, label: "3.0" },
                    { value: 6, label: "6.0" },
                    { value: 9, label: "9.0" },
                ],
                defaultValue: 5.5,
            },
            {
                id: "target_band",
                type: "single",
                title: "What band do you need to reach?",
                options: [
                    { id: "6.0", label: "Band 6.0" },
                    { id: "6.5", label: "Band 6.5" },
                    { id: "7.0", label: "Band 7.0" },
                    { id: "7.5", label: "Band 7.5" },
                ],
            },
            {
                id: "weakest_skill",
                type: "single",
                title: "Which skill needs the most focus right now?",
                options: [
                    { id: "reading", label: "Reading" },
                    { id: "listening", label: "Listening" },
                    { id: "writing", label: "Writing" },
                    { id: "speaking", label: "Speaking" },
                ],
            },
            {
                id: "timeline_weeks",
                type: "range",
                title: "How many weeks until your target test date?",
                min: 4,
                max: 32,
                step: 2,
                unit: "weeks",
                defaultValue: 12,
            },
            {
                id: "study_slots",
                type: "multiple",
                title: "When can you usually study?",
                minSelected: 1,
                maxSelected: 2,
                options: [
                    { id: "early-morning", label: "Early morning" },
                    { id: "afternoon", label: "Afternoon" },
                    { id: "evening", label: "Evening" },
                    { id: "weekend", label: "Weekend blocks" },
                ],
            },
        ],
    },
    {
        path: "/wizard/career-english",
        title: "Career English Setup Wizard",
        subtitle: "Configure a role-focused English plan for work outcomes.",
        questions: [
            {
                id: "role_title",
                type: "text",
                title: "What is your current role?",
                placeholder: "Example: Product Manager",
                minLength: 2,
            },
            {
                id: "primary_use_cases",
                type: "multiple",
                title: "Where do you use English most at work?",
                minSelected: 1,
                maxSelected: 3,
                options: [
                    { id: "email", label: "Email and async updates" },
                    { id: "meetings", label: "Meetings and standups" },
                    { id: "presentations", label: "Presentations and demos" },
                    { id: "interviews", label: "Interviews and hiring" },
                    { id: "client-calls", label: "Client calls" },
                ],
            },
            {
                id: "confidence_level",
                type: "range",
                title: "How confident are you in professional conversations?",
                min: 1,
                max: 10,
                step: 1,
                defaultValue: 5,
            },
            {
                id: "timezone",
                type: "select",
                title: "Which timezone do you work in?",
                placeholder: "Select timezone",
                options: [
                    { id: "UTC", label: "UTC" },
                    { id: "Europe/London", label: "Europe/London" },
                    { id: "America/New_York", label: "America/New_York" },
                    { id: "Asia/Dubai", label: "Asia/Dubai" },
                    { id: "Asia/Tehran", label: "Asia/Tehran" },
                ],
            },
            {
                id: "weekly_minutes",
                type: "range",
                title: "How many minutes per week can you invest in practice?",
                min: 60,
                max: 600,
                step: 30,
                unit: "min/week",
                defaultValue: 180,
            },
        ],
    },
    {
        path: "/wizard/travel-ready",
        title: "Travel Ready Wizard",
        subtitle: "Build a practical travel-English plan for your upcoming trip.",
        questions: [
            {
                id: "destination_region",
                type: "select",
                title: "Where are you traveling next?",
                placeholder: "Select destination region",
                options: [
                    { id: "europe", label: "Europe" },
                    { id: "north-america", label: "North America" },
                    { id: "middle-east", label: "Middle East" },
                    { id: "southeast-asia", label: "Southeast Asia" },
                ],
            },
            {
                id: "trip_timeline",
                type: "single",
                title: "When is your next trip?",
                options: [
                    { id: "2-weeks", label: "Within 2 weeks" },
                    { id: "1-2-months", label: "In 1-2 months" },
                    { id: "3-plus-months", label: "3+ months from now" },
                ],
            },
            {
                id: "travel_scenarios",
                type: "multiple",
                title: "Which situations should we prioritize?",
                minSelected: 1,
                maxSelected: 3,
                options: [
                    { id: "airport", label: "Airport and boarding" },
                    { id: "hotel", label: "Hotel check-in/check-out" },
                    { id: "transport", label: "Local transport and directions" },
                    { id: "shopping", label: "Shopping and payments" },
                    { id: "emergency", label: "Emergency and medical help" },
                ],
            },
            {
                id: "travel_companion",
                type: "text",
                title: "Who are you traveling with?",
                placeholder: "Solo, family, colleagues...",
            },
            {
                id: "practice_minutes",
                type: "range",
                title: "How much weekly practice can you commit before travel?",
                min: 30,
                max: 420,
                step: 30,
                unit: "min/week",
                defaultValue: 120,
            },
        ],
    },
];

const OnboardingWizardRoutesDemo = () => (
    <div className="w-full max-w-[1080px] space-y-4">
        <div className="rounded-2xl border border-space-100 bg-space-10/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                Custom wizard routes
            </p>
            <p className="mt-1 text-sm text-space-500">
                Open these routes directly in the browser to preview focused onboarding flows.
            </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
            {onboardingWizardRoutePresets.map((preset) => (
                <article key={preset.path} className="rounded-2xl border border-space-100 bg-white p-4">
                    <a
                        href={preset.path}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-celestialblue-700 hover:underline"
                    >
                        <span className="material-symbols-rounded !text-[18px]">link</span>
                        {preset.path}
                    </a>
                    <h3 className="mt-2 text-lg font-semibold text-space-800">{preset.title}</h3>
                    <p className="mt-1 text-sm text-space-500">{preset.subtitle}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                        Questions
                    </p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-space-600">
                        {preset.questions.map((question) => (
                            <li key={`${preset.path}-${question.id}`}>{question.title}</li>
                        ))}
                    </ol>
                </article>
            ))}
        </div>
    </div>
);

const OnboardingWizardRoutePage = ({
    activeRoute,
}: {
    activeRoute: WizardRoutePreset;
}) => {
    const [submissionSeed, setSubmissionSeed] = useState(0);
    const [submittedAnswers, setSubmittedAnswers] = useState<OnboardingWizardAnswers | null>(null);

    return (
        <div className="min-h-screen bg-space-25 px-4 py-8 text-space-900">
            <div className="mx-auto w-full max-w-[1100px] space-y-6">
                <header className="rounded-3xl border border-space-100 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <a href="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400 hover:underline">
                                Back to component demos
                            </a>
                            <h1 className="mt-2 text-2xl font-semibold text-space-900">
                                {activeRoute.title}
                            </h1>
                            <p className="mt-1 text-sm text-space-500">{activeRoute.subtitle}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                setSubmissionSeed((prev) => prev + 1);
                                setSubmittedAnswers(null);
                            }}
                        >
                            Reset wizard
                        </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                        {onboardingWizardRoutePresets.map((preset) => (
                            <a
                                key={`route-link-${preset.path}`}
                                href={preset.path}
                                className={
                                    preset.path === activeRoute.path
                                        ? "rounded-full border px-3 py-1 font-semibold transition border-celestialblue-300 bg-celestialblue-50 text-celestialblue-700"
                                        : "rounded-full border px-3 py-1 font-semibold transition border-space-150 bg-space-50 text-space-500 hover:text-space-700"
                                }
                            >
                                {preset.path}
                            </a>
                        ))}
                    </div>
                </header>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="min-w-0 rounded-3xl border border-space-100 bg-white p-4">
                        <OnboardingWizard
                            key={`${activeRoute.path}-${submissionSeed}`}
                            questions={activeRoute.questions}
                            title={activeRoute.title}
                            subtitle={activeRoute.subtitle}
                            onComplete={async (answers) => {
                                await new Promise((resolve) => setTimeout(resolve, 300));
                                setSubmittedAnswers(answers);
                            }}
                        />
                    </div>

                    <aside className="space-y-3 rounded-3xl border border-space-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                            Route questions
                        </p>
                        <ol className="list-decimal space-y-2 pl-5 text-sm text-space-600">
                            {activeRoute.questions.map((question) => (
                                <li key={`${activeRoute.path}-q-${question.id}`}>{question.title}</li>
                            ))}
                        </ol>
                        <p className="pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                            Submitted payload
                        </p>
                        <pre className="max-h-[360px] overflow-auto rounded-xl border border-space-100 bg-space-10 p-3 text-xs text-space-700">
                            {JSON.stringify(submittedAnswers ?? {}, null, 2)}
                        </pre>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const VocabularyNavigatorStressDemo = ({ baseItems }: { baseItems: VocabularyNavigatorItem[] }) => {
    const MIN_EXAMPLE_COUNT = 1;
    const MAX_EXAMPLE_COUNT = 6;
    const fallbackItems: VocabularyNavigatorItem[] = [
        {
            word: "boarding pass",
            meaningEn: "a travel document that lets you board the plane",
            meaningFa: "کارت پرواز",
            examples: ["Please show your boarding pass at gate 12."],
            image: "https://placehold.co/720x480/png?text=Boarding+Pass",
        },
        {
            word: "customs",
            meaningEn: "airport checkpoint for baggage and declaration control",
            meaningFa: "گمرک",
            examples: ["We waited at customs after landing."],
            image: "https://placehold.co/720x480/png?text=Customs",
        },
        {
            word: "runway",
            meaningEn: "a long strip where aircraft take off and land",
            meaningFa: "باند فرودگاه",
            examples: ["The runway was wet after the storm."],
            image: "https://placehold.co/720x480/png?text=Runway",
        },
    ];
    const sourceItems = baseItems.length > 0 ? baseItems : fallbackItems;
    const [datasetIndex, setDatasetIndex] = useState(2);
    const [targetExampleCount, setTargetExampleCount] = useState(2);
    const [remountSeed, setRemountSeed] = useState(0);

    const fitExamples = (baseExamples: string[], word: string, itemIndex: number) => {
        const sanitized = baseExamples.length > 0 ? baseExamples : [`Sample example ${itemIndex + 1}.`];
        if (targetExampleCount <= sanitized.length) {
            return sanitized.slice(0, targetExampleCount);
        }
        const generated = Array.from({ length: targetExampleCount - sanitized.length }, (_, extraIndex) => {
            return `Extra ${extraIndex + 1}: ${word} used in context sentence ${extraIndex + 1}.`;
        });
        return [...sanitized, ...generated];
    };

    const normalizedSource = sourceItems.map((item, index) => ({
        word: item.word?.trim() || `Word ${index + 1}`,
        meaningEn: item.meaningEn?.trim() || "Sample definition",
        meaningFa: item.meaningFa?.trim() || "نمونه",
        examples: item.examples.length > 0 ? item.examples : [],
        image: item.image || `https://placehold.co/720x480/png?text=Vocab+${index + 1}`,
    }));

    const pick = (seedIndex: number) => normalizedSource[seedIndex % normalizedSource.length]!;
    const singleItems: VocabularyNavigatorItem[] = [
        {
            ...pick(0),
            word: `${pick(0).word} solo`,
            examples: fitExamples(pick(0).examples, `${pick(0).word} solo`, 0),
        },
    ];
    const pairItems: VocabularyNavigatorItem[] = Array.from({ length: 2 }, (_, index) => ({
        ...pick(index),
        word: `${pick(index).word} ${index + 1}`,
        examples: fitExamples(pick(index).examples, `${pick(index).word} ${index + 1}`, index),
    }));
    const standardCount = Math.min(4, Math.max(3, normalizedSource.length));
    const standardItems: VocabularyNavigatorItem[] = Array.from({ length: standardCount }, (_, index) => ({
        ...pick(index),
        word: `${pick(index).word} ${index + 1}`,
        examples: fitExamples(pick(index).examples, `${pick(index).word} ${index + 1}`, index),
    }));
    const stressItems: VocabularyNavigatorItem[] = Array.from({ length: 8 }, (_, index) => {
        const base = pick(index);
        const stressWord = `${base.word} ${index + 1}`;
        const stressExamples = fitExamples(
            [
                ...base.examples,
                `Stress sample ${index + 1}: verify swipe direction, image preview, and progress sync.`,
            ],
            stressWord,
            index,
        );

        return {
            ...base,
            word: stressWord,
            meaningEn:
                index === 7
                    ? `${base.meaningEn} with extended copy for overflow and swipe transition checks in constrained containers`
                    : base.meaningEn,
            examples: stressExamples,
        };
    });

    const datasets = [
        { id: "single", label: "Single", items: singleItems },
        { id: "pair", label: "Pair", items: pairItems },
        { id: "standard", label: "Standard", items: standardItems },
        { id: "stress", label: "Stress 8", items: stressItems },
    ] as const;

    const activeDataset = datasets[datasetIndex] ?? datasets[2];

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">Edge-state snapshots</p>
                <div className="grid gap-4">
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">
                            Single item (buttons should be disabled)
                        </p>
                        <div className="rounded-xl border border-space-100 bg-space-10/30 p-3">
                            <VocabularyNavigator vocabularyItems={singleItems} />
                        </div>
                    </div>
                    <div className="space-y-2 rounded-xl border border-space-100 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-space-400">
                            Pair dataset (quick boundary checks)
                        </p>
                        <div className="rounded-xl border border-space-100 bg-space-10/30 p-3">
                            <VocabularyNavigator vocabularyItems={pairItems} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setDatasetIndex((prev) => (prev + 1) % datasets.length)}
                    >
                        Cycle dataset
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            setTargetExampleCount((prev) => Math.min(MAX_EXAMPLE_COUNT, prev + 1))
                        }
                        disabled={targetExampleCount >= MAX_EXAMPLE_COUNT}
                    >
                        Add examples
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            setTargetExampleCount((prev) => Math.max(MIN_EXAMPLE_COUNT, prev - 1))
                        }
                        disabled={targetExampleCount <= MIN_EXAMPLE_COUNT}
                    >
                        Reduce examples
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRemountSeed((prev) => prev + 1)}
                    >
                        Remount
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: dataset={activeDataset.id}, items={activeDataset.items.length}, examples per card={targetExampleCount}
                </p>
                <p className="text-xs text-space-500">
                    Progress contract: `value` is active index + 1 (clamped) and `max` equals vocabulary item count.
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div className="w-full">
                        <VocabularyNavigator
                            key={`vocabulary-navigator-live-${activeDataset.id}-${remountSeed}`}
                            vocabularyItems={activeDataset.items}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
const XpProgressionChartStressDemo = () => {
    const widthOptions = [360, 520, 700, 920] as const;
    const shellVariants = ["default", "card"] as const;
    const createSeries = (values: number[]): XpPoint[] => {
        const today = new Date();
        return values.map((xp, index) => {
            const day = new Date(today);
            day.setDate(today.getDate() - (values.length - 1 - index));
            day.setHours(12, 0, 0, 0);
            return {
                date: day.toISOString(),
                xp,
            };
        });
    };

    const datasets = useMemo(
        () => [
            { id: "steady", label: "Steady climb", data: createSeries([360, 410, 455, 520, 575, 620, 690]) },
            { id: "volatile", label: "Volatile week", data: createSeries([420, 710, 500, 760, 540, 780, 640]) },
            { id: "recovery", label: "Dip & recovery", data: createSeries([690, 640, 590, 520, 560, 620, 740]) },
            { id: "flat", label: "Flat cadence", data: createSeries([510, 508, 512, 509, 511, 510, 513]) },
            { id: "short", label: "Short series", data: createSeries([440, 500, 560, 630]) },
            { id: "empty", label: "Empty", data: [] as XpPoint[] },
        ],
        [],
    );

    const [datasetIndex, setDatasetIndex] = useState(0);
    const [widthIndex, setWidthIndex] = useState(2);
    const [showSummary, setShowSummary] = useState(true);
    const [shellVariantIndex, setShellVariantIndex] = useState(0);
    const [remountSeed, setRemountSeed] = useState(0);

    const activeDataset = datasets[datasetIndex] ?? datasets[0];
    const width = widthOptions[widthIndex] ?? 700;
    const activeShellVariant = shellVariants[shellVariantIndex] ?? shellVariants[0];
    const summaryEnabled = activeShellVariant === "default" ? showSummary : false;

    return (
        <div className="w-full max-w-[1180px] space-y-8">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-space-400">UI states and visual variants</p>
                <div className="grid gap-4 xl:grid-cols-3">
                    <div className="rounded-xl border border-space-100 bg-space-10/40 p-3">
                        <XpProgressionChart
                            data={datasets[0]?.data}
                            className="max-w-none border-celestialblue-100/90"
                        />
                    </div>
                    <div className="rounded-xl border border-space-100 bg-space-10/40 p-3">
                        <XpProgressionChart
                            data={datasets[2]?.data}
                            shellVariant="card"
                            className="max-w-none"
                        />
                    </div>
                    <div className="rounded-xl border border-space-100 bg-space-10/40 p-3">
                        <XpProgressionChart
                            data={datasets[5]?.data}
                            shellVariant="card"
                            className="max-w-none"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-space-100 bg-space-10/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setDatasetIndex((prev) => (prev + 1) % datasets.length)}>
                        Cycle dataset
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setWidthIndex((prev) => (prev + 1) % widthOptions.length)}>
                        Cycle width
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setShellVariantIndex((prev) => (prev + 1) % shellVariants.length)}>
                        Shell: {activeShellVariant}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowSummary((prev) => !prev)}
                        disabled={activeShellVariant === "card"}
                    >
                        Summary: {showSummary ? "on" : "off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemountSeed((prev) => prev + 1)}>
                        Remount
                    </Button>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-space-400">
                    Live: dataset={activeDataset.id}, points={activeDataset.data.length}, shell={activeShellVariant}, width={width}px, summary={String(summaryEnabled)}
                </p>

                <div className="rounded-xl border border-space-100 bg-white p-3">
                    <div
                        className="mx-auto transition-all"
                        style={{
                            width: activeShellVariant === "default" ? `${width}px` : "100%",
                            maxWidth: "100%",
                        }}
                    >
                        <XpProgressionChart
                            key={`xp-progression-live-${activeDataset.id}-${activeShellVariant}-${summaryEnabled}-${remountSeed}`}
                            data={activeDataset.data}
                            shellVariant={activeShellVariant}
                            showSummary={summaryEnabled}
                            className="max-w-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
function App() {
    const currentPathname =
        typeof window !== "undefined" ? window.location.pathname : "/";
    const activeWizardRoute = onboardingWizardRoutePresets.find(
        (preset) => preset.path === currentPathname,
    );

    if (activeWizardRoute) {
        return <OnboardingWizardRoutePage activeRoute={activeWizardRoute} />;
    }

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
            meaningFa: "...",
            examples: ["Use sample data to preview layouts."],
            image: "https://placehold.co/400x260?text=Vocab",
        }];
    const vocabHighlight = vocabularyItems[0];
    const vocabSecondary = vocabularyItems[1];
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
    const grammarRule = "Use am/is/are + verb-ing for actions happening now.";

    const chapterLessons = [
        {id: "l1", title: "Lesson 1", progress: "completed" as const},
        {id: "l2", title: "Lesson 2", progress: "unlocked" as const},
        {id: "l3", title: "Lesson 3", progress: "locked" as const},
    ];

    const quizData = primaryLesson.quiz;
    const streakEntries = [
        {label: "Mon", points: 1},
        {label: "Tue", points: 2},
        {label: "Wed", points: 0},
        {label: "Thu", points: 1},
        {label: "Fri", points: 3},
        {label: "Sat", points: 2},
        {label: "Sun", points: 1, isToday: true},
    ];
    const streakTotal = streakEntries.reduce((sum, entry) => sum + entry.points, 0);
    const streakToday = streakEntries.find((entry) => entry.isToday)?.points ?? 0;
    const notificationItems: NotificationIslandItem[] = [
            {
                id: "note-system",
                type: "system-notice",
                title: "Battery low",
                message: "Enable saver to keep offline sessions.",
                severity: "danger",
                battery: {level: 12, isCharging: false},
                priority: 6,
                onCta: () => console.log("Enable battery saver"),
                onDismiss: () => console.log("Dismiss battery notice"),
            },
            {
                id: "note-lesson",
                type: "new-lesson",
                title: "New lesson drop",
            subtitle: "Airport check-in series",
            image: {
                src: primaryLesson.reading.image,
                alt: primaryLesson.reading.title,
                },
                lessonCount: 3,
                priority: 5,
                onCta: () => console.log("Start lesson"),
                onDismiss: () => console.log("Dismiss lesson notice"),
            },
            {
                id: "note-goal",
                type: "daily-goal",
                progress: 3,
                target: 5,
                unit: "tasks",
                priority: 4,
                onCta: () => console.log("Continue goal"),
                onDismiss: () => console.log("Dismiss goal notice"),
            },
            {
                id: "note-mission",
                type: "mission",
                title: "Grammar sprint",
                progress: 2,
                total: 5,
                tag: "Daily mission",
                priority: 3,
                onCta: () => console.log("Resume mission"),
                onDismiss: () => console.log("Dismiss mission notice"),
            },
            {
                id: "note-achievement",
                type: "achievement",
                title: "XP streak unlocked",
                subtitle: "Keep the momentum",
                reward: "Bronze badge",
                xp: 120,
                streak: 7,
                priority: 2,
                onCta: () => console.log("Share achievement"),
                onDismiss: () => console.log("Dismiss achievement notice"),
            },
            {
                id: "note-billing",
                type: "billing-plan",
                planName: "Core Plan",
                renewalDate: "Renews Apr 12",
                status: "expiring",
                priceLabel: "$12/mo",
                priority: 1,
                onCta: () => console.log("Manage plan"),
                onDismiss: () => console.log("Dismiss billing notice"),
            },
        ];
    const demoSections: DemoSection[] = [
        {
            id: "badge",
            label: "Badge",
            preview: <BadgeDemo />,
        },
        {
            id: "streak-button",
            label: "StreakButton",
            preview: (
                <div className="flex flex-wrap items-start gap-4">
                    <StreakButton
                        totalPoints={streakTotal}
                        todayPoints={streakToday}
                        entries={streakEntries}
                    />
                    <StreakButton
                        totalPoints={streakTotal}
                        todayPoints={streakToday}
                        entries={streakEntries}
                        defaultOpen
                    />
                </div>
            ),
        },
        {
            id: "streak-card",
            label: "StreakCard",
            preview: (
                <div className="grid gap-4 md:grid-cols-2">
                    <StreakCard
                        totalPoints={streakTotal}
                        todayPoints={streakToday}
                        entries={streakEntries}
                        onCtaClick={() => console.log("View streak")}
                    />
                    <StreakCard
                        entries={[]}
                        totalPoints={0}
                        todayPoints={0}
                        subtitle="No activity yet"
                        ctaLabel="Start streak"
                    />
                </div>
            ),
        },
        {
            id: "vocabulary-of-day",
            label: "VocabularyOfDay",
            preview: (
                <div className="grid gap-4 md:grid-cols-2">
                    <VocabularyOfDay
                        word={vocabHighlight.word}
                        meaning={vocabHighlight.meaningEn}
                        partOfSpeech="noun"
                        examples={vocabHighlight.examples.slice(0, 2).map((text) => ({text}))}
                        images={[
                            {src: vocabHighlight.image, alt: vocabHighlight.word, label: "Main"},
                            ...(vocabSecondary
                                ? [{src: vocabSecondary.image, alt: vocabSecondary.word, label: "Bonus"}]
                                : []),
                        ]}
                    />
                    <VocabularyOfDay
                        word="itinerary"
                        meaning="a plan for a trip with dates and places"
                        partOfSpeech="noun"
                        examples={[{text: "She shared her itinerary before the flight."}]}
                        images={[{src: vocabHighlight.image, alt: "itinerary"}]}
                        badgeLabel="New"
                        subtitle="Travel essential"
                    />
                </div>
            ),
        },
        {
            id: "coming-soon-card",
            label: "ComingSoonCard",
            preview: (
                <div className="grid gap-4 md:grid-cols-2">
                    <ComingSoonCard
                        title="Mystery Mode"
                        description="A fresh way to explore lessons with hidden twists and luminous hints."
                        etaLabel="Spring 2026"
                        highlights={[
                            "Daily riddles that unlock bonus XP.",
                            "Secret checkpoints for faster review.",
                            "Surprise visuals woven into your streak.",
                        ]}
                    />
                    <ComingSoonCard
                        title="Orbit Sessions"
                        badgeLabel="In the lab"
                        label="Next drop"
                        etaLabel="Soon"
                        description="Short sessions for rapid recall, tuned to your momentum."
                        highlights={["Zero prep, instant focus.", "Smart pacing, no pressure."]}
                        icon="graphic_eq"
                    />
                </div>
            ),
        },
        {
            id: "milestone-tracker-card",
            label: "MilestoneTrackerCard",
            preview: (
                <div className="grid gap-4 md:grid-cols-2">
                    <MilestoneTrackerCard
                        currentLevel={5.5}
                        targetLevel={7.0}
                        progress={62}
                    />
                    <MilestoneTrackerCard
                        currentLevel={6.0}
                        targetLevel={6.5}
                        label="IELTS goal"
                        subtitle="Updated after lessons"
                        badgeLabel="In progress"
                    />
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
            id: "breadcrumb",
            label: "Breadcrumb",
            preview: (
                <Breadcrumb
                    items={[
                        {title: "Roadmap A2", href: "#"},
                        {title: "Airport", href: "#"},
                        {title: "Vocabulary", href: "#"},
                    ]}
                />
            ),
        },
        {
            id: "button",
            label: "Button",
            preview: <ButtonDemo />,
        },
        {
            id: "input",
            label: "Input",
            preview: <InputDemo />,
        },
        {
            id: "checkbox",
            label: "Checkbox",
            preview: (
                <div className="w-full max-w-2xl space-y-6">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Checkbox
                                label="Default"
                                description="Standard inline choice."
                            />
                            <Checkbox
                                label="Card"
                                description="Elevated option style."
                                variant="card"
                            />
                            <Checkbox
                                label="Ghost"
                                description="Low emphasis until hover."
                                variant="ghost"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">States</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Checkbox
                                label="Checked"
                                description="Ready to go."
                                defaultChecked
                            />
                            <Checkbox
                                label="Indeterminate"
                                description="Some items selected."
                                indeterminate
                                tone="info"
                            />
                            <Checkbox
                                label="Helper text"
                                description="Optional notification."
                                helperText="Shown under the option."
                            />
                            <Checkbox
                                label="Error state"
                                description="Needs attention."
                                errorText="Selection required."
                            />
                            <Checkbox
                                label="Disabled"
                                description="Unavailable right now."
                                disabled
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <Checkbox
                                size="sm"
                                label="Small"
                                description="Compact label."
                            />
                            <Checkbox
                                size="md"
                                label="Medium"
                                description="Default size."
                            />
                            <Checkbox
                                size="lg"
                                label="Large"
                                description="More breathing room."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tones</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Checkbox
                                tone="info"
                                label="Info"
                                description="Informational choice."
                                defaultChecked
                            />
                            <Checkbox
                                tone="success"
                                label="Success"
                                description="On track."
                                defaultChecked
                            />
                            <Checkbox
                                tone="warning"
                                label="Warning"
                                description="Heads up."
                            />
                            <Checkbox
                                tone="danger"
                                label="Danger"
                                description="Risky option."
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "radio",
            label: "Radio",
            preview: (
                <div className="w-full max-w-2xl space-y-6">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Variants</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Radio
                                name="radio-variants"
                                label="Default"
                                description="Standard choice."
                                defaultChecked
                            />
                            <Radio
                                name="radio-variants"
                                label="Card"
                                description="Separated selection."
                                variant="card"
                            />
                            <Radio
                                name="radio-variants"
                                label="Ghost"
                                description="Subtle until hover."
                                variant="ghost"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Sizes</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <Radio
                                name="radio-sizes"
                                size="sm"
                                label="Small"
                                description="Compact."
                                defaultChecked
                            />
                            <Radio
                                name="radio-sizes"
                                size="md"
                                label="Medium"
                                description="Default."
                            />
                            <Radio
                                name="radio-sizes"
                                size="lg"
                                label="Large"
                                description="Roomy."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">Tones</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Radio
                                name="radio-tones"
                                tone="info"
                                label="Info"
                                description="Guided plan."
                                defaultChecked
                            />
                            <Radio
                                name="radio-tones"
                                tone="success"
                                label="Success"
                                description="Strong option."
                            />
                            <Radio
                                name="radio-tones"
                                tone="warning"
                                label="Warning"
                                description="Needs attention."
                            />
                            <Radio
                                name="radio-tones"
                                tone="danger"
                                label="Danger"
                                description="High risk."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-space-400">States</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Radio
                                name="radio-states"
                                label="Helper text"
                                description="Optional guidance."
                                helperText="Shown under the option."
                                defaultChecked
                            />
                            <Radio
                                name="radio-states"
                                label="Error"
                                description="Requires attention."
                                errorText="Choose one option."
                            />
                            <Radio
                                name="radio-states"
                                label="Disabled"
                                description="Unavailable."
                                disabled
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "toggle",
            label: "Toggle",
            preview: <ToggleDemo />,
        },
        {
            id: "input-group",
            label: "InputGroup",
            preview: (
                <div className="w-full max-w-2xl space-y-6">
                    <InputGroup
                        label="Account details"
                        description="Personalize how your profile appears."
                        helperText="We use this to prefill certificates."
                    >
                        <Input
                            label="Full name"
                            placeholder="Lena Kael"
                            leadingIcon={<span className="material-symbols-rounded">person</span>}
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Input label="Timezone" placeholder="UTC+1" />
                            <Input label="Language" placeholder="English" />
                        </div>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="lena@lunara.io"
                            trailingIcon={<span className="material-symbols-rounded">mail</span>}
                        />
                    </InputGroup>
                    <InputGroup
                        label="Billing"
                        description="Primary payment contact."
                        tone="info"
                        variant="outline"
                        layout="grid"
                        columns={2}
                        headerSlot={(
                            <span className="rounded-full border border-space-100 bg-space-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-space-500">
                                Optional
                            </span>
                        )}
                    >
                        <Input label="Company" placeholder="Orbital Raley-9" />
                        <Input label="VAT" placeholder="EU123456789" />
                        <Input label="Invoice email" type="email" placeholder="billing@lunara.io" />
                        <Input label="Cost center" prefix="CC" placeholder="3104" />
                    </InputGroup>
                    <InputGroup
                        label="Preferences"
                        description="Choose the style of guidance."
                        variant="subtle"
                        layout="horizontal"
                    >
                        <div className="min-w-[220px]">
                            <Checkbox label="Daily tips" description="Quick coaching notes." defaultChecked />
                        </div>
                        <div className="min-w-[220px]">
                            <Toggle label="Auto reminders" description="Nudges before sessions." defaultChecked />
                        </div>
                        <div className="min-w-[220px]">
                            <Radio name="input-group-style" label="Focus mode" description="Single focus track." />
                        </div>
                    </InputGroup>
                    <InputGroup
                        label="Validation"
                        description="Show group-level feedback."
                        errorText="Please resolve the highlighted fields."
                    >
                        <Input
                            label="Username"
                            placeholder="lena.kael"
                            errorText="Username already in use."
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                        />
                    </InputGroup>
                </div>
            ),
        },
        {
            id: "radio-group",
            label: "RadioGroup",
            preview: (
                <div className="w-full max-w-2xl space-y-6">
                    <RadioGroup
                        label="Session length"
                        description="Choose how long a typical lesson should be."
                        helperText="You can adjust this later."
                        options={[
                            {
                                value: "short",
                                label: "15 minutes",
                                description: "Bite-sized daily momentum.",
                            },
                            {
                                value: "standard",
                                label: "25 minutes",
                                description: "Balanced focus with review time.",
                            },
                            {
                                value: "deep",
                                label: "45 minutes",
                                description: "Deep work with extended practice.",
                            },
                        ]}
                        defaultValue="standard"
                        layout="grid"
                        columns={2}
                        itemVariant="card"
                    />
                    <RadioGroup
                        label="Learning pace"
                        description="Pick a focus intensity."
                        variant="outline"
                        tone="info"
                        layout="horizontal"
                        helperText="Recommended: steady pace."
                    >
                        <Radio
                            name="pace"
                            label="Steady"
                            description="Balanced workload."
                            defaultChecked
                        />
                        <Radio
                            name="pace"
                            label="Ambitious"
                            description="Faster progression."
                        />
                        <Radio
                            name="pace"
                            label="Light"
                            description="Low pressure."
                        />
                    </RadioGroup>
                    <RadioGroup
                        label="Placement review"
                        description="Choose the next step."
                        errorText="Select a placement."
                        options={[
                            { value: "skip", label: "Skip for now", description: "Decide later." },
                            { value: "take", label: "Take placement", description: "Recommended." },
                        ]}
                        defaultValue="take"
                        layout="vertical"
                    />
                </div>
            ),
        },
        {
            id: "toggle-group",
            label: "ToggleGroup",
            preview: <ToggleGroupDemo />,
        },
        {
            id: "tabs",
            label: "Tabs",
            preview: <TabsDemo />,
        },
        {
            id: "card",
            label: "Card",
            preview: <CardStressDemo />,
        },
        {
            id: "challenge-toast",
            label: "ChallengeToast",
            preview: <ChallengeToastStressDemo />,
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
            preview: <DashboardCardStressDemo />,
        },
        {
            id: "dashboard-message",
            label: "DashboardMessage",
            preview: <DashboardMessageStressDemo />,
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
            id: "tooltip",
            label: "Tooltip",
            preview: <TooltipStressDemo />,
        },
        {
            id: "mermaid-diagram",
            label: "MermaidDiagram",
            preview: <MermaidDiagramStressDemo />,
        },
        {
            id: "info-buttons",
            label: "InfoButtons",
            preview: <InfoButtonsStressDemo />,
        },
        {
            id: "roadmap-card-skeleton",
            label: "RoadmapCardSkeleton",
            preview: (
                <div>
                    <RoadmapCardSkeleton />
                </div>
            )
        },
        {
            id: "band-indicator",
            label: "BandIndicator",
            preview: (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <BandIndicator band={4.5} />
                        <BandIndicator band={5.5} />
                        <BandIndicator band={7.5} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <BandIndicator band={6.0} prefix="Band" />
                        <BandIndicator
                            band={8.5}
                            prefix="IELTS"
                            ariaLabel="IELTS band 8.5 for demo"
                        />
                        <BandIndicator band={-1} />
                        <BandIndicator band={10} />
                    </div>
                </div>
            ),
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
            preview: <ProgressDemo />,
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
                <QuizAnimatedStressDemo baseData={quizData} />
            ),
        },
        {
            id: "onboarding-wizard",
            label: "OnboardingWizard",
            preview: <OnboardingWizardDemo />,
        },
        {
            id: "onboarding-wizard-routes",
            label: "OnboardingWizard Routes",
            preview: <OnboardingWizardRoutesDemo />,
        },
        {
            id: "quiz-card",
            label: "QuizCard",
            preview: <QuizCardStressDemo />,
        },
        {
            id: "section-status",
            label: "SectionStatus",
            preview: (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-6">
                        <SectionStatus status="success" title="Vocabulary" variant="desktop" />
                        <SectionStatus status="failed" title="Grammar" variant="desktop" />
                        <SectionStatus status="neutral" title="Review" variant="desktop" />
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <SectionStatus status="success" title="Vocabulary" variant="mobile" />
                        <SectionStatus status="failed" title="Grammar" variant="mobile" />
                        <SectionStatus status="neutral" title="Review" variant="mobile" />
                    </div>
                </div>
            ),
        },
        {
            id: "quiz-completion",
            label: "QuizCompletion",
            preview: (
                <QuizCompletion
                    message="Great job! Keep the streak going."
                    result={{xp: 25, time: "05:23", grade: "A"}}
                    status="success"
                    actionLabel="Continue"
                />
            ),
        },
        {
            id: "reading-card",
            label: "ReadingCard",
            preview: <ReadingCardStressDemo baseReading={primaryLesson.reading} />,
        },
        {
            id: "reading-point",
            label: "ReadingPoint",
            preview: <ReadingPointStressDemo basePoints={readingPoints} />,
        },
        {
            id: "grammar-card",
            label: "GrammarCard",
            preview: (
                <div className="w-full max-w-[1180px] space-y-4">
                    <div className="grid gap-4 xl:grid-cols-2">
                        <GrammarCard
                            title={`${primaryLesson.grammar.title} (slot prop)`}
                            rule={grammarRule}
                            examples={primaryLesson.grammar.examples}
                            topSlot={(
                                <MermaidDiagram
                                    syntax={`flowchart LR
S[Subject] --> V[Verb] --> O[Object]
S --> ExS[I / She / They]
V --> ExV[work / works]
O --> ExO[every day]`}
                                    theme="neutral"
                                    minHeight={120}
                                />
                            )}
                            renderImage={(className) => (
                                <img
                                    src={primaryLesson.grammar.explanationImg}
                                    alt={`${primaryLesson.grammar.title} illustration`}
                                    className={className}
                                />
                            )}
                        />

                        <GrammarCard
                            title={`${primaryLesson.grammar.title} (children slot)`}
                            rule="Use do/does for simple present questions, then keep the main verb in base form."
                            examples={[
                                "Do they study every evening?",
                                "Does she work on weekends?",
                                "Do I need an article here?",
                            ]}
                        >
                            <MermaidDiagram
                                syntax={`flowchart TD
Q[Simple present question] --> Aux{he / she / it?}
Aux -- yes --> Does[Use does]
Aux -- no --> Do[Use do]
Does --> Base[Base verb]
Do --> Base`}
                                theme="forest"
                                minHeight={120}
                            />
                        </GrammarCard>
                    </div>
                </div>
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
            preview: <SubtitleStressDemo />,
        },
        {
            id: "swipe-deck",
            label: "SwipeDeck",
            preview: <SwipeDeckDemo items={deckItems}/>,
        },
        {
            id: "tips-card",
            label: "TipCard",
            preview: <TipCardStressDemo baseTips={tipItems} />,
        },
        {
            id: "notification-island",
            label: "NotificationIsland",
            preview: (
                <div className="grid gap-4 md:grid-cols-2">
                    <NotificationIsland items={notificationItems} />
                    <NotificationIsland
                        items={notificationItems}
                        displayMode="queue"
                        renderQueueDismiss={() => null}
                        emptyState={(
                            <NotificationPillEmpty className="border-space-150" />
                        )}
                    />
                    <NotificationIsland
                        emptyState={(
                            <NotificationPillEmpty className="border-space-150" />
                        )}
                    />
                </div>
            ),
        },
        {
            id: "notification-pill",
            label: "NotificationPill",
            preview: (
                <div className="flex flex-wrap items-center gap-4">
                    <NotificationPill
                        label="Lesson update"
                        subtitle="New mission unlocks today"
                        onDismiss={() => console.log("Dismiss pill")}
                        className="border-celestialblue-150 bg-celestialblue-50/80 text-celestialblue-700"
                    />
                    <NotificationPill
                        label="Daily goal"
                        subtitle={(
                            <span>
                                3/5 tasks آ· <span className="text-emerald-600">On track</span>
                            </span>
                        )}
                        onDismiss={() => console.log("Dismiss pill")}
                        className="border-emerald-150 bg-emerald-50/80 text-emerald-700"
                    />
                </div>
            ),
        },
        {
            id: "lunara-logo",
            label: "LunaraLogo",
            preview: (
                <div className="flex flex-wrap items-center gap-4">
                    <LunaraLogo />
                    <LunaraLogo
                        title="Lunara Labs"
                        logo={<div className="h-10 w-10 rounded-2xl bg-celestialblue-100" />}
                    />
                </div>
            ),
        },
        {
            id: "menu-panel",
            label: "MenuPanel",
            preview: <MenuPanelDemo />,
        },
        {
            id: "top-bar",
            label: "TopBar",
            preview: (
                <TopBar>
                    <TopBar.Left>
                        <LunaraLogo title="Lunara" />
                    </TopBar.Left>
                    <TopBar.Center>
                        <NotificationIsland
                            items={notificationItems}
                            displayMode="queue"
                            maxVisible={3}
                        />
                    </TopBar.Center>
                    <TopBar.Right>
                        <StreakButton onClick={() => console.log("Streaks")} />
                        <MenuPanel>
                            <MenuPanel.Trigger asChild>
                                <button
                                    type="button"
                                    className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-space-150 bg-space-100 text-space-800"
                                    aria-label="Open profile menu"
                                >
                                    <span className="material-symbols-rounded !text-[36px] !font-normal">
                                        account_circle
                                    </span>
                                </button>
                            </MenuPanel.Trigger>
                            <MenuPanel.Content
                                align="end"
                                className="min-w-[260px] rounded-2xl border border-space-100 bg-white p-2 shadow-[0_20px_40px_-24px_rgba(9,16,37,0.45)]"
                            >
                                <MenuPanel.Label className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-space-400">
                                    TopBar Profile
                                </MenuPanel.Label>
                                <MenuPanel.Separator className="my-1 h-px bg-space-100" />
                                <MenuPanel.Item
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-space-700 hover:bg-space-50"
                                    onSelect={() => console.log("View profile")}
                                >
                                    <span className="material-symbols-rounded !text-[18px]">person</span>
                                    View profile
                                </MenuPanel.Item>
                                <MenuPanel.Item
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-space-700 hover:bg-space-50"
                                    onSelect={() => console.log("Continue roadmap")}
                                >
                                    <span className="material-symbols-rounded !text-[18px]">route</span>
                                    Continue roadmap
                                </MenuPanel.Item>
                            </MenuPanel.Content>
                        </MenuPanel>
                    </TopBar.Right>
                    <TopBar.MobileCenter>
                        <NotificationIsland
                            items={notificationItems}
                            displayMode="queue"
                            maxVisible={3}
                        />
                    </TopBar.MobileCenter>
                </TopBar>
            ),
        },
        {
            id: "title",
            label: "Title",
            preview: <TitleStressDemo />,
        },
        {
            id: "vocabulary-card",
            label: "VocabularyCard",
            preview: (
                <VocabularyCard
                    imageSrc={vocabularyItems[0]?.image ?? "https://placehold.co/400"}
                    faText={vocabularyItems[0]?.meaningFa ?? "Sample translation"}
                    enWord={vocabularyItems[0]?.word ?? "passport"}
                    definition={vocabularyItems[0]?.meaningEn ?? "ID document for travel"}
                    examples={vocabularyItems[0]?.examples ?? ["He forgot his passport.", "Show it at the gate."]}
                />
            ),
        },
        {
            id: "vocabulary-navigator",
            label: "VocabularyNavigator",
            preview: <VocabularyNavigatorStressDemo baseItems={vocabularyItems} />,
        },
        {
            id: "xp-progression-chart",
            label: "XpProgressionChart",
            preview: <XpProgressionChartStressDemo />,
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
    const alwaysVisibleSectionId = "breadcrumb";
    const disabledSectionIds = new Set([
        "chapter-card",
        "empty-section",
        "lesson-indicator",
        "quiz",
        "roadmap",
        "section-indicator-skeleton",
        "section-tracker",
        "success-animation",
    ]);
    const defaultEnabledSections = new Set([alwaysVisibleSectionId]);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [menuSearchQuery, setMenuSearchQuery] = useState("");
    const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(
        () => Object.fromEntries(allSectionIds.map((id) => [id, defaultEnabledSections.has(id)])),
    );
    const normalizedMenuSearchQuery = menuSearchQuery.trim().toLowerCase();
    const filteredMenuSections = useMemo(() => {
        if (!normalizedMenuSearchQuery) {
            return demoSections;
        }
        return demoSections.filter((section) =>
            matchesDemoSectionQuery(section, normalizedMenuSearchQuery)
        );
    }, [demoSections, normalizedMenuSearchQuery]);
    const searchSuggestions = useMemo(
        () => (normalizedMenuSearchQuery ? filteredMenuSections.slice(0, 6) : []),
        [filteredMenuSections, normalizedMenuSearchQuery]
    );

    const handleToggleSection = (sectionId: string) => {
        if (sectionId === alwaysVisibleSectionId) {
            return;
        }
        setEnabledSections((prev) => ({
            ...prev,
            [sectionId]: !(prev[sectionId] ?? true),
        }));
    };

    const handleSelectAll = () => {
        setEnabledSections(Object.fromEntries(allSectionIds.map((id) => [id, true])));
    };

    const handleSelectNone = () => {
        setEnabledSections(
            Object.fromEntries(allSectionIds.map((id) => [id, id === alwaysVisibleSectionId])),
        );
    };
    const handleJumpToSection = (sectionId: string) => {
        setEnabledSections((prev) => ({
            ...prev,
            [sectionId]: true,
        }));
        setMenuSearchQuery("");

        window.setTimeout(() => {
            const target = document.getElementById(sectionId);
            if (!target) {
                return;
            }

            target.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `#${sectionId}`);
        }, 0);
    };

    const visibleSections = demoSections.filter((section) => enabledSections[section.id] ?? true);
    const totalSections = demoSections.length;
    const enabledCount = visibleSections.length;
    const isAllSelected = enabledCount === totalSections;
    const isNoneSelected = enabledCount === 0;

    return (
        <div className="min-h-screen bg-space-25 text-space-900">
            <button
                type="button"
                aria-label="Toggle component menu"
                aria-controls="component-menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-space-100 bg-white text-space-600 shadow-sm transition hover:text-space-900"
            >
                <span className="material-symbols-rounded !text-xl">
                    {isMenuOpen ? "menu_open" : "menu"}
                </span>
            </button>

            <nav
                id="component-menu"
                aria-hidden={!isMenuOpen}
                className={[
                    "fixed left-0 top-0 z-40 flex h-screen w-72 max-w-[90vw] flex-col gap-4 overflow-y-auto border-r border-space-100 bg-white p-6 shadow-lg transition-[transform,opacity] duration-300",
                    isMenuOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-full opacity-0 pointer-events-none",
                ].join(" ")}
            >
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
                    <div className="space-y-2">
                        <label
                            htmlFor="component-search"
                            className="text-xs font-semibold uppercase tracking-[0.18em] text-space-400"
                        >
                            Quick Search
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-space-400">
                                <span className="material-symbols-rounded !text-[18px]">search</span>
                            </span>
                            <input
                                id="component-search"
                                value={menuSearchQuery}
                                onChange={(event) => setMenuSearchQuery(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key !== "Enter" || !searchSuggestions[0]) {
                                        return;
                                    }
                                    event.preventDefault();
                                    handleJumpToSection(searchSuggestions[0].id);
                                }}
                                placeholder="Type a component name..."
                                className="h-10 w-full rounded-xl border border-space-150 bg-white pl-10 pr-3 text-sm text-space-700 outline-none transition focus:border-celestialblue-300 focus:ring-2 focus:ring-celestialblue-100"
                            />
                        </div>
                        {normalizedMenuSearchQuery ? (
                            <div className="rounded-xl border border-space-100 bg-space-10/60 p-1">
                                {searchSuggestions.length ? (
                                    searchSuggestions.map((section) => (
                                        <button
                                            key={`suggestion-${section.id}`}
                                            type="button"
                                            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs text-space-600 transition hover:bg-space-50 hover:text-space-900"
                                            onClick={() => handleJumpToSection(section.id)}
                                        >
                                            <span className="font-medium">{section.label}</span>
                                            <span className="text-[11px] uppercase tracking-[0.15em] text-space-400">
                                                {section.id}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="px-2 py-1 text-xs text-space-500">
                                        No matching components.
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
                <ul className="flex flex-col gap-1 text-sm">
                    {filteredMenuSections.map((section) => {
                        const isAlwaysOn = section.id === alwaysVisibleSectionId;
                        const isDisabled = disabledSectionIds.has(section.id);
                        const isChecked = isAlwaysOn ? true : enabledSections[section.id] ?? true;
                        return (
                        <li key={section.id}>
                            <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-space-50">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer accent-celestialblue-500"
                                    checked={isChecked}
                                    onChange={() => handleToggleSection(section.id)}
                                    disabled={isAlwaysOn || isDisabled}
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
                    {normalizedMenuSearchQuery && filteredMenuSections.length === 0 ? (
                        <li className="rounded-lg border border-dashed border-space-100 px-3 py-2 text-xs text-space-500">
                            No sections found for "{menuSearchQuery}".
                        </li>
                    ) : null}
                </ul>
            </nav>

            <main className="min-h-screen overflow-y-auto">
                <div className="space-y-16">
                    {visibleSections.length > 0 ? (
                        visibleSections.map((section) => (
                            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                                <header>
                                    <h2 className="text-lg md:text-2xl font-semibold text-space-300 text-center">{section.label}</h2>
                                    {section.description && (
                                        <p className="text-sm text-space-500">{section.description}</p>
                                    )}
                                </header>
                                <div className="border border-dashed border-space-50 bg-white p-4 shadow-sm justify-center items-center flex">
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
    );
}

export default App;







