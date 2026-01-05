'use client'

import * as React from "react";
import Card from "./Card";

export type RoadmapCardProps = {
    title: string;
    description: string;

    /** 0–10 */
    rating: number;

    /** 0–100 — undefined means locked */
    progress?: number;

    imageSrc?: string;
    imageAlt?: string;

    onNavigate: () => void;

    /** Optional display-only level label */
    levelLabel?: string;
};

export default function RoadmapCard({
                                title,
                                description,
                                rating,
                                progress,
                                imageSrc,
                                imageAlt = "",
                                onNavigate,
                                levelLabel,
                            }: RoadmapCardProps) {
    const isLocked = progress === undefined;

    return (
        <Card
            tone={"default"}
            rounded={"3xl"}
            padding={"sm"}
            align={"left"}
            hoverable
            elevation={"none"}
            className="overflow-hidden font-iransans"
            aria-label={title}
        >
            <div className="flex flex-col md:flex-row w-full">
                {imageSrc && (
                    <div className="w-[300px] h-[250px] aspect-auto">
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="w-full h-full object-cover rounded-[10px]"
                        />
                    </div>
                )}

                <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                    {levelLabel && (
                        <span className="text-sm opacity-70">
                             {levelLabel}
                        </span>
                    )}

                    <div className={"flex flex-col gap-3"}>
                        <div className={"flex flex-row justify-between"}>
                            <h3 className="text-xl md:text-[36px] font-extrabold" dir={"ltr"}>
                                {title}
                            </h3>

                            {/* Progress (hidden if locked) */}
                            {!isLocked && (
                                <div className="flex flex-col-reverse gap-2 w-14 items-start">
                                    <div className="text-[12px]">
                                        {progress}٪
                                    </div>

                                    <div className="h-1 w-full bg-gray-200 rounded">
                                        <div
                                            className="h-full bg-green-600 rounded"
                                            style={{width: `${progress}%`}}
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        <p className="text-[12px] md:text-sm leading-relaxed w-full" dir={"ltr"}>
                            {description}
                        </p></div>

                    {/* Footer */}
                    <div className="flex flex-row-reverse items-center justify-between mt-2">
                        <button
                            type="button"
                            onClick={onNavigate}
                            disabled={isLocked}
                            className="flex justify-center items-center align-middle text-center text-base text-celestialblue-500 font-medium p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:pointer-events-none hover:bg-space-50"
                        >
                            Continue
                        </button>

                        <span className="px-3 py-1 border border-space-150 text-celestialblue-700/50 [&>*:last-child]:text-celestialblue-600 rounded-sm bg-space-10 font-medium text-[10px] md:text-[12px] [&>*:last-child]:text-sm [&>*:last-child]:md:text-base ">
                          امتیاز کاربران: <span>{rating}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
