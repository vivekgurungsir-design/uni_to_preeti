"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSharedTranslation } from "@/lib/supabase";
import { SavedTranslation } from "@/types/database";
import {
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  Share2,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [translation, setTranslation] = useState<SavedTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedConverted, setCopiedConverted] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const data = await getSharedTranslation(id);
      setTranslation(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const copyText = (text: string, isSource: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSource) {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    } else {
      setCopiedConverted(true);
      setTimeout(() => setCopiedConverted(false), 2000);
    }
  };

  const handleOpenInEditor = () => {
    if (!translation) return;
    // Store in sessionStorage or query params for home page to pick up
    sessionStorage.setItem("shared_load_text", translation.source_text);
    sessionStorage.setItem("shared_load_mode", translation.conversion_mode);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm">अनुवाद लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (!translation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl text-center space-y-4 border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            अनुवाद फेला परेन
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            यो शेयर लिंक पुरानो भएको वा मेटिएको हुन सक्छ।
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
          >
            अनुवादकको गृहपृष्ठमा जानुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>अनुवादकमा फर्कनुहोस्</span>
          </button>

          <button
            onClick={handleOpenInEditor}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>एडिटरमा खोल्नुहोस्</span>
          </button>
        </div>

        {/* Translation Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
          {/* Card Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {translation.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {translation.conversion_mode === "unicode-to-preeti"
                    ? "Unicode → Preeti"
                    : "Preeti → Unicode"}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(translation.created_at).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {translation.tags && translation.tags.length > 0 && (
              <div className="flex items-center space-x-1.5 mt-2">
                {translation.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Texts Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>मूल पाठ (Source):</span>
                <button
                  onClick={() => copyText(translation.source_text, true)}
                  className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copiedSource ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>कपी भयो</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>कपी</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-devanagari text-sm leading-relaxed whitespace-pre-wrap min-h-[160px]">
                {translation.source_text}
              </div>
            </div>

            {/* Converted */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>रूपान्तरित पाठ (Output):</span>
                <button
                  onClick={() => copyText(translation.converted_text, false)}
                  className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copiedConverted ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>कपी भयो</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>कपी</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 text-sm leading-relaxed whitespace-pre-wrap min-h-[160px] font-mono select-all">
                {translation.converted_text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
