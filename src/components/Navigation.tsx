"use client";

import { motion, useReducedMotion } from "motion/react";
import {
    Children,
    type AnchorHTMLAttributes,
    type ComponentType,
    type FC,
    type ReactElement,
    type ReactNode,
} from "react";
import { cn } from "../utils/cn";

interface NavigationProps {
    children?: ReactNode;
    className?: string;
}

const Logo: FC = (): ReactElement => {
    const prefersReducedMotion = useReducedMotion();
    const content: ReactNode = (
        <div className="w-[36px] h-[36px] rounded-lg bg-celestialblue-400/40 hidden md:flex items-center justify-center">
            <span className="text-celestialblue-300 text-2xl" />
        </div>
    );

    if (prefersReducedMotion) {
        return <>{content}</>;
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
        >
            {content}
        </motion.div>
    );
};

type LinkComponentProps = {
    href: string;
    children: ReactNode;
    className?: string;
};

interface NavItemProps
    extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> {
    icon: string; // Material Symbol name
    href?: string;
    active?: boolean;
    activePath?: string;
    LinkComponent?: ComponentType<LinkComponentProps>;
    linkProps?: Record<string, unknown>;
    className?: string;
}

const normalizePath = (value?: string): string => {
    if (!value) return "";
    if (value.length > 1 && value.endsWith("/")) {
        return value.slice(0, -1);
    }
    return value || "/";
};
const NavItem: FC<NavItemProps> = ({
    icon,
    href = "#",
    active,
    activePath,
    LinkComponent,
    linkProps,
    className,
    ...anchorProps
}): ReactElement => {
    const prefersReducedMotion = useReducedMotion();

    const normalizedHref = normalizePath(href);
    const normalizedActive = normalizePath(activePath);
    const isActive =
        active ??
        (normalizedHref !== "" &&
            normalizedActive !== "" &&
            (normalizedActive === normalizedHref ||
                normalizedActive.startsWith(`${normalizedHref}/`)));

    const tone = isActive
        ? {
            base: "!text-celestialblue-250",
            state:
                "bg-celestialblue-500/25 border-celestialblue-400 shadow-[0_10px_28px_-12px_rgba(66,114,255,0.55)]",
        }
        : {
            base: "!text-emerald-100",
            state: "hover:!text-emerald-150 hover:border-space-400 hover:bg-space-10/5 border-transparent bg-transparent",
        };

    const classNames = cn(
        "flex items-center justify-center w-[60px] h-[60px] rounded-[10px] border transition-all duration-300 cursor-pointer",
        tone.base,
        tone.state,
        className,
    );

    const iconMarkup = (
        <motion.span
            className="material-symbols-rounded !text-[36px] !font-extralight"
            whileHover={prefersReducedMotion ? undefined : { y: [0, 0], scale: [1.05, 1] }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            transition={prefersReducedMotion ? undefined : { type: "spring", stiffness: 220, damping: 14, mass: 0.9 }}
        >
            {icon}
        </motion.span>
    );

    if (LinkComponent) {
        const linkComponentProps = {
            href,
            className: classNames,
            children: iconMarkup,
            ...(linkProps ?? {}),
            ...(anchorProps as Record<string, unknown>),
        };

        return <LinkComponent {...linkComponentProps} />;
    }

    return (
        <a href={href} className={classNames} {...anchorProps}>
            {iconMarkup}
        </a>
    );
};

const ItemTooltip: FC = (): ReactElement => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <motion.div
            className="absolute left-[90px] bg-space-800 text-space-50 px-3 py-1 rounded-md text-sm shadow-lg"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
            transition={prefersReducedMotion ? undefined : { type: "spring", stiffness: 220, damping: 26, mass: 0.9, duration: 0.2 }}
        >
            Tooltip text
        </motion.div>
    );
};

const DefaultNavigationContent: FC = () => (
    <>
        <Logo />

        <div className="flex flex-col items-center gap-[10px]">
            <NavItem icon="empty_dashboard" active />
            <NavItem icon="automation" />
            <NavItem icon="book_3" />
            <NavItem icon="radio" />
            <NavItem icon="forum" />
        </div>

        <NavItem icon="account_circle" />
    </>
);

const NavigationRoot: FC<NavigationProps> = ({ children, className }): ReactElement => {
    const prefersReducedMotion = useReducedMotion();
    const renderedChildren = children ?? <DefaultNavigationContent />;
    const childArray = Children.toArray(renderedChildren);

    const topSlot = childArray[0] ?? null;
    const bottomSlot = childArray.length > 1 ? childArray[childArray.length - 1] : null;
    const middleSlot =
        childArray.length > 2
            ? childArray.slice(1, -1)
            : childArray.length === 1
                ? childArray
                : childArray.length === 2
                    ? [childArray[1]]
                    : [];

    return (
        <motion.nav
            className={cn(
                "fixed bottom-0 md:top-0 md:left-0 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:grid-cols-1 grid-rows-[auto_auto_auto] md:grid-rows-[auto_1fr_auto] gap-4 sm:gap-5 w-full md:w-[84px] h-[80px] md:h-screen bg-space-900 py-[10px] px-5 md:py-6 select-none z-10",
                className,
            )}
            initial={
                prefersReducedMotion
                    ? undefined
                    : {
                        opacity: 0,
                        scale: 0.92,
                        x: 24,
                    }
            }
            animate={
                prefersReducedMotion
                    ? undefined
                    : {
                        opacity: 1,
                        scale: 1,
                        x: 0,
                    }
            }
            transition={prefersReducedMotion ? undefined : { type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
            style={{ transformOrigin: "right center" }}
        >
            <div className="hidden md:flex items-center justify-center md:justify-start md:pl-1">
                {topSlot}
            </div>

            <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2">
                {middleSlot}
            </div>

            <div className="hidden md:flex items-center justify-center md:justify-end md:pb-1">
                {bottomSlot}
            </div>
        </motion.nav>
    );
};

const Navigation = Object.assign(NavigationRoot, {
    Logo,
    NavItem,
    ItemTooltip,
});

export default Navigation;
export { Logo, NavItem, ItemTooltip };
