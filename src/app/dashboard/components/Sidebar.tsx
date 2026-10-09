"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
ArrowLeftRight,
ChartNoAxesCombined,
ChevronLeft,
ChevronRight,
LayoutDashboard,
Menu,
Settings,
Wallet,
X,
} from "lucide-react";

const navigation = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
    { label: "Statistics", href: "/dashboard/statistics", icon: ChartNoAxesCombined },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type SidebarProps = {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
};

export default function Sidebar({
    isCollapsed,
    onToggleCollapse,
    isMobileOpen,
    onCloseMobile,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile menu trigger */}
            <button
                type="button"
                onClick={() => {
                    window.dispatchEvent(new Event("finsight:open-sidebar"));
                }}
                aria-label="Open navigation menu"
                aria-expanded={isMobileOpen}
                className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-finsight-gray-500 bg-white text-finsight-text shadow-sm transition hover:bg-finsight-surface-soft lg:hidden"
            > 
                <Menu className="h-5 w-5" /> 
            </button>

            {/* Mobile backdrop */}
            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onCloseMobile}
                    className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
                />
            )}

            <aside
                aria-label="Main navigation"
                className={[
                    "fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col border-r border-finsight-gray-500 bg-white",
                    "transition-[width,transform] duration-200 ease-in-out",
                    isCollapsed ? "w-[76px]" : "w-[248px]",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:sticky lg:top-0 lg:translate-x-0",
                ].join(" ")}
            >
                {/* Brand */}
                <div
                className={[
                    "flex h-[76px] shrink-0 items-center border-b border-finsight-border-light",
                    isCollapsed ? "justify-center px-3" : "justify-between px-5",
                ].join(" ")}
                >
                <Link
                    href="/dashboard"
                    onClick={onCloseMobile}
                    aria-label="FinSight dashboard"
                    className={[
                        "flex min-w-0 items-center",
                        isCollapsed ? "justify-center" : "justify-start",
                    ].join(" ")}
                >

                    {isCollapsed ? (
                        <Image
                            src="/finsight-icon.png"
                            alt="FinSight"
                            width={441}
                            height={430}
                            priority
                            className="h-8 w-10 shrink-0 object-contain"
                        />
                    ) : (
                        <Image 
                            src="/logo.png"
                            alt="FinSight Logo"
                            width={2079}
                            height={756}
                            className="h-13 w-auto max-w-full object-contain object-left"
                            priority
                        />
                    )}
                </Link>

                <button
                    type="button"
                    onClick={onCloseMobile}
                    aria-label="Close navigation menu"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-finsight-muted transition hover:bg-finsight-surface-soft hover:text-finsight-text lg:hidden"
                >
                    <X className="h-4 w-4" />
                </button>
                </div>

                {/* Desktop collapse control */}
                <div
                className={[
                    "hidden pt-4 lg:flex",
                    isCollapsed ? "justify-center px-3" : "justify-end px-4",
                ].join(" ")}
                >
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-expanded={!isCollapsed}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-finsight-muted transition hover:bg-finsight-surface-soft hover:text-finsight-primary"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {!isCollapsed && (
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-finsight-muted">
                    Menu
                    </p>
                )}

                {navigation.map(({ label, href, icon: Icon }) => {
                    const isActive =
                    href === "/dashboard"
                        ? pathname === href
                        : pathname === href || pathname.startsWith(`${href}/`);

                    return (

                        <Link
                            key={href}
                            href={href}
                            onClick={onCloseMobile}
                            aria-current={isActive ? "page" : undefined}
                            title={isCollapsed ? label : undefined}
                            className={[
                            "group flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isCollapsed ? "justify-center" : "",
                            isActive
                                ? "bg-finsight-primary-soft text-finsight-primary"
                                : "text-finsight-text-secondary hover:bg-finsight-surface-soft hover:text-finsight-text",
                            ].join(" ")}
                        >

                            <Icon
                            className={[
                                "h-[18px] w-[18px] shrink-0",
                                isActive
                                ? "text-finsight-primary"
                                : "text-finsight-muted group-hover:text-finsight-text",
                            ].join(" ")}
                            />

                            {!isCollapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
                </nav>

                {/* Workspace footer */}
                <div className="shrink-0 border-t border-finsight-border-light p-3">
                <div
                    title={isCollapsed ? "Personal workspace" : undefined}
                    className={[
                    "flex items-center gap-3 rounded-lg px-2 py-3",
                    isCollapsed ? "justify-center" : "",
                    ].join(" ")}
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-finsight-primary-soft text-finsight-primary">
                    <Wallet className="h-4 w-4" />
                    </span>

                    {!isCollapsed && (
                        <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-finsight-text">
                                Personal workspace
                            </span>
                            <span className="mt-0.5 block text-xs text-finsight-muted">
                                Manage your money
                            </span>
                        </span>
                    )}
                </div>
                </div>
            </aside>
        </>
    );
}
