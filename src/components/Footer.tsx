"use client";

import React from "react";
import { Heart, Sparkles, BookOpen, Keyboard, Database, HelpCircle, ShieldAlert } from "lucide-react";

interface FooterProps {
  onOpenCheatSheet: () => void;
  onOpenKeyboard: () => void;
  onOpenSupabaseConfig: () => void;
}

export default function Footer({
  onOpenCheatSheet,
  onOpenKeyboard,
  onOpenSupabaseConfig,
}: FooterProps) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
                ने
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Preeti<span className="text-indigo-600 dark:text-indigo-400">Unicode</span> Translator
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              नेपाली युनिकोड (Nepali Devanagari Unicode) र परम्परागत प्रिती फन्ट (Preeti Font) बीच द्रुत, शुद्ध र सुरक्षित दुई-तर्फी रूपान्तरण गर्ने आधुनिक वेब प्लेटफर्म। यसले सरकारी कार्यालय, पत्रकारिता, प्रकाशन र व्यक्तिगत प्रयोगकर्ताहरूलाई सहज बनाउँछ।
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1">
              <span>Next.js र Supabase द्वारा संचालित</span>
              <span>•</span>
              <span>नेपालमा निर्मित 🇳🇵</span>
            </div>
          </div>

          {/* Col 2: Shortcuts & Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              मुख्य उपकरणहरू
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={onOpenKeyboard}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1.5"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>प्रिती भर्चुअल किबोर्ड</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCheatSheet}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>प्रिती किम्याप चीटशीट</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSupabaseConfig}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase डेटाबेस सेटअप</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: DTP Tips */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              प्रिती फन्ट जानकारी
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              प्रिती परिणामलाई Adobe Photoshop, InDesign वा Microsoft Word मा प्रयोग गर्दा फन्ट फेमिलीमा <strong>Preeti</strong> वा <strong>Kantipur</strong> चयन गर्नुहोस्।
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} PreetiUnicode Translator. सर्वाधिकार सुरक्षित।</p>
          <p className="flex items-center space-x-1">
            <span>Powered by Next.js App Router & Supabase</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

