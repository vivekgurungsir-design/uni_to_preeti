"use client";

import React, { useState, useRef } from "react";
import {
  FileUp,
  FileText,
  Download,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileSpreadsheet,
  Trash2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { extractDocumentText, downloadAsDocx, downloadAsTxt, ExtractedDocument } from "@/lib/document-processor";
import { convertUnicodeToPreeti, convertPreetiToUnicode, detectTextType, calculateStats } from "@/lib/converter";

export default function DocumentConverterSection() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docData, setDocData] = useState<ExtractedDocument | null>(null);
  const [conversionMode, setConversionMode] = useState<"unicode-to-preeti" | "preeti-to-unicode">("unicode-to-preeti");
  const [autoDetect, setAutoDetect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedText, setConvertedText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile: File) => {
    try {
      setIsProcessing(true);
      setErrorMsg(null);
      setFile(selectedFile);

      const extracted = await extractDocumentText(selectedFile);
      setDocData(extracted);

      // Detect mode
      let targetMode = conversionMode;
      if (autoDetect && extracted.text) {
        targetMode = detectTextType(extracted.text);
        setConversionMode(targetMode);
      }

      // Convert
      const result =
        targetMode === "unicode-to-preeti"
          ? convertUnicodeToPreeti(extracted.text)
          : convertPreetiToUnicode(extracted.text);

      setConvertedText(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("फाइल पढ्न वा रूपान्तरण गर्न समस्या भयो। कृपया अर्को फाइल प्रयास गर्नुहोस्।");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleModeChange = (newMode: "unicode-to-preeti" | "preeti-to-unicode") => {
    setAutoDetect(false);
    setConversionMode(newMode);
    if (docData?.text) {
      const result =
        newMode === "unicode-to-preeti"
          ? convertUnicodeToPreeti(docData.text)
          : convertPreetiToUnicode(docData.text);
      setConvertedText(result);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDocData(null);
    setConvertedText("");
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadDocx = async () => {
    if (!convertedText || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const outName = `${baseName}_converted.docx`;
    const font = conversionMode === "unicode-to-preeti" ? "Preeti" : "Noto Sans Devanagari";
    await downloadAsDocx(convertedText, font, outName);
  };

  const handleDownloadTxt = () => {
    if (!convertedText || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const outName = `${baseName}_converted.txt`;
    downloadAsTxt(convertedText, outName);
  };

  const handleCopy = () => {
    if (!convertedText) return;
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = calculateStats(convertedText);

  return (
    <section id="doc-converter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>कागजात रूपान्तरण (Document Batch Converter)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          सम्पूर्ण वर्ड (.docx) तथा टेक्स्ट (.txt) फाइल रूपान्तरण गर्नुहोस्
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          तपाईंको कम्प्युटरमा रहेको नेपाली युनिकोड वा प्रिती फन्टको डकुमेन्ट एकै क्लिकमा रूपान्तरण गरी पुनः डाउनलोड गर्नुहोस्।
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Upload State */}
        {!docData ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`p-10 sm:p-14 text-center border-2 border-dashed rounded-3xl transition-all m-4 ${
              dragActive
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,.rtf,.doc"
              onChange={handleChange}
              className="hidden"
            />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
              <FileUp className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              यहाँ डकुमेन्ट तान्नुहोस् (Drag & Drop) वा ब्राउज गर्नुहोस्
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              समर्थित ढाँचाहरू: <strong>.docx (Word)</strong>, <strong>.txt (Text)</strong>, <strong>.rtf</strong>
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              फाइल छान्नुहोस् (Choose File)
            </button>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-left text-xs">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">प्याराग्राफ संरक्षण</strong>
                  <p className="text-slate-500 dark:text-slate-400">लाइन ब्रेक र ढाँचा कायम रहन्छ।</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Preeti & Unicode दुवै</strong>
                  <p className="text-slate-500 dark:text-slate-400">दुवै दिशामा शतप्रतिशत शुद्ध रूपान्तरण।</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Word .DOCX डाउनलोड</strong>
                  <p className="text-slate-500 dark:text-slate-400">सिधै नयाँ Word फाइलको रूपमा डाउनलोड।</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Result & Preview State */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {file?.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{((file?.size || 0) / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>{stats.words} शब्दहरू</span>
                    <span>•</span>
                    <span>{stats.lines} पंक्तिहरू</span>
                  </div>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center space-x-2">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => handleModeChange("unicode-to-preeti")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      conversionMode === "unicode-to-preeti"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Unicode → Preeti
                  </button>
                  <button
                    onClick={() => handleModeChange("preeti-to-unicode")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      conversionMode === "preeti-to-unicode"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Preeti → Unicode
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="अर्को फाइल लोड गर्नुहोस्"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Side by side Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>मूल डकुमेन्ट (Original Text):</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 h-80 overflow-y-auto text-xs leading-relaxed font-devanagari whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {docData.text}
                </div>
              </div>

              {/* Converted Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>रूपान्तरित नतिजा (Converted Output):</span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                    {conversionMode === "unicode-to-preeti" ? "Preeti Font" : "Unicode"}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/60 h-80 overflow-y-auto text-xs leading-relaxed whitespace-pre-wrap text-slate-900 dark:text-slate-100 ${
                    conversionMode === "unicode-to-preeti" ? "font-preeti text-sm" : "font-devanagari"
                  }`}
                >
                  {convertedText}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>कपी भयो!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>सबै कपी गर्नुहोस्</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                >
                  <Download className="w-4 h-4" />
                  <span>.TXT डाउनलोड</span>
                </button>
                <button
                  onClick={handleDownloadDocx}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>वर्ड (.DOCX) डाउनलोड</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

