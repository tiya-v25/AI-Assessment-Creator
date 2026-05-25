'use client';

import { useAssessmentStore } from '@/store/assessmentStore';
import { BlueprintItem } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

const TYPES: BlueprintItem['type'][] = ['MCQ', 'SHORT', 'DIAGRAM', 'NUMERICAL'];

const typeLabels: Record<BlueprintItem['type'], string> = {
  MCQ: 'Multiple Choice (MCQ)',
  SHORT: 'Short Answer',
  DIAGRAM: 'Diagram / Labeling',
  NUMERICAL: 'Numerical / Problem',
};

const selectStyle: React.CSSProperties = {
  padding: '9px 12px', borderRadius: 8, background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)', color: 'var(--text-primary)',
  fontSize: 13, outline: 'none', cursor: 'pointer', width: '100%',
};

const numStyle: React.CSSProperties = {
  padding: '9px 12px', borderRadius: 8, background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)', color: 'var(--text-primary)',
  fontSize: 13, outline: 'none', width: '100%', textAlign: 'center',
};

export default function Step2Blueprint({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { form, addBlueprintRow, updateBlueprintRow, removeBlueprintRow } = useAssessmentStore();
  const totalMarks = form.blueprint.reduce((s, r) => s + r.quantity * r.marks, 0);
  const totalQ = form.blueprint.reduce((s, r) => s + r.quantity, 0);
  const isValid = form.blueprint.length > 0 && form.blueprint.every((r) => r.quantity > 0 && r.marks > 0);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
        Question Blueprint
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Define the structure of your question paper — types, quantities, and marks.
      </p>

      {/* Table Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 48px', gap: 10, marginBottom: 10 }}>
        {['Question Type', 'Quantity', 'Marks Each', ''].map((h) => (
          <span key={h} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {form.blueprint.map((row, i) => (
        <div
          key={i}
          style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 48px', gap: 10, marginBottom: 10, animation: 'fadeIn 0.2s ease' }}
        >
          <select
            id={`blueprint-type-${i}`}
            value={row.type}
            onChange={(e) => updateBlueprintRow(i, 'type', e.target.value as BlueprintItem['type'])}
            style={selectStyle}
          >
            {TYPES.map((t) => <option key={t} value={t}>{typeLabels[t]}</option>)}
          </select>
          <input
            id={`blueprint-qty-${i}`}
            type="number"
            min={1} max={50}
            value={row.quantity}
            onChange={(e) => updateBlueprintRow(i, 'quantity', parseInt(e.target.value) || 1)}
            style={numStyle}
          />
          <input
            id={`blueprint-marks-${i}`}
            type="number"
            min={1} max={100}
            value={row.marks}
            onChange={(e) => updateBlueprintRow(i, 'marks', parseInt(e.target.value) || 1)}
            style={numStyle}
          />
          <button
            onClick={() => removeBlueprintRow(i)}
            disabled={form.blueprint.length === 1}
            style={{
              width: 40, height: 40, borderRadius: 8, border: 'none',
              background: 'rgba(239,68,68,0.1)', color: '#ef4444',
              cursor: form.blueprint.length === 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: form.blueprint.length === 1 ? 0.4 : 1,
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      {/* Add row */}
      <button
        id="add-blueprint-row"
        onClick={addBlueprintRow}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
          borderRadius: 8, border: '1px dashed var(--border-default)', background: 'transparent',
          color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', marginTop: 4,
          transition: 'all 0.15s ease', width: '100%', justifyContent: 'center',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--text-accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <Plus size={15} /> Add Question Type
      </button>

      {/* Summary */}
      <div style={{
        display: 'flex', gap: 24, padding: '16px 20px', borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)',
        border: '1px solid var(--border-brand)', marginTop: 20,
      }}>
        <div>
          <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-primary)' }}>{totalQ}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Questions</p>
        </div>
        <div style={{ width: 1, background: 'var(--border-subtle)' }} />
        <div>
          <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-accent)' }}>{totalMarks}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Marks</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={onBack} style={{
          padding: '11px 24px', borderRadius: 10, border: '1px solid var(--border-default)',
          background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600,
          fontSize: 14, cursor: 'pointer',
        }}>
          ← Back
        </button>
        <button
          id="step2-next-btn"
          onClick={onNext}
          disabled={!isValid}
          style={{
            padding: '11px 28px', borderRadius: 10, border: 'none',
            background: isValid ? 'var(--grad-primary)' : 'var(--bg-elevated)',
            color: isValid ? 'white' : 'var(--text-muted)',
            fontWeight: 600, fontSize: 14, cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          Next: Review →
        </button>
      </div>
    </div>
  );
}
