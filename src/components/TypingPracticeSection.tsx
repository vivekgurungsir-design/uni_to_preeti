"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Keyboard,
  Timer,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Activity,
  Flame,
} from "lucide-react";

const PRACTICE_SENTENCES = [
  {
    title: "नेपालको सुन्दरता",
    text: "नेपाल एक सुन्दर, शान्त र हिमालको देश हो । यहाँ संसारकै सर्वोच्च शिखर सगरमाथा अवस्थित छ ।",
  },
  {
    title: "सूचना प्रविधि",
    text: "कम्प्युटर र इन्टरनेटको प्रयोगले हाम्रो दैनिक कामकाज, शिक्षा र सञ्चारलाई अत्यन्त सरल र छिटो बनाएको छ ।",
  },
  {
    title: "सद्भाव र एकता",
    text: "विविधतामा एकता नै नेपाली समाजको प्रमुख विशेषता हो । हामी सबै मिलेर देशको विकासमा लाग्नुपर्छ ।",
  },
  {
    title: "प्रिती अभ्यास (Preeti)",
    text: "g]kfn Ps ;'Gb/ b]z xf] . oxfF hGd lng kfpg' xfd|f] uf}/j xf] .",
  },
];

export default function TypingPracticeSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const targetText = PRACTICE_SENTENCES[selectedIdx].text;

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setInput(val);

    // Calculate accuracy
    let correctCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) correctCount++;
    }
    const acc = val.length > 0 ? Math.round((correctCount / val.length) * 100) : 100;
    setAccuracy(acc);

    // Check completion
    if (val.length >= targetText.length) {
      setIsFinished(true);
    }
  };

  // Calculate WPM in real-time
  useEffect(() => {
    if (!startTime || input.length === 0) return;

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        // approx 5 chars per word
        const wordsTyped = input.length / 5;
        const currentWpm = Math.round(wordsTyped / elapsedMinutes);
        setWpm(currentWpm);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, input]);

  const handleReset = () => {
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <section id="typing-practice" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>नेपाली टाइपिङ अभ्यास तथा गति परीक्षण (Speed Test)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          आफ्नो नेपाली टाइपिङ गति (WPM) र शुद्धता बढाउनुहोस्
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          तल दिइएको वाक्य हेरेर टाइप गर्नुहोस् र आफ्नो प्रति मिनेट शब्द गति (WPM) तथा शुद्धता मापन गर्नुहोस्।
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Selector pills */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            {PRACTICE_SENTENCES.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedIdx(i);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  selectedIdx === i
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>गति: <strong className="text-sm font-mono">{wpm}</strong> WPM</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Trophy className="w-4 h-4 text-emerald-500" />
              <span>शुद्धता: <strong className="text-sm font-mono">{accuracy}%</strong></span>
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="पुनः सुरु गर्नुहोस्"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Display with Realtime Character Highlights */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 min-h-[120px] flex items-center">
          <div className="text-lg sm:text-xl font-devanagari leading-loose tracking-wide select-none">
            {targetText.split("").map((char, index) => {
              let colorClass = "text-slate-400 dark:text-slate-500";
              let bgClass = "";

              if (index < input.length) {
                if (input[index] === char) {
                  colorClass = "text-emerald-600 dark:text-emerald-400 font-bold";
                } else {
                  colorClass = "text-rose-600 dark:text-rose-400 font-bold underline";
                  bgClass = "bg-rose-100 dark:bg-rose-950/80 rounded";
                }
              } else if (index === input.length) {
                bgClass = "bg-indigo-500/30 border-b-2 border-indigo-600 animate-pulse";
              }

              return (
                <span key={index} className={`${colorClass} ${bgClass}`}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={isFinished}
            placeholder="यहाँ माथिको वाक्य टाइप गर्न सुरु गर्नुहोस्..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-devanagari text-base sm:text-lg focus:outline-none focus:border-indigo-500 shadow-sm transition"
          />

          {isFinished && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm animate-in fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  उत्कृष्ट! तपाईंले <strong>{wpm} WPM</strong> को गति र <strong>{accuracy}%</strong> शुद्धताका साथ यो पाठ पूरा गर्नुभयो।
                </span>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-xs"
              >
                फेरि खेल्नुहोस्
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

