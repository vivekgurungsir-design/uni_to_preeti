"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Download,
  Copy,
  Check,
  RotateCcw,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  Eye,
  Code,
} from "lucide-react";
import {
  extractDocumentText,
  downloadAsDocx,
  downloadAsTxt,
  copyToClipboardWithFormatting,
  ExtractedDocument,
} from "@/lib/document-processor";
import { detectTextType, calculateStats } from "@/lib/converter";
import {
  convertMixedText,
  MixedSegment,
} from "@/lib/mixed-language";

export default function DocumentConverterSection() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docData, setDocData] = useState<ExtractedDocument | null>(null);
  const [conversionMode, setConversionMode] = useState<"unicode-to-preeti" | "preeti-to-unicode">("unicode-to-preeti");
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedText, setConvertedText] = useState<string>("");
  const [segments, setSegments] = useState<MixedSegment[]>([]);
  const [viewMode, setViewMode] = useState<"visual" | "raw">("visual");
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

      // Automatic language/font detection
      const detected = detectTextType(extracted.text);
      setConversionMode(detected);

      // Convert preserving English segments exactly
      const { convertedText: converted, segments: segs } = convertMixedText(extracted.text, detected);
      setConvertedText(converted);
      setSegments(segs);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("फाइल पढ्न वा रूपान्तरण गर्न सकिएन। कृपया मान्य .docx वा .txt फाइल छान्नुहोस्।");
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

  const handleModeToggle = (newMode: "unicode-to-preeti" | "preeti-to-unicode") => {
    setConversionMode(newMode);
    if (docData?.text) {
      const { convertedText: converted, segments: segs } = convertMixedText(docData.text, newMode);
      setConvertedText(converted);
      setSegments(segs);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDocData(null);
    setConvertedText("");
    setSegments([]);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadDocx = async () => {
    if (!convertedText || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const outName = `${baseName}_converted.docx`;
    await downloadAsDocx(segments, conversionMode, outName);
  };

  const handleDownloadTxt = () => {
    if (!convertedText || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const outName = `${baseName}_converted.txt`;
    downloadAsTxt(convertedText, outName);
  };

  const handleCopy = async () => {
    if (!convertedText) return;
    await copyToClipboardWithFormatting(segments, conversionMode, convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const originalStats = calculateStats(docData?.text || "");
  const convertedStats = calculateStats(convertedText);
  const englishSegmentsCount = segments.filter((s) => s.isEnglish).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Section Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight font-devanagari">
          कागजात फाइल रूपान्तरण (File Converter)
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 font-devanagari">
          Word (.docx) वा Text (.txt) फाइल अपलोड गर्नुहोस् — नेपाली रूपान्तरण हुन्छ, अङ्ग्रेजी शब्दहरू जस्ताको तस्तै सुरक्षित रहन्छन्।
        </p>
      </div>

      {/* Main Upload / Conversion Card */}
      <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-sm overflow-hidden transition-all">
        {!docData ? (
          /* ================= DRAG & DROP UPLOAD ZONE ================= */
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`p-8 sm:p-12 text-center transition-all ${
              dragActive
                ? "bg-emerald-50/80 border-2 border-dashed border-emerald-500 m-3 rounded-2xl"
                : "hover:bg-emerald-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,.rtf"
              onChange={handleChange}
              className="hidden"
            />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 font-devanagari">
              यहाँ फाइल तान्नुहोस् (Drag & Drop) वा छान्नुहोस्
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-3 font-devanagari">
              समर्थित ढाँचाहरू: <strong>.docx (Word)</strong>, <strong>.txt (Text)</strong>, <strong>.rtf</strong>
            </p>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium mb-5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>नेपाली र अङ्ग्रेजी मिश्रित कागजात पूर्ण रूपमा सुरक्षित रहने प्रविधि</span>
            </div>

            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm shadow-sm transition"
              >
                {isProcessing ? "प्रशोधन हुँदैछ..." : "फाइल छान्नुहोस्"}
              </button>
            </div>

            {errorMsg && (
              <p className="mt-4 text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}
          </div>
        ) : (
          /* ================= CONVERTED RESULT & PREVIEW ZONE ================= */
          <div className="p-5 sm:p-6 space-y-5">
            {/* Top Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 truncate max-w-[240px] sm:max-w-md">
                    {file?.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{((file?.size || 0) / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span className="inline-flex items-center text-emerald-700 font-medium">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {conversionMode === "unicode-to-preeti"
                        ? "युनिकोड पहिचान → प्रितीमा रूपान्तरण"
                        : "प्रिती पहिचान → युनिकोडमा रूपान्तरण"}
                    </span>
                    {englishSegmentsCount > 0 && (
                      <span className="inline-flex items-center text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        ✓ {englishSegmentsCount} अङ्ग्रेजी शब्द सुरक्षित
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mode Switcher & Reset */}
              <div className="flex items-center space-x-2">
                <div className="inline-flex p-1 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs font-semibold">
                  <button
                    onClick={() => handleModeToggle("unicode-to-preeti")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      conversionMode === "unicode-to-preeti"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    → प्रिती
                  </button>
                  <button
                    onClick={() => handleModeToggle("preeti-to-unicode")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      conversionMode === "preeti-to-unicode"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    → युनिकोड
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
                  title="नयाँ फाइल अपलोड गर्नुहोस्"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">नयाँ फाइल</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Dual Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Document Preview */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
                  <span>मूल कागजात (Original)</span>
                  <span className="text-slate-500 font-normal">शब्द: {originalStats.words}</span>
                </div>
                <div className="p-4 max-h-72 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-devanagari whitespace-pre-wrap select-all">
                  {docData.text || "(खाली फाइल)"}
                </div>
              </div>

              {/* Converted Document Preview */}
              <div className="flex flex-col rounded-2xl border border-emerald-300 bg-white overflow-hidden shadow-inner">
                <div className="px-4 py-2.5 bg-emerald-100/60 border-b border-emerald-200 text-xs font-bold text-emerald-900 flex justify-between items-center">
                  <span>रूपान्तरित नतिजा (Converted)</span>
                  
                  {/* View Mode Toggle: Visual vs Raw */}
                  <div className="flex items-center space-x-1 bg-white/80 rounded-lg p-0.5 border border-emerald-200">
                    <button
                      onClick={() => setViewMode("visual")}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                        viewMode === "visual"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      title="अङ्ग्रेजी र प्रिती फन्ट मिलाइएको दृश्य"
                    >
                      <Eye className="w-3 h-3" />
                      <span>स्मार्ट दृश्य</span>
                    </button>
                    <button
                      onClick={() => setViewMode("raw")}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                        viewMode === "raw"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      title="कच्चा टेक्स्ट"
                    >
                      <Code className="w-3 h-3" />
                      <span>कच्चा</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 max-h-72 overflow-y-auto leading-relaxed select-all">
                  {viewMode === "visual" ? (
                    /* Smart Visual Mode: Renders English in English font and Nepali in Preeti/Unicode */
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

                          if (conversionMode === "unicode-to-preeti") {
                            return (
                              <span key={idx} className="font-preeti text-xl text-slate-900">
                                {seg.convertedText}
                              </span>
                            );
                          } else {
                            return (
                              <span key={idx} className="font-devanagari text-xs sm:text-sm text-slate-800">
                                {seg.convertedText}
                              </span>
                            );
                          }
                        })
                      ) : (
                        <span className="text-slate-400 italic text-xs">(नतिजा छैन)</span>
                      )}
                    </div>
                  ) : (
                    /* Raw text mode */
                    <div
                      className={`whitespace-pre-wrap ${
                        conversionMode === "unicode-to-preeti" ? "font-mono text-sm text-slate-800" : "font-devanagari text-sm text-slate-800"
                      }`}
                    >
                      {convertedText || "(नतिजा छैन)"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons: Download DOCX, Download TXT, Copy */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500 font-devanagari">
                💡 <span className="text-emerald-700 font-semibold">Word (.docx)</span> डाउनलोड गर्दा अङ्ग्रेजी शब्दहरू <strong>Arial</strong> मा र नेपाली शब्दहरू <strong>Preeti</strong> मा स्वतः मिलाएर सुरक्षित हुन्छ।
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold shadow-sm transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{copied ? "कपी भयो!" : "सबै कपी"}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Text (.txt) डाउनलोड</span>
                </button>

                <button
                  onClick={handleDownloadDocx}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Word (.docx) डाउनलोड</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
