import RoadmapCard from "./RoadmapCard";
import {useRandomNumber} from "../hooks/useRandomNumber";


function RoadmapCardSkeleton() {

    let imageSrc = "https://placehold.co/100x100"

    let randomRate = useRandomNumber()
    let randomProgress = useRandomNumber({format: "progress", intervalMs: 900})

    return (
        <RoadmapCard title={"xxxx"} rating={randomRate} description={"xxxx"} progress={randomProgress}/>
    )
}

export default RoadmapCardSkeleton;