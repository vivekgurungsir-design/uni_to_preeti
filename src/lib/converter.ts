/**
 * Bidirectional Preeti <-> Devanagari Unicode Converter
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

// Ordered Unicode to Preeti Mapping Array
export const unicodeToPreetiMap: [string, string][] = [
  // Compound conjuncts & special characters
  ["द्ध", "2"],
  ["द्व", "å"],
  ["द्य", "B"],
  ["द्द", "2"],
  ["द्म", "ß"],
  ["ट्ट", "§"],
  ["ट्ठ", "Ý"],
  ["ड्ड", "•"],
  ["ठ्ठ", "¶"],
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
  ["त्त", "Q"],
  ["त्क", "Ts"],
  ["क्ष्", "I"],
  ["क्ष", "If"],
  ["ज्ञ्", "¡"],
  ["ज्ञ", "1"],
  ["त्र्", "q\\"],
  ["त्र", "q"],
  ["रु", "?"],
  ["रू", "¿"],

  // Independent vowels
  ["ॐ", "ç"],
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
  ["ृ", "["],
  ["ो", "f]"],
  ["ौ", "f}"],
  ["ं", "+"],
  ["ँ", "F"],
  ["ः", "M"],

  // Consonants with virama (half letters) - Must be processed BEFORE solitary virama
  ["फ्", "Km"],
  ["फ", "km"],
  ["क्", "S"],
  ["ख्", "V"],
  ["ग्", "U"],
  ["घ्", "£"],
  ["ङ्", "ª\\"],
  ["च्", "R"],
  ["छ्", "R\\"],
  ["ज्", "H"],
  ["झ्", "¤"],
  ["ञ्", "~"],
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
  ["ब्", "A"],
  ["भ्", "E"],
  ["म्", "D"],
  ["य्", "o\\"],
  ["ल्", "N"],
  ["व्", "J"],
  ["श्", "Z"],
  ["ष्", "i\\"],
  ["स्", ":"],
  ["ह्", "X"],

  // Solitary virama (only applied if not part of a recognized half-letter)
  ["्", "\\"],

  // Full consonants
  ["क", "s"],
  ["ख", "v"],
  ["ग", "u"],
  ["घ", "3"],
  ["ङ", "ª"],
  ["च", "r"],
  ["छ", "5"],
  ["ज", "h"],
  ["झ", "´"],
  ["ञ", "`"],
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

  // 1. Pre-process special complex ligatures
  text = text.replace(/क्र/g, "qm");
  text = text.replace(/क्त/g, "Qm");
  text = text.replace(/झ/g, "´");
  text = text.replace(/त्र/g, "q");
  text = text.replace(/ज्ञ/g, "1");
  text = text.replace(/श्र/g, ">");
  text = text.replace(/ऋ/g, "C");
  text = text.replace(/ॐ/g, "ç");

  // Word-final halanta Sa (स्) in words like गर्नुहोस्, लिनुहोस् => complete Sa with halanta (;\)
  text = text.replace(/स्(?=[\s\.,।?!;:()_\"'\n\r\t]|$)/g, ";\\");
  // Sa before consonants in conjuncts (नमस्ते, स्थान, स्वास्थ्य) => half-Sa (:)
  text = text.replace(/स्(?=[क-ह])/g, ":");

  // 2. R-Akar combinations (consonant + virama + ra => consonant + | or ^)
  text = text.replace(/([कखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह])्\u0930/g, "$1|");
  text = text.replace(/([टठडढ])\|/g, "$1«");

  // 3. Reph handling (र + ् + consonant => consonant + {)
  const rephRegex = /र्([क-ह](?:्[क-ह])?)/g;
  text = text.replace(rephRegex, "$1{");

  // 4. Hraswa I-kar (ि) repositioning
  // 4a. Complex ligatures: e.g. त्रि (qि -> lq), क्रि (qmि -> lqm), क्ति (Qmि -> lQm), श्रि (>ि -> l>), ज्ञि (1ि -> l1)
  text = text.replace(/((?:[क-ह]्)*)([q1>]|qm|Qm|´)ि/g, "l$1$2");

  // 4b. Standard consonant clusters: [consonants + viramas] + consonant + ि => l + [cluster]
  const ikarRegex = /((?:[क-ह]्)*[क-ह](?:\||«)?(?:\{)?)ि/g;
  text = text.replace(ikarRegex, "l$1");

  // 5. E-kar and AI-kar
  text = text.replace(/े/g, "]");
  text = text.replace(/ै/g, "}");

  // 6. Direct Character Mapping (order matters: longer strings first)
  for (const [uni, preeti] of unicodeToPreetiMap) {
    if (uni.length > 0) {
      text = text.replaceAll(uni, preeti);
    }
  }

  // 7. Spacing cleanups
  text = text.replace(/l\s+/g, "l");

  return text;
}

// Preeti character map to Unicode
const PREETI_CHAR_MAP: { [k: string]: string } = {
  "v": "ख", "r": "च", "\"": "ू", "~": "ञ्", "z": "श", "ç": "ॐ", "f": "ा", "b": "द", "n": "ल", "j": "व",
  "V": "ख्", "R": "च्", "ß": "द्म", "^": "६", "Û": "!", "Z": "श्", "F": "ँ", "B": "द्य", "N": "ल्",
  "Ë": "ङ्ग", "J": "व्", "6": "ट", "2": "द्द", "¿": "रू", ">": "श्र", ":": ":", "§": "ट्ट", "&": "७",
  "£": "घ्", "•": "ड्ड", ".": ".", "«": "्र", "*": "८", "„": "ध्र", "w": "ध", "s": "क", "g": "न",
  "æ": "“", "c": "अ", "o": "य", "k": "प", "W": "ध्", "Ö": "=", "S": "क्", "Ò": "¨", "_": ")", "[": "ृ",
  "Ú": "’", "G": "न्", "ˆ": "फ्", "C": "ऋ", "O": "इ", "Î": "ङ्ख", "K": "प्", "7": "ठ", "¶": "ठ्ठ", "3": "घ",
  "9": "ढ", "?": "?", ";": "स", "'": "ु", "#": "३", "¢": "द्घ", "/": "र", "+": "ं", "ª": "ङ", "t": "त",
  "p": "उ", "|": "्र", "x": "ह", "å": "द्व", "d": "म", "`": "ञ", "l": "ि", "h": "ज", "T": "त्", "P": "ए",
  "Ý": "ट्ठ", "\\": "्", "Ù": ";", "X": "ह्", "Å": "हृ", "D": "म्", "@": "२", "Í": "ङ्क", "L": "ी",
  "H": "ज्", "4": "द्ध", "±": "+", "0": "ण्", "<": "?", "8": "ड", "¥": "र्‍", "$": "४", "¡": "ज्ञ्",
  ",": ",", "©": "र", "(": "(", "‘": "ॅ", "u": "ग", "q": "त्र", "}": "ै", "y": "थ", "e": "भ", "a": "ब",
  "i": "ष्", "‰": "झ्", "U": "ग्", "Q": "त्त", "]": "े", "˜": "ऽ", "Y": "थ्", "Ø": "्य", "E": "भ्",
  "A": "ब्", "M": "ः", "Ì": "न्न", "I": "क्ष्", "5": "छ", "´": "झ", "1": "ज्ञ", "°": "ङ्ढ", "=": "=",
  "Æ": "”", "‹": "ङ्घ", "%": "५", "¤": "झ्", "!": "१", "-": "-", "›": "द्र", ")": ")", "…": "‘", "Ü": "%"
};

const PREETI_POST_RULES: [string, string][] = [
  ["्ा", ""],
  ["(त्र|त्त)([^उभप]+?)m", "$1m$2"],
  ["त्रm", "क्र"],
  ["त्तm", "क्त"],
  ["([^उभप]+?)m", "m$1"],
  ["उm", "ऊ"],
  ["भm", "झ"],
  ["पm", "फ"],
  ["प्m", "फ्"],
  ["इ{", "ई"],
  ["ि((.्)*[^्])", "$1ि"],
  ["(.[ािीुूृेैोौंःँ]*?){", "{$1"],
  ["((.्)*){", "{$1"],
  ["{", "र्"],
  ["([ाीुूृेैोौंःँ]+?)(्(.्)*[^्])", "$2$1"],
  ["्([ाीुूृेैोौंःँ]+?)((.्)*[^्])", "्$2$1"],
  ["([ंँ])([ािीुूृेैोौः]*)", "$2$1"],
  ["ँँ", "ँ"],
  ["ंं", "ं"],
  ["ेे", "े"],
  ["ैै", "ै"],
  ["ुु", "ु"],
  ["ूू", "ू"],
  ["^ः", ":"],
  ["टृ", "ट्ट"],
  ["ेा", "ाे"],
  ["ैा", "ाै"],
  ["अाे", "ओ"],
  ["अाै", "औ"],
  ["अा", "आ"],
  ["एे", "ऐ"],
  ["ाे", "ो"],
  ["ाै", "ौ"]
];

/**
 * Convert Preeti font text to Unicode Nepali
 */
export function convertPreetiToUnicode(input: string): string {
  if (!input) return "";

  let text = input;

  // 1. Conjunct half-Sa ':' only appears immediately preceding a letter (e.g. :t -> स्त, :y -> स्थ, :j -> स्व, :k -> स्प)
  // Standalone ':' or ':' followed by space or punctuation remains ':'
  text = text.replace(/:([a-zA-Z])/g, "स्$1");

  // 2. Preeti '?' is Ru only when followed by a letter (e.g. ?k -> रुप, ?lkof -> रुपिया)
  // Standalone '?' remains '?'
  text = text.replace(/\?([a-zA-Z])/g, "रु$1");

  let output = "";
  for (let w = 0; w < text.length; w++) {
    output += PREETI_CHAR_MAP[text[w]] || text[w];
  }

  for (let r = 0; r < PREETI_POST_RULES.length; r++) {
    output = output.replace(new RegExp(PREETI_POST_RULES[r][0], "g"), PREETI_POST_RULES[r][1]);
  }

  return output;
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
 * Clean text helper
 */
export function cleanNepaliText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .replace(/\s+([।?,.])/g, "$1")
    .trim();
}
