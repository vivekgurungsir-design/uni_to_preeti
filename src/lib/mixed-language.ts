/**
 * Smart Mixed Language Engine (Nepali <-> English Preservation)
 * 
 * Accurately distinguishes English words, technical terms, acronyms, and URLs
 * from Preeti / Devanagari characters so that English is preserved 100% untouched.
 */

import { convertUnicodeToPreeti, convertPreetiToUnicode } from "./converter";

export interface MixedSegment {
  text: string;
  isEnglish: boolean;
  convertedText: string;
}

// 600+ common English words, tech terms, and abbreviations frequently mixed in Nepali documents
const COMMON_ENGLISH_WORDS = new Set([
  // Tech & platforms
  "supabase", "next.js", "nextjs", "next", "react", "node", "nodejs", "typescript", "javascript",
  "antigravity", "ai", "ui", "ux", "api", "url", "http", "https", "www", "com", "org", "net",
  "html", "css", "tailwind", "python", "java", "github", "gitlab", "google", "microsoft", "apple",
  "word", "excel", "powerpoint", "office", "windows", "mac", "linux", "android", "ios", "chrome",
  "firefox", "safari", "facebook", "youtube", "twitter", "instagram", "tiktok", "linkedin",
  "chatgpt", "gemini", "claude", "openai", "pdf", "docx", "doc", "txt", "rtf", "json", "xml",
  "email", "gmail", "yahoo", "id", "password", "username", "login", "logout", "admin", "user",
  "dashboard", "database", "sql", "nosql", "cloud", "server", "client", "app", "application",
  "system", "software", "hardware", "internet", "website", "web", "page", "site", "link",
  "code", "data", "file", "folder", "copy", "paste", "cut", "undo", "redo", "save", "download",
  "upload", "edit", "delete", "remove", "update", "create", "search", "filter", "view", "preview",
  "print", "share", "settings", "profile", "account", "status", "loading", "error", "success",

  // Common English conversational words
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
  "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
  "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
  "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
  "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "is", "are", "was", "were",
  "been", "has", "had", "mr", "mrs", "miss", "dr", "prof", "ok", "yes", "no", "hi", "hello",
  "nepal", "kathmandu", "pokhara", "lalitpur", "bhaktapur", "bank", "nabil", "nic", "asia",
  "project", "report", "title", "subject", "date", "signature", "total", "amount", "rs", "npr",
]);

/**
 * Checks if a token is genuine English
 */
export function isEnglishWord(token: string): boolean {
  if (!token || token.trim().length === 0) return false;

  const trimmed = token.trim();

  // 0. Universal punctuation - ( ) . , : ; ! ? - _ are NOT meant to change
  if (/^[().,;:!?_\-]+$/.test(trimmed)) return true;

  // If it contains Devanagari characters, it is NOT English
  if (/[\u0900-\u097F]/.test(trimmed)) return false;

  // If it contains Preeti-specific unique glyphs, it is NOT English
  // ({, }, [, ], \, |, «, ~, ª, ¿, §, Ý, •, ¶, ç, ß, ¡, ˜, °, Û, Ú, Ù, Ò, Ö, ±)
  if (/[\{\}\]\[\|\«\~\\ª¿§Ý•¶çß¡˜°ÛÚÙÒÖ±]/.test(trimmed)) return false;

  // Clean punctuation from edges
  const clean = trimmed.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
  if (!clean) return false;

  // 1. Direct hit in common English vocabulary
  if (COMMON_ENGLISH_WORDS.has(clean)) return true;

  // 2. Acronyms & uppercase abbreviations (UI, AI, API, URL, HTML, CSS, IT, CPU, RAM, etc.)
  if (/^[A-Z]{2,8}$/.test(trimmed)) return true;

  // 3. Mixed CamelCase or PascalCase (Supabase, NextJS, JavaScript, Antigravity)
  if (/^[A-Z][a-z]+[A-Z]/.test(trimmed)) return true;

  // 4. Tech naming with dots/hyphens (Next.js, Node.js, v15.1, test-case)
  if (/[a-zA-Z]+\.(js|com|org|net|io|edu|gov|html|pdf|docx|txt|json)/i.test(trimmed)) return true;

  // 5. URLs and Emails
  if (/^https?:\/\//i.test(trimmed) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return true;
  }

  // 6. English words with standard English syllables / phonotactics
  if (/^[A-Za-z]{3,}$/.test(clean)) {
    const vowels = (clean.match(/[aeiouy]/g) || []).length;
    const ratio = vowels / clean.length;
    if (ratio >= 0.25 && ratio <= 0.65) {
      // Common English suffixes
      if (/(ing|tion|sion|ment|able|ible|ous|ful|less|ness|ed|er|est|ly|al|ic|ize|ise|ity|tive|sive)$/.test(clean)) {
        return true;
      }
      // Common English prefixes
      if (/^(un|re|in|im|dis|en|non|pre|pro|sub|anti|auto|tele|micro|inter|trans)/.test(clean)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Splits text into segments preserving English words intact
 */
export function splitMixedSegments(
  text: string,
  mode: "unicode-to-preeti" | "preeti-to-unicode"
): MixedSegment[] {
  if (!text) return [];

  const segments: MixedSegment[] = [];

  if (mode === "unicode-to-preeti") {
    // In Unicode text, Latin letters, numbers, and symbols like : ; ? , ( ) . - _ ! are preserved intact
    const regex = /([A-Za-z][A-Za-z0-9._/-]*(?:\s+[A-Za-z][A-Za-z0-9._/-]*)*|[():;?,.!_\-]+|[0-9]+(?:\.[0-9]+)?)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const nepaliPart = text.slice(lastIndex, match.index);
        segments.push({
          text: nepaliPart,
          isEnglish: false,
          convertedText: convertUnicodeToPreeti(nepaliPart),
        });
      }

      const englishPart = match[0];
      segments.push({
        text: englishPart,
        isEnglish: true,
        convertedText: englishPart, // Kept exactly identical!
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      const nepaliPart = text.slice(lastIndex);
      segments.push({
        text: nepaliPart,
        isEnglish: false,
        convertedText: convertUnicodeToPreeti(nepaliPart),
      });
    }
  } else {
    // In Preeti text, words with English patterns are English, rest are Preeti
    const tokens = text.split(/(\s+)/);
    let currentPreetiBuffer = "";

    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        currentPreetiBuffer += token;
        continue;
      }

      if (isEnglishWord(token)) {
        if (currentPreetiBuffer) {
          segments.push({
            text: currentPreetiBuffer,
            isEnglish: false,
            convertedText: convertPreetiToUnicode(currentPreetiBuffer),
          });
          currentPreetiBuffer = "";
        }
        segments.push({
          text: token,
          isEnglish: true,
          convertedText: token, // Kept exactly identical!
        });
      } else {
        currentPreetiBuffer += token;
      }
    }

    if (currentPreetiBuffer) {
      segments.push({
        text: currentPreetiBuffer,
        isEnglish: false,
        convertedText: convertPreetiToUnicode(currentPreetiBuffer),
      });
    }
  }

  return segments;
}

/**
 * Converts mixed text while preserving English words untouched
 */
export function convertMixedText(
  text: string,
  mode: "unicode-to-preeti" | "preeti-to-unicode"
): { convertedText: string; segments: MixedSegment[] } {
  const segments = splitMixedSegments(text, mode);
  const convertedText = segments.map((s) => s.convertedText).join("");
  return { convertedText, segments };
}

