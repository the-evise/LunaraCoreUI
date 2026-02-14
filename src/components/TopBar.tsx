import * as React from "react";
import { cn } from "../utils/cn";

type TopBarSlotName = "left" | "center" | "right" | "mobileCenter";

export type TopBarSlotProps = {
    children?: React.ReactNode;
    className?: string;
};

export type TopBarProps = {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    centerWrapperClassName?: string;
    mobileCenterWrapperClassName?: string;
};

type TopBarSlotComponent = React.FC<TopBarSlotProps> & {
    slotName: TopBarSlotName;
};

type TopBarCompoundComponent = React.FC<TopBarProps> & {
    Root: React.FC<TopBarProps>;
    Left: TopBarSlotComponent;
    Center: TopBarSlotComponent;
    Right: TopBarSlotComponent;
    MobileCenter: TopBarSlotComponent;
};

type TopBarExtractedSlots = Record<TopBarSlotName, TopBarSlotProps[]>;

const createEmptySlots = (): TopBarExtractedSlots => ({
    left: [],
    center: [],
    right: [],
    mobileCenter: [],
});

function createTopBarSlot(slotName: TopBarSlotName, displayName: string): TopBarSlotComponent {
    const Slot = ({ children }: TopBarSlotProps) => <>{children}</>;
    Slot.displayName = displayName;
    return Object.assign(Slot, { slotName });
}

const TopBarLeft = createTopBarSlot("left", "TopBar.Left");
const TopBarCenter = createTopBarSlot("center", "TopBar.Center");
const TopBarRight = createTopBarSlot("right", "TopBar.Right");
const TopBarMobileCenter = createTopBarSlot("mobileCenter", "TopBar.MobileCenter");

function isTopBarSlotElementType(value: unknown): value is TopBarSlotComponent {
    return (
        typeof value === "function" &&
        "slotName" in value &&
        typeof (value as { slotName?: unknown }).slotName === "string"
    );
}

function collectSlots(nodes: React.ReactNode, slots: TopBarExtractedSlots) {
    React.Children.forEach(nodes, (node) => {
        if (!React.isValidElement(node)) {
            return;
        }

        if (node.type === React.Fragment) {
            const fragmentProps = node.props as { children?: React.ReactNode };
            collectSlots(fragmentProps.children, slots);
            return;
        }

        if (!isTopBarSlotElementType(node.type)) {
            return;
        }

        const slotProps = node.props as TopBarSlotProps;
        slots[node.type.slotName].push(slotProps);
    });
}

function extractSlots(children: React.ReactNode) {
    const slots = createEmptySlots();
    collectSlots(children, slots);
    return slots;
}

function renderSlotChildren(slotName: TopBarSlotName, entries: TopBarSlotProps[]) {
    return entries.map((entry, index) => (
        <React.Fragment key={`${slotName}-${index}`}>
            {entry.children}
        </React.Fragment>
    ));
}

function resolveSlotClassName(entries: TopBarSlotProps[]) {
    return cn(...entries.map((entry) => entry.className));
}

function TopBarRoot({
    children,
    className,
    containerClassName,
    centerWrapperClassName,
    mobileCenterWrapperClassName,
}: TopBarProps) {
    const slots = React.useMemo(() => extractSlots(children), [children]);
    const hasMobileCenter = slots.mobileCenter.length > 0;

    return (
        <div className={cn("w-full", containerClassName)}>
            <header
                className={cn(
                    "w-full",
                    "flex items-center justify-between gap-3",
                    "px-4 py-3",
                    "border-b border-space-100",
                    className
                )}
            >
                <div className={cn("flex min-w-0 items-center gap-3", resolveSlotClassName(slots.left))}>
                    {renderSlotChildren("left", slots.left)}
                </div>

                <div className="hidden flex-1 justify-center sm:flex">
                    <div
                        className={cn(
                            "min-w-[140px] max-w-[260px] w-full",
                            centerWrapperClassName,
                            resolveSlotClassName(slots.center)
                        )}
                    >
                        {renderSlotChildren("center", slots.center)}
                    </div>
                </div>

                <div className={cn("flex items-center gap-3", resolveSlotClassName(slots.right))}>
                    {renderSlotChildren("right", slots.right)}
                </div>
            </header>

            {hasMobileCenter ? (
                <div className={cn("px-4 pb-3 pt-2 sm:hidden", mobileCenterWrapperClassName)}>
                    <div className={cn("w-full", resolveSlotClassName(slots.mobileCenter))}>
                        {renderSlotChildren("mobileCenter", slots.mobileCenter)}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

const TopBar = TopBarRoot as TopBarCompoundComponent;

TopBar.Root = TopBarRoot;
TopBar.Left = TopBarLeft;
TopBar.Center = TopBarCenter;
TopBar.Right = TopBarRight;
TopBar.MobileCenter = TopBarMobileCenter;

export default TopBar;
