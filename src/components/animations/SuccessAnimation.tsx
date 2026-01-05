import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";

interface StackAnimationProps {
    size?: number;
    autoplay?: boolean;
}

export default function StackAnimation({ size = 160, autoplay = true }: StackAnimationProps) {
    // Single machine: "STACK"
    const { rive, RiveComponent } = useRive({
        src: "/animations/stack_animation_02.riv",
        stateMachines: "State Machine STACK",
        autoplay,
    });

    // The boolean input controlling transitions
    const hoverInput = useStateMachineInput(rive, "State Machine STACK", "Hover");

    // Start idle on load
    useEffect(() => {
        if (hoverInput) hoverInput.value = false;
    }, [hoverInput]);

    // Handlers
    const handleMouseEnter = () => {
        if (hoverInput) hoverInput.value = true; // transitions to Hover_TL
    };

    const handleMouseLeave = () => {
        if (hoverInput) hoverInput.value = false; // triggers transition to Exit, then Idle_TL
    };

    return (
        <div
            className="flex items-center justify-center cursor-pointer select-none"
            style={{ width: size, height: size }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <RiveComponent />
        </div>
    );
}
