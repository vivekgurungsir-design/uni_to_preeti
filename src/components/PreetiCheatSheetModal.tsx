"use client";

import React, { useState } from "react";
import { PREETI_CHEATSHEET, CheatSheetEntry } from "@/lib/preeti-keyboard-layout";
import { X, Search, Copy, Check, BookOpen, Lightbulb } from "lucide-react";

interface PreetiCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToSource: (text: string) => void;
}

export default function PreetiCheatSheetModal({
  isOpen,
  onClose,
  onInsertToSource,
}: PreetiCheatSheetModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("सबै (All)");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    "सबै (All)",
    "स्वर (Vowels)",
    "व्यञ्जन (Consonants)",
    "मात्रा (Vowel Signs)",
    "संयुक्त वर्ण (Conjuncts)",
    "अङ्क (Numbers)",
    "चिह्न (Symbols)",
  ];

  const filteredEntries = PREETI_CHEATSHEET.filter((entry) => {
    const matchesCategory =
      selectedCategory === "सबै (All)" || entry.category === selectedCategory;
    const matchesSearch =
      entry.devanagari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.preetiKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.englishKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Preeti Font Layout Cheatsheet (प्रिती किम्याप गाइड)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                कुन अक्षर टाइप गर्न कुन कुञ्जी दबाउने हेर्नुहोस्
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="खोजी गर्नुहोस् (उदा. ज्ञ, क्ष, f, s, रेफ, आदि)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Typing Pro-Tip Banner */}
        <div className="mx-4 mt-3 px-3.5 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-start space-x-2.5 text-xs text-indigo-900 dark:text-indigo-300">
          <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong>टिप:</strong> ह्रस्व इ-कार (ि) टाइप गर्दा पहिले <code>l</code> अनि अक्षर थिच्नुपर्छ (जस्तै <code>l + s = कि</code>)। रेफ (र्) को लागि वर्ण पछि <code>{`{`}</code> थिच्नुपर्छ (जस्तै <code>s + {`{`} = र्क</code>)।
          </div>
        </div>

        {/* Cheatsheet Grid */}
        <div className="p-4 overflow-y-auto flex-1 max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredEntries.map((entry, index) => {
              const id = `${entry.devanagari}-${index}`;
              const isCopied = copiedKey === id;

              return (
                <div
                  key={id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-devanagari text-lg font-bold text-slate-800 dark:text-slate-100">
                      {entry.devanagari}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {entry.englishKey}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Preeti: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{entry.preetiKey}</span>
                      </div>
                      {entry.notes && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopy(entry.devanagari, id)}
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      title="Copy character"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onInsertToSource(entry.devanagari)}
                      className="px-2 py-1 text-[11px] rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 font-medium"
                      title="Insert into editor"
                    >
                      थप्नुहोस्
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              कुनै परिणाम फेला परेन। अरू खोज्नुहोस्।
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}

