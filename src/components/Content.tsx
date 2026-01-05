import type {ReactNode} from "react";

function Content({ children }: { children: ReactNode }) {
    return (
        <div className={"mt-8 flex flex-col items-center gap-8 mx-auto"}>
            {children}
        </div>
    )
}

/**
 * Utility wrapper to bypass Content's padding.
 * Use this for elements (like full-bleed images) that need to stretch edge-to-edge.
 */
Content.FullBleed = function FullBleed({ children }: { children: ReactNode }) {
    return (
        <div className="">
            {children}
        </div>
    );
};

export default Content;