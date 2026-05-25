'use client';

import { useAssessmentStore } from '@/store/assessmentStore';
import { Upload, Type, FileText } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  transition: 'border-color 0.15s ease',
};

export default function Step1Upload({ onNext }: { onNext: () => void }) {
  const { form, setFormField } = useAssessmentStore();
  const canProceed = form.material.trim().length > 20;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
        Upload Study Material
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Paste your syllabus, notes, or topic description. The AI will base all questions on this content.
      </p>

      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <Type size={14} /> Assessment Title
        </label>
        <input
          id="input-title"
          type="text"
          placeholder="e.g. Mid-Term Examination – Class 10 Science"
          value={form.title}
          onChange={(e) => setFormField('title', e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
        />
      </div>

      {/* Material */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <FileText size={14} /> Study Material <span style={{ color: 'var(--brand-danger)' }}>*</span>
        </label>
        <textarea
          id="input-material"
          placeholder="Paste your study material here... (minimum 20 characters)&#10;&#10;Example: Chapter 5 - Photosynthesis&#10;Plants convert sunlight into glucose through photosynthesis. This process occurs in chloroplasts..."
          value={form.material}
          onChange={(e) => setFormField('material', e.target.value)}
          rows={10}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 200, lineHeight: 1.6 }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
        />
        <p style={{ fontSize: 12, color: form.material.length < 20 ? 'var(--text-muted)' : 'var(--brand-success)', marginTop: 6 }}>
          {form.material.length} characters {form.material.length < 20 ? `(need ${20 - form.material.length} more)` : '✓'}
        </p>
      </div>

      {/* Due Date */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <Upload size={14} /> Due Date (optional)
        </label>
        <input
          id="input-due-date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setFormField('dueDate', e.target.value)}
          style={{ ...inputStyle, colorScheme: 'dark' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          id="step1-next-btn"
          onClick={onNext}
          disabled={!canProceed}
          style={{
            padding: '12px 28px', borderRadius: 10, border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
            background: canProceed ? 'var(--grad-primary)' : 'var(--bg-elevated)',
            color: canProceed ? 'white' : 'var(--text-muted)',
            fontWeight: 600, fontSize: 14, transition: 'all 0.15s ease',
          }}
        >
          Next: Blueprint →
        </button>
      </div>
    </div>
  );
}
