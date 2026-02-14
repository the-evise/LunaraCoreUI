import type { ReactNode } from "react";
import Card from "./Card";
import Title from "./Title";
import { cn } from "../utils/cn";

type GrammarCardProps = {
    title: string;
    rule?: string;
    examples?: string[];
    renderImage?: (className: string) => ReactNode;
    topSlot?: ReactNode;
    children?: ReactNode;
    className?: string;
};

type GrammarCardTopProps = {
    children: ReactNode;
    className?: string;
};

function GrammarCardTop({ children, className }: GrammarCardTopProps) {
    return <div className={cn("w-full", className)}>{children}</div>;
}

function GrammarCard({
    title,
    rule,
    examples = [],
    renderImage,
    topSlot,
    children,
    className,
}: GrammarCardProps) {
    return (
        <Card
            tone="Saffron"
            padding="md"
            rounded="3xl"
            align="left"
            className={cn("flex w-full flex-col gap-4", className)}
        >
            {topSlot ? <GrammarCardTop>{topSlot}</GrammarCardTop> : null}
            {children ? <GrammarCardTop>{children}</GrammarCardTop> : null}

            {renderImage && (
                <div className="w-full overflow-hidden rounded-2xl border border-saffron-100 bg-white/80">
                    {renderImage("h-auto w-full object-cover")}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Title tone="Saffron" size={4} className="mb-0">
                    {title}
                </Title>
                {rule && (
                    <p className="text-saffron-900 text-sm font-medium leading-relaxed md:text-base">
                        {rule}
                    </p>
                )}
            </div>

            {examples.length > 0 && (
                <ul className="space-y-2 pl-5 text-sm text-saffron-900/90 md:text-base">
                    {examples.map((example) => (
                        <li key={example} className="list-disc">
                            {example}
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

type GrammarCardCompound = typeof GrammarCard & {
    Top: typeof GrammarCardTop;
};

const GrammarCardComponent = GrammarCard as GrammarCardCompound;
GrammarCardComponent.Top = GrammarCardTop;

export default GrammarCardComponent;
