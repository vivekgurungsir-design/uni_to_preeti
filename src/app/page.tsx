"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import TranslatorPane from "@/components/TranslatorPane";
import DocumentConverterSection from "@/components/DocumentConverterSection";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import PreetiCheatSheetModal from "@/components/PreetiCheatSheetModal";

export default function Home() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [injectedText, setInjectedText] = useState<string | null>(null);

  const handleVirtualKeyPress = (char: string) => {
    setInjectedText(char);
    setTimeout(() => setInjectedText(null), 50);
  };

  const handleCheatSheetInsert = (text: string) => {
    setInjectedText(text);
    setTimeout(() => setInjectedText(null), 50);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Clean Navbar */}
        <Navbar
          onOpenKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        />

        {/* Simple & Clean Header */}
        <div className="pt-6 pb-2 text-center max-w-2xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight font-devanagari">
            युनिकोड र प्रिती अनुवादक
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-devanagari">
            बायाँ बाकसमा युनिकोड टाइप गर्नुहोस्, दायाँ बाकसमा तत्काल प्रिती फन्टमा देखिनेछ।
          </p>
        </div>

        {/* Main Clean Conversion Workspace */}
        <TranslatorPane
          onOpenVirtualKeyboard={() => setIsKeyboardOpen(true)}
          injectedText={injectedText}
        />

        {/* Document File Converter (Automatic Unicode <-> Preeti) */}
        <DocumentConverterSection />
      </div>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-emerald-100/80 font-devanagari">
        नेपाली युनिकोड र प्रिती फन्ट रूपान्तरण • सरल र सुरक्षित
      </footer>

      {/* Virtual Keyboard */}
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
    </div>
  );
}
