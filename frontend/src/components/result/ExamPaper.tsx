'use client';

import { AssessmentResult } from '@/lib/api';

const DIFFICULTY_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  easy:   { label: 'Easy',     bg: '#DCFCE7', color: '#166534' },
  medium: { label: 'Moderate', bg: '#FEF3C7', color: '#92400E' },
  hard:   { label: 'Hard',     bg: '#FFE4E6', color: '#9F1239' },
};

export default function ExamPaper({ result, showAnswers }: { result: AssessmentResult; showAnswers: boolean }) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div
      className="exam-paper"
      style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        fontFamily: '"Times New Roman", Times, serif',
        color: '#1a1a1a',
        overflow: 'hidden',
      }}
    >
      {/* School Header */}
      <div style={{ padding: '28px 40px 20px', textAlign: 'center', borderBottom: '2px solid #1a1a1a' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.03em' }}>
          {result.title}
        </h1>
        <p style={{ fontSize: 15, margin: '0 0 2px' }}>Subject: {result.subject}</p>
      </div>

      {/* Exam Info */}
      <div style={{ padding: '14px 40px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <p style={{ fontSize: 13, margin: 0 }}>Time Allowed: {result.duration}</p>
        <p style={{ fontSize: 13, margin: 0 }}>Maximum Marks: {result.totalMarks}</p>
      </div>

      <div style={{ padding: '16px 40px 8px' }}>
        {/* General Instructions */}
        {result.generalInstructions?.length > 0 && (
          <p style={{ fontSize: 13, fontStyle: 'italic', marginBottom: 12, color: '#374151' }}>
            {result.generalInstructions[0]}
          </p>
        )}

        {/* Student Fields */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, margin: '0 0 6px' }}>Name: ___________________________________</p>
          <p style={{ fontSize: 13, margin: '0 0 6px' }}>Roll Number: ________________</p>
          <p style={{ fontSize: 13, margin: 0 }}>Class & Section: __________________________</p>
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: '0 40px 28px' }}>
        {result.sections?.map((section, si) => (
          <div key={si} className={si > 0 ? 'new-page-section' : ''} style={{ marginBottom: 24 }}>
            {/* Section heading */}
            <h2 style={{
              fontSize: 15, fontWeight: 700, textAlign: 'center',
              margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {section.title}
            </h2>
            {section.instructions && (
              <p style={{ fontSize: 13, textAlign: 'center', fontStyle: 'italic', margin: '0 0 14px', color: '#374151' }}>
                {section.instructions}
              </p>
            )}

            {/* Questions */}
            {section.questions?.map((q, qi) => (
              <div key={qi} className="avoid-break" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, minWidth: 24 }}>{q.index}.</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                      <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>{q.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {q.difficulty && DIFFICULTY_STYLE[q.difficulty] && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 7px',
                            borderRadius: 20, letterSpacing: '0.03em',
                            background: DIFFICULTY_STYLE[q.difficulty].bg,
                            color: DIFFICULTY_STYLE[q.difficulty].color,
                            border: `1px solid ${DIFFICULTY_STYLE[q.difficulty].color}30`,
                            fontFamily: 'Inter, sans-serif',
                          }}>
                            {DIFFICULTY_STYLE[q.difficulty].label}
                          </span>
                        )}
                        <span style={{ fontSize: 12, color: '#6B7280', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                          [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                        </span>
                      </div>
                    </div>

                    {/* MCQ options */}
                    {q.type === 'MCQ' && q.options?.length && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px', marginTop: 8 }}>
                        {q.options.map((opt, oi) => (
                          <p key={oi} style={{ fontSize: 13, margin: 0 }}>{opt}</p>
                        ))}
                      </div>
                    )}

                    {/* Answer lines for non-MCQ */}
                    {q.type !== 'MCQ' && (
                      <div style={{ borderBottom: '1px dashed #D1D5DB', marginTop: 10, height: q.type === 'DIAGRAM' ? 70 : 40 }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* End of paper */}
        <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
          *** End of Question Paper ***
        </p>

        {/* Answer Key */}
        {showAnswers && result.answerKey?.length > 0 && (
          <div className="new-page-section" style={{ marginTop: 28, padding: '20px', background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#166534', marginBottom: 16, textAlign: 'center', textTransform: 'uppercase' }}>
              Answer Key
            </h3>
            <div style={{ columns: 2, gap: 16, columnRule: '1px solid #BBF7D0' }}>
              {result.answerKey.map((ans, i) => (
                <p key={i} style={{ fontSize: 13, margin: '0 0 8px', breakInside: 'avoid' }}>
                  <strong>Q{ans.index}:</strong> {ans.answer}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
