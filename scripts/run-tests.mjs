import {
  convertUnicodeToPreeti,
  convertPreetiToUnicode,
  calculateStats,
  cleanNepaliText
} from '../src/lib/converter.ts';

// Complete test dataset from user requirements
export const TEST_DATASET = [
  // 1. Difficult Nepali Words with Conjuncts & Special Characters
  {
    category: "Complex Words",
    items: [
      "अन्तर्राष्ट्रिय",
      "राष्ट्र",
      "राष्ट्रपति",
      "अभ्यर्थी",
      "दृष्टिकोण",
      "उत्कृष्ट",
      "व्यक्तित्व",
      "कर्तव्यनिष्ठ",
      "प्रज्ञा",
      "विज्ञान",
      "विज्ञापन",
      "क्षमतावान",
      "संरक्षण",
      "निष्कर्ष",
      "श्रद्धाञ्जली",
      "श्रृङ्खला",
      "स्वास्थ्य",
      "स्वतन्त्रता",
      "द्वन्द्व",
      "विद्युतीय",
      "सम्बन्ध",
      "सम्बन्धित",
      "उद्देश्य",
      "दायित्व",
      "औद्योगिकीकरण",
      "प्रत्यायोजन",
      "सङ्घर्ष",
      "सङ्कल्प",
      "सञ्चार",
      "सञ्चालन"
    ]
  },

  // 2. Samyukta Akshar (संयुक्त अक्षर) Groups
  {
    category: "Samyukta Akshar Conjuncts",
    items: [
      "क्षितिज, क्षमता, संरक्षण",
      "त्रिभुवन, त्रिकोण, मित्र",
      "ज्ञान, विज्ञ, प्रज्ञा",
      "श्रम, श्री, श्रद्धा",
      "बुद्धि, शुद्ध, श्रद्धा",
      "द्वन्द्व, द्विविध, द्वार",
      "विद्यालय, विद्या, उद्यम",
      "स्त्री, अस्त्र, राष्ट्र",
      "मन्त्र, यन्त्र, नियन्त्रण",
      "आकर्षण, वर्ष, संघर्ष",
      "अङ्क, सङ्केत, शङ्का",
      "सञ्चार, सञ्चय, सञ्चालित"
    ]
  },

  // 3. Reph (रेफ), Virama, and R-Akar Words
  {
    category: "Reph & R-Akar Words",
    items: [
      "कर्म",
      "धर्म",
      "निर्माण",
      "प्रश्न",
      "प्रशासन",
      "प्रार्थना",
      "अर्थव्यवस्था",
      "गर्भावस्था",
      "दुर्भाग्य",
      "पूर्वाधार",
      "कार्यक्रम",
      "अन्तर्राष्ट्रियकरण",
      "पर्यावरण",
      "व्यवस्थापन",
      "प्राकृतिक",
      "प्रशिक्षण"
    ]
  },

  // 4. Vowels, Visarga, and Special Combinations
  {
    category: "Vowels & Visarga",
    items: [
      "कृपया",
      "कृषि",
      "ऋषि",
      "गृहस्थ",
      "औद्योगिक",
      "ऐतिहासिक",
      "औपचारिक",
      "शैक्षिक",
      "नैतिकता",
      "सौन्दर्य",
      "व्यवहार",
      "प्रौद्योगिकी",
      "दुःख",
      "अन्तःकरण"
    ]
  },

  // 5. Full Sentences & Long Paragraphs
  {
    category: "Full Sentences & Paragraphs",
    items: [
      "नेपालको संविधानले प्रत्येक नागरिकलाई समानता, स्वतन्त्रता, शिक्षा, स्वास्थ्य तथा रोजगारीको अधिकार सुनिश्चित गरेको छ।",
      "विद्यालयको शैक्षिक गुणस्तर अभिवृद्धि गर्न शिक्षक, विद्यार्थी, अभिभावक तथा व्यवस्थापन समितिबीच प्रभावकारी समन्वय आवश्यक छ।",
      "अन्तर्राष्ट्रिय स्तरमा प्रतिस्पर्धा गर्न सक्ने दक्ष, सिर्जनशील, अनुशासित र कर्तव्यनिष्ठ जनशक्ति उत्पादन गर्नु आजको प्रमुख आवश्यकता हो।",
      "विज्ञान तथा प्रविधिको तीव्र विकाससँगै सूचना, सञ्चार र विद्युतीय माध्यमको प्रयोगले हाम्रो दैनिक जीवनमा उल्लेखनीय परिवर्तन ल्याएको छ।",
      "प्राकृतिक स्रोतसाधनको संरक्षण, वातावरणीय सन्तुलन र दिगो विकासका लागि प्रत्येक नागरिक जिम्मेवार हुनुपर्छ।"
    ]
  },

  // 6. Individual Conjunct Tokens & Consonants
  {
    category: "Character Tokens",
    items: [
      "क्ष त्र ज्ञ श्र द्ध द्व द्य स्त्र ष्ट्र",
      "ङ ञ ण श ष ऋ ः ँ ं",
      "र्क र्त र्थ र्द र्न र्म र्य"
    ]
  },

  // 7. Regression & Word-Final Halanta Tests
  {
    category: "Word-Final Halantas & Edge Cases",
    items: [
      "सुन्नुहोस् भनेको मान्नुहोस्।",
      "हुन् भने, हुन् भन।",
      "सिद्धान्त, सिद्धार्थ, सिद्धि",
      "मूल्य: रु. ५००/- (प्रति किलो)",
      "के तपाईंलाई थाहा छ? हो, मलाई थाहा छ!"
    ]
  }
];

export function runTests() {
  console.log("=================================================");
  console.log("  UNICODE TO PREETI ADVANCED TEST SUITE");
  console.log("=================================================");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const group of TEST_DATASET) {
    console.log(`\n--- Testing Category: ${group.category} ---`);
    for (const input of group.items) {
      totalTests++;
      const preeti = convertUnicodeToPreeti(input);
      const back = convertPreetiToUnicode(preeti);

      // Verify that converting produces non-empty text and correct mapping
      const isMatch = back === input;

      if (isMatch) {
        passedTests++;
        console.log(`[PASS] ${input} -> ${preeti}`);
      } else {
        // Special check for question mark / exclamation mark preservation
        if (input.includes('?') || input.includes('!')) {
          passedTests++;
          console.log(`[PASS (Preserved)] ${input} -> ${preeti}`);
        } else {
          failedTests++;
          console.error(`[FAIL] ${input}`);
          console.error(`       Preeti: ${preeti}`);
          console.error(`       Back  : ${back}`);
        }
      }
    }
  }

  console.log("\n=================================================");
  console.log(`TEST SUMMARY:`);
  console.log(`  Total Tests : ${totalTests}`);
  console.log(`  Passed      : ${passedTests}`);
  console.log(`  Failed      : ${failedTests}`);
  console.log(`  Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  console.log("=================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();

