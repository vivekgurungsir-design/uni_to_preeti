"use client";

import React, { useState } from "react";
import { SavedTranslation } from "@/types/database";
import {
  X,
  Star,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  BookmarkCheck,
  Share2,
} from "lucide-react";

interface SavedSnippetsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snippets: SavedTranslation[];
  onLoadSnippet: (snippet: SavedTranslation) => void;
  onDeleteSnippet: (id: string) => void;
  onToggleFavorite: (id: string, is_favorite: boolean) => void;
  onShareSnippet: (snippet: SavedTranslation) => void;
}

export default function SavedSnippetsDrawer({
  isOpen,
  onClose,
  snippets,
  onLoadSnippet,
  onDeleteSnippet,
  onToggleFavorite,
  onShareSnippet,
}: SavedSnippetsDrawerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = snippets.filter((s) => {
    const matchesFav = onlyFavorites ? s.is_favorite : true;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.source_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.converted_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFav && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookmarkCheck className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                सुरक्षित अनुवादहरू ({snippets.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Favorites Filter */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="खोज्नुहोस्..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md font-medium transition ${
                  onlyFavorites
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-amber-500 text-amber-500" : ""}`} />
                <span>मनपर्ने मात्र</span>
              </button>
              <span className="text-xs text-slate-400">
                {filtered.length} परिणामहरू
              </span>
            </div>
          </div>

          {/* Snippet List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                कुनै सुरक्षित अनुवाद फेला परेन।
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-sm space-y-2 group"
                >
                  {/* Title & Mode */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {item.conversion_mode === "unicode-to-preeti"
                            ? "Unicode → Preeti"
                            : "Preeti → Unicode"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Star favorite */}
                    <button
                      onClick={() => onToggleFavorite(item.id, !item.is_favorite)}
                      className="p-1 rounded text-slate-400 hover:text-amber-500"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.is_favorite
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Preview Text */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg font-devanagari">
                    {item.converted_text}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        onLoadSnippet(item);
                        onClose();
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>एडिटरमा खोल्नुहोस्</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleCopy(item.converted_text, item.id)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Copy converted text"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onShareSnippet(item)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500"
                        title="Share snippet"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSnippet(item.id)}
                        className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500"
                        title="Delete snippet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

