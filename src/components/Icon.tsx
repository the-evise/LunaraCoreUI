import type { HTMLAttributes } from "react";

import { cn } from "../utils/cn";

const iconSizeClassNameMap = {
    xs: "!text-(length:--button-icon-size-xs)",
    sm: "!text-(length:--button-icon-size-sm)",
    md: "!text-(length:--button-icon-size-md)",
    lg: "!text-(length:--button-icon-size-lg)",
    xl: "!text-(length:--button-icon-size-xl)",
    inherit: "text-inherit",
} as const;

export type IconSize = keyof typeof iconSizeClassNameMap;
export type IconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    name: string;
    size?: IconSize;
    weight?: IconWeight;
    isFill?: boolean;
}

const Icon = ({
    name,
    size = "md",
    weight = 400,
    isFill = false,
    className,
    "aria-hidden": ariaHiddenProp,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    style,
    ...props
}: IconProps) => {
    const resolvedAriaHidden =
        ariaHiddenProp ?? (!ariaLabel && !ariaLabelledby ? true : undefined);
    const sizeClassName = iconSizeClassNameMap[size];
    const variationSettings =
        style?.fontVariationSettings ??
        `"FILL" ${isFill ? 1 : 0}, "wght" ${weight}, "GRAD" 0, "opsz" 24`;

    return (
        <span
            className={cn(
                sizeClassName,
                "material-symbols-rounded inline-flex items-center justify-center leading-none",
                className,
            )}
            aria-hidden={resolvedAriaHidden}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            style={{ ...style, fontVariationSettings: variationSettings }}
            {...props}
        >
            {name}
        </span>
    );
};

Icon.displayName = "Icon";

export default Icon;
