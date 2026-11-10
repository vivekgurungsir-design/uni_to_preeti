/**
 * Bidirectional Preeti <-> Devanagari Unicode Converter
 * Accurately translates Nepali text between standard Devanagari Unicode and Preeti font format.
 */

export interface ConversionStats {
  characters: number;
  words: number;
  lines: number;
}

export function calculateStats(text: string): ConversionStats {
  if (!text) return { characters: 0, words: 0, lines: 0 };
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split("\n").length;
  return { characters, words, lines };
}

// Unicode to Preeti Mapping Array
export const unicodeToPreetiMap: [string, string][] = [
  // Compound conjuncts & special characters
  ["द्ध", "2"],
  ["द्व", "}"],
  ["द्य", "Þ"],
  ["द्द", "å"],
  ["द्म", "÷"],
  ["ट्ट", "6\\6"],
  ["ट्ठ", "6\\7"],
  ["ड्ड", "8\\8"],
  ["ड्ढ", "8\\9"],
  ["श्च", "Zr"],
  ["श्न", "Zg"],
  ["श्व", "Zj"],
  ["ष्ट", "i6"],
  ["ष्ठ", "i7"],
  ["ह्र", "x|"],
  ["ह्न", "xg"],
  ["ह्म", "xd"],
  ["ह्य", "xo"],
  ["ह्ल", "xn"],
  ["ह्व", "xj"],
  ["श्र", ">"],
  ["त्त", "Tt"],
  ["त्क", "Ts"],
  ["क्ष्", "If\\"],
  ["क्ष", "If"],
  ["ज्ञ्", "1\\"],
  ["ज्ञ", "1"],
  ["त्र्", "q\\"],
  ["त्र", "q"],
  ["रु", "?"],
  ["रू", 'r"'],

  // Independent vowels
  ["ॐ", "cf‘"],
  ["ऋ", "C"],
  ["अौ", "cf}"],
  ["औ", "cf}"],
  ["अो", "cf]"],
  ["ओ", "cf]"],
  ["आ", "cf"],
  ["अं", "c+"],
  ["अँ", "cF"],
  ["अ", "c"],
  ["ई", "O{"],
  ["इ", "O"],
  ["ऊ", "pm"],
  ["उ", "p"],
  ["ऐ", "P]"],
  ["ए", "P"],

  // Dependent vowel signs (Matras)
  ["ा", "f"],
  ["ी", "L"],
  ["ु", "'"],
  ["ू", '"'],
  ["ृ", "]"],
  ["ो", "f]"],
  ["ौ", "f}"],
  ["ं", "+"],
  ["ँ", "F"],
  ["ः", ":"],
  ["्", "\\"],

  // Half consonants
  ["क्", "S"],
  ["ख्", "V"],
  ["ग्", "U"],
  ["घ्", "W"],
  ["ङ्", "ª\\"],
  ["च्", "R"],
  ["छ्", "R\\"],
  ["ज्", "H"],
  ["झ्", "4"],
  ["ञ्", "`\\"],
  ["ट्‍", "6\\"],
  ["ठ्‍", "7\\"],
  ["ड्‍", "8\\"],
  ["ढ्‍", "9\\"],
  ["ण्", "0"],
  ["त्", "T"],
  ["थ्", "Y"],
  ["द्", "b\\"],
  ["ध्", "W"],
  ["न्", "G"],
  ["प्", "K"],
  ["फ्", "M"],
  ["ब्", "A"],
  ["भ्", "E"],
  ["म्", "D"],
  ["य्", "o\\"],
  ["ल्", "N"],
  ["व्", "J"],
  ["श्", "Z"],
  ["ष्", "if\\"],
  ["स्", ":"],
  ["ह्", "X"],

  // Full consonants
  ["क", "s"],
  ["ख", "v"],
  ["ग", "u"],
  ["घ", "U"],
  ["ङ", "ª"],
  ["च", "r"],
  ["छ", "R"],
  ["ज", "h"],
  ["झ", "H"],
  ["ञ", "~"],
  ["ट", "6"],
  ["ठ", "7"],
  ["ड", "8"],
  ["ढ", "9"],
  ["ण", "0f"],
  ["त", "t"],
  ["थ", "y"],
  ["द", "b"],
  ["ध", "w"],
  ["न", "g"],
  ["प", "k"],
  ["फ", "m"],
  ["ब", "a"],
  ["भ", "e"],
  ["म", "d"],
  ["य", "o"],
  ["र", "/"],
  ["ल", "n"],
  ["व", "j"],
  ["श", "z"],
  ["ष", "i"],
  ["स", ";"],
  ["ह", "x"],

  // Devanagari Digits
  ["०", ")"],
  ["१", "!"],
  ["२", "@"],
  ["३", "#"],
  ["४", "$"],
  ["५", "%"],
  ["६", "^"],
  ["७", "&"],
  ["८", "*"],
  ["९", "("],

  // Punctuation
  ["।", "."],
  ["॥", ".."],
];

/**
 * Convert Unicode Nepali to Preeti font format
 */
export function convertUnicodeToPreeti(input: string): string {
  if (!input) return "";

  let text = input;

  // 1. Compound glyph replacements
  text = text.replace(/त्र/g, "q");
  text = text.replace(/ज्ञ/g, "1");
  text = text.replace(/श्र/g, ">");
  text = text.replace(/ऋ/g, "C");
  text = text.replace(/ॐ/g, "cf‘");

  // 2. R-Akar (consonant + virama + ra)
  text = text.replace(/([कखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह])्\u0930/g, "$1|");
  text = text.replace(/([टठडढ])\|/g, "$1^");

  // 3. Reph handling (र + ् + consonant => consonant + {)
  const rephRegex = /र्([क-ह](?:्[क-ह])?)/g;
  text = text.replace(rephRegex, "$1{");

  // 4. Hraswa I-kar (ि) repositioning
  const ikarRegex = /((?:[क-ह]्)*[क-ह](?:\||\^)?(?:\{)?)ि/g;
  text = text.replace(ikarRegex, "l$1");

  // 5. E-kar and AI-kar
  text = text.replace(/े/g, "]");
  text = text.replace(/ै/g, "}");

  // 6. Direct Character Mapping
  for (const [uni, preeti] of unicodeToPreetiMap) {
    if (uni.length > 0) {
      text = text.replaceAll(uni, preeti);
    }
  }

  // 7. Cleanup spacing artifacts
  text = text.replace(/l\s+/g, "l");

  return text;
}

/**
 * Convert Preeti font text to Unicode Nepali
 */
export function convertPreetiToUnicode(input: string): string {
  if (!input) return "";

  let text = input;

  // 1. Standardize common ligatures & alt symbols
  text = text.replace(/±/g, "Z+");
  text = text.replace(/Æ/g, "ª\\u");
  text = text.replace(/æ/g, "ª\\s");
  text = text.replace(/Ø/g, "i6");
  text = text.replace(/È/g, "i7");
  text = text.replace(/÷/g, "द्म");
  text = text.replace(/å/g, "द्द");
  text = text.replace(/Þ/g, "द्य");
  text = text.replace(/Í/g, "द्ध");
  text = text.replace(/~/g, "ञ");
  text = text.replace(/`\\/g, "ञ्");
  text = text.replace(/`/g, "ञ्");
  text = text.replace(/Tt/g, "त्त");
  text = text.replace(/Ts/g, "त्क");
  text = text.replace(/If\\/g, "क्ष्");
  text = text.replace(/If/g, "क्ष");
  text = text.replace(/1\\/g, "ज्ञ्");
  text = text.replace(/1/g, "ज्ञ");
  text = text.replace(/q\\/g, "त्र्");
  text = text.replace(/q/g, "त्र");
  text = text.replace(/>/g, "श्र");
  text = text.replace(/2/g, "द्ध");
  text = text.replace(/\?/g, "रु");
  text = text.replace(/r"/g, "रू");

  // 2. Retroflex ra-akar
  text = text.replace(/6\^/g, "ट्र");
  text = text.replace(/7\^/g, "ठ्र");
  text = text.replace(/8\^/g, "ड्र");
  text = text.replace(/9\^/g, "ढ्र");

  // 3. Reph repositioning: '{' comes after consonant in Preeti, but in Devanagari it's 'र्' BEFORE consonant
  // e.g. s{ => र्क
  text = text.replace(/([a-zA-Z0-9~`_]+)\{/g, "#REPH#$1");

  // 4. I-kar repositioning: 'l' comes BEFORE consonant in Preeti, but in Devanagari 'ि' comes AFTER consonant
  // Handle single consonant (e.g. ls => कि) or conjuncts (e.g. l:t => स्ति, lk| => प्रि)
  text = text.replace(/l([A-Z:;]?[a-zA-Z~`_\|]+)/g, "$1#IKAR#");

  // 5. Ra-akar mapping
  text = text.replace(/([a-zA-Z])\|/g, "$1्\u0930");

  // 6. Multi-character vowels & symbols
  const preetiToUniPairs: [string, string][] = [
    ["cf‘", "ॐ"],
    ["cf}", "औ"],
    ["cf]", "ओ"],
    ["cf", "आ"],
    ["c+", "अं"],
    ["cF", "अँ"],
    ["c", "अ"],
    ["O{", "ई"],
    ["O", "इ"],
    ["pm", "ऊ"],
    ["p", "उ"],
    ["P]", "ऐ"],
    ["P", "ए"],
    ["C", "ऋ"],

    ["f]", "ो"],
    ["f}", "ौ"],
    ["f", "ा"],
    ["L", "ी"],
    ["'", "ु"],
    ['"', "ू"],
    ["]", "े"],
    ["}", "ै"],
    ["+", "ं"],
    ["F", "ँ"],
    [":", "स्"],
    ["\\", "्"],
    [".", "।"],

    // Half consonants (Shift keys)
    ["S", "क्"],
    ["V", "ख्"],
    ["U", "घ्"],
    ["W", "ध्"],
    ["R", "छ्"],
    ["H", "झ्"],
    ["0", "ण्"],
    ["T", "त्"],
    ["Y", "थ्"],
    ["b\\", "द्"],
    ["G", "न्"],
    ["K", "प्"],
    ["M", "फ्"],
    ["A", "ब्"],
    ["E", "भ्"],
    ["D", "म्"],
    ["N", "ल्"],
    ["J", "व्"],
    ["Z", "श्"],
    ["i", "ष"],
    ["X", "ह्"],

    // Full consonants
    ["s", "क"],
    ["v", "ख"],
    ["u", "ग"],
    ["ª", "ङ"],
    ["r", "च"],
    ["h", "ज"],
    ["6", "ट"],
    ["7", "ठ"],
    ["8", "ड"],
    ["9", "ढ"],
    ["t", "त"],
    ["y", "थ"],
    ["b", "द"],
    ["w", "ध"],
    ["g", "न"],
    ["k", "प"],
    ["m", "फ"],
    ["a", "ब"],
    ["e", "भ"],
    ["d", "म"],
    ["o", "य"],
    ["/", "र"],
    ["n", "ल"],
    ["j", "व"],
    ["z", "श"],
    [";", "स"],
    ["x", "ह"],

    // Digits
    [")", "०"],
    ["!", "१"],
    ["@", "२"],
    ["#", "३"],
    ["$", "४"],
    ["%", "५"],
    ["^", "६"],
    ["&", "७"],
    ["*", "८"],
    ["(", "९"],
  ];

  for (const [preeti, uni] of preetiToUniPairs) {
    text = text.replaceAll(preeti, uni);
  }

  // 7. Place #IKAR# and #REPH#
  text = text.replace(/#IKAR#/g, "ि");
  text = text.replace(/#REPH#/g, "र्");

  // 8. Fix common grammatical anomalies
  text = text.replace(/्+/g, "्");
  text = text.replace(/ाे/g, "ो");
  text = text.replace(/ाै/g, "ौ");
  text = text.replace(/स\s*्/g, "स्");

  return text;
}

/**
 * Automatically detects whether input is Unicode Devanagari or Preeti ASCII.
 */
export function detectTextType(text: string): "unicode-to-preeti" | "preeti-to-unicode" {
  if (!text || text.trim().length === 0) return "unicode-to-preeti";

  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const asciiLettersCount = (text.match(/[a-zA-Z]/g) || []).length;

  if (devanagariCount > 0 && devanagariCount >= asciiLettersCount * 0.2) {
    return "unicode-to-preeti";
  }

  return "preeti-to-unicode";
}

/**
 * Text utility helpers
 */
export function cleanNepaliText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[ \t]+/g, " ") // normalize spaces
    .replace(/\n\s*\n\s*\n/g, "\n\n") // remove excessive newlines
    .replace(/\s+([।?,.])/g, "$1") // fix space before punctuation
    .trim();
}
