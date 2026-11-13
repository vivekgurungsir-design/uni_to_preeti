"use client";

import React, { useState } from "react";
import { KEYBOARD_ROWS, KeyInfo } from "@/lib/preeti-keyboard-layout";
import { X, ArrowBigUp, Delete, Space, Info } from "lucide-react";

interface VirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyPress: (char: string) => void;
  mode: "unicode-to-preeti" | "preeti-to-unicode";
}

export default function VirtualKeyboard({
  isOpen,
  onClose,
  onKeyPress,
  mode,
}: VirtualKeyboardProps) {
  const [isShift, setIsShift] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-all animate-in slide-in-from-bottom duration-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
              <span>नेपाली प्रिती भर्चुअल किबोर्ड</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              (कुञ्जी थिचेर सिधै इनपुट बाकसमा टाइप गर्नुहोस्)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsShift(!isShift)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-semibold transition ${
                isShift
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <ArrowBigUp className="w-4 h-4" />
              <span>Shift: {isShift ? "ON" : "OFF"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Keyboard Keys Layout */}
        <div className="flex flex-col space-y-1.5 select-none overflow-x-auto pb-1">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-1 sm:space-x-1.5">
              {row.map((item) => {
                const displayChar = isShift ? item.unicodeShift : item.unicodeNormal;
                const preetiChar = isShift ? item.preetiShift : item.preetiNormal;
                const keyLetter = isShift ? item.shiftKey : item.key;

                return (
                  <button
                    key={item.code}
                    onClick={() => onKeyPress(displayChar)}
                    className="kbd-key group relative flex flex-col items-center justify-between min-w-[22px] xs:min-w-[26px] sm:min-w-[44px] md:min-w-[48px] h-11 sm:h-14 p-0.5 sm:p-1 rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 active:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    title={`Key: ${keyLetter} | Preeti: ${preetiChar} | Devanagari: ${displayChar}`}
                  >
                    <span className="text-[8px] sm:text-xs font-mono text-slate-400 dark:text-slate-500 self-start">
                      {keyLetter}
                    </span>
                    <span className="font-devanagari text-xs sm:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {displayChar}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-slate-400 dark:text-slate-500 font-mono hidden xs:inline sm:inline">
                      {preetiChar}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Action Row: Shift, Space, Backspace */}
          <div className="flex justify-center space-x-2 pt-1">
            <button
              onClick={() => setIsShift(!isShift)}
              className={`flex items-center justify-center space-x-1 px-4 h-11 rounded-md text-xs sm:text-sm font-semibold border ${
                isShift
                  ? "bg-indigo-600 text-white border-indigo-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
              }`}
            >
              <ArrowBigUp className="w-4 h-4" />
              <span>Shift</span>
            </button>
            <button
              onClick={() => onKeyPress(" ")}
              className="flex-1 max-w-md flex items-center justify-center space-x-2 h-11 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium kbd-key"
            >
              <Space className="w-4 h-4 text-slate-400" />
              <span>स्पेस (Spacebar)</span>
            </button>
            <button
              onClick={() => onKeyPress("\n")}
              className="px-4 h-11 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium kbd-key"
            >
              Enter ↵
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

