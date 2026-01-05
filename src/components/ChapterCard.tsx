import React from "react";
import {SectionStatus} from "@/components/QuizCard";
import Progress from "@/components/Progress";

export type LessonProgress = "locked" | "unlocked" | "completed";

export interface LessonItem {
    id: string;
    title: string;
    progress: LessonProgress;
}

export interface ChapterCardProps {
    id: string;
    title: string;
    coverImageUrl?: string;
    lessons: LessonItem[];
    onLessonClick: (lessonId: string) => void;
}

export function ChapterCard({
                                title,
                                coverImageUrl = "https://yavuzceliker.github.io/sample-images/image-224.jpg",
                                lessons,
                                onLessonClick,
                            }: ChapterCardProps) {
    return (
        <section className="flex flex-col w-[400px] rounded-2xl overflow-hidden bg-space-10 border border-space-200 items-center justify-center">
            {/* Cover */}
            <div
                className="w-full h-40 flex items-center justify-center text-white font-semibold text-xl"
                style={{
                    backgroundImage: coverImageUrl
                        ? `url(${coverImageUrl})`
                        : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {title}
            </div>

            {/* Lessons */}
            <div className={"p-3 w-full "}>
                <div className="p-4 space-y-3 bg-space-100 rounded-[38px]">
                    {lessons.map((lesson) => (
                        <button
                            key={lesson.id}
                            disabled={lesson.progress === "locked"}
                            onClick={() => onLessonClick(lesson.id)}
                            className={`
                                  w-full flex items-center justify-between rounded-full px-4 py-3
                                  transition
                                    ${
                                        lesson.progress === "locked"
                                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                                        : "bg-space-50 hover:bg-celestialblue-10 border border-space-150 hover:border-celestialblue-400 text-space-400 hover:text-space-600 cursor-pointer"
                                    }
                                `}
                        >
                            <span>{lesson.title}</span>

                            <SectionStatus status={"neutral"} variant={"mobile"}/>
                        </button>
                    ))}
                </div>
            </div>
            <Progress value={1} size={"lg"} tone={"space"} max={2} orientation={"horizontal"} dotted/>
        </section>
    );
}
