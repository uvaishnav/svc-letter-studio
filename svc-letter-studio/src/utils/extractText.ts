/**
 * extractText.ts
 * Extracts raw text from .docx (mammoth) or text-based .pdf (pdfjs-dist).
 * Returns { text, warning? } — warning is set when extraction quality is poor.
 *
 * NOTE: pdfjs worker is intentionally disabled (workerSrc = '').
 * iOS Safari does not support ES module Web Workers, which causes a hard crash
 * when using pdfjs-dist's .mjs worker via new URL(..., import.meta.url).
 * Running pdfjs on the main thread is safe for typical letter-sized documents.
 */

export interface ExtractionResult {
  text: string;
  warning?: string;
}

// ─── .docx via mammoth ────────────────────────────────────────────────────────
async function extractDocx(file: File): Promise<ExtractionResult> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
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

  // Disable the Web Worker entirely.
  // iOS Safari does not support ES module workers (type: 'module'),
  // which pdfjs-dist's .mjs worker requires. Setting workerSrc to an
  // empty string forces pdfjs to run synchronously on the main thread.
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
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
