"use client";

import React from "react";
import { Sparkles, FileText, Activity, ShieldCheck, Zap, ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-rose-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-bold mb-4 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>नेपाली टाइपिङ तथा फन्ट रूपान्तरणको आधुनिक SaaS प्लेटफर्म</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto font-devanagari">
        नेपाली टाइपिङ, रूपान्तरण र{" "}
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
          कागजात व्यवस्थापन
        </span>{" "}
        एकै ठाउँमा
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
        नेपाली <strong>Unicode</strong> र <strong>Preeti Font</strong> बीचको दुई-तर्फी अनुवाद गर्नुहोस्, सम्पूर्ण <strong>Word (.docx)</strong> फाइल रूपान्तरण गर्नुहोस् र टाइपिङ गति (WPM) बढाउनुहोस्।
      </p>

      {/* Quick Action Anchors */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
        <a
          href="#doc-converter"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition"
        >
          <FileText className="w-4 h-4 text-indigo-500" />
          <span>कागजात (.docx) रूपान्तरण</span>
        </a>
        <a
          href="#typing-practice"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition"
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>टाइपिङ अभ्यास तथा गति परीक्षण</span>
        </a>
      </div>

      {/* Value Badges */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left text-xs">
        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-white">Preeti.ttf रेन्डरिङ</div>
            <div className="text-[11px] text-slate-500">वास्तविक नेपाली लिपि</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-white">Word & Text</div>
            <div className="text-[11px] text-slate-500">.docx, .txt ब्याच फाइल</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-white">१००% गोप्य</div>
            <div className="text-[11px] text-slate-500">ब्राउजरमै सुरक्षित प्रक्रिया</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-white">Supabase सिंक</div>
            <div className="text-[11px] text-slate-500">क्लाउड ब्याकअप र शेयर</div>
          </div>
        </div>
      </div>
    </section>
  );
}

