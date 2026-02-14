import {useEffect, useMemo, useRef} from "react";

type KeyboardShortcutOptions = {
    enabled?: boolean;
    target?: Window | Document | HTMLElement | null;
    ignoreInputs?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
};

const normalizeKey = (key: string) =>
    key.length === 1 ? key.toLowerCase() : key;

const isTypingTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    if (typeof target.closest !== "function") {
        const tag = target.tagName;
        return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    }
    return Boolean(
        target.closest("input, textarea, select, [contenteditable='true']")
    );
};

export function useKeyboardShortcut(
    keys: string[] | string,
    callback: (e: KeyboardEvent) => void,
    options: KeyboardShortcutOptions = {}
) {
    const callbackRef = useRef(callback);
    const keySetRef = useRef<Set<string>>(new Set());
    const optionsRef = useRef({
        enabled: true,
        ignoreInputs: true,
        preventDefault: false,
        stopPropagation: false,
    });

    const mergedOptions = useMemo(() => {
        return {
            enabled: options.enabled ?? true,
            target:
                options.target ??
                (typeof window !== "undefined" ? window : null),
            ignoreInputs: options.ignoreInputs ?? true,
            preventDefault: options.preventDefault ?? false,
            stopPropagation: options.stopPropagation ?? false,
        };
    }, [
        options.enabled,
        options.target,
        options.ignoreInputs,
        options.preventDefault,
        options.stopPropagation,
    ]);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const keyList = Array.isArray(keys) ? keys : [keys];
        keySetRef.current = new Set(keyList.map(normalizeKey));
    }, [keys]);

    useEffect(() => {
        optionsRef.current = {
            enabled: mergedOptions.enabled,
            ignoreInputs: mergedOptions.ignoreInputs,
            preventDefault: mergedOptions.preventDefault,
            stopPropagation: mergedOptions.stopPropagation,
        };
    }, [
        mergedOptions.enabled,
        mergedOptions.ignoreInputs,
        mergedOptions.preventDefault,
        mergedOptions.stopPropagation,
    ]);

    useEffect(() => {
        if (!mergedOptions.enabled || !mergedOptions.target) return;

        const handler: EventListener = (event) => {
            const keyEvent = event as KeyboardEvent;
            const currentOptions = optionsRef.current;
            if (currentOptions.ignoreInputs && isTypingTarget(keyEvent.target)) {
                return;
            }

            const normalizedKey = normalizeKey(keyEvent.key);
            if (!keySetRef.current.has(normalizedKey)) return;

            if (currentOptions.preventDefault) {
                keyEvent.preventDefault();
            }
            if (currentOptions.stopPropagation) {
                keyEvent.stopPropagation();
            }

            callbackRef.current(keyEvent);
        };

        mergedOptions.target.addEventListener("keydown", handler);
        return () =>
            mergedOptions.target?.removeEventListener("keydown", handler);
    }, [mergedOptions.enabled, mergedOptions.target]);
}
