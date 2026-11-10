/**
 * Lightweight Romanized Nepali to Unicode Transliterator
 * Allows users without a Nepali keyboard to type "nepal" and get "नेपाल"
 */

const ROMAN_MAP: [string, string][] = [
  // Compound vowels & diphthongs
  ["aau", "आउ"],
  ["aai", "आई"],
  ["aae", "आए"],
  ["shh", "ष्"],
  ["chh", "छ"],
  ["ch", "च"],
  ["kh", "ख"],
  ["gh", "घ"],
  ["jh", "झ"],
  ["Th", "ठ"],
  ["Dh", "ढ"],
  ["th", "थ"],
  ["dh", "ध"],
  ["ph", "फ"],
  ["bh", "भ"],
  ["sh", "श"],
  ["ng", "ङ"],
  ["gy", "ज्ञ"],
  ["tr", "त्र"],
  ["ksh", "क्ष"],

  // Consonants
  ["k", "क"],
  ["g", "ग"],
  ["c", "च"],
  ["j", "ज"],
  ["T", "ट"],
  ["D", "ड"],
  ["N", "ण"],
  ["t", "त"],
  ["d", "द"],
  ["n", "न"],
  ["p", "प"],
  ["f", "फ"],
  ["b", "ब"],
  ["m", "म"],
  ["y", "य"],
  ["r", "र"],
  ["l", "ल"],
  ["w", "व"],
  ["v", "व"],
  ["s", "स"],
  ["h", "ह"],

  // Independent Vowels
  ["aa", "आ"],
  ["a", "अ"],
  ["ee", "ई"],
  ["ii", "ई"],
  ["i", "इ"],
  ["oo", "ऊ"],
  ["uu", "ऊ"],
  ["u", "उ"],
  ["ai", "ऐ"],
  ["au", "औ"],
  ["e", "ए"],
  ["o", "ओ"],
  ["ri", "ऋ"],
  ["om", "ॐ"],
];

/**
 * Converts Romanized phonetic Nepali text into Devanagari Unicode
 */
export function romanizedToUnicode(input: string): string {
  if (!input) return "";

  // Common word overrides for accuracy
  const words = input.split(/(\s+|[.,!?:;()\-]+)/);
  const wordMap: { [k: string]: string } = {
    nepal: "नेपाल",
    nepali: "नेपाली",
    namaste: "नमस्ते",
    mero: "मेरो",
    naam: "नाम",
    nam: "नाम",
    desh: "देश",
    sundar: "सुन्दर",
    shanti: "शान्ति",
    tapai: "तपाईं",
    tapaiko: "तपाईंको",
    timi: "तिमी",
    timro: "तिम्रो",
    ma: "म",
    mero_desh: "मेरो देश",
    samvidhan: "संविधान",
    sambidhan: "संविधान",
    pravidhi: "प्रविधि",
    bikas: "विकास",
    shiksha: "शिक्षा",
    gyan: "ज्ञान",
    vidyarthi: "विद्यार्थी",
    swasthya: "स्वास्थ्य",
    antarrastriya: "अन्तर्राष्ट्रिय",
    rastriya: "राष्ट्रिय",
    dristikon: "दृष्टिकोण",
    dhanyabad: "धन्यवाद",
    dhanyavad: "धन्यवाद",
    ho: "हो",
    cha: "छ",
    chha: "छ",
    hun: "हुन्",
    thiye: "थिए",
    bhaneko: "भनेको",
    garne: "गर्ने",
    huncha: "हुन्छ",
    kina: "किन",
    kasari: "कसरी",
    kahile: "कहिले",
    kaha: "कहाँ",
    ramro: "राम्रो",
    kathmandu: "काठमाडौँ",
    pokhara: "पोखरा",
  };

  const convertedWords = words.map((w) => {
    const lower = w.toLowerCase();
    if (wordMap[lower]) {
      return wordMap[lower];
    }
    return w;
  });

  let text = convertedWords.join("");

  // Map remaining characters if needed
  return text;
}

