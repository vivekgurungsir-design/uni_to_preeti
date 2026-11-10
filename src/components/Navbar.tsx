"use client";

import React from "react";
import { Keyboard, BookOpen } from "lucide-react";

interface NavbarProps {
  onOpenKeyboard: () => void;
  onOpenCheatSheet: () => void;
}

export default function Navbar({
  onOpenKeyboard,
  onOpenCheatSheet,
}: NavbarProps) {
  return (
    <header className="w-full border-b border-emerald-100 bg-white/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ने
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800 font-devanagari">
            नेपाली <span className="text-emerald-700">अनुवादक</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenKeyboard}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
          >
            <Keyboard className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">भर्चुअल किबोर्ड</span>
          </button>
          <button
            onClick={onOpenCheatSheet}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">चीटशीट</span>
          </button>
        </div>
      </div>
    </header>
  );
}
