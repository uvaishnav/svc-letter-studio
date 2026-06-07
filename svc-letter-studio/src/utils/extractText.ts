/**
 * extractText.ts
 * Extracts raw text from .docx (mammoth) or text-based .pdf (pdfjs-dist).
 * Returns { text, warning? } — warning is set when extraction quality is poor.
 *
 * iOS Safari compatibility notes:
 * - file.arrayBuffer() triggers a ReadableStream async iteration path inside
 *   pdfjs-dist v6 that crashes on iOS Safari 16 and below.
 * - FileReader.readAsArrayBuffer() is the older, fully supported API on all
 *   iOS versions and avoids ReadableStream entirely.
 * - pdfjs CDN worker is pinned to exact version 6.0.227 (matches package.json).
 */

export interface ExtractionResult {
  text: string;
  warning?: string;
}

// ─── iOS-safe file reader ───────────────────────────────────────────────────────
// Uses FileReader instead of file.arrayBuffer() — works on all iOS versions.
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
}

// ─── .docx via mammoth ────────────────────────────────────────────────────────
async function extractDocx(file: File): Promise<ExtractionResult> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();
  if (!text) {
    throw new Error('The Word document appears to be empty or image-only.');
  }
  const warning = result.messages.length > 0
    ? 'Some content (images, charts) could not be extracted.'
    : undefined;
  return { text, warning };
}

// ─── .pdf via pdfjs-dist ──────────────────────────────────────────────────────
async function extractPdf(file: File): Promise<ExtractionResult> {
  const pdfjsLib = await import('pdfjs-dist');

  // CDN worker pinned to exact installed version — pdfjs enforces strict match.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.0.227/build/pdf.worker.min.mjs';

  // Use FileReader instead of file.arrayBuffer() to avoid ReadableStream
  // async iteration which crashes on iOS Safari 16 and below.
  const arrayBuffer = await readFileAsArrayBuffer(file);

  // Pass as Uint8Array — pdfjs takes ownership without any stream wrapping.
  const data = new Uint8Array(arrayBuffer);
  const pdf  = await pdfjsLib.getDocument({ data }).promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();
    if (pageText) pageTexts.push(pageText);
  }

  const text = pageTexts.join('\n\n').trim();

  if (!text) {
    throw new Error(
      'No readable text found. This PDF may be image-based (scanned). Please use a text-based PDF or a .docx file.'
    );
  }

  const warning =
    text.length < 50
      ? 'Very little text was extracted. The PDF may be mostly images.'
      : undefined;

  return { text, warning };
}

// ─── Public entry point ───────────────────────────────────────────────────────
export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.docx')) {
    return extractDocx(file);
  }

  if (name.endsWith('.pdf')) {
    return extractPdf(file);
  }

  throw new Error(
    `Unsupported file type ".${name.split('.').pop()}". Please upload a .docx or .pdf file.`
  );
}
