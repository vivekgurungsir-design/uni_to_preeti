"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  Copy,
  Trash2,
  Check,
  Download,
  ClipboardPaste,
  Eye,
  Code,
  FileDown,
} from "lucide-react";
import { calculateStats } from "@/lib/converter";
import { convertMixedText, MixedSegment } from "@/lib/mixed-language";
import { downloadAsDocx, copyToClipboardWithFormatting } from "@/lib/document-processor";

interface TranslatorPaneProps {
  onOpenVirtualKeyboard?: () => void;
  injectedText?: string | null;
}

export default function TranslatorPane({
  onOpenVirtualKeyboard,
  injectedText,
}: TranslatorPaneProps) {
  const [mode, setMode] = useState<"unicode-to-preeti" | "preeti-to-unicode">("unicode-to-preeti");
  const [sourceText, setSourceText] = useState("नेपाल एक सुन्दर देश हो । Supabase र Next.js मा Antigravity AI प्रयोग गर्नुहोस् ।");
  const [convertedText, setConvertedText] = useState("");
  const [segments, setSegments] = useState<MixedSegment[]>([]);
  const [viewMode, setViewMode] = useState<"visual" | "raw">("visual");
  const [copied, setCopied] = useState(false);

  // Synchronous mixed conversion
  const performConversion = (input: string, currentMode: "unicode-to-preeti" | "preeti-to-unicode") => {
    if (!input) {
      setConvertedText("");
      setSegments([]);
      return;
    }
    const { convertedText: converted, segments: segs } = convertMixedText(input, currentMode);
    setConvertedText(converted);
    setSegments(segs);
  };

  // Initial load
  useEffect(() => {
    performConversion(sourceText, mode);
  }, []);

  // Keystroke handler: fires in real-time as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSourceText(val);
    performConversion(val, mode);
  };

  // Swap direction
  const handleSwap = () => {
    const newMode = mode === "unicode-to-preeti" ? "preeti-to-unicode" : "unicode-to-preeti";
    const newSource = convertedText;
    setMode(newMode);
    setSourceText(newSource);
    performConversion(newSource, newMode);
  };

  // Mode button change
  const handleModeChange = (newMode: "unicode-to-preeti" | "preeti-to-unicode") => {
    setMode(newMode);
    performConversion(sourceText, newMode);
  };

  // React to injected text (virtual keyboard or samples)
  useEffect(() => {
    if (injectedText !== undefined && injectedText !== null) {
      setSourceText((prev) => {
        const next = prev + injectedText;
        performConversion(next, mode);
        return next;
      });
    }
  }, [injectedText, mode]);

  // Copy to clipboard with rich HTML so Microsoft Word formats it in Preeti and Arial!
  const handleCopy = async () => {
    if (!convertedText) return;
    await copyToClipboardWithFormatting(segments, mode, convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Paste into source
  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setSourceText(clipText);
      performConversion(clipText, mode);
    } catch {
      alert("कृपया सिधै इनपुट बाकसमा टाँस्नुहोस् (Ctrl+V)");
    }
  };

  // Clear text
  const handleClear = () => {
    setSourceText("");
    setConvertedText("");
    setSegments([]);
  };

  // Download .txt
  const handleDownloadTxt = () => {
    if (!convertedText) return;
    const blob = new Blob([convertedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nepali-converted.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download .docx with English font preservation
  const handleDownloadDocx = async () => {
    if (!convertedText) return;
    await downloadAsDocx(segments, mode, "nepali-converted.docx");
  };

  const sourceStats = calculateStats(sourceText);
  const targetStats = calculateStats(convertedText);
  const englishCount = segments.filter((s) => s.isEnglish).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Top Simple Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex p-1 bg-white/90 backdrop-blur border border-emerald-200/80 rounded-2xl shadow-sm">
          <button
            onClick={() => handleModeChange("unicode-to-preeti")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "unicode-to-preeti"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            युनिकोड → प्रिती
          </button>
          <button
            onClick={() => handleModeChange("preeti-to-unicode")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "preeti-to-unicode"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            प्रिती → युनिकोड
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-emerald-200 shadow-sm transition active:scale-95"
            title="दिशा बदल्नुहोस्"
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
          </button>

          {onOpenVirtualKeyboard && (
            <button
              onClick={onOpenVirtualKeyboard}
              className="px-3 sm:px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-sm transition hidden sm:inline-block"
            >
              भर्चुअल किबोर्ड
            </button>
          )}
        </div>
      </div>

      {/* Main Dual Box Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* ================= LEFT BOX (INPUT) ================= */}
        <div className="flex flex-col bg-white rounded-3xl border border-emerald-200 shadow-sm overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          {/* Header */}
          <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-emerald-50/40 border-b border-emerald-100 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-800">
              {mode === "unicode-to-preeti" ? "युनिकोड इनपुट" : "प्रिती इनपुट"}
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={handlePaste}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                title="टाँस्नुहोस्"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>पेस्ट</span>
              </button>
              {sourceText && (
                <button
                  onClick={handleClear}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition"
                  title="खाली गर्नुहोस्"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative flex-1 min-h-[260px] sm:min-h-[340px]">
            <textarea
              value={sourceText}
              onChange={handleInputChange}
              placeholder={
                mode === "unicode-to-preeti"
                  ? "यहाँ नेपाली युनिकोड टाइप गर्नुहोस्..."
                  : "यहाँ प्रिती टेक्स्ट टाइप गर्नुहोस्..."
              }
              className={`w-full h-full p-4 sm:p-5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none resize-none text-base sm:text-lg leading-relaxed ${
                mode === "unicode-to-preeti" ? "font-devanagari" : "font-mono"
              }`}
            />
          </div>

          {/* Footer Stats */}
          <div className="px-4 sm:px-5 py-2.5 bg-emerald-50/20 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-500">
            <span>वर्ण: {sourceStats.characters} | शब्द: {sourceStats.words}</span>
          </div>
        </div>

        {/* ================= RIGHT BOX (CONVERTED OUTPUT) ================= */}
        <div className="flex flex-col bg-white rounded-3xl border border-emerald-200 shadow-sm overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          {/* Header */}
          <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-emerald-50/40 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-sm text-slate-800">
              {mode === "unicode-to-preeti" ? "प्रिती नतिजा" : "युनिकोड नतिजा"}
            </span>

            {/* Actions: View Toggle, Download, Copy */}
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              {/* View Toggle */}
              <div className="flex items-center space-x-0.5 sm:space-x-1 bg-white rounded-lg p-0.5 border border-emerald-200 mr-0.5 sm:mr-1">
                <button
                  onClick={() => setViewMode("visual")}
                  className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    viewMode === "visual"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="अङ्ग्रेजी र प्रिती फन्ट मिलाइएको स्मार्ट दृश्य"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">स्मार्ट</span>
                </button>
                <button
                  onClick={() => setViewMode("raw")}
                  className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    viewMode === "raw"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="कच्चा टेक्स्ट"
                >
                  <Code className="w-3 h-3" />
                  <span className="hidden sm:inline">टेक्स्ट</span>
                </button>
              </div>

              <button
                onClick={handleDownloadDocx}
                disabled={!convertedText}
                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition disabled:opacity-40"
                title="Word (.docx) डाउनलोड (अङ्ग्रेजी र प्रिती फन्ट सुरक्षित)"
              >
                <FileDown className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadTxt}
                disabled={!convertedText}
                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition disabled:opacity-40"
                title="Text (.txt) डाउनलोड"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopy}
                disabled={!convertedText}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "कपी भयो" : "कपी"}</span>
              </button>
            </div>
          </div>

          {/* Text Area / Smart Visual View */}
          <div className="relative flex-1 min-h-[340px] p-5 overflow-y-auto leading-relaxed select-all">
            {viewMode === "visual" ? (
              <div className="whitespace-pre-wrap">
                {segments.length > 0 ? (
                  segments.map((seg, idx) => {
                    if (seg.isEnglish) {
                      const isPunctuationOnly = /^[():;?,.!_\-\s]+$/.test(seg.text);
                      if (isPunctuationOnly) {
                        return (
                          <span key={idx} className="font-sans text-slate-800">
                            {seg.text}
                          </span>
                        );
                      }
                      return (
                        <span
                          key={idx}
                          className="font-sans font-semibold text-emerald-900 bg-emerald-100/70 px-1 py-0.5 rounded border border-emerald-300/60 inline-block align-baseline mx-0.5 text-xs sm:text-sm"
                          title="संरक्षित अङ्ग्रेजी शब्द (Preserved English)"
                        >
                          {seg.text}
                        </span>
                      );
                    }

                    if (mode === "unicode-to-preeti") {
                      return (
                        <span key={idx} className="font-preeti text-xl text-slate-900">
                          {seg.convertedText}
                        </span>
                      );
                    } else {
                      return (
                        <span key={idx} className="font-devanagari text-base sm:text-lg text-slate-800">
                          {seg.convertedText}
                        </span>
                      );
                    }
                  })
                ) : (
                  <span className="text-slate-400 italic text-sm">
                    {mode === "unicode-to-preeti"
                      ? "यहाँ Preeti Font मा नतिजा देखिनेछ..."
                      : "यहाँ नेपाली युनिकोड नतिजा देखिनेछ..."}
                  </span>
                )}
              </div>
            ) : (
              <textarea
                readOnly
                value={convertedText}
                placeholder={
                  mode === "unicode-to-preeti"
                    ? "यहाँ Preeti Font मा नतिजा देखिनेछ..."
                    : "यहाँ नेपाली युनिकोड नतिजा देखिनेछ..."
                }
                className={`w-full h-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-relaxed select-all ${
                  mode === "unicode-to-preeti" ? "font-mono text-base" : "font-devanagari text-base sm:text-lg"
                }`}
              />
            )}
          </div>

          {/* Footer Stats */}
          <div className="px-5 py-2.5 bg-emerald-50/20 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-500">
            <span>वर्ण: {targetStats.characters} | शब्द: {targetStats.words}</span>
            {englishCount > 0 && (
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                ✓ {englishCount} अङ्ग्रेजी शब्द सुरक्षित
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
