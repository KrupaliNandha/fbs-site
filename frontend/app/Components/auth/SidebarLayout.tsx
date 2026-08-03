"use client";

import { useState, type ReactNode } from "react";
import { LogoutButton } from "./LogoutButton";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Palette,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  UserCheck,
} from "lucide-react";

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
};

type SidebarLayoutProps = {
  title: string;
  subtitle: string;
  roleName: string;
  userEmail?: string;
  userName?: string;
  navItems: SidebarNavItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
};

export function SidebarLayout({
  title,
  subtitle,
  roleName,
  userEmail,
  userName,
  navItems,
  activeTab,
  onTabChange,
  children,
}: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      {/* LEFT VERTICAL SIDEBAR (Pinterest Modern Slate Style) */}
      <aside
        className={`sticky top-0 h-screen bg-[#0f172a] text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-40 shadow-xl ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 flex-shrink-0">
                F
              </div>
              {!collapsed && (
                <div className="truncate">
                  <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                    FBS Prints <Sparkles size={14} className="text-amber-400" />
                  </h1>
                  <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                    Review Studio
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {!collapsed && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Navigation
              </p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all relative ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge !== undefined && (
                    <span className="ml-auto bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute right-0 top-2 bottom-2 w-1 bg-white rounded-l-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0">
              {userName?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate">{userName || "Authenticated User"}</p>
                <p className="text-[10px] text-slate-400 truncate">{userEmail || roleName}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="pt-1">
              <LogoutButton />
            </div>
          )}
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {roleName} Portal
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">{title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600">
              <UserCheck size={14} className="text-emerald-500" />
              <span>{userEmail}</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
