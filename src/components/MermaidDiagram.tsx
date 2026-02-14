import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";

export type MermaidDiagramTheme =
    | "default"
    | "neutral"
    | "dark"
    | "forest"
    | "base";

export interface MermaidDiagramProps {
    syntax: string;
    theme?: MermaidDiagramTheme;
    className?: string;
    ariaLabel?: string;
    minHeight?: number;
    showSourceOnError?: boolean;
    onRenderError?: (error: Error) => void;
}

const svgCache = new Map<string, string>();
let mermaidModulePromise: Promise<typeof import("mermaid")> | null = null;
let initializedTheme: MermaidDiagramTheme | null = null;

const getMermaid = async () => {
    if (!mermaidModulePromise) {
        mermaidModulePromise = import("mermaid");
    }
    const module = await mermaidModulePromise;
    return module.default;
};

function MermaidDiagram({
    syntax,
    theme = "default",
    className,
    ariaLabel = "Mermaid diagram",
    minHeight = 180,
    showSourceOnError = false,
    onRenderError,
}: MermaidDiagramProps) {
    const [svg, setSvg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const onRenderErrorRef = useRef(onRenderError);
    const rawId = useId();
    const diagramId = useMemo(
        () => rawId.replace(/[^a-zA-Z0-9_-]/g, ""),
        [rawId]
    );
    const normalizedSyntax = useMemo(() => syntax.trim(), [syntax]);

    useEffect(() => {
        onRenderErrorRef.current = onRenderError;
    }, [onRenderError]);

    useEffect(() => {
        let cancelled = false;

        if (!normalizedSyntax) {
            setSvg("");
            setErrorMessage("Diagram syntax is empty.");
            setIsLoading(false);
            return;
        }

        const cacheKey = `${theme}::${normalizedSyntax}`;
        const cached = svgCache.get(cacheKey);
        if (cached) {
            setSvg(cached);
            setErrorMessage(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const render = async () => {
            try {
                const mermaid = await getMermaid();
                if (initializedTheme !== theme) {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme,
                        securityLevel: "strict",
                        suppressErrorRendering: true,
                        fontFamily: "inherit",
                    });
                    initializedTheme = theme;
                }

                const renderId = `mermaid-${diagramId}-${Date.now()}`;
                const result = await mermaid.render(renderId, normalizedSyntax);

                if (cancelled) return;
                svgCache.set(cacheKey, result.svg);
                setSvg(result.svg);
                setErrorMessage(null);
            } catch (error) {
                if (cancelled) return;
                const resolvedError =
                    error instanceof Error
                        ? error
                        : new Error("Unable to render Mermaid diagram.");
                setSvg("");
                setErrorMessage(resolvedError.message);
                onRenderErrorRef.current?.(resolvedError);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        render();

        return () => {
            cancelled = true;
        };
    }, [diagramId, normalizedSyntax, theme]);

    return (
        <div
            role="img"
            aria-label={ariaLabel}
            className={cn(
                "w-full rounded-2xl border border-space-100 bg-white p-3",
                className
            )}
            style={{ minHeight }}
        >
            {errorMessage ? (
                <div className="space-y-2 text-xs text-persianred-700">
                    <p>Failed to render diagram.</p>
                    <p className="rounded-lg bg-persianred-50 px-2 py-1">{errorMessage}</p>
                    {showSourceOnError ? (
                        <pre className="max-h-40 overflow-auto rounded-lg bg-space-50 p-2 text-space-600">
                            {normalizedSyntax}
                        </pre>
                    ) : null}
                </div>
            ) : svg ? (
                <div
                    className="[&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            ) : isLoading ? (
                <p className="text-xs text-space-500">Rendering diagram...</p>
            ) : null}
        </div>
    );
}

export default MermaidDiagram;
