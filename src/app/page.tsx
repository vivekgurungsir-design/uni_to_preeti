"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TranslatorPane from "@/components/TranslatorPane";
import DocumentConverterSection from "@/components/DocumentConverterSection";
import TypingPracticeSection from "@/components/TypingPracticeSection";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import PreetiCheatSheetModal from "@/components/PreetiCheatSheetModal";
import SavedSnippetsDrawer from "@/components/SavedSnippetsDrawer";
import SupabaseConfigModal from "@/components/SupabaseConfigModal";
import ShareModal from "@/components/ShareModal";
import FeedbackModal from "@/components/FeedbackModal";
import AccuracyVerifier from "@/components/AccuracyVerifier";
import Footer from "@/components/Footer";
import { fetchSavedTranslations, deleteSavedTranslation, toggleFavoriteTranslation } from "@/lib/supabase";
import { SavedTranslation } from "@/types/database";
import { Sparkles } from "lucide-react";

export default function Home() {
  // Modal visibility states
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  // Share & Feedback modals
  const [shareSnippet, setShareSnippet] = useState<SavedTranslation | null>(null);
  const [feedbackInfo, setFeedbackInfo] = useState<{
    isOpen: boolean;
    orig: string;
    converted: string;
    mode: "unicode-to-preeti" | "preeti-to-unicode";
  }>({
    isOpen: false,
    orig: "",
    converted: "",
    mode: "unicode-to-preeti",
  });

  // Saved snippets state
  const [savedSnippets, setSavedSnippets] = useState<SavedTranslation[]>([]);

  // Text injection state
  const [injectedText, setInjectedText] = useState<string | null>(null);

  const refreshSnippets = async () => {
    const list = await fetchSavedTranslations();
    setSavedSnippets(list);
  };

  useEffect(() => {
    refreshSnippets();

    if (typeof window !== "undefined") {
      const pendingText = sessionStorage.getItem("shared_load_text");
      if (pendingText) {
        setInjectedText(pendingText);
        sessionStorage.removeItem("shared_load_text");
        sessionStorage.removeItem("shared_load_mode");
      }
    }
  }, []);

  const handleVirtualKeyPress = (char: string) => {
    setInjectedText(char);
    setTimeout(() => setInjectedText(null), 50);
  };

  const handleCheatSheetInsert = (text: string) => {
    setInjectedText(text);
    setTimeout(() => setInjectedText(null), 50);
  };

  const handleLoadSnippet = (snippet: SavedTranslation) => {
    setInjectedText(snippet.source_text);
    setTimeout(() => setInjectedText(null), 50);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSnippet = async (id: string) => {
    if (confirm("के तपाईं यो सुरक्षित अनुवाद मेटाउन निश्चित हुनुहुन्छ?")) {
      await deleteSavedTranslation(id);
      await refreshSnippets();
    }
  };

  const handleToggleFavorite = async (id: string, is_favorite: boolean) => {
    await toggleFavoriteTranslation(id, is_favorite);
    await refreshSnippets();
  };

  const handleOpenFeedback = (
    orig: string,
    converted: string,
    mode: "unicode-to-preeti" | "preeti-to-unicode"
  ) => {
    setFeedbackInfo({
      isOpen: true,
      orig,
      converted,
      mode,
    });
  };

  const handleLoadTestCase = (text: string) => {
    setInjectedText(text);
    setTimeout(() => setInjectedText(null), 50);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          onOpenKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
          onOpenSaved={() => setIsSavedDrawerOpen(true)}
          onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
          savedCount={savedSnippets.length}
        />

        {/* Compact Header */}
        <div className="pt-6 pb-2 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>नेपाली युनिकोड र प्रिती फन्ट लाइभ अनुवादक</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-devanagari">
            Unicode ➔ Preeti तत्काल लाइभ रूपान्तरण
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            बायाँ बाकसमा युनिकोड टाइप गर्नुहोस् वा टाँस्नुहोस्, दायाँ बाकसमा तुरुन्तै Preeti मा रूपान्तरण हुनेछ।
          </p>
        </div>

        {/* PROMINENT LIVE CONVERTER (Right at the top) */}
        <TranslatorPane
          onOpenVirtualKeyboard={() => setIsKeyboardOpen(true)}
          onOpenFeedback={handleOpenFeedback}
          onOpenShare={(snippet) => setShareSnippet(snippet)}
          onSnippetSaved={refreshSnippets}
          injectedText={injectedText}
        />

        {/* Document Converter Section (.docx, .txt) */}
        <DocumentConverterSection />

        {/* Live Nepali Typing Practice & Speed Test (WPM) */}
        <TypingPracticeSection />

        {/* Accuracy Benchmark Suite */}
        <AccuracyVerifier onLoadTestCase={handleLoadTestCase} />
      </div>

      {/* Footer */}
      <Footer
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenKeyboard={() => setIsKeyboardOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
      />

      {/* Virtual Keyboard (Docked at bottom) */}
      <VirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleVirtualKeyPress}
        mode="unicode-to-preeti"
      />

      {/* Cheatsheet Modal */}
      <PreetiCheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        onInsertToSource={handleCheatSheetInsert}
      />

      {/* Saved Snippets Drawer */}
      <SavedSnippetsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        snippets={savedSnippets}
        onLoadSnippet={handleLoadSnippet}
        onDeleteSnippet={handleDeleteSnippet}
        onToggleFavorite={handleToggleFavorite}
        onShareSnippet={(item) => setShareSnippet(item)}
      />

      {/* Supabase Config / Migration Guide Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />

      {/* Public Share Modal */}
      <ShareModal
        isOpen={Boolean(shareSnippet)}
        onClose={() => setShareSnippet(null)}
        snippet={shareSnippet}
      />

      {/* Report Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackInfo.isOpen}
        onClose={() => setFeedbackInfo((prev) => ({ ...prev, isOpen: false }))}
        originalText={feedbackInfo.orig}
        convertedText={feedbackInfo.converted}
        mode={feedbackInfo.mode}
      />
    </div>
  );
}
