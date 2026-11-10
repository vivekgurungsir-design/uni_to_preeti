"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Play, Sparkles, Check, ArrowRight } from "lucide-react";
import { convertUnicodeToPreeti, convertPreetiToUnicode } from "@/lib/converter";

interface TestCase {
  name: string;
  unicode: string;
  preeti: string;
  category: string;
}

export const TEST_CASES: TestCase[] = [
  { name: "देशको नाम", unicode: "नेपाल", preeti: "g]kfn", category: "सामान्य" },
  { name: "अभिवादन", unicode: "नमस्ते", preeti: "gd;\\t]", category: "सामान्य" },
  { name: "संविधान", unicode: "संविधान", preeti: ";+ljwfg", category: "अनुस्वार" },
  { name: "प्रविधि", unicode: "प्रविधि", preeti: "k|ljlw", category: "र-आकार" },
  { name: "शिक्षा", unicode: "शिक्षा", preeti: "lzIff", category: "संयुक्त वर्ण" },
  { name: "ज्ञान", unicode: "ज्ञान", preeti: "1fg", category: "संयुक्त वर्ण" },
  { name: "कार्य", unicode: "कार्य", preeti: "sfo{", category: "रेफ" },
  { name: "विद्यार्थी", unicode: "विद्यार्थी", preeti: "ljBfyL{", category: "मिश्रित" },
  { name: "दृष्टिकोण", unicode: "दृष्टिकोण", preeti: "b[li6sf]0f", category: "ऋ-कार/ष्ट" },
  { name: "अन्तर्राष्ट्रिय", unicode: "अन्तर्राष्ट्रिय", preeti: "cGt/f{li6«o", category: "जटिल रेफ/ट्र" },
  { name: "संख्या", unicode: "०१२३४५६७८९", preeti: ")!@#$%^&*(", category: "अङ्कहरू" },
];

interface AccuracyVerifierProps {
  onLoadTestCase: (text: string, mode: "unicode-to-preeti" | "preeti-to-unicode") => void;
}

export default function AccuracyVerifier({ onLoadTestCase }: AccuracyVerifierProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                शुद्धता तथा जटिल शब्द परीक्षण (Accuracy Benchmark Suite)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              नेपाली भाषाका जटिल संयुक्त वर्ण, रेफ, र-आकार र हलन्तको रूपान्तरण शुद्धता यहाँ जाँच्नुहोस्
            </p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            {isOpen ? "सूची लुकाउनुहोस् ▲" : "परीक्षण शब्दहरू हेर्नुहोस् ▼"}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEST_CASES.map((tc, idx) => {
              const convertedToPreeti = convertUnicodeToPreeti(tc.unicode);
              const convertedToUni = convertPreetiToUnicode(tc.preeti);
              const isPreetiMatch = convertedToPreeti === tc.preeti;

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-600 transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {tc.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {tc.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>Unicode:</span>
                      <strong className="font-devanagari text-indigo-600 dark:text-indigo-400">
                        {tc.unicode}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>Preeti:</span>
                      <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                        {tc.preeti}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>प्रमाणित</span>
                    </span>
                    <button
                      onClick={() => onLoadTestCase(tc.unicode, "unicode-to-preeti")}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center space-x-1"
                    >
                      <span>एडिटरमा हाल्नुहोस्</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

