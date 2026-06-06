/**
 * UploadScreen.tsx
 * Phase 7 — Upload & Convert entry path.
 *
 * Uses the same pipeline API as IntakeScreen:
 *   classifyPipeline → clarifyPipeline → draftPipeline
 * All imported from src/ai/adapter.ts (D005 rule).
 */

import { useRef, useState } from 'react';
import type { Screen } from '../App';
import { extractTextFromFile } from '../utils/extractText';
import {
  classifyPipeline,
  clarifyPipeline,
  draftPipeline,
  type PipelineContext,
} from '../ai/adapter';
import type { LetterDraft } from '../types/document';

interface Props {
  navigate:       (s: Screen) => void;
  setDraft:       (draft: LetterDraft, provider: 'gemini' | 'groq') => void;
  setRawInput:    (text: string) => void;
  setPipelineCtx: (ctx: PipelineContext) => void;
}

type Stage =
  | 'idle'
  | 'extracting'
  | 'classifying'
  | 'clarifying'
  | 'generating'
  | 'error';

const STAGE_MESSAGES: Record<string, string> = {
  extracting:  'Reading your document…',
  classifying: 'Understanding content…',
  clarifying:  'Checking for missing details…',
  generating:  'Drafting on letterhead…',
};

export default function UploadScreen({
  navigate,
  setDraft,
  setRawInput,
  setPipelineCtx,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ctxRef       = useRef<PipelineContext | null>(null);

  const [stage, setStage]       = useState<Stage>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [warning, setWarning]   = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clarification step
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer]     = useState('');

  // ─── Pipeline ────────────────────────────────────────────────────────────────
  async function runPipeline(extractedText: string) {
    setRawInput(extractedText);

    // Stage 1: classify
    setStage('classifying');
    let ctx: PipelineContext;
    try {
      ctx = await classifyPipeline(extractedText);
      ctxRef.current = ctx;
      setPipelineCtx(ctx);
    } catch (e: any) {
      setStage('error');
      setErrorMsg(e?.message ?? 'Failed to understand the document. Please try again.');
      return;
    }

    // Stage 2: clarify
    setStage('clarifying');
    try {
      const { ctx: updatedCtx, question: q } = await clarifyPipeline(ctx);
      ctxRef.current = updatedCtx;
      setPipelineCtx(updatedCtx);

      if (q) {
        // Pause and ask the user
        setQuestion(q);
        setStage('idle');
        return;
      }
      // No question needed — go straight to generation
      await runGeneration(updatedCtx);
    } catch {
      // Non-fatal — skip clarification
      await runGeneration(ctx);
    }
  }

  async function runGeneration(ctx: PipelineContext) {
    setStage('generating');
    try {
      const output = await draftPipeline(ctx);
      setDraft(output.draft, output.provider);
      navigate('draft');
    } catch (e: any) {
      setStage('error');
      setErrorMsg(e?.message ?? 'Draft generation failed. Please try again.');
    }
  }

  // ─── Clarification answer submit ──────────────────────────────────────────────
  async function handleSubmitAnswer() {
    const trimmed = answer.trim();
    if (!trimmed || !ctxRef.current) return;
    const enrichedCtx: PipelineContext = {
      ...ctxRef.current,
      clarificationAnswer: trimmed,
    };
    ctxRef.current = enrichedCtx;
    setPipelineCtx(enrichedCtx);
    setQuestion(null);
    setAnswer('');
    await runGeneration(enrichedCtx);
  }

  function handleSkipAnswer() {
    if (!ctxRef.current) return;
    setQuestion(null);
    setAnswer('');
    runGeneration(ctxRef.current);
  }

  // ─── File handlers ───────────────────────────────────────────────────────────
  async function handleFile(file: File) {
    setStage('extracting');
    setFileName(file.name);
    setWarning(null);
    setErrorMsg(null);
    setQuestion(null);
    setAnswer('');

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
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  // ─── Derived state ──────────────────────────────────────────────────────────
  const isLoading        = ['extracting', 'classifying', 'clarifying', 'generating'].includes(stage);
  const showClarify      = stage === 'idle' && question !== null;
  const showDropzone     = stage === 'idle' && question === null;

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col min-h-full px-5 pt-12 pb-8"
      style={{ background: 'var(--color-ivory, #F5F1E8)' }}
    >
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('home')}
          className="font-montserrat text-sm font-medium mb-4 flex items-center gap-1"
          style={{ color: 'var(--color-gold, #C8A96A)' }}
        >
          ← Back
        </button>
        <h1
          className="font-montserrat font-bold text-2xl"
          style={{ color: 'var(--color-dark-brown, #3B2A1F)' }}
        >
          Upload &amp; Convert
        </h1>
        <p
          className="font-montserrat text-sm mt-1"
          style={{ color: 'var(--color-dark-brown, #3B2A1F)', opacity: 0.6 }}
        >
          Upload a .docx or PDF — AI will restructure it onto branded letterhead.
        </p>
      </div>

      {/* Gold divider */}
      <div style={{ height: '1px', background: 'var(--color-gold, #C8A96A)', marginBottom: 24, opacity: 0.5 }} />

      {/* Extraction warning */}
      {warning && (
        <div
          className="mb-4 rounded-xl px-4 py-3 font-montserrat text-sm"
          style={{ background: '#FFF3CD', color: '#7A5800' }}
        >
          ⚠️ {warning}
        </div>
      )}

      {/* Drop zone */}
      {showDropzone && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 px-6 cursor-pointer"
          style={{ borderColor: 'var(--color-gold, #C8A96A)', background: 'rgba(200,169,106,0.06)' }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="text-5xl mb-4">📂</div>
          <p
            className="font-montserrat text-base font-semibold text-center"
            style={{ color: 'var(--color-dark-brown, #3B2A1F)' }}
          >
            {fileName ? `✓ ${fileName}` : 'Tap to choose file'}
          </p>
          <p
            className="font-montserrat text-xs mt-2 text-center"
            style={{ color: 'var(--color-dark-brown, #3B2A1F)', opacity: 0.45 }}
          >
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-6 py-20">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--color-gold, #C8A96A)', borderTopColor: 'transparent' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-gold, #C8A96A)' }} />
            </div>
          </div>
          <p
            className="font-montserrat text-sm font-medium"
            style={{ color: 'var(--color-dark-brown, #3B2A1F)', opacity: 0.7 }}
          >
            {STAGE_MESSAGES[stage] ?? 'Processing…'}
          </p>
          <div
            className="px-3 py-1 rounded-full font-montserrat text-xs"
            style={{
              background: 'rgba(200,169,106,0.15)',
              color: 'var(--color-gold, #C8A96A)',
              border: '1px solid rgba(200,169,106,0.3)',
            }}
          >
            {stage === 'generating' ? 'Gemini 3.5 Flash · Premium' : 'Gemini 2.0 Flash · Lightweight'}
          </div>
        </div>
      )}

      {/* Clarification step */}
      {showClarify && (
        <div className="flex flex-col gap-4">
          {/* Detected doc type pill */}
          {ctxRef.current?.documentType && (
            <div
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(200,169,106,0.1)', border: '1px solid rgba(200,169,106,0.25)' }}
            >
              <span className="text-base mt-0.5">📄</span>
              <div>
                <p className="font-montserrat font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-gold, #C8A96A)' }}>
                  Detected
                </p>
                <p className="font-montserrat text-sm mt-0.5" style={{ color: 'var(--color-dark-brown, #3B2A1F)' }}>
                  {ctxRef.current.documentType.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          )}

          <div
            className="rounded-2xl p-4"
            style={{ background: '#fff', border: '1.5px solid rgba(200,169,106,0.3)', boxShadow: '0 2px 12px rgba(59,42,31,0.06)' }}
          >
            <p className="font-montserrat font-semibold text-sm mb-3" style={{ color: 'var(--color-dark-brown, #3B2A1F)' }}>
              {question}
            </p>
            <textarea
              className="w-full resize-none font-montserrat text-sm outline-none bg-transparent"
              style={{ color: 'var(--color-dark-brown, #3B2A1F)', minHeight: 80 }}
              placeholder="Type your answer…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitAnswer(); }}
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={!answer.trim()}
            className="w-full py-4 rounded-2xl font-montserrat font-bold text-sm"
            style={{
              background: answer.trim() ? 'var(--color-dark-brown, #3B2A1F)' : 'rgba(59,42,31,0.25)',
              color: '#F5F1E8',
              opacity: answer.trim() ? 1 : 0.6,
            }}
          >
            Continue →
          </button>

          <button
            onClick={handleSkipAnswer}
            className="w-full py-2 font-montserrat text-sm"
            style={{ color: 'var(--color-dark-brown, #3B2A1F)', opacity: 0.45 }}
          >
            Skip — generate with what you have
          </button>
        </div>
      )}

      {/* Error state */}
      {stage === 'error' && (
        <div className="flex flex-col items-center gap-4 pt-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(200,80,80,0.12)' }}
          >
            <span className="text-2xl">⚠️</span>
          </div>
          <p
            className="font-montserrat text-sm text-center"
            style={{ color: 'var(--color-dark-brown, #3B2A1F)' }}
          >
            {errorMsg}
          </p>
          <button
            className="w-full py-4 rounded-2xl font-montserrat font-bold text-sm"
            style={{ background: 'var(--color-dark-brown, #3B2A1F)', color: '#F5F1E8' }}
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
