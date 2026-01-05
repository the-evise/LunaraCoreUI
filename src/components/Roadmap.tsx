import SectionTracker from "./SectionTracker";
import LessonContent from "./LessonContent";
import {type JSX, useState} from "react";

type RoadmapProps = {
    lessons: string[];
}

function Roadmap({lessons}: RoadmapProps): JSX.Element {
    const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
    const [activeSectionIndex, setActiveSectionIndex] = useState<number>(1);

    const handleLessonSelect = (index: number) => {
        setActiveLessonIndex(index);
        setActiveSectionIndex(1); // reset section when lesson changes
    }

    const handleSectionSelect = (newIndex: number) => {
        setActiveSectionIndex(newIndex);
    };

    return (
        <>
            <SectionTracker
                lessons={lessons}
                activeSectionIndex={activeSectionIndex}
                onSectionSelect={handleSectionSelect} // callback
                activeLessonIndex={activeLessonIndex}
                onLessonSelect={handleLessonSelect} // callback
            />
            <LessonContent
                lessonIndex={activeLessonIndex}
                sectionIndex={activeSectionIndex}
            >
            </LessonContent>
        </>
    );
}

export default Roadmap;

// Compound API
// Roadmap.SectionTracker = SectionTracker;
// Roadmap.LessonContent = LessonContent;
