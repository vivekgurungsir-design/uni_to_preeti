"use client";

import React, { useState, useEffect } from "react";
import {
  Keyboard,
  BookOpen,
  BookmarkCheck,
  Database as DatabaseIcon,
  Sun,
  Moon,
  FileText,
  Activity,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface NavbarProps {
  onOpenKeyboard: () => void;
  onOpenCheatSheet: () => void;
  onOpenSaved: () => void;
  onOpenSupabaseConfig: () => void;
  savedCount: number;
}

export default function Navbar({
  onOpenKeyboard,
  onOpenCheatSheet,
  onOpenSaved,
  onOpenSupabaseConfig,
  savedCount,
}: NavbarProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);

  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    setSupabaseConnected(isSupabaseConfigured());
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            ने
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                Preeti<span className="text-indigo-600 dark:text-indigo-400">Unicode</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hidden sm:inline-block">
                PRO PLATFORM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              नेपाली टाइपिङ तथा डकुमेन्ट रूपान्तरण
            </p>
          </div>
        </a>

        {/* Center Quick Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a
            href="#"
            className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            अनुवादक
          </a>
          <a
            href="#doc-converter"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>कागजात (.docx)</span>
          </a>
          <a
            href="#typing-practice"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>टाइपिङ अभ्यास</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabaseConfig}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              supabaseConnected
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100"
            }`}
            title={supabaseConnected ? "Supabase Cloud Database Connected" : "Local Storage Mode (Click to connect Supabase)"}
          >
            <DatabaseIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {supabaseConnected ? "Supabase Connected" : "Local Cloud"}
            </span>
            <span className={`w-2 h-2 rounded-full ${supabaseConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
          </button>

          {/* Virtual Keyboard */}
          <button
            onClick={onOpenKeyboard}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Preeti Virtual Keyboard"
          >
            <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">किबोर्ड</span>
          </button>

          {/* Cheat Sheet */}
          <button
            onClick={onOpenCheatSheet}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Preeti Keymap Cheatsheet"
          >
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">चीटशीट</span>
          </button>

          {/* Saved Snippets */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Saved Translations"
          >
            <BookmarkCheck className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">सुरक्षित</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
