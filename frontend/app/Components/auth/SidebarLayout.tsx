"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/app/Components/ui";
import {
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Menu,
  X,
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

const LOGO_SRC = "/images/brand/fbs-prints-logo.webp";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleTabChange(tabId: string) {
    onTabChange(tabId);
    setMobileOpen(false);
  }

  const sidebarContent = (
    <>
      {/* Brand Header — real logo */}
      <div>
        <div
          className={`relative border-b border-slate-800/80 px-3 ${
            collapsed
              ? "py-3 flex flex-col items-center justify-center gap-2"
              : "h-16 flex items-center justify-center"
          }`}
        >
          {/* Centered logo */}
          <Link
            href="/"
            className={`flex items-center justify-center overflow-hidden ${
              collapsed ? "w-10 h-10" : "w-[148px] h-10"
            }`}
            title="FBS Prints — Home"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src={LOGO_SRC}
              alt="FBS Prints logo"
              width={148}
              height={40}
              priority
              className={`object-contain mx-auto ${
                collapsed ? "h-8 w-8" : "h-9 w-auto max-w-[148px]"
              }`}
            />
          </Link>

          {/* Collapse — absolute right when expanded; under logo when collapsed */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed((v) => !v)}
            className={`hidden lg:inline-flex bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white ${
              collapsed
                ? "static"
                : "absolute right-2 top-1/2 -translate-y-1/2"
            }`}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>

          {/* Mobile close — right side */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Close menu"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {!collapsed && (
            <p className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500 lg:block">
              Navigation
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                onClick={() => handleTabChange(item.id)}
                className={`w-full justify-start gap-3 px-3 py-2.5 h-auto rounded-xl font-semibold text-sm relative ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-600 hover:text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                } ${collapsed ? "justify-center lg:justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                {/* On mobile drawer always show labels; on desktop respect collapse */}
                <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-auto bg-slate-800 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-700 ${
                      collapsed ? "lg:hidden" : ""
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute right-0 top-2 bottom-2 w-1 bg-white rounded-l-full hidden lg:block" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "lg:justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className={`truncate text-left min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
            <p className="text-sm font-bold text-white truncate">
              {userName || "Authenticated User"}
            </p>
            <p className="text-xs text-slate-400 truncate">{userEmail || roleName}</p>
          </div>
        </div>

        <div className={collapsed ? "lg:hidden" : ""}>
          <LogoutButton />
        </div>
      </div>
    </>
  );

  return (
    <div className="portal-dashboard min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex sticky top-0 h-screen bg-[#0f172a] text-slate-300 border-r border-slate-800 flex-col justify-between transition-all duration-300 z-40 shadow-xl ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[min(18rem,85vw)] bg-[#0f172a] text-slate-300 border-r border-slate-800 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Mobile top bar with logo */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </Button>

          <Link
            href="/"
            className="flex items-center justify-center flex-1 min-w-0 h-10"
            title="FBS Prints"
          >
            <Image
              src={LOGO_SRC}
              alt="FBS Prints logo"
              width={148}
              height={40}
              priority
              className="h-9 w-auto max-w-[148px] object-contain"
            />
          </Link>

          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        {/* Desktop top header bar */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 xl:px-8 py-4 items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {roleName} Portal
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 truncate">
              {title}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600">
              <UserCheck size={16} className="text-emerald-500" />
              <span className="max-w-[220px] truncate">{userEmail}</span>
            </div>
          </div>
        </header>

        {/* Mobile page title strip */}
        <div className="lg:hidden px-4 sm:px-5 pt-3 pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {roleName} Portal
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 xl:p-8 overflow-y-auto w-full max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
