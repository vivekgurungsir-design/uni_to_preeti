"use client";

import React, { useState } from "react";
import { X, Send, AlertTriangle, Check } from "lucide-react";
import { submitFeedback } from "@/lib/supabase";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  convertedText: string;
  mode: "unicode-to-preeti" | "preeti-to-unicode";
}

export default function FeedbackModal({
  isOpen,
  onClose,
  originalText,
  convertedText,
  mode,
}: FeedbackModalProps) {
  const [expectedText, setExpectedText] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await submitFeedback({
      original_text: originalText,
      actual_output: convertedText,
      expected_output: expectedText,
      conversion_mode: mode,
      notes,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                त्रुटि वा सुधार सुझाव पठाउनुहोस्
              </h3>
              <p className="text-xs text-slate-500">
                यदि कुनै शब्द वा वर्ण गलत रूपान्तरण भयो भने हामीलाई जानकारी दिनुहोस्
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

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white">
              धन्यवाद! तपाईंको प्रतिक्रिया दर्ता भयो।
            </h4>
            <p className="text-xs text-slate-500">
              हाम्रो टोलीले यसलाई समीक्षा गरी सुधार गर्नेछ।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                मूल पाठ (Original Text):
              </label>
              <textarea
                readOnly
                value={originalText}
                rows={2}
                className="mt-1 w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                हालको रूपान्तरण (Current Output):
              </label>
              <textarea
                readOnly
                value={convertedText}
                rows={2}
                className="mt-1 w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                हुनुपर्ने सही रूपान्तरण (Expected Output):
              </label>
              <input
                type="text"
                required
                value={expectedText}
                onChange={(e) => setExpectedText(e.target.value)}
                placeholder="हुनुपर्ने सही शब्द यहाँ लेख्नुहोस्..."
                className="mt-1 w-full p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                थप टिप्पणी (Notes):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="यस सम्बन्धमा अन्य केही जानकारी भए लेख्नुहोस्..."
                className="mt-1 w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center space-x-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "पठाउँदै..." : "प्रतिक्रिया पठाउनुहोस्"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

