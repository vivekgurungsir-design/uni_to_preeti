/**
 * Document processor with dynamic imports to keep client bundle lightweight and safe
 */

export interface ExtractedDocument {
  name: string;
  size: number;
  type: string;
  text: string;
  paragraphs: string[];
}

/**
 * Extracts plain text and paragraph structure from TXT, DOCX, and RTF files
 */
export async function extractDocumentText(file: File): Promise<ExtractedDocument> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (extension === "docx") {
    // Dynamic import to avoid SSR/hydration crash
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

/**
 * Generates and triggers download of a formatted Word (.docx) document
 */
export async function downloadAsDocx(
  text: string,
  fontName: "Preeti" | "Noto Sans Devanagari" | "Kalimati" = "Noto Sans Devanagari",
  fileName: string = "converted-document.docx"
): Promise<void> {
  // Dynamically import docx on demand
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const lines = text.split(/\r?\n/);
  const paragraphs = lines.map((line) => {
    return new Paragraph({
      spacing: {
        after: 140,
        line: 300,
      },
      children: [
        new TextRun({
          text: line || " ",
          font: fontName,
          size: 24,
        }),
      ],
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerBlobDownload(blob, fileName.endsWith(".docx") ? fileName : `${fileName}.docx`);
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
