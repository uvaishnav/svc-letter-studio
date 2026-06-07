/**
 * extractText.ts
 * Extracts raw text from .docx (mammoth) or text-based .pdf (pdfjs-dist).
 * Returns { text, warning? } — warning is set when extraction quality is poor.
 *
 * pdfjs-dist is pinned to 4.10.38 — the same version used in SVC_Billing
 * which is confirmed working on iOS Safari. pdfjs-dist v6 uses ReadableStream
 * async iteration internally which crashes on iOS Safari 16 and below.
 *
 * CDN worker is pinned to the exact same version (4.10.38).
 * FileReader is used instead of file.arrayBuffer() for maximum iOS compatibility.
 */

export interface ExtractionResult {
  text: string;
  warning?: string;
}

// ─── iOS-safe file reader ───────────────────────────────────────────────────────
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

  // CDN worker pinned to exact same version as package.json (4.10.38).
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

  const arrayBuffer = await readFileAsArrayBuffer(file);
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
