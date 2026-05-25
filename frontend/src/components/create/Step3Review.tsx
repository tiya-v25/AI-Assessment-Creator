'use client';

import { useAssessmentStore } from '@/store/assessmentStore';
import { Sparkles } from 'lucide-react';

const typeLabels: Record<string, string> = {
  MCQ: 'Multiple Choice', SHORT: 'Short Answer', DIAGRAM: 'Diagram', NUMERICAL: 'Numerical',
};

export default function Step3Review({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const { form } = useAssessmentStore();
  const totalMarks = form.blueprint.reduce((s, r) => s + r.quantity * r.marks, 0);
  const totalQ = form.blueprint.reduce((s, r) => s + r.quantity, 0);

  const textareaStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
    color: 'var(--text-primary)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.15s ease', resize: 'vertical',
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
        Review & Generate
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Confirm your settings and add any final instructions before generating.
      </p>

      {/* Summary */}
      <div style={{
        padding: '18px 20px', borderRadius: 12, marginBottom: 20,
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Summary</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Title</p>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
              {form.title || 'Untitled Assessment'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Due Date</p>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
              {form.dueDate || 'Not set'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Total Questions</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-primary)' }}>{totalQ}</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Total Marks</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-accent)' }}>{totalMarks}</p>
          </div>
        </div>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Question Blueprint</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {form.blueprint.map((row, i) => (
              <span key={i} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: 'rgba(99,102,241,0.12)', color: 'var(--text-accent)',
                border: '1px solid var(--border-brand)',
              }}>
                {row.quantity}× {typeLabels[row.type]} ({row.marks}m)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Instructions */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
          Additional Instructions (optional)
        </label>
        <textarea
          id="input-instructions"
          placeholder="e.g. Focus on application-based questions. Avoid questions from Chapter 3. Use easy to medium difficulty..."
          value={form.instructions}
          onChange={(e) => useAssessmentStore.getState().setFormField('instructions', e.target.value)}
          rows={4}
          style={textareaStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
        />
      </div>

      {/* Material preview */}
      <div style={{
        padding: '14px 16px', borderRadius: 10, marginBottom: 24,
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
        maxHeight: 120, overflow: 'hidden', position: 'relative',
      }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Material Preview</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {form.material.slice(0, 300)}{form.material.length > 300 ? '...' : ''}
        </p>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
          background: 'linear-gradient(to top, var(--bg-elevated), transparent)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{
          padding: '11px 24px', borderRadius: 10, border: '1px solid var(--border-default)',
          background: 'transparent', color: 'var(--text-secondary)',
          fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          ← Back
        </button>
        <button
          id="generate-assessment-btn"
          onClick={onSubmit}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 32px', borderRadius: 10, border: 'none',
            background: 'var(--grad-primary)', color: 'white',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Sparkles size={16} /> Generate with AI
        </button>
      </div>
    </div>
  );
}
