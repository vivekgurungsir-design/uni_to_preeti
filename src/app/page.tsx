"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TranslatorPane from "@/components/TranslatorPane";
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

  // Text injection state (from virtual keyboard, cheatsheet, or saved snippet)
  const [injectedText, setInjectedText] = useState<string | null>(null);

  // Load saved translations on mount
  const refreshSnippets = async () => {
    const list = await fetchSavedTranslations();
    setSavedSnippets(list);
  };

  useEffect(() => {
    refreshSnippets();

    // Check if redirecting from /share/[id]
    if (typeof window !== "undefined") {
      const pendingText = sessionStorage.getItem("shared_load_text");
      if (pendingText) {
        setInjectedText(pendingText);
        sessionStorage.removeItem("shared_load_text");
        sessionStorage.removeItem("shared_load_mode");
      }
    }
  }, []);

  // Keyboard character click
  const handleVirtualKeyPress = (char: string) => {
    setInjectedText(char);
    // Reset after a brief tick so subsequent identical characters register
    setTimeout(() => setInjectedText(null), 50);
  };

  // Cheatsheet insert
  const handleCheatSheetInsert = (text: string) => {
    setInjectedText(text);
    setTimeout(() => setInjectedText(null), 50);
  };

  // Load saved snippet into editor
  const handleLoadSnippet = (snippet: SavedTranslation) => {
    setInjectedText(snippet.source_text);
    setTimeout(() => setInjectedText(null), 50);
  };

  // Delete snippet
  const handleDeleteSnippet = async (id: string) => {
    if (confirm("के तपाईं यो सुरक्षित अनुवाद मेटाउन निश्चित हुनुहुन्छ?")) {
      await deleteSavedTranslation(id);
      await refreshSnippets();
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (id: string, is_favorite: boolean) => {
    await toggleFavoriteTranslation(id, is_favorite);
    await refreshSnippets();
  };

  // Open feedback modal
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

  // Accuracy suite load
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

        {/* Hero Section */}
        <section className="pt-8 pb-3 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-3">
            <span>✨ उच्च शुद्धता, स्वचालित दिशा पहिचान र क्लाउड सिंक</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            नेपाली युनिकोड र प्रिती फन्ट अनुवादक
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            युनिकोड (Unicode) बाट प्रिती (Preeti) वा प्रितीबाट युनिकोडमा तुरुन्तै वास्तविक समयमा रूपान्तरण गर्नुहोस्। सरकारी कामकाज, पत्रकारिता तथा डिजाइनको लागि १००% उपयोगी।
          </p>
        </section>

        {/* Main Dual-Pane Translator */}
        <TranslatorPane
          onOpenVirtualKeyboard={() => setIsKeyboardOpen(true)}
          onOpenFeedback={handleOpenFeedback}
          onOpenShare={(snippet) => setShareSnippet(snippet)}
          onSnippetSaved={refreshSnippets}
          injectedText={injectedText}
        />

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
