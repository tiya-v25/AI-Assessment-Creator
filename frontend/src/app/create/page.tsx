'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { assessmentApi } from '@/lib/api';
import { subscribeToJob } from '@/lib/socket';
import TopBar from '@/components/TopBar';
import {
  CloudUpload, Calendar, Plus, X, Loader2, ChevronDown, Mic, ArrowLeft
} from 'lucide-react';

type QuestionType = 'Multiple Choice Questions' | 'Short Questions' | 'Diagram/Graph-Based Questions' | 'Numerical Problems';

interface BlueprintRow {
  type: QuestionType;
  quantity: number;
  marks: number;
}

const ALL_TYPES: QuestionType[] = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
];

const TYPE_MAP: Record<QuestionType, string> = {
  'Multiple Choice Questions': 'MCQ',
  'Short Questions': 'SHORT',
  'Diagram/Graph-Based Questions': 'DIAGRAM',
  'Numerical Problems': 'NUMERICAL',
};

const inputCls: React.CSSProperties = {
  width: '100%', 
  padding: '14px 16px', 
  fontSize: 14, 
  border: '1px solid var(--border-color, #E4E4E7)', 
  borderRadius: '12px',
  background: '#FFFFFF', 
  color: 'var(--text-primary, #18181B)', 
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
};

const labelCls: React.CSSProperties = {
  fontSize: 14, 
  fontWeight: 700, 
  color: 'var(--text-primary, #18181B)', 
  display: 'block', 
  marginBottom: 10,
};

export default function CreatePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [material, setMaterial] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const [blueprint, setBlueprint] = useState<BlueprintRow[]>([
    { type: 'Multiple Choice Questions', quantity: 4, marks: 1 },
    { type: 'Short Questions', quantity: 3, marks: 2 },
    { type: 'Diagram/Graph-Based Questions', quantity: 5, marks: 5 },
    { type: 'Numerical Problems', quantity: 5, marks: 5 },
  ]);
  
  const [submitting, setSubmitting] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');

  const totalQ = blueprint.reduce((s, r) => s + r.quantity, 0);
  const totalM = blueprint.reduce((s, r) => s + r.quantity * r.marks, 0);

  const addRow = () => setBlueprint((b) => [...b, { type: 'Short Questions', quantity: 1, marks: 1 }]);
  const removeRow = (i: number) => setBlueprint((b) => b.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof BlueprintRow, val: any) =>
    setBlueprint((b) => b.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setMaterial(text || `[File: ${file.name}]`);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
    };
    if (file.type === 'text/plain') reader.readAsText(file);
    else setMaterial(`[Uploaded: ${file.name}]`);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInstructions((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async () => {
    if (!material.trim()) { setError('Please provide study material or upload a file'); return; }
    setSubmitting(true);
    setError('');
    setProcessingStep('Creating assignment...');

    try {
      const { jobId, assessmentId } = await assessmentApi.create({
        material,
        blueprint: blueprint.map((r) => ({
          type: TYPE_MAP[r.type] as any, quantity: r.quantity, marks: r.marks,
        })),
        instructions, dueDate, title: title || 'Untitled Assignment',
      });

      setProcessingStep('Queued for AI generation...');
      const unsub = subscribeToJob(
        jobId,
        (d) => setProcessingStep(d.step || 'Processing...'),
        () => { unsub(); router.push(`/result/${assessmentId}`); },
        (d) => { unsub(); setSubmitting(false); setError(d.error || 'Generation failed'); }
      );

      const poll = setInterval(async () => {
        try {
          const a = await assessmentApi.getById(assessmentId);
          if (a.status === 'completed') { clearInterval(poll); router.push(`/result/${assessmentId}`); }
          else if (a.status === 'failed') { clearInterval(poll); setSubmitting(false); setError(a.error || 'Failed'); }
        } catch {}
      }, 3000);
      setTimeout(() => clearInterval(poll), 120000);
    } catch (e: any) {
      setSubmitting(false);
      setError(e?.response?.data?.error || e.message || 'Error creating assignment');
    }
  };

  if (submitting) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40, minHeight: '100vh', background: 'var(--bg-page, #F4F4F5)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--brand-orange-light, #FFE0C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-ring 2s ease infinite' }}>
          <Loader2 size={36} color="var(--brand-orange, #D9502A)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #18181B)', marginBottom: 8 }}>Generating Your Assignment</h2>
          <p style={{ color: 'var(--text-secondary, #71717A)', fontSize: 15 }}>{processingStep}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page, #F4F4F5)' }}>
      
      {/* INJECTED RESPONSIVE STYLES 
        This handles the shift from CSS Grid (Desktop) to Flexbox Cards (Mobile) seamlessly
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        .page-container { padding: 16px 24px 80px; max-width: 840px; width: 100%; margin: 0 auto; }
        .card-container { background: #FFFFFF; padding: 40px; border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.04); margin-bottom: 32px; }
        .upload-zone { padding: 40px 20px; }
        .desktop-only { display: block; }
        .mobile-only { display: none !important; }
        
        /* Desktop Grid for Blueprint */
        .q-row { display: grid; grid-template-columns: 1fr 40px 140px 140px; gap: 16px; margin-bottom: 12px; align-items: center; }
        .q-row-top { display: contents; }
        .q-row-bottom { display: contents; }
        .q-header-grid { display: grid; grid-template-columns: 1fr 40px 140px 140px; gap: 16px; margin-bottom: 16px; padding: 0 4px; }
        .mobile-label { display: none; }
        .remove-btn { display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; }
        .nav-btns { display: flex; justify-content: space-between; align-items: center; }

        /* Mobile Breakpoint */
        @media (max-width: 768px) {
          .page-container { padding: 90px 16px 120px; } /* Space for top and bottom floating navs */
          .card-container { padding: 24px 16px; border-radius: 20px; margin-bottom: 24px; }
          .upload-zone { padding: 24px 16px; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          
          /* Blueprint rows turn into stacked cards on mobile */
          .q-header-grid { display: none; }
          .q-row { display: flex; flex-direction: column; gap: 16px; background: #FAFAFA; padding: 16px; border-radius: 16px; border: 1px solid #E4E4E7; margin-bottom: 16px; }
          .q-row-top { display: flex; align-items: center; gap: 12px; width: 100%; }
          .q-row-top > div:first-child { flex: 1; }
          .q-row-bottom { display: flex; gap: 12px; width: 100%; }
          .stepper-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
          .mobile-label { display: block; font-size: 12px; font-weight: 700; color: #71717A; }
          .stepper-container { width: 100%; justify-content: space-between; }
          .remove-btn { width: 44px; height: 44px; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 12px; }
          
          .nav-btns { flex-direction: column-reverse; gap: 16px; }
          .nav-btns > * { width: 100%; text-align: center; justify-content: center; }
        }
      `}} />

      <TopBar title="Assignment" showBack={true} onBack={() => router.push('/')} />

      <main className="page-content page-container">
        
        {/* =========================================
            HEADER TEXT & PROGRESS BARS 
        ========================================= */}
        {/* Desktop Header */}
        <div className="desktop-only" style={{ marginBottom: 24, paddingLeft: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)' }} />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #18181B)', letterSpacing: '-0.02em' }}>
              Create Assignment
            </h1>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary, #71717A)', paddingLeft: 24 }}>
            Set up a new assignment for your students
          </p>
        </div>

        {/* Mobile Header (Matches Figma) */}
        <div className="mobile-only" style={{ alignItems: 'center', marginBottom: 24, position: 'relative', height: 40 }}>
          <button onClick={() => router.push('/')} style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} color="#18181B" />
          </button>
          <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 18, fontWeight: 700, color: '#18181B' }}>
            Create Assignment
          </h1>
        </div>

        {/* Progress Bars */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 4, background: '#2B2B2B', borderRadius: 4 }} />
          <div style={{ flex: 1, height: 4, background: '#E4E4E7', borderRadius: 4 }} />
        </div>

        {/* =========================================
            ASSIGNMENT DETAILS CARD
        ========================================= */}
        <div className="card-container">
          
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary, #18181B)', marginBottom: 6 }}>Assignment Details</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary, #71717A)', marginBottom: 32 }}>Basic information about your assignment</p>

          <div style={{ marginBottom: 32 }}>
            <label style={labelCls}>Title</label>
            <input
              placeholder="e.g. Mid-Term Exam – Class 10 Science"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputCls}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-orange, #D9502A)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-color, #E4E4E7)')}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={labelCls}>Study Material</label>
            
            {/* Upload Zone */}
            <div
              className="upload-zone"
              style={{
                border: `2px dashed ${dragging ? 'var(--brand-orange, #D9502A)' : 'var(--border-color, #E4E4E7)'}`,
                borderRadius: '16px', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                background: dragging ? 'var(--brand-orange-light, #FFE0C2)' : '#FFFFFF',
                cursor: 'pointer', transition: 'all 0.2s ease', marginBottom: 12,
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            >
              <CloudUpload size={32} color={dragging ? 'var(--brand-orange, #D9502A)' : '#18181B'} style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary, #18181B)', marginBottom: 8 }}>
                {fileName ? `✓ ${fileName}` : 'Choose a file or drag & drop it here'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary, #71717A)', marginBottom: 20 }}>TXT, PDF, JPEG, PNG – up to 10MB</p>
              <button type="button" style={{
                padding: '10px 24px', border: '1px solid var(--border-color, #E4E4E7)',
                borderRadius: '50px', background: 'var(--bg-page, #F4F4F5)', fontSize: 13, cursor: 'pointer',
                fontWeight: 600, color: 'var(--text-primary, #18181B)',
              }}>Browse Files</button>
            </div>
            
            <input ref={fileRef} type="file" accept=".txt,.pdf,.png,.jpg,.jpeg" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color, #E4E4E7)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted, #A1A1AA)', fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color, #E4E4E7)' }} />
            </div>

            {/* Direct Text Input */}
            <div style={{ position: 'relative' }}>
              <textarea
                id="material-textarea"
                placeholder="Paste or type your study material here...&#10;&#10;e.g. Chapter 5: The Human Digestive System&#10;The digestive system is a group of organs working together to convert food into energy..."
                value={material.startsWith('[') ? '' : material}
                onChange={(e) => {
                  setMaterial(e.target.value);
                  if (e.target.value) setFileName('');
                }}
                rows={8}
                style={{
                  ...inputCls,
                  resize: 'vertical',
                  lineHeight: 1.7,
                  fontSize: 14,
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--brand-orange, #D9502A)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color, #E4E4E7)')}
              />
              {material && !material.startsWith('[') && (
                <span style={{
                  position: 'absolute', bottom: 12, right: 14,
                  fontSize: 11, color: 'var(--text-muted, #A1A1AA)',
                }}>
                  {material.length} chars
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted, #A1A1AA)', marginTop: 8 }}>
              Tip: More detailed material = better quality questions.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={labelCls}>Due Date</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ ...inputCls, paddingRight: 40 }} />
             
            </div>
          </div>

          {/* Question Type Section (Responsive) */}
          <div>
            <div className="q-header-grid desktop-only">
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary, #18181B)' }}>Question Type</span>
              <span />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary, #18181B)', textAlign: 'center' }}>No. of Questions</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary, #18181B)', textAlign: 'center' }}>Marks</span>
            </div>

            {blueprint.map((row, i) => (
              <div key={i} className="q-row">
                <div className="q-row-top">
                  <div style={{ position: 'relative' }}>
                    <select value={row.type} onChange={(e) => updateRow(i, 'type', e.target.value)} style={{ ...inputCls, appearance: 'none', paddingRight: 32, cursor: 'pointer', borderRadius: '50px' }}>
                      {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={16} color="var(--text-primary, #18181B)" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  <button onClick={() => removeRow(i)} disabled={blueprint.length === 1} className="remove-btn" style={{ opacity: blueprint.length === 1 ? 0.3 : 1 }}>
                    <X size={20} color="#A1A1AA" />
                  </button>
                </div>

                <div className="q-row-bottom">
                  <div className="stepper-col">
                    <label className="mobile-label">No. of Questions</label>
                    <div className="stepper-container" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color, #E4E4E7)', borderRadius: '50px', overflow: 'hidden', background: '#FFFFFF' }}>
                      <button onClick={() => updateRow(i, 'quantity', Math.max(1, row.quantity - 1))} style={{ width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#A1A1AA' }}>−</button>
                      <input type="number" min={1} value={row.quantity} onChange={(e) => updateRow(i, 'quantity', parseInt(e.target.value) || 1)} style={{ flex: 1, border: 'none', textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-primary, #18181B)', outline: 'none', width: 0 }} />
                      <button onClick={() => updateRow(i, 'quantity', row.quantity + 1)} style={{ width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#A1A1AA' }}>+</button>
                    </div>
                  </div>

                  <div className="stepper-col">
                    <label className="mobile-label">Marks</label>
                    <div className="stepper-container" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color, #E4E4E7)', borderRadius: '50px', overflow: 'hidden', background: '#FFFFFF' }}>
                      <button onClick={() => updateRow(i, 'marks', Math.max(1, row.marks - 1))} style={{ width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#A1A1AA' }}>−</button>
                      <input type="number" min={1} value={row.marks} onChange={(e) => updateRow(i, 'marks', parseInt(e.target.value) || 1)} style={{ flex: 1, border: 'none', textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-primary, #18181B)', outline: 'none', width: 0 }} />
                      <button onClick={() => updateRow(i, 'marks', row.marks + 1)} style={{ width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#A1A1AA' }}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addRow} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 0', background: 'none', border: 'none', color: 'var(--text-primary, #18181B)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 24 }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#18181B', color: '#FFFFFF' }}>
              <Plus size={16} strokeWidth={2.5} />
            </span>
            Add Question Type
          </button>

          <div style={{ textAlign: 'right', marginBottom: 32 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary, #71717A)', marginRight: 24 }}>Total Questions: <strong style={{ color: 'var(--text-primary, #18181B)', fontSize: 16 }}>{totalQ}</strong></span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary, #71717A)' }}>Total Marks: <strong style={{ color: 'var(--text-primary, #18181B)', fontSize: 16 }}>{totalM}</strong></span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelCls}>Additional Information (For better output)</label>
            <div style={{ position: 'relative' }}>
              <textarea placeholder="e.g. Generate a question paper for 2-hour exam duration..." value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} style={{ ...inputCls, resize: 'vertical', paddingBottom: '40px' }} />
              <button onClick={handleVoiceInput} type="button" title="Click to speak" style={{ position: 'absolute', bottom: '12px', right: '12px', background: isListening ? '#FEE2E2' : 'var(--bg-page, #F4F4F5)', border: isListening ? '1px solid #FCA5A5' : '1px solid var(--border-color, #E4E4E7)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isListening ? '0 0 0 4px rgba(239, 68, 68, 0.1)' : 'none' }}>
                <Mic size={16} color={isListening ? '#EF4444' : 'var(--text-secondary, #71717A)'} className={isListening ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>

          {error && <div style={{ padding: '12px 16px', borderRadius: '12px', marginTop: 16, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14, fontWeight: 500 }}>⚠ {error}</div>}
        </div>

        {/* =========================================
            NAVIGATION BUTTONS
        ========================================= */}
        <div className="nav-btns">
          <Link href="/" className="btn-outline" style={{ padding: '14px 28px', fontSize: 15, borderRadius: '50px' }}>
            ← Previous
          </Link>
          <button onClick={handleSubmit} className="btn-primary" disabled={!material.trim()} style={{ padding: '14px 36px', fontSize: 15, opacity: !material.trim() ? 0.5 : 1, cursor: !material.trim() ? 'not-allowed' : 'pointer' }}>
            Next →
          </button>
        </div>

      </main>
    </div>
  );
}