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
  | 'input'
  | 'classifying'
  | 'clarifying'
  | 'generating'
  | 'error';

interface Props {
  navigate: (s: Screen) => void;
  state: SessionState;
  setDraft: (draft: import('../types/document').LetterDraft, provider: 'gemini' | 'groq') => void;
  setRawInput: (input: string) => void;
  setPipelineCtx: (ctx: PipelineContext) => void;
}

const STAGE_MESSAGES: Record<string, string> = {
  classifying: 'Understanding your request…',
  clarifying:  'Analysing document requirements…',
  generating:  'Drafting your document…',
};

// Reusable action button — two explicit visual states, no CSS variable ambiguity
function ActionButton({
  label,
  onClick,
  enabled,
}: {
  label: string;
  onClick: () => void;
  enabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: '16px',
        border: 'none',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
        fontSize: '14px',
        cursor: enabled ? 'pointer' : 'default',
        transition: 'background 0.2s, color 0.2s',
        // Active: espresso fill + ivory text. Disabled: light fill + muted text.
        background: enabled ? '#3B2A1F' : 'rgba(59,42,31,0.12)',
        color:      enabled ? '#F5F1E8' : 'rgba(59,42,31,0.35)',
      }}
    >
      {label}
    </button>
  );
}

export default function IntakeScreen({
  navigate,
  setDraft,
  setRawInput,
  setPipelineCtx,
}: Props) {
  const [step, setStep]         = useState<IntakeStep>('input');
  const [userText, setUserText] = useState('');
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer]     = useState('');
  const [error, setError]       = useState<string | null>(null);
  const ctxRef                  = useRef<PipelineContext | null>(null);

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
        setQuestion(q);
        setStep('input');
      } else {
        await runGeneration(updatedCtx);
      }
    } catch (err) {
      console.error(err);
      setError('Could not analyse your request. Please try again.');
      setStep('error');
    }
  }

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
    <div className="flex flex-col" style={{ background: '#F5F1E8', paddingBottom: '96px' }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-6">
        {!isLoading && (
          <button
            onClick={() => navigate('home')}
            style={{ color: '#C8A96A', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ← Back
          </button>
        )}
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '24px', color: '#3B2A1F', margin: 0 }}>
          New Document
        </h1>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', color: '#3B2A1F', opacity: 0.6, marginTop: '4px', marginBottom: 0 }}>
          Describe what you need — the AI will handle the rest.
        </p>
      </div>

      {/* Gold divider */}
      <div style={{ height: '1px', background: '#C8A96A', margin: '0 20px 24px' }} />

      <div className="flex-1 px-5">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center pt-20 gap-6">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full border-2 animate-spin"
                style={{ borderColor: '#C8A96A', borderTopColor: 'transparent' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full" style={{ background: '#C8A96A' }} />
              </div>
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 500, color: '#3B2A1F', opacity: 0.7 }}>
              {STAGE_MESSAGES[step] ?? 'Processing…'}
            </p>
            <div
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontFamily: 'Montserrat, sans-serif',
                background: 'rgba(200,169,106,0.15)',
                color: '#C8A96A',
                border: '1px solid rgba(200,169,106,0.3)',
              }}
            >
              {step === 'generating' ? 'Gemini 3.5 Flash · Premium' : 'Gemini 2.0 Flash · Lightweight'}
            </div>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="flex flex-col items-center justify-center pt-16 gap-4 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(200,80,80,0.12)' }}>
              <span className="text-2xl">⚠️</span>
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', color: '#3B2A1F' }}>
              {error}
            </p>
            <button
              onClick={handleRetry}
              style={{ marginTop: '8px', padding: '8px 24px', borderRadius: '12px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '14px', background: '#C8A96A', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Input */}
        {step === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!showClarification ? (
              <>
                {/* Textarea card */}
                <div
                  style={{
                    background: '#fff',
                    border: '1.5px solid rgba(200,169,106,0.3)',
                    boxShadow: '0 2px 12px rgba(59,42,31,0.06)',
                    borderRadius: '16px',
                    padding: '16px',
                  }}
                >
                  <textarea
                    style={{
                      width: '100%',
                      resize: 'none',
                      fontFamily: 'Montserrat, sans-serif',
                      outline: 'none',
                      background: 'transparent',
                      color: '#3B2A1F',
                      minHeight: '160px',
                      fontSize: '16px',
                      border: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="e.g. Write a quotation for painting work at Banjara Hills site for Mr. Rajesh Kumar — 3 rooms, ₹45,000 total."
                    value={userText}
                    onChange={e => setUserText(e.target.value)}
                  />
                </div>

                <ActionButton
                  label="Generate Document →"
                  onClick={handleSubmitRequest}
                  enabled={!!userText.trim()}
                />
              </>
            ) : (
              <>
                {/* Detected document type badge */}
                <div
                  style={{
                    background: 'rgba(200,169,106,0.1)',
                    border: '1px solid rgba(200,169,106,0.25)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '16px', marginTop: '2px' }}>📄</span>
                  <div>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C8A96A', margin: 0 }}>
                      Detected
                    </p>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', color: '#3B2A1F', margin: '2px 0 0' }}>
                      {ctxRef.current?.documentType?.replace(/_/g, ' ') ?? 'Document'}
                    </p>
                  </div>
                </div>

                {/* Clarification question + answer textarea */}
                <div
                  style={{
                    background: '#fff',
                    border: '1.5px solid rgba(200,169,106,0.3)',
                    boxShadow: '0 2px 12px rgba(59,42,31,0.06)',
                    borderRadius: '16px',
                    padding: '16px',
                  }}
                >
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '14px', color: '#3B2A1F', marginBottom: '12px', marginTop: 0 }}>
                    {question}
                  </p>
                  <textarea
                    style={{
                      width: '100%',
                      resize: 'none',
                      fontFamily: 'Montserrat, sans-serif',
                      outline: 'none',
                      background: 'transparent',
                      color: '#3B2A1F',
                      minHeight: '80px',
                      fontSize: '16px',
                      border: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Type your answer…"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    autoFocus
                  />
                </div>

                <ActionButton
                  label="Continue →"
                  onClick={handleSubmitAnswer}
                  enabled={!!answer.trim()}
                />

                <button
                  onClick={() => { setQuestion(null); setAnswer(''); }}
                  style={{ width: '100%', padding: '8px', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', color: '#3B2A1F', opacity: 0.5, background: 'none', border: 'none', cursor: 'pointer' }}
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
