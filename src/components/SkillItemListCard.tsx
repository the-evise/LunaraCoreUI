import * as React from "react";
import Card from "./Card";
import SkillItem, {type SkillGrade} from "./SkillItem";
import {cn} from "../utils/cn";

export type SkillItemModel = {
    id: string;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    grade?: SkillGrade;

    /** Optional: user cannot access */
    disabled?: boolean;
};

export type SkillItemListCardProps = {
    /** Optional header for the card */
    title?: string;
    skills: SkillItemModel[];

    /** Which skill is currently active (learning now) */
    activeSkillId?: string;

    /** Click handler */
    onSkillSelect?: (skillId: string) => void;

    /** Optional: card footer slot */
    footer?: React.ReactNode;

    /** Optional id for testing */
    id?: string;
};

export default function SkillItemListCard({
                                              title,
                                              skills,
                                              activeSkillId,
                                              onSkillSelect,
                                              footer,
                                              id,
                                          }: SkillItemListCardProps) {
    return (
        <div id={id}>
            <Card>
                <div className="flex flex-col gap-3">
                    {title && (
                        <div className="px-1">
                            <div className="font-semibold">{title}</div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        {skills.map((skill) => {
                            const isActive = activeSkillId === skill.id && !skill.disabled;
                            return (
                                <div
                                    key={skill.id}
                                    className={cn(
                                        "rounded-full",
                                        isActive ? "ring-2 ring-celestialblue-400" : "",
                                    )}
                                >
                                    <SkillItem
                                        id={skill.id}
                                        title={skill.title}
                                        subtitle={skill.subtitle}
                                        icon={skill.icon}
                                        grade={skill.grade}
                                        disabled={skill.disabled}
                                        onClick={
                                            onSkillSelect && !skill.disabled
                                                ? () => onSkillSelect(skill.id)
                                                : undefined
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {footer && <div className="pt-2">{footer}</div>}
                </div>
            </Card>
        </div>
    );
}
