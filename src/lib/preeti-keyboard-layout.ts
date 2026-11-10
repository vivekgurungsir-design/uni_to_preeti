export interface KeyInfo {
  code: string;
  key: string;
  shiftKey: string;
  preetiNormal: string;
  unicodeNormal: string;
  preetiShift: string;
  unicodeShift: string;
}

export interface CheatSheetEntry {
  category: "स्वर (Vowels)" | "व्यञ्जन (Consonants)" | "मात्रा (Vowel Signs)" | "संयुक्त वर्ण (Conjuncts)" | "अङ्क (Numbers)" | "चिह्न (Symbols)";
  devanagari: string;
  preetiKey: string;
  englishKey: string;
  notes?: string;
}

export const KEYBOARD_ROWS: KeyInfo[][] = [
  // Number row
  [
    { code: "Backquote", key: "`", shiftKey: "~", preetiNormal: "`", unicodeNormal: "ञ्", preetiShift: "~", unicodeShift: "ञ" },
    { code: "Digit1", key: "1", shiftKey: "!", preetiNormal: "1", unicodeNormal: "ज्ञ", preetiShift: "!", unicodeShift: "१" },
    { code: "Digit2", key: "2", shiftKey: "@", preetiNormal: "2", unicodeNormal: "द्ध", preetiShift: "@", unicodeShift: "२" },
    { code: "Digit3", key: "3", shiftKey: "#", preetiNormal: "3", unicodeNormal: "घ्", preetiShift: "#", unicodeShift: "३" },
    { code: "Digit4", key: "4", shiftKey: "$", preetiNormal: "4", unicodeNormal: "झ्", preetiShift: "$", unicodeShift: "४" },
    { code: "Digit5", key: "5", shiftKey: "%", preetiNormal: "5", unicodeNormal: "छ्", preetiShift: "%", unicodeShift: "५" },
    { code: "Digit6", key: "6", shiftKey: "^", preetiNormal: "6", unicodeNormal: "ट", preetiShift: "^", unicodeShift: "६" },
    { code: "Digit7", key: "7", shiftKey: "&", preetiNormal: "7", unicodeNormal: "ठ", preetiShift: "&", unicodeShift: "७" },
    { code: "Digit8", key: "8", shiftKey: "*", preetiNormal: "8", unicodeNormal: "ड", preetiShift: "*", unicodeShift: "८" },
    { code: "Digit9", key: "9", shiftKey: "(", preetiNormal: "9", unicodeNormal: "ढ", preetiShift: "(", unicodeShift: "९" },
    { code: "Digit0", key: "0", shiftKey: ")", preetiNormal: "0", unicodeNormal: "ण्", preetiShift: ")", unicodeShift: "०" },
    { code: "Minus", key: "-", shiftKey: "_", preetiNormal: "-", unicodeNormal: "(", preetiShift: "_", unicodeShift: ")" },
    { code: "Equal", key: "=", shiftKey: "+", preetiNormal: "=", unicodeNormal: ".", preetiShift: "+", unicodeShift: "ं" },
  ],
  // Top QWERTY row
  [
    { code: "KeyQ", key: "q", shiftKey: "Q", preetiNormal: "q", unicodeNormal: "त्र", preetiShift: "Q", unicodeShift: "त्त" },
    { code: "KeyW", key: "w", shiftKey: "W", preetiNormal: "w", unicodeNormal: "ध", preetiShift: "W", unicodeShift: "ध्" },
    { code: "KeyE", key: "e", shiftKey: "E", preetiNormal: "e", unicodeNormal: "भ", preetiShift: "E", unicodeShift: "भ्" },
    { code: "KeyR", key: "r", shiftKey: "R", preetiNormal: "r", unicodeNormal: "च", preetiShift: "R", unicodeShift: "छ्" },
    { code: "KeyT", key: "t", shiftKey: "T", preetiNormal: "t", unicodeNormal: "त", preetiShift: "T", unicodeShift: "त्" },
    { code: "KeyY", key: "y", shiftKey: "Y", preetiNormal: "y", unicodeNormal: "थ", preetiShift: "Y", unicodeShift: "थ्" },
    { code: "KeyU", key: "u", shiftKey: "U", preetiNormal: "u", unicodeNormal: "ग", preetiShift: "U", unicodeShift: "घ्" },
    { code: "KeyI", key: "i", shiftKey: "I", preetiNormal: "i", unicodeNormal: "ष", preetiShift: "I", unicodeShift: "क्ष" },
    { code: "KeyO", key: "o", shiftKey: "O", preetiNormal: "o", unicodeNormal: "य", preetiShift: "O", unicodeShift: "इ" },
    { code: "KeyP", key: "p", shiftKey: "P", preetiNormal: "p", unicodeNormal: "उ", preetiShift: "P", unicodeShift: "ऐ" },
    { code: "BracketLeft", key: "[", shiftKey: "{", preetiNormal: "[", unicodeNormal: "ृ", preetiShift: "{", unicodeShift: "र् (रेफ)" },
    { code: "BracketRight", key: "]", shiftKey: "}", preetiNormal: "]", unicodeNormal: "े", preetiShift: "}", unicodeShift: "ै" },
  ],
  // Home row
  [
    { code: "KeyA", key: "a", shiftKey: "A", preetiNormal: "a", unicodeNormal: "ब", preetiShift: "A", unicodeShift: "ब्" },
    { code: "KeyS", key: "s", shiftKey: "S", preetiNormal: "s", unicodeNormal: "क", preetiShift: "S", unicodeShift: "क्" },
    { code: "KeyD", key: "d", shiftKey: "D", preetiNormal: "d", unicodeNormal: "म", preetiShift: "D", unicodeShift: "म्" },
    { code: "KeyF", key: "f", shiftKey: "F", preetiNormal: "f", unicodeNormal: "ा", preetiShift: "F", unicodeShift: "ँ" },
    { code: "KeyG", key: "g", shiftKey: "G", preetiNormal: "g", unicodeNormal: "न", preetiShift: "G", unicodeShift: "न्" },
    { code: "KeyH", key: "h", shiftKey: "H", preetiNormal: "h", unicodeNormal: "ज", preetiShift: "H", unicodeShift: "झ्" },
    { code: "KeyJ", key: "j", shiftKey: "J", preetiNormal: "j", unicodeNormal: "व", preetiShift: "J", unicodeShift: "व्" },
    { code: "KeyK", key: "k", shiftKey: "K", preetiNormal: "k", unicodeNormal: "प", preetiShift: "K", unicodeShift: "प्" },
    { code: "KeyL", key: "l", shiftKey: "L", preetiNormal: "l", unicodeNormal: "ि", preetiShift: "L", unicodeShift: "ी" },
    { code: "Semicolon", key: ";", shiftKey: ":", preetiNormal: ";", unicodeNormal: "स", preetiShift: ":", unicodeShift: "स्" },
    { code: "Quote", key: "'", shiftKey: '"', preetiNormal: "'", unicodeNormal: "ु", preetiShift: '"', unicodeShift: "ू" },
  ],
  // Bottom row
  [
    { code: "KeyZ", key: "z", shiftKey: "Z", preetiNormal: "z", unicodeNormal: "श", preetiShift: "Z", unicodeShift: "श्" },
    { code: "KeyX", key: "x", shiftKey: "X", preetiNormal: "x", unicodeNormal: "ह", preetiShift: "X", unicodeShift: "ह्" },
    { code: "KeyC", key: "c", shiftKey: "C", preetiNormal: "c", unicodeNormal: "अ", preetiShift: "C", unicodeShift: "ऋ" },
    { code: "KeyV", key: "v", shiftKey: "V", preetiNormal: "v", unicodeNormal: "ख", preetiShift: "V", unicodeShift: "ख्" },
    { code: "KeyB", key: "b", shiftKey: "B", preetiNormal: "b", unicodeNormal: "द", preetiShift: "B", unicodeShift: "द्" },
    { code: "KeyN", key: "n", shiftKey: "N", preetiNormal: "n", unicodeNormal: "ल", preetiShift: "N", unicodeShift: "ल्" },
    { code: "KeyM", key: "m", shiftKey: "M", preetiNormal: "m", unicodeNormal: "फ", preetiShift: "M", unicodeShift: "फ्" },
    { code: "Comma", key: ",", shiftKey: "<", preetiNormal: ",", unicodeNormal: ",", preetiShift: "<", unicodeShift: "?" },
    { code: "Period", key: ".", shiftKey: ">", preetiNormal: ".", unicodeNormal: "।", preetiShift: ">", unicodeShift: "श्र" },
    { code: "Slash", key: "/", shiftKey: "?", preetiNormal: "/", unicodeNormal: "र", preetiShift: "?", unicodeShift: "रु" },
  ],
];

export const PREETI_CHEATSHEET: CheatSheetEntry[] = [
  // स्वर
  { category: "स्वर (Vowels)", devanagari: "अ", preetiKey: "c", englishKey: "c" },
  { category: "स्वर (Vowels)", devanagari: "आ", preetiKey: "cf", englishKey: "c + f" },
  { category: "स्वर (Vowels)", devanagari: "इ", preetiKey: "O", englishKey: "Shift + O" },
  { category: "स्वर (Vowels)", devanagari: "ई", preetiKey: "O{", englishKey: "Shift + O + {" },
  { category: "स्वर (Vowels)", devanagari: "उ", preetiKey: "p", englishKey: "p" },
  { category: "स्वर (Vowels)", devanagari: "ऊ", preetiKey: "pm", englishKey: "p + m" },
  { category: "स्वर (Vowels)", devanagari: "ऋ", preetiKey: "C", englishKey: "Shift + C" },
  { category: "स्वर (Vowels)", devanagari: "ए", preetiKey: "P", englishKey: "Shift + P" },
  { category: "स्वर (Vowels)", devanagari: "ऐ", preetiKey: "P]", englishKey: "Shift + P + ]" },
  { category: "स्वर (Vowels)", devanagari: "ओ", preetiKey: "cf]", englishKey: "c + f + ]" },
  { category: "स्वर (Vowels)", devanagari: "औ", preetiKey: "cf}", englishKey: "c + f + }" },
  { category: "स्वर (Vowels)", devanagari: "अं", preetiKey: "c+", englishKey: "c + +" },
  { category: "स्वर (Vowels)", devanagari: "अँ", preetiKey: "cF", englishKey: "c + Shift + F" },

  // व्यञ्जन
  { category: "व्यञ्जन (Consonants)", devanagari: "क / क्", preetiKey: "s / S", englishKey: "s / Shift + S" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ख / ख्", preetiKey: "v / V", englishKey: "v / Shift + V" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ग / ग्", preetiKey: "u / U", englishKey: "u / Shift + U" },
  { category: "व्यञ्जन (Consonants)", devanagari: "घ / घ्", preetiKey: "U / W", englishKey: "Shift + U / Shift + W" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ङ", preetiKey: "ª", englishKey: "Alt + 0170" },
  { category: "व्यञ्जन (Consonants)", devanagari: "च / च्", preetiKey: "r / R", englishKey: "r / Shift + R" },
  { category: "व्यञ्जन (Consonants)", devanagari: "छ", preetiKey: "R", englishKey: "Shift + R" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ज / ज्", preetiKey: "h / H", englishKey: "h / Shift + H" },
  { category: "व्यञ्जन (Consonants)", devanagari: "झ / झ्", preetiKey: "H / 4", englishKey: "Shift + H / 4" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ञ / ञ्", preetiKey: "~ / `", englishKey: "~ / `" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ट", preetiKey: "6", englishKey: "6" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ठ", preetiKey: "7", englishKey: "7" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ड", preetiKey: "8", englishKey: "8" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ढ", preetiKey: "9", englishKey: "9" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ण / ण्", preetiKey: "0f / 0", englishKey: "0 + f / 0" },
  { category: "व्यञ्जन (Consonants)", devanagari: "त / त्", preetiKey: "t / T", englishKey: "t / Shift + T" },
  { category: "व्यञ्जन (Consonants)", devanagari: "थ / थ्", preetiKey: "y / Y", englishKey: "y / Shift + Y" },
  { category: "व्यञ्जन (Consonants)", devanagari: "द / द्", preetiKey: "b / b\\", englishKey: "b / b + \\" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ध / ध्", preetiKey: "w / W", englishKey: "w / Shift + W" },
  { category: "व्यञ्जन (Consonants)", devanagari: "न / न्", preetiKey: "g / G", englishKey: "g / Shift + G" },
  { category: "व्यञ्जन (Consonants)", devanagari: "प / प्", preetiKey: "k / K", englishKey: "k / Shift + K" },
  { category: "व्यञ्जन (Consonants)", devanagari: "फ / फ्", preetiKey: "m / M", englishKey: "m / Shift + M" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ब / ब्", preetiKey: "a / A", englishKey: "a / Shift + A" },
  { category: "व्यञ्जन (Consonants)", devanagari: "भ / भ्", preetiKey: "e / E", englishKey: "e / Shift + E" },
  { category: "व्यञ्जन (Consonants)", devanagari: "म / म्", preetiKey: "d / D", englishKey: "d / Shift + D" },
  { category: "व्यञ्जन (Consonants)", devanagari: "य", preetiKey: "o", englishKey: "o" },
  { category: "व्यञ्जन (Consonants)", devanagari: "र", preetiKey: "/", englishKey: "/" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ल / ल्", preetiKey: "n / N", englishKey: "n / Shift + N" },
  { category: "व्यञ्जन (Consonants)", devanagari: "व / व्", preetiKey: "j / J", englishKey: "j / Shift + J" },
  { category: "व्यञ्जन (Consonants)", devanagari: "श / श्", preetiKey: "z / Z", englishKey: "z / Shift + Z" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ष", preetiKey: "i", englishKey: "i" },
  { category: "व्यञ्जन (Consonants)", devanagari: "स / स्", preetiKey: "; / :", englishKey: "; / Shift + ;" },
  { category: "व्यञ्जन (Consonants)", devanagari: "ह / ह्", preetiKey: "x / X", englishKey: "x / Shift + X" },

  // संयुक्त वर्ण
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "क्ष", preetiKey: "If", englishKey: "Shift + I + f" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "त्र", preetiKey: "q", englishKey: "q" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "ज्ञ", preetiKey: "1", englishKey: "1" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "श्र", preetiKey: ">", englishKey: "Shift + ." },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "द्ध", preetiKey: "2", englishKey: "2" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "द्व", preetiKey: "}", englishKey: "Shift + ]" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "द्य", preetiKey: "Þ", englishKey: "Alt + 0222" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "द्द", preetiKey: "å", englishKey: "Alt + 0229" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "त्त", preetiKey: "Tt", englishKey: "Shift + T + t" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "प्र / भ्र / ग्र", preetiKey: "k| / e| / u|", englishKey: "Key + |", notes: "र-आकार" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "ट्र / ठ्र", preetiKey: "6^ / 7^", englishKey: "6 + ^ / 7 + ^", notes: "राउन्ड र-आकार" },
  { category: "संयुक्त वर्ण (Conjuncts)", devanagari: "र्क (रेफ)", preetiKey: "s{", englishKey: "s + {", notes: "वर्ण पछि रेफ टाइप गर्ने" },

  // मात्रा
  { category: "मात्रा (Vowel Signs)", devanagari: "ा (आ-कार)", preetiKey: "f", englishKey: "f" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ि (ह्रस्व इ-कार)", preetiKey: "l", englishKey: "l", notes: "Preeti मा अक्षर भन्दा अगाडि टाइप गर्ने" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ी (दीर्घ ई-कार)", preetiKey: "L", englishKey: "Shift + L" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ु (ह्रस्व उ-कार)", preetiKey: "'", englishKey: "'" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ू (दीर्घ ऊ-कार)", preetiKey: '"', englishKey: 'Shift + "' },
  { category: "मात्रा (Vowel Signs)", devanagari: "ृ (ऋ-कार)", preetiKey: "]", englishKey: "]" },
  { category: "मात्रा (Vowel Signs)", devanagari: "े (ए-कार)", preetiKey: "]", englishKey: "]" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ै (ऐ-कार)", preetiKey: "}", englishKey: "Shift + ]" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ो (ओ-कार)", preetiKey: "f]", englishKey: "f + ]" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ौ (औ-कार)", preetiKey: "f}", englishKey: "f + Shift + ]" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ं (अनुस्वार)", preetiKey: "+", englishKey: "Shift + =" },
  { category: "मात्रा (Vowel Signs)", devanagari: "ँ (चन्द्रबिन्दु)", preetiKey: "F", englishKey: "Shift + F" },
  { category: "मात्रा (Vowel Signs)", devanagari: "् (हलन्त)", preetiKey: "\\", englishKey: "\\" },

  // अङ्क
  { category: "अङ्क (Numbers)", devanagari: "०, १, २, ३, ४", preetiKey: "), !, @, #, $", englishKey: "Shift + 0, 1, 2, 3, 4" },
  { category: "अङ्क (Numbers)", devanagari: "५, ६, ७, ८, ९", preetiKey: "%, ^, &, *, (", englishKey: "Shift + 5, 6, 7, 8, 9" },

  // चिह्न
  { category: "चिह्न (Symbols)", devanagari: "। (पूर्णविराम)", preetiKey: ".", englishKey: "." },
  { category: "चिह्न (Symbols)", devanagari: "रु (रुपैयाँ)", preetiKey: "?", englishKey: "Shift + /" },
];

