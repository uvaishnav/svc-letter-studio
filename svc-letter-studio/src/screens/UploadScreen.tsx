/**
 * UploadScreen.tsx
 * Phase 7 — Upload & Convert entry path.
 *
 * Flow:
 *   1. User picks a .docx or .pdf file
 *   2. We extract raw text (mammoth / pdfjs-dist)
 *   3. We pass the extracted text straight into the existing
 *      classifyIntent → generateClarification → generateDraft pipeline
 *      (identical to IntakeScreen — reuses 100% of AI + PDF layers)
 */

import { useRef, useState } from 'react';
import type { Screen } from '../App';
import { extractTextFromFile } from '../utils/extractText';
import { classifyIntent } from '../ai/tasks/classifyIntent';
import { generateClarification } from '../ai/tasks/generateClarification';
import { generateDraft } from '../ai/tasks/generateDraft';
import type { PipelineContext } from '../ai/types';
import type { LetterDraft } from '../types/document';

interface Props {
  navigate:        (s: Screen) => void;
  setDraft:        (draft: LetterDraft, provider: 'gemini' | 'groq') => void;
  setRawInput:     (text: string) => void;
  setPipelineCtx:  (ctx: PipelineContext) => void;
}

type Stage =
  | 'idle'
  | 'extracting'
  | 'classifying'
  | 'clarifying'
  | 'generating'
  | 'error';

const STAGE_LABELS: Record<Stage, string> = {
  idle:        '',
  extracting:  'Reading your document…',
  classifying: 'Understanding content…',
  clarifying:  'Checking for missing details…',
  generating:  'Drafting on letterhead…',
  error:       '',
};

export default function UploadScreen({
  navigate,
  setDraft,
  setRawInput,
  setPipelineCtx,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage]             = useState<Stage>('idle');
  const [fileName, setFileName]       = useState<string | null>(null);
  const [warning, setWarning]         = useState<string | null>(null);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);

  // Clarification state
  const [needsClarify, setNeedsClarify] = useState(false);
  const [clarifyQuestion, setClarifyQuestion] = useState('');
  const [clarifyAnswer, setClarifyAnswer]     = useState('');
  const [pendingCtx, setPendingCtx]   = useState<PipelineContext | null>(null);

  // ─── Main pipeline ───────────────────────────────────────────────────────────
  async function runPipeline(extractedText: string) {
    setRawInput(extractedText);

    // Stage 2 — classify
    setStage('classifying');
    let ctx: PipelineContext;
    try {
      ctx = await classifyIntent(extractedText);
    } catch (e: any) {
      setStage('error');
      setErrorMsg(e?.message ?? 'Failed to understand the document. Please try again.');
      return;
    }

    // Stage 3 — clarification (if required fields missing)
    setStage('clarifying');
    let finalCtx = ctx;
    try {
      const clarification = await generateClarification(ctx);
      if (clarification.question) {
        // Pause pipeline — show clarification UI
        setPipelineCtx(ctx);
        setPendingCtx(ctx);
        setClarifyQuestion(clarification.question);
        setNeedsClarify(true);
        setStage('idle');
        return;
      }
    } catch {
      // Non-fatal — continue without clarification
    }

    await finalizeDraft(finalCtx);
  }

  async function finalizeDraft(ctx: PipelineContext) {
    setStage('generating');
    try {
      const result = await generateDraft(ctx);
      setDraft(result.draft, result.provider);
      setPipelineCtx(ctx);
      navigate('draft');
    } catch (e: any) {
      setStage('error');
      setErrorMsg(e?.message ?? 'Draft generation failed. Please try again.');
    }
  }

  // ─── File pick handler ───────────────────────────────────────────────────────
  async function handleFile(file: File) {
    setStage('extracting');
    setFileName(file.name);
    setWarning(null);
    setErrorMsg(null);
    setNeedsClarify(false);

    try {
      const { text, warning: w } = await extractTextFromFile(file);
      if (w) setWarning(w);
      await runPipeline(text);
    } catch (e: any) {
      setStage('error');
      setErrorMsg(e?.message ?? 'Could not read the file.');
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-picked after error
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  // ─── Clarification submit ────────────────────────────────────────────────────
  async function submitClarification() {
    if (!pendingCtx || !clarifyAnswer.trim()) return;
    const enrichedCtx: PipelineContext = {
      ...pendingCtx,
      clarifications: [
        ...(pendingCtx.clarifications ?? []),
        { question: clarifyQuestion, answer: clarifyAnswer.trim() },
      ],
    };
    setNeedsClarify(false);
    setClarifyAnswer('');
    await finalizeDraft(enrichedCtx);
  }

  function skipClarification() {
    if (!pendingCtx) return;
    setNeedsClarify(false);
    finalizeDraft(pendingCtx);
  }

  // ─── Derived state ───────────────────────────────────────────────────────────
  const isProcessing = ['extracting', 'classifying', 'clarifying', 'generating'].includes(stage);
  const stageLabel   = STAGE_LABELS[stage];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full px-5 pt-14 pb-8" style={{ background: '#F5F1E8' }}>

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('home')}
          className="text-sm font-medium mb-4 flex items-center gap-1"
          style={{ color: '#C8A96A' }}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold" style={{ color: '#3B2A1F', fontFamily: 'Montserrat, sans-serif' }}>
          Upload &amp; Convert
        </h1>
        <p className="text-sm mt-1" style={{ color: '#7A6A5A' }}>
          Upload a .docx or PDF — AI will restructure it onto branded letterhead.
        </p>
      </div>

      {/* Drop zone / file picker */}
      {stage === 'idle' && !needsClarify && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 px-6 cursor-pointer"
          style={{ borderColor: '#C8A96A', background: '#FBF8F2' }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="text-5xl mb-4">📂</div>
          <p className="text-base font-semibold text-center" style={{ color: '#3B2A1F' }}>
            {fileName ? `✓ ${fileName}` : 'Tap to choose file'}
          </p>
          <p className="text-xs mt-2 text-center" style={{ color: '#9A8A7A' }}>
            Supports .docx and text-based .pdf
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      )}

      {/* Extraction warning */}
      {warning && (
        <div className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ background: '#FFF3CD', color: '#7A5800' }}>
          ⚠️ {warning}
        </div>
      )}

      {/* Processing state */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#C8A96A', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-medium" style={{ color: '#3B2A1F' }}>
            {stageLabel}
          </p>
        </div>
      )}

      {/* Clarification step */}
      {needsClarify && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="rounded-2xl px-4 py-4" style={{ background: '#FBF8F2', border: '1px solid #E8DFD0' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#C8A96A' }}>ONE QUICK QUESTION</p>
            <p className="text-base" style={{ color: '#3B2A1F' }}>{clarifyQuestion}</p>
          </div>

          <textarea
            className="w-full rounded-xl px-4 py-3 text-sm resize-none"
            style={{
              background: '#FBF8F2',
              border: '1.5px solid #C8A96A',
              color: '#3B2A1F',
              minHeight: 100,
              fontFamily: 'Montserrat, sans-serif',
            }}
            placeholder="Your answer…"
            value={clarifyAnswer}
            onChange={(e) => setClarifyAnswer(e.target.value)}
            autoFocus
          />

          <button
            className="w-full py-4 rounded-2xl text-sm font-semibold"
            style={{
              background: clarifyAnswer.trim() ? '#3B2A1F' : '#CCC',
              color: '#F5F1E8',
            }}
            onClick={submitClarification}
            disabled={!clarifyAnswer.trim()}
          >
            Continue →
          </button>

          <button
            className="w-full py-3 text-xs text-center"
            style={{ color: '#9A8A7A' }}
            onClick={skipClarification}
          >
            Skip — generate with what you have
          </button>
        </div>
      )}

      {/* Error state */}
      {stage === 'error' && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="rounded-2xl px-4 py-4 w-full" style={{ background: '#FDE8E8', border: '1px solid #E8A0A0' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#8B1A1A' }}>Could not process file</p>
            <p className="text-sm" style={{ color: '#8B1A1A' }}>{errorMsg}</p>
          </div>
          <button
            className="w-full py-4 rounded-2xl text-sm font-semibold"
            style={{ background: '#3B2A1F', color: '#F5F1E8' }}
            onClick={() => {
              setStage('idle');
              setErrorMsg(null);
              setFileName(null);
            }}
          >
            Try another file
          </button>
        </div>
      )}
    </div>
  );
}
