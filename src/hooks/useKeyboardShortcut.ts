import {useEffect} from "react";


export function useKeyboardShortcut(
    keys: string[] | string,
    callback: (e?: KeyboardEvent) => void,
    deps: any[] = []
) {
    useEffect(() => {
        const keyList = Array.isArray(keys) ? keys : [keys]

        const handler = (e: KeyboardEvent) => {
            if (keyList.includes(e.key)) callback(e);
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, deps);
}
