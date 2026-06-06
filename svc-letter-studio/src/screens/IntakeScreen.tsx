import { useState, useRef } from 'react';
import type { Screen } from '../App';
import type { SessionState } from '../store/sessionStore';
import {
  classifyPipeline,
  clarifyPipeline,
  draftPipeline,
  type PipelineContext,
} from '../ai/adapter';

type IntakeStep =
  | 'input'          // user types their request
  | 'classifying'    // Tier 1: detecting intent
  | 'clarifying'     // Tier 1: asking one question
  | 'generating'     // Tier 3: building the draft
  | 'error';         // something went wrong

interface Props {
  navigate: (s: Screen) => void;
  state: SessionState;
  setDraft: (draft: import('../types/document').LetterDraft, provider: 'gemini' | 'groq') => void;
  setRawInput: (input: string) => void;
  setPipelineCtx: (ctx: PipelineContext) => void;
}

// Status messages shown during each pipeline stage
const STAGE_MESSAGES: Record<string, string> = {
  classifying: 'Understanding your request…',
  clarifying:  'Analysing document requirements…',
  generating:  'Drafting your document…',
};

export default function IntakeScreen({
  navigate,
  setDraft,
  setRawInput,
  setPipelineCtx,
}: Props) {
  const [step, setStep]           = useState<IntakeStep>('input');
  const [userText, setUserText]   = useState('');
  const [question, setQuestion]   = useState<string | null>(null);
  const [answer, setAnswer]       = useState('');
  const [error, setError]         = useState<string | null>(null);
  const ctxRef                    = useRef<PipelineContext | null>(null);

  // ── Stage 1: user submits initial request ──────────────────────────────────
  async function handleSubmitRequest() {
    const trimmed = userText.trim();
    if (!trimmed) return;

    setRawInput(trimmed);
    setStep('classifying');
    setError(null);

    try {
      const ctx = await classifyPipeline(trimmed);
      ctxRef.current = ctx;
      setPipelineCtx(ctx);

      setStep('clarifying');
      const { ctx: updatedCtx, question: q } = await clarifyPipeline(ctx);
      ctxRef.current = updatedCtx;
      setPipelineCtx(updatedCtx);

      if (q) {
        // Need one more piece of info from user
        setQuestion(q);
        setStep('input'); // back to input, but now showing clarification UI
      } else {
        // All info present — proceed straight to generation
        await runGeneration(updatedCtx);
      }
    } catch (err) {
      console.error(err);
      setError('Could not analyse your request. Please try again.');
      setStep('error');
    }
  }

  // ── Stage 2: user answers the clarification question ──────────────────────
  async function handleSubmitAnswer() {
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer || !ctxRef.current) return;

    const enrichedCtx: PipelineContext = {
      ...ctxRef.current,
      clarificationAnswer: trimmedAnswer,
    };
    ctxRef.current = enrichedCtx;
    setPipelineCtx(enrichedCtx);
    setQuestion(null);
    await runGeneration(enrichedCtx);
  }

  // ── Stage 3: generate the full draft ──────────────────────────────────────
  async function runGeneration(ctx: PipelineContext) {
    setStep('generating');
    try {
      const output = await draftPipeline(ctx);
      setDraft(output.draft, output.provider);
      navigate('draft');
    } catch (err) {
      console.error(err);
      setError('Could not generate the document. Please check your API keys and try again.');
      setStep('error');
    }
  }

  function handleRetry() {
    setStep('input');
    setQuestion(null);
    setAnswer('');
    setError(null);
    ctxRef.current = null;
  }

  const isLoading = step === 'classifying' || step === 'clarifying' || step === 'generating';
  const showClarification = step === 'input' && question !== null;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-ivory)', paddingBottom: '80px' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-5 pt-12 pb-6">
        {/* Back button — hidden while AI is processing */}
        {!isLoading && (
          <button
            onClick={() => navigate('home')}
            className="font-montserrat text-sm font-medium mb-4 flex items-center gap-1"
            style={{ color: 'var(--color-gold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← Back
          </button>
        )}
        <h1 className="font-montserrat font-bold text-2xl" style={{ color: 'var(--color-dark-brown)' }}>
          New Document
        </h1>
        <p className="font-montserrat text-sm mt-1" style={{ color: 'var(--color-dark-brown)', opacity: 0.6 }}>
          Describe what you need — the AI will handle the rest.
        </p>
      </div>

      {/* ── Gold divider ───────────────────────────────────────────────── */}
      <div style={{ height: '1px', background: 'var(--color-gold)', margin: '0 20px 24px' }} />

      <div className="flex-1 px-5">

        {/* ── Loading State ─────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center pt-20 gap-6">
            <div className="relative">
              {/* Spinner ring */}
              <div
                className="w-16 h-16 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
              />
              {/* Inner dot */}
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-gold)' }} />
              </div>
            </div>
            <p className="font-montserrat text-sm font-medium" style={{ color: 'var(--color-dark-brown)', opacity: 0.7 }}>
              {STAGE_MESSAGES[step] ?? 'Processing…'}
            </p>
            {/* Tier badge */}
            <div
              className="px-3 py-1 rounded-full text-xs font-montserrat"
              style={{
                background: 'rgba(200,169,106,0.15)',
                color: 'var(--color-gold)',
                border: '1px solid rgba(200,169,106,0.3)',
              }}
            >
              {step === 'generating' ? 'Gemini 3.5 Flash · Premium' : 'Gemini 2.0 Flash · Lightweight'}
            </div>
          </div>
        )}

        {/* ── Error State ───────────────────────────────────────────────── */}
        {step === 'error' && (
          <div className="flex flex-col items-center justify-center pt-16 gap-4 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(200,80,80,0.12)' }}>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="font-montserrat text-sm" style={{ color: 'var(--color-dark-brown)' }}>
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="mt-2 px-6 py-2 rounded-xl font-montserrat font-semibold text-sm"
              style={{ background: 'var(--color-gold)', color: '#fff' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Main Input (initial or clarification) ─────────────────────── */}
        {step === 'input' && (
          <div className="flex flex-col gap-4">

            {!showClarification ? (
              /* Initial freeform request */
              <>
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: '#fff',
                    border: '1.5px solid rgba(200,169,106,0.3)',
                    boxShadow: '0 2px 12px rgba(59,42,31,0.06)',
                  }}
                >
                  <textarea
                    className="w-full resize-none font-montserrat text-sm outline-none bg-transparent"
                    style={{ color: 'var(--color-dark-brown)', minHeight: '160px' }}
                    placeholder="e.g. Write a quotation for painting work at Banjara Hills site for Mr. Rajesh Kumar — 3 rooms, ₹45,000 total."
                    value={userText}
                    onChange={e => setUserText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitRequest();
                    }}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSubmitRequest}
                  disabled={!userText.trim()}
                  className="w-full py-4 rounded-2xl font-montserrat font-bold text-sm transition-opacity"
                  style={{
                    background: userText.trim() ? 'var(--color-dark-brown)' : 'rgba(59,42,31,0.25)',
                    color: '#F5F1E8',
                    opacity: userText.trim() ? 1 : 0.6,
                  }}
                >
                  Generate Document →
                </button>

                <p className="text-center font-montserrat text-xs" style={{ color: 'var(--color-dark-brown)', opacity: 0.4 }}>
                  ⌘ + Enter to submit
                </p>
              </>
            ) : (
              /* Clarification follow-up */
              <>
                {/* Context pill showing what was detected */}
                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-3"
                  style={{ background: 'rgba(200,169,106,0.1)', border: '1px solid rgba(200,169,106,0.25)' }}
                >
                  <span className="text-base mt-0.5">📄</span>
                  <div>
                    <p className="font-montserrat font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-gold)' }}>
                      Detected
                    </p>
                    <p className="font-montserrat text-sm mt-0.5" style={{ color: 'var(--color-dark-brown)' }}>
                      {ctxRef.current?.documentType?.replace(/_/g, ' ') ?? 'Document'}
                    </p>
                  </div>
                </div>

                {/* The clarification question */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: '#fff',
                    border: '1.5px solid rgba(200,169,106,0.3)',
                    boxShadow: '0 2px 12px rgba(59,42,31,0.06)',
                  }}
                >
                  <p className="font-montserrat font-semibold text-sm mb-3" style={{ color: 'var(--color-dark-brown)' }}>
                    {question}
                  </p>
                  <textarea
                    className="w-full resize-none font-montserrat text-sm outline-none bg-transparent"
                    style={{ color: 'var(--color-dark-brown)', minHeight: '80px' }}
                    placeholder="Type your answer…"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitAnswer();
                    }}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim()}
                  className="w-full py-4 rounded-2xl font-montserrat font-bold text-sm transition-opacity"
                  style={{
                    background: answer.trim() ? 'var(--color-dark-brown)' : 'rgba(59,42,31,0.25)',
                    color: '#F5F1E8',
                    opacity: answer.trim() ? 1 : 0.6,
                  }}
                >
                  Continue →
                </button>

                <button
                  onClick={() => { setQuestion(null); setAnswer(''); }}
                  className="w-full py-2 font-montserrat text-sm"
                  style={{ color: 'var(--color-dark-brown)', opacity: 0.5 }}
                >
                  ← Edit original request
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
