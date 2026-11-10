"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeftRight,
  Copy,
  Check,
  Trash2,
  Download,
  Share2,
  BookmarkPlus,
  BookmarkCheck,
  Sparkles,
  Maximize2,
  Minimize2,
  Eye,
  Type,
  Flag,
  ClipboardPaste,
  FileText,
  FileCode,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import {
  convertUnicodeToPreeti,
  convertPreetiToUnicode,
  detectTextType,
  calculateStats,
  cleanNepaliText,
} from "@/lib/converter";
import { saveTranslation } from "@/lib/supabase";
import { SavedTranslation } from "@/types/database";
import { downloadAsDocx, downloadAsTxt } from "@/lib/document-processor";

interface TranslatorPaneProps {
  onOpenVirtualKeyboard: () => void;
  onOpenFeedback: (orig: string, converted: string, mode: "unicode-to-preeti" | "preeti-to-unicode") => void;
  onOpenShare: (snippet: SavedTranslation) => void;
  onSnippetSaved: () => void;
  injectedText?: string | null;
}

export default function TranslatorPane({
  onOpenVirtualKeyboard,
  onOpenFeedback,
  onOpenShare,
  onSnippetSaved,
  injectedText,
}: TranslatorPaneProps) {
  const [sourceText, setSourceText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [mode, setMode] = useState<"unicode-to-preeti" | "preeti-to-unicode">("unicode-to-preeti");
  const [autoDetect, setAutoDetect] = useState(true);

  // Font and display mode for output
  const [fontSize, setFontSize] = useState<number>(18);
  const [outputDisplayMode, setOutputDisplayMode] = useState<"preeti-font" | "raw-ascii">("preeti-font");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveTags, setSaveTags] = useState("");

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sample texts for 1-click test
  const sampleTexts = [
    {
      label: "नेपालको संविधान",
      text: "हामी सार्वभौमसत्तासम्पन्न नेपाली जनता; नेपालको स्वतन्त्रता, सार्वभौमिकता, भौगोलिक अखण्डता, राष्ट्रिय एकता, स्वाधीनता र स्वाभिमानलाई अक्षुण्ण राख्दै...",
      targetMode: "unicode-to-preeti" as const,
    },
    {
      label: "प्रविधि र विज्ञान",
      text: "नेपालमा सूचना प्रविधिको विकास र विस्तार द्रुत गतिमा भइरहेको छ । कम्प्युटर र इन्टरनेटले आधुनिक युगको जीवनशैलीलाई सहज बनाएको छ ।",
      targetMode: "unicode-to-preeti" as const,
    },
    {
      label: "Preeti Sample (g]kfn)",
      text: 'g]kfn Ps ;\'Gb/ / zflGtk"0f{ b]z xf] . oxfF ;+;f/s} ;a}eGbf cUnf] lzv/ ;u/dfyf /x]sf] 5 .',
      targetMode: "preeti-to-unicode" as const,
    },
    {
      label: "सरकारी निवेदन",
      text: "श्रीमान् प्रमुख प्रशासकीय अधिकृतज्यू, विषय: नागरिकता प्रमाणपत्र सिफारिस पाउँ बारे । महोदय, उपरोक्त सम्बन्धमा म निवेदक...",
      targetMode: "unicode-to-preeti" as const,
    },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // React to injected text
  useEffect(() => {
    if (injectedText !== undefined && injectedText !== null) {
      setSourceText((prev) => prev + injectedText);
    }
  }, [injectedText]);

  // Conversion engine
  useEffect(() => {
    if (!sourceText) {
      setConvertedText("");
      return;
    }

    let activeMode = mode;
    if (autoDetect) {
      const detected = detectTextType(sourceText);
      if (detected !== mode) {
        setMode(detected);
        activeMode = detected;
      }
    }

    if (activeMode === "unicode-to-preeti") {
      setConvertedText(convertUnicodeToPreeti(sourceText));
    } else {
      setConvertedText(convertPreetiToUnicode(sourceText));
    }
  }, [sourceText, mode, autoDetect]);

  // Direction swap
  const handleSwapDirections = () => {
    setAutoDetect(false);
    const newMode = mode === "unicode-to-preeti" ? "preeti-to-unicode" : "unicode-to-preeti";
    setMode(newMode);
    setSourceText(convertedText);
    showToast("रूपान्तरण दिशा उल्ट्याइयो (Directions Swapped)");
  };

  // Copy output
  const handleCopy = () => {
    if (!convertedText) return;
    navigator.clipboard.writeText(convertedText);
    showToast("नतिजा क्लिपबोर्डमा कपी भयो (Copied to Clipboard)!");
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setSourceText(clipText);
      showToast("क्लिपबोर्डबाट टाँसियो (Pasted from Clipboard)");
    } catch {
      alert("कृपया पाठ सिधै इनपुट बाकसमा टाँस्नुहोस् (Ctrl+V)");
    }
  };

  // Clear text
  const handleClear = () => {
    setSourceText("");
    setConvertedText("");
    showToast("सबै खाली गरियो (Cleared)");
  };

  // Clean text helper
  const handleClean = () => {
    setSourceText((prev) => cleanNepaliText(prev));
    showToast("खाली ठाउँ र ढाँचा मिलाइयो (Cleaned & Normalized)");
  };

  // Download converted text as .docx file
  const handleDownloadDocx = async () => {
    if (!convertedText) return;
    const fontName = mode === "unicode-to-preeti" ? "Preeti" : "Noto Sans Devanagari";
    await downloadAsDocx(convertedText, fontName, `nepali-converted-${Date.now()}.docx`);
    showToast("Word (.docx) फाइल डाउनलोड भयो!");
  };

  // Download converted text as .txt file
  const handleDownloadTxt = () => {
    if (!convertedText) return;
    downloadAsTxt(convertedText, `nepali-converted-${Date.now()}.txt`);
    showToast("Text (.txt) फाइल डाउनलोड भयो!");
  };

  // Save to Cloud / Snippets
  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertedText || !sourceText) return;

    const tagsArray = saveTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await saveTranslation({
      title: saveTitle.trim() || "Untitled Translation",
      source_text: sourceText,
      converted_text: convertedText,
      conversion_mode: mode,
      is_public: true,
      tags: tagsArray,
    });

    setIsSaving(false);
    setSaveTitle("");
    setSaveTags("");
    onSnippetSaved();
    showToast("क्लाउडमा सफलतापूर्वक सुरक्षित भयो (Saved to Cloud)!");
  };

  const sourceStats = calculateStats(sourceText);
  const targetStats = calculateStats(convertedText);

  return (
    <div
      className={`w-full transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto"
          : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-2 border border-slate-700 dark:border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Mode Toolbar & Direction Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
        {/* Direction Selector Group */}
        <div className="flex items-center space-x-2">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                setAutoDetect(false);
                setMode("unicode-to-preeti");
              }}
              className={`px-4 py-2 rounded-xl transition-all ${
                mode === "unicode-to-preeti" && !autoDetect
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              युनिकोड → प्रिती (Unicode to Preeti)
            </button>
            <button
              onClick={() => {
                setAutoDetect(false);
                setMode("preeti-to-unicode");
              }}
              className={`px-4 py-2 rounded-xl transition-all ${
                mode === "preeti-to-unicode" && !autoDetect
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              प्रिती → युनिकोड (Preeti to Unicode)
            </button>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapDirections}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition active:scale-95 shadow-sm"
            title="दिशा बदल्नुहोस् (Swap Direction)"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Auto Detect Switch */}
          <button
            onClick={() => {
              setAutoDetect(!autoDetect);
              showToast(
                autoDetect ? "स्वचालित पहिचान बन्द (Auto-detect OFF)" : "स्वचालित पहिचान चालु (Auto-detect ON)"
              );
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-semibold transition border ${
              autoDetect
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-sm"
                : "bg-transparent text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">स्वचालित पहिचान</span>
            <span className="sm:hidden">Auto</span>
          </button>
        </div>

        {/* View & Utility Toolbar */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Clean text */}
          <button
            onClick={handleClean}
            disabled={!sourceText}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-40 transition"
            title="खाली ठाउँ र विराम चिन्ह मिलाउनुहोस्"
          >
            सफा गर्नुहोस्
          </button>

          {/* Font Size controls */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-1 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 font-bold"
              title="Font smaller"
            >
              A-
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-500">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className="px-2 py-1 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 font-bold"
              title="Font bigger"
            >
              A+
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sample Texts Pills */}
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-1 text-xs select-none">
        <span className="text-slate-400 dark:text-slate-500 shrink-0 flex items-center space-x-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>नमुना पाठ:</span>
        </span>
        {sampleTexts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setAutoDetect(false);
              setMode(item.targetMode);
              setSourceText(item.text);
              showToast(`'${item.label}' लोड गरियो`);
            }}
            className="px-3 py-1.5 rounded-full whitespace-nowrap bg-white dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-devanagari transition shadow-xs"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Central Conversion Workspace: Two Equal Sized Editor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ================= LEFT PANEL ================= */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-all">
          {/* Left Panel Header */}
          <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {mode === "unicode-to-preeti" ? "नेपाली युनिकोड (Unicode Input)" : "प्रिती फन्ट इनपुट (Preeti Input)"}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold">
                इनपुट
              </span>
            </div>

            {/* Panel Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePaste}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-xs font-semibold transition"
                title="क्लिपबोर्डबाट टाँस्नुहोस् (Paste)"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">पेस्ट</span>
              </button>

              {sourceText && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="सबै खाली गर्नुहोस् (Clear)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Left Editor Textarea */}
          <div className="relative flex-1 min-h-[340px] sm:min-h-[420px]">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={
                mode === "unicode-to-preeti"
                  ? "यहाँ नेपाली युनिकोड टाइप गर्नुहोस्..."
                  : "यहाँ Preeti Font मा लेखिएको टेक्स्ट टाइप वा पेस्ट गर्नुहोस्..."
              }
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full h-full p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed ${
                mode === "unicode-to-preeti" ? "font-devanagari" : "font-mono"
              }`}
            />
          </div>

          {/* Left Panel Footer Stats */}
          <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-3">
              <span>वर्ण: <strong className="text-slate-800 dark:text-slate-200">{sourceStats.characters}</strong></span>
              <span>शब्द: <strong className="text-slate-800 dark:text-slate-200">{sourceStats.words}</strong></span>
              <span>पंक्ति: <strong className="text-slate-800 dark:text-slate-200">{sourceStats.lines}</strong></span>
            </div>
            <button
              onClick={onOpenVirtualKeyboard}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs"
            >
              + भर्चुअल किबोर्ड
            </button>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-all glow-indigo">
          {/* Right Panel Header */}
          <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {mode === "unicode-to-preeti" ? "Preeti Font नतिजा" : "नेपाली युनिकोड नतिजा"}
              </span>

              {/* Preeti font rendering indicator badge */}
              {mode === "unicode-to-preeti" && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center space-x-1">
                  <span>Preeti.ttf सक्रिय</span>
                </span>
              )}
            </div>

            {/* Right Panel Font View Toggle & Actions */}
            <div className="flex items-center space-x-1.5">
              {/* If Preeti output, allow toggling between Preeti font visual rendering and Raw ASCII text */}
              {mode === "unicode-to-preeti" && (
                <div className="flex p-0.5 bg-slate-200 dark:bg-slate-800 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => setOutputDisplayMode("preeti-font")}
                    className={`px-2 py-1 rounded-lg transition ${
                      outputDisplayMode === "preeti-font"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                    title="Preeti.ttf फन्टमा नेपाली अक्षर हेर्नुहोस्"
                  >
                    प्रिती फन्ट भ्यू
                  </button>
                  <button
                    onClick={() => setOutputDisplayMode("raw-ascii")}
                    className={`px-2 py-1 rounded-lg transition ${
                      outputDisplayMode === "raw-ascii"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                    title="कच्चा क्यारेक्टर कोड (ASCII: g]kfn) हेर्नुहोस्"
                  >
                    ASCII कोड
                  </button>
                </div>
              )}

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                disabled={!convertedText}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md transition"
                title="क्लिपबोर्डमा कपी गर्नुहोस्"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>कपी</span>
              </button>
            </div>
          </div>

          {/* Right Editor Output Area */}
          <div className="relative flex-1 min-h-[340px] sm:min-h-[420px]">
            <textarea
              readOnly
              value={convertedText}
              placeholder={
                mode === "unicode-to-preeti"
                  ? "यहाँ Preeti Font मा नतिजा देखिनेछ..."
                  : "यहाँ नेपाली युनिकोड नतिजा देखिनेछ..."
              }
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full h-full p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed select-all ${
                mode === "unicode-to-preeti"
                  ? outputDisplayMode === "preeti-font"
                    ? "font-preeti text-lg"
                    : "font-mono"
                  : "font-devanagari"
              }`}
            />
          </div>

          {/* Right Panel Footer: Actions & Stats */}
          <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-3">
              <span>वर्ण: <strong className="text-slate-800 dark:text-slate-200">{targetStats.characters}</strong></span>
              <span>शब्द: <strong className="text-slate-800 dark:text-slate-200">{targetStats.words}</strong></span>
            </div>

            {/* Download and Cloud Buttons */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleDownloadTxt}
                disabled={!convertedText}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 font-semibold transition"
                title="Text फाइल डाउनलोड (.txt)"
              >
                <Download className="w-3 h-3" />
                <span>.TXT</span>
              </button>
              <button
                onClick={handleDownloadDocx}
                disabled={!convertedText}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 disabled:opacity-40 font-semibold transition"
                title="Word डकुमेन्ट डाउनलोड (.docx)"
              >
                <Download className="w-3 h-3" />
                <span>.DOCX</span>
              </button>
              <button
                onClick={() => setIsSaving(!isSaving)}
                disabled={!convertedText}
                className="p-1.5 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 disabled:opacity-40 transition"
                title="क्लाउडमा सुरक्षित गर्नुहोस्"
              >
                <BookmarkPlus className="w-4 h-4" />
              </button>
              {convertedText && (
                <button
                  onClick={() => onOpenFeedback(sourceText, convertedText, mode)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="त्रुटि रिपोर्ट गर्नुहोस्"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save to Cloud Popover Form */}
      {isSaving && (
        <div className="mt-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-top duration-200 max-w-xl mx-auto">
          <form onSubmit={handleSaveSnippet} className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <BookmarkCheck className="w-4 h-4 text-amber-500" />
                <span>यो अनुवादलाई क्लाउडमा सुरक्षित गर्नुहोस् (Save Snippet)</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                शीर्षक (Title):
              </label>
              <input
                type="text"
                required
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="उदा. सरकारी सिफारिस मस्यौदा, बजेट वक्तव्य..."
                className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                ट्यागहरू (Tags - अल्पविरामले छुट्ट्याउनुहोस्):
              </label>
              <input
                type="text"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                placeholder="उदा. निवेदन, अफिस, समाचार"
                className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="px-3 py-1.5 text-xs rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                रद्द
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              >
                सुरक्षित गर्नुहोस्
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
