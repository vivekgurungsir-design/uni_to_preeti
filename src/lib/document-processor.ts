/**
 * Document Processor with Intelligent Font & Mixed Language Preservation
 */

import { splitMixedSegments, convertMixedText, MixedSegment, isEnglishWord } from "./mixed-language";

export interface ExtractedDocument {
  name: string;
  size: number;
  type: string;
  text: string;
  paragraphs: string[];
  runs?: { text: string; font?: string; isEnglish: boolean }[];
}

/**
 * Extracts plain text and paragraph structure from TXT, DOCX, and RTF files.
 * For DOCX, parses word/document.xml to extract exact font metadata for each run.
 */
export async function extractDocumentText(file: File): Promise<ExtractedDocument> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (extension === "docx") {
    try {
      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default || JSZipModule;
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const xml = await zip.file("word/document.xml")?.async("string");

      if (xml) {
        // Parse paragraphs and runs from XML
        const paragraphRegex = /<w:p\b[\s\S]*?<\/w:p>/g;
        const paragraphs: string[] = [];
        const runs: { text: string; font?: string; isEnglish: boolean }[] = [];
        let fullText = "";

        let pMatch: RegExpExecArray | null;
        while ((pMatch = paragraphRegex.exec(xml)) !== null) {
          const pXml = pMatch[0];
          const runRegex = /<w:r\b[\s\S]*?<\/w:r>/g;
          let pText = "";

          let rMatch: RegExpExecArray | null;
          while ((rMatch = runRegex.exec(pXml)) !== null) {
            const rXml = rMatch[0];
            const fontMatch = rXml.match(/<w:rFonts[^>]*w:ascii="([^"]+)"/i);
            const fontName = fontMatch ? fontMatch[1] : "";

            // Extract all <w:t> inside this run
            const tRegex = /<w:t(?:\s+[^>]*)?>([\s\S]*?)<\/w:t>/g;
            let tMatch: RegExpExecArray | null;
            let runText = "";
            while ((tMatch = tRegex.exec(rXml)) !== null) {
              runText += decodeXml(tMatch[1]);
            }

            if (runText) {
              const isPreetiFont = /preeti|kantipur|fontasy|himali|sagarmatha/i.test(fontName);
              const isLatinFont = /arial|calibri|times|helvetica|segoe|verdana|georgia/i.test(fontName);

              // If typed in Latin font and not containing Devanagari, it is definitely English
              const isEnglish = isLatinFont || (!isPreetiFont && isEnglishWord(runText));

              runs.push({
                text: runText,
                font: fontName,
                isEnglish,
              });

              pText += runText;
            }
          }

          if (pText.trim().length > 0) {
            paragraphs.push(pText);
            fullText += pText + "\n";
          }
        }

        if (fullText.trim().length > 0) {
          return {
            name: file.name,
            size: file.size,
            type: "docx",
            text: fullText.trim(),
            paragraphs,
            runs,
          };
        }
      }
    } catch (docxErr) {
      console.warn("XML parser failed, falling back to mammoth:", docxErr);
    }

    // Fallback to mammoth
    const mammothModule = await import("mammoth");
    const mammoth = mammothModule.default || mammothModule;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value || "";
    const paragraphs = text
      .split(/\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return {
      name: file.name,
      size: file.size,
      type: "docx",
      text,
      paragraphs,
    };
  }

  // Plain text or RTF
  const text = await file.text();
  let cleanText = text;
  if (extension === "rtf" && text.startsWith("{\\rtf")) {
    cleanText = text
      .replace(/\{\*?\\[^{}]+;?\}|[{}]|\\\n?[A-Za-z]+\b/g, " ")
      .replace(/\\'[0-9a-fA-F]{2}/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const paragraphs = cleanText
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return {
    name: file.name,
    size: file.size,
    type: extension || "txt",
    text: cleanText,
    paragraphs,
  };
}

function decodeXml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates and triggers download of a formatted Word (.docx) document
 * with PROPER font assignments recognized by all versions of Microsoft Word:
 * - English text runs get "Arial"
 * - Preeti text runs get "Preeti" across ascii, hAnsi, cs, and eastAsia
 * - Unicode Devanagari text runs get "Noto Sans Devanagari"
 */
export async function downloadAsDocx(
  input: string | MixedSegment[],
  mode: "unicode-to-preeti" | "preeti-to-unicode" = "unicode-to-preeti",
  fileName: string = "converted-document.docx"
): Promise<void> {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  let segments: MixedSegment[] = [];
  if (Array.isArray(input)) {
    segments = input;
  } else {
    // If input is a raw string, split it into segments
    segments = splitMixedSegments(input, mode);
  }

  const preetiFontSpec = {
    name: "Preeti",
    ascii: "Preeti",
    hAnsi: "Preeti",
    cs: "Preeti",
    eastAsia: "Preeti",
  };

  const englishFontSpec = {
    name: "Arial",
    ascii: "Arial",
    hAnsi: "Arial",
    cs: "Arial",
    eastAsia: "Arial",
  };

  const devanagariFontSpec = {
    name: "Noto Sans Devanagari",
    ascii: "Noto Sans Devanagari",
    hAnsi: "Noto Sans Devanagari",
    cs: "Noto Sans Devanagari",
    eastAsia: "Noto Sans Devanagari",
  };

  const paragraphs: any[] = [];
  let currentRuns: any[] = [];

  for (const seg of segments) {
    const textToUse = seg.convertedText || seg.text;
    const fontToUse = seg.isEnglish
      ? englishFontSpec
      : mode === "unicode-to-preeti"
      ? preetiFontSpec
      : devanagariFontSpec;

    const fontSize = seg.isEnglish ? 24 : mode === "unicode-to-preeti" ? 28 : 24;

    const parts = textToUse.split(/\r?\n/);
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        currentRuns.push(
          new TextRun({
            text: parts[i],
            font: fontToUse,
            size: fontSize,
          })
        );
      }
      if (i < parts.length - 1) {
        // Line break / paragraph boundary
        paragraphs.push(
          new Paragraph({
            spacing: { after: 120, line: 280 },
            children: currentRuns.length > 0 ? currentRuns : [new TextRun({ text: " " })],
          })
        );
        currentRuns = [];
      }
    }
  }

  if (currentRuns.length > 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 120, line: 280 },
        children: currentRuns,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children:
          paragraphs.length > 0
            ? paragraphs
            : [new Paragraph({ children: [new TextRun({ text: " " })] })],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerBlobDownload(blob, fileName.endsWith(".docx") ? fileName : `${fileName}.docx`);
}

/**
 * Copies rich formatted text to clipboard with HTML styling so that when
 * pasted into Microsoft Word, Word automatically applies Preeti font to Nepali
 * text and Arial to English text!
 */
export async function copyToClipboardWithFormatting(
  segments: MixedSegment[],
  mode: "unicode-to-preeti" | "preeti-to-unicode",
  plainText: string
): Promise<boolean> {
  const nepaliFont =
    mode === "unicode-to-preeti"
      ? "Preeti, 'Kantipur', sans-serif"
      : "'Noto Sans Devanagari', 'Kalimati', sans-serif";
  const englishFont = "Arial, Helvetica, sans-serif";

  // Build rich HTML snippet for MS Word clipboard
  let htmlContent = `<meta charset="utf-8"><div style="font-size: 14pt; line-height: 1.6; color: #000000;">`;

  if (segments && segments.length > 0) {
    let currentParagraphHtml = `<p style="margin: 0 0 8pt 0; line-height: 1.6;">`;
    for (const seg of segments) {
      const font = seg.isEnglish ? englishFont : nepaliFont;
      const size = seg.isEnglish ? "12pt" : mode === "unicode-to-preeti" ? "14pt" : "12pt";
      const parts = (seg.convertedText || seg.text).split(/\r?\n/);

      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
          currentParagraphHtml += `<span style="font-family: ${font}; font-size: ${size};">${escapeHtml(
            parts[i]
          )}</span>`;
        }
        if (i < parts.length - 1) {
          currentParagraphHtml += `</p><p style="margin: 0 0 8pt 0; line-height: 1.6;">`;
        }
      }
    }
    currentParagraphHtml += `</p>`;
    htmlContent += currentParagraphHtml;
  } else {
    htmlContent += `<p style="font-family: ${nepaliFont}; font-size: 14pt;">${escapeHtml(plainText)}</p>`;
  }
  htmlContent += `</div>`;

  try {
    if (typeof window !== "undefined" && navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob([plainText], { type: "text/plain" });
      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": textBlob,
          "text/html": htmlBlob,
        }),
      ]);
      return true;
    }
  } catch (err) {
    console.warn("ClipboardItem rich text copy failed, falling back to writeText:", err);
  }

  // Fallback
  if (typeof window !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(plainText);
  }
  return true;
}

/**
 * Triggers download of raw text as a .txt file
 */
export function downloadAsTxt(text: string, fileName: string = "converted-text.txt"): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  triggerBlobDownload(blob, fileName.endsWith(".txt") ? fileName : `${fileName}.txt`);
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
