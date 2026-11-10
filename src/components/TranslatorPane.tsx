"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeftRight,
  Copy,
  Check,
  Trash2,
  Upload,
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
  FileText,
  ClipboardPaste,
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

  // Styling & view controls
  const [fontSize, setFontSize] = useState<number>(16);
  const [renderWithPreetiFont, setRenderWithPreetiFont] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Save modal/popover states
  const [isSaving, setIsSaving] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveTags, setSaveTags] = useState("");
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample texts for 1-click test
  const sampleTexts = [
    {
      label: "नेपालको संविधान",
      text: "हामी सार्वभौमसत्तासम्पन्न नेपाली जनता; नेपालको स्वतन्त्रता, सार्वभौमिकता, भौगोलिक अखण्डता, राष्ट्रिय एकता, स्वाधीनता र स्वाभिमानलाई अक्षुण्ण राख्दै...",
      targetMode: "unicode-to-preeti" as const,
    },
    {
      label: "प्रविधि र विकास",
      text: "नेपालमा सूचना प्रविधिको विकास र विस्तार द्रुत गतिमा भइरहेको छ । कम्प्युटर र इन्टरनेटले हाम्रो जीवनशैलीलाई सहज बनाएको छ ।",
      targetMode: "unicode-to-preeti" as const,
    },
    {
      label: "Preeti Sample (g]kfn)",
      text: 'g]kfn Ps ;\'Gb/ / zflGtk"0f{ b]z xf] . oxfF ;+;f/s} ;a}eGbf cUnf] lzv/ ;u/dfyf /x]sf] 5 .',
      targetMode: "preeti-to-unicode" as const,
    },
  ];

  // React to injected text (e.g. from virtual keyboard or cheat sheet)
  useEffect(() => {
    if (injectedText !== undefined && injectedText !== null) {
      setSourceText((prev) => prev + injectedText);
    }
  }, [injectedText]);

  // Primary conversion logic
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
  };

  // Copy output
  const handleCopy = () => {
    if (!convertedText) return;
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setSourceText(clipText);
    } catch {
      alert("कृपया पाठ सिधै इनपुट बाकसमा टाँस्नुहोस् (Ctrl+V)");
    }
  };

  // Clear text
  const handleClear = () => {
    setSourceText("");
    setConvertedText("");
  };

  // Clean text helper
  const handleClean = () => {
    setSourceText((prev) => cleanNepaliText(prev));
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSourceText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Download converted text as .txt file
  const handleDownload = () => {
    if (!convertedText) return;
    const blob = new Blob([convertedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nepali-converted-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save to Cloud / Snippets
  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertedText || !sourceText) return;

    const tagsArray = saveTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const saved = await saveTranslation({
      title: saveTitle.trim() || "Untitled Translation",
      source_text: sourceText,
      converted_text: convertedText,
      conversion_mode: mode,
      is_public: true,
      tags: tagsArray,
    });

    setIsSaving(false);
    setIsSaveSuccess(true);
    setSaveTitle("");
    setSaveTags("");
    onSnippetSaved();
    setTimeout(() => setIsSaveSuccess(false), 3000);
  };

  const sourceStats = calculateStats(sourceText);
  const targetStats = calculateStats(convertedText);

  return (
    <div className={`w-full transition-all ${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-slate-900 p-4 overflow-y-auto" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"}`}>
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Mode Selector & Swap */}
        <div className="flex items-center space-x-2">
          {/* Mode Tabs */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                setAutoDetect(false);
                setMode("unicode-to-preeti");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === "unicode-to-preeti" && !autoDetect
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              युनिकोड → प्रिती
            </button>
            <button
              onClick={() => {
                setAutoDetect(false);
                setMode("preeti-to-unicode");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === "preeti-to-unicode" && !autoDetect
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              प्रिती → युनिकोड
            </button>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapDirections}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition"
            title="दिशा बदल्नुहोस् (Swap Directions)"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Auto Detect Switch */}
          <button
            onClick={() => setAutoDetect(!autoDetect)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              autoDetect
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                : "bg-transparent text-slate-500 border-slate-200 dark:border-slate-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>स्वचालित पत्ता लगाउने (Auto)</span>
          </button>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Clean text */}
          <button
            onClick={handleClean}
            disabled={!sourceText}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium disabled:opacity-40 transition"
            title="खाली ठाउँ र ढाँचा मिलाउनुहोस् (Normalize Spaces)"
          >
            सफा गर्नुहोस्
          </button>

          {/* Font Size controls */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="p-1 rounded text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
              title="Font smaller"
            >
              <Type className="w-3.5 h-3.5" />-
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-500">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(Math.min(28, fontSize + 2))}
              className="p-1 rounded text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
              title="Font bigger"
            >
              <Type className="w-4 h-4 font-bold" />+
            </button>
          </div>

          {/* Preeti font preview toggle */}
          {mode === "unicode-to-preeti" && (
            <button
              onClick={() => setRenderWithPreetiFont(!renderWithPreetiFont)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium transition ${
                renderWithPreetiFont
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              }`}
              title="Preeti फन्ट स्टाइलमा पूर्वावलोकन गर्नुहोस्"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>प्रिती फन्ट भ्यू</span>
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sample Texts Pills */}
      <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 dark:text-slate-500 shrink-0 flex items-center space-x-1 font-medium">
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
            }}
            className="px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-devanagari transition"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dual Pane Layout (Source -> Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: Source Text */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden focus-within:border-indigo-400 dark:focus-within:border-indigo-600 transition">
          {/* Pane Header */}
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {mode === "unicode-to-preeti" ? "नेपाली युनिकोड (Unicode)" : "प्रिती फन्ट (Preeti ASCII)"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                इनपुट
              </span>
            </div>

            {/* Pane Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* File upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
                title="टेक्स्ट फाइल लोड गर्नुहोस् (.txt)"
              >
                <Upload className="w-4 h-4" />
              </button>

              {/* Paste */}
              <button
                onClick={handlePaste}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
                title="क्लिपबोर्डबाट टाँस्नुहोस्"
              >
                <ClipboardPaste className="w-4 h-4" />
              </button>

              {/* Clear */}
              {sourceText && (
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="सबै खाली गर्नुहोस्"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[380px]">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={
                mode === "unicode-to-preeti"
                  ? "यहाँ नेपाली युनिकोड पाठ टाइप गर्नुहोस् वा टाँस्नुहोस् (जस्तै: नेपाल मेरो देश हो)..."
                  : "यहाँ प्रिती फन्ट टेक्स्ट टाइप वा पेस्ट गर्नुहोस् (जस्तै: g]kfn d]/f] b]z xf])..."
              }
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full h-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed ${
                mode === "unicode-to-preeti" ? "font-devanagari" : "font-mono"
              }`}
            />
          </div>

          {/* Pane Footer Stats */}
          <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-3">
              <span>वर्ण: <strong>{sourceStats.characters}</strong></span>
              <span>शब्द: <strong>{sourceStats.words}</strong></span>
              <span>पंक्ति: <strong>{sourceStats.lines}</strong></span>
            </div>
            <button
              onClick={onOpenVirtualKeyboard}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              + भर्चुअल किबोर्ड खोल्नुहोस्
            </button>
          </div>
        </div>

        {/* Right Pane: Converted Output */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden focus-within:border-emerald-400 dark:focus-within:border-emerald-600 transition">
          {/* Pane Header */}
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {mode === "unicode-to-preeti" ? "प्रिती फन्ट परिणाम (Preeti)" : "नेपाली युनिकोड परिणाम (Unicode)"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                परिणाम
              </span>
            </div>

            {/* Pane Action Buttons */}
            <div className="flex items-center space-x-1.5">
              {/* Copy */}
              <button
                onClick={handleCopy}
                disabled={!convertedText}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition"
                title="क्लिपबोर्डमा कपी गर्नुहोस्"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>कपी भयो!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>कपी</span>
                  </>
                )}
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={!convertedText}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 disabled:opacity-40 transition"
                title="टेक्स्ट फाइल डाउनलोड (.txt)"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Save to Cloud Snippets */}
              <button
                onClick={() => setIsSaving(!isSaving)}
                disabled={!convertedText}
                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 disabled:opacity-40 transition"
                title="क्लाउडमा सुरक्षित गर्नुहोस्"
              >
                <BookmarkPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Text Area Output */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[380px]">
            <textarea
              readOnly
              value={convertedText}
              placeholder="रूपान्तरित पाठ यहाँ देखिनेछ..."
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full h-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed select-all ${
                renderWithPreetiFont && mode === "unicode-to-preeti"
                  ? "font-preeti"
                  : mode === "preeti-to-unicode"
                  ? "font-devanagari"
                  : "font-mono"
              }`}
            />
          </div>

          {/* Pane Footer Stats & Feedback */}
          <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-3">
              <span>वर्ण: <strong>{targetStats.characters}</strong></span>
              <span>शब्द: <strong>{targetStats.words}</strong></span>
              <span>पंक्ति: <strong>{targetStats.lines}</strong></span>
            </div>

            {convertedText && (
              <button
                onClick={() => onOpenFeedback(sourceText, convertedText, mode)}
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 font-medium"
              >
                <Flag className="w-3 h-3" />
                <span>त्रुटि रिपोर्ट गर्नुहोस्</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save to Cloud Popover Form */}
      {isSaving && (
        <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl animate-in slide-in-from-top duration-200 max-w-xl mx-auto">
          <form onSubmit={handleSaveSnippet} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                <BookmarkCheck className="w-4 h-4 text-amber-500" />
                <span>यो अनुवादलाई सुरक्षित गर्नुहोस् (Save Snippet)</span>
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
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                शीर्षक (Title):
              </label>
              <input
                type="text"
                required
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="उदा. नागरिकता सिफारिस निवेदन, बजेट मस्यौदा..."
                className="mt-1 w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                ट्यागहरू (Tags - अल्पविरामले छुट्ट्याउनुहोस्):
              </label>
              <input
                type="text"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                placeholder="उदा. सरकारी, निवेदन, समाचार"
                className="mt-1 w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="px-3 py-1.5 text-xs rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                रद्द
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                सुरक्षित गर्नुहोस्
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Banner */}
      {isSaveSuccess && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm max-w-xl mx-auto shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>अनुवाद सफलतापूर्वक सुरक्षित भयो!</span>
          </div>
        </div>
      )}
    </div>
  );
}
