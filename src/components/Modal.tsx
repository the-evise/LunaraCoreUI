import { useEffect, useId, type ReactNode } from "react";
import { cn } from "../utils/cn";
import Button from "./Button";
import Card from "./Card";

export type ModalProps = {
    isOpen: boolean;
    title: string;
    description?: ReactNode;
    children?: ReactNode;
    acceptLabel?: string;
    passLabel?: string;
    acceptLoadingLabel?: string;
    onAccept?: () => void;
    onPass?: () => void;
    isAcceptLoading?: boolean;
    acceptDisabled?: boolean;
    passDisabled?: boolean;
    disableClose?: boolean;
    errorText?: string | null;
    className?: string;
};

export default function Modal({
    isOpen,
    title,
    description,
    children,
    acceptLabel = "Accept",
    passLabel = "Pass",
    acceptLoadingLabel = "Processing...",
    onAccept,
    onPass,
    isAcceptLoading = false,
    acceptDisabled = false,
    passDisabled = false,
    disableClose = false,
    errorText,
    className,
}: ModalProps) {
    const titleId = useId();
    const descriptionId = useId();
    const canClose = !disableClose && !isAcceptLoading;
    const canPass = canClose && !passDisabled;
    const canAccept = !acceptDisabled && !isAcceptLoading;

    useEffect(() => {
        if (!isOpen || !onPass || !canClose) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                return;
            }
            event.preventDefault();
            onPass();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [canClose, isOpen, onPass]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 bg-space-900/55 backdrop-blur-[2px]"
                onClick={canPass ? onPass : undefined}
                disabled={!canPass}
            />
            <Card
                tone="White"
                rounded="3xl"
                padding="md"
                align="left"
                hoverable={false}
                className={cn(
                    "relative w-full !min-w-0 max-w-xl border-space-150 shadow-[0_24px_64px_-24px_rgba(17,24,39,0.45)]",
                    className
                )}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={description ? descriptionId : undefined}
                    className="w-full"
                >
                    <h2 id={titleId} className="text-lg font-semibold text-space-900">
                        {title}
                    </h2>
                    {description && (
                        <div id={descriptionId} className="mt-2 text-sm text-space-600">
                            {description}
                        </div>
                    )}
                    {children && <div className="mt-3">{children}</div>}
                    {errorText ? (
                        <p className="mt-4 rounded-xl border border-persianred-200 bg-persianred-10 px-3 py-2 text-sm text-persianred-700">
                            {errorText}
                        </p>
                    ) : null}
                    <div className="mt-6 grid w-full grid-cols-3 gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="col-span-1 w-full min-w-0 !rounded-full"
                            onClick={onPass}
                            disabled={!onPass || !canPass}
                        >
                            {passLabel}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="col-span-2 w-full min-w-0 !rounded-full"
                            onClick={onAccept}
                            disabled={!onAccept || !canAccept}
                        >
                            {isAcceptLoading ? acceptLoadingLabel : acceptLabel}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
