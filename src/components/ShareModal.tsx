"use client";

import React, { useState } from "react";
import { X, Share2, Copy, Check, ExternalLink, Globe } from "lucide-react";
import { SavedTranslation } from "@/types/database";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippet: SavedTranslation | null;
}

export default function ShareModal({ isOpen, onClose, snippet }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !snippet) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/share/${snippet.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                अनुवाद शेयर गर्नुहोस्
              </h3>
              <p className="text-xs text-slate-500">
                यो लिंक जोसुकैसँग पनि शेयर गर्न सक्नुहुन्छ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snippet Info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {snippet.title}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-devanagari">
            {snippet.converted_text}
          </p>
        </div>

        {/* Share Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            पब्लिक शेयर लिंक:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1 transition shadow-sm shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>कपी भयो!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>लिंक कपी</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Open Direct */}
        <div className="pt-2 flex justify-between items-center text-xs">
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>नयाँ ट्याबमा खोलेर हेर्नुहोस्</span>
          </a>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
