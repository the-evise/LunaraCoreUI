import type { ReactElement, ReactNode } from "react";

export type LunaraLogoProps = {
    title?: string;
    logo?: ReactNode;
    logoAlt?: string;
    className?: string;
};

export default function LunaraLogo({
    title = "Lunara",
    logo,
    logoAlt = "Lunara logo",
    className,
}: LunaraLogoProps): ReactElement {
    return (
        <div className={["flex items-center gap-3 min-w-0", className ?? ""].join(" ")}>
            <div className="shrink-0">
                {logo ?? (
                    <img
                        src="/LunaraLogo.png"
                        alt={logoAlt}
                        className="size-10 md:size-12"
                        loading="lazy"
                    />
                )}
            </div>
            <div className="hidden md:block font-semibold truncate font-dmsans text-xl text-[#070B19]">{title}</div>
        </div>
    );
}
