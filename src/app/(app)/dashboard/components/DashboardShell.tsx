"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return ( 
        <div className="min-h-screen bg-finsight-background lg:flex">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed((current) => !current)}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
            />


        <div className="min-w-0 flex-1">
            {children}
        </div>
        </div>
    );
}
