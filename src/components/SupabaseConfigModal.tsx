"use client";

import React, { useState } from "react";
import { X, Database, Check, Copy, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupabaseConfigModal({
  isOpen,
  onClose,
}: SupabaseConfigModalProps) {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const configured = isSupabaseConfigured();

  if (!isOpen) return null;

  const sqlSchema = `-- =======================================================
-- Supabase Schema for Unicode <-> Preeti Translator
-- Paste & Run in Supabase SQL Editor
-- =======================================================

CREATE TABLE IF NOT EXISTS public.saved_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Conversion',
    source_text TEXT NOT NULL,
    converted_text TEXT NOT NULL,
    conversion_mode TEXT NOT NULL CHECK (conversion_mode IN ('unicode-to-preeti', 'preeti-to-unicode')),
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    is_public BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.feedback_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    original_text TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    actual_output TEXT NOT NULL,
    conversion_mode TEXT NOT NULL CHECK (conversion_mode IN ('unicode-to-preeti', 'preeti-to-unicode')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.saved_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public translations are viewable by everyone" 
    ON public.saved_translations FOR SELECT 
    USING (is_public = true OR auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create translations" 
    ON public.saved_translations FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users can update their own translations" 
    ON public.saved_translations FOR UPDATE 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own translations" 
    ON public.saved_translations FOR DELETE 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can submit feedback" 
    ON public.feedback_reports FOR INSERT 
    WITH CHECK (true);
`;

  const envSample = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const copyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Supabase Database Setup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                क्लाउड सिंक, शेयरिङ र अनुवाद सङ्ग्रहको लागि Supabase कन्फिगर गर्नुहोस्
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status Alert */}
          {configured ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-xs sm:text-sm">
                  Supabase सफलतापूर्वक जोडिएको छ!
                </span>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  तपाईंका अनुवादहरू सिधै तपाईंको Supabase Postgres डेटाबेसमा सुरक्षित हुन्छन्।
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start space-x-3 text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs sm:text-sm">
                  स्थानीय भण्डारण मोड (Local Storage Mode)
                </span>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  अहिले एप पूर्ण रूपमा ब्राउजरको LocalStorage मा चलिरहेको छ। क्लाउड सिंक र पब्लिक शेयरिङ लिंकको लागि तलका ३ चरणहरू पूरा गरी Supabase जोड्नुहोस्।
                </p>
              </div>
            </div>
          )}

          {/* Setup Steps */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              ३ सजिलो चरणमा Supabase जोड्ने तरिका:
            </h3>

            {/* Step 1 */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  चरण १: नि:शुल्क Supabase प्रोजेक्ट बनाउनुहोस्
                </span>
                <a
                  href="https://database.new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <span>database.new खोल्नुहोस्</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supabase मा गएर नयाँ प्रोजेक्ट सिर्जना गर्नुहोस् र Project URL तथा Anon Public API Key लिनुहोस्।
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  चरण २: SQL Editor मा तालिका (Tables) सिर्जना गर्नुहोस्
                </span>
                <button
                  onClick={copySql}
                  className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 font-medium"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>कपी भयो!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>SQL कपी गर्नुहोस्</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono max-h-32 overflow-y-auto">
                {sqlSchema}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  चरण ३: <code>.env.local</code> फाइलमा किहरू राख्नुहोस्
                </span>
                <button
                  onClick={copyEnv}
                  className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 font-medium"
                >
                  {copiedEnv ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>कपी भयो!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Env कपी गर्नुहोस्</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono">
                {envSample}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
          >
            बुझियो (Done)
          </button>
        </div>
      </div>
    </div>
  );
}

