'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { assessmentApi, Assessment } from '@/lib/api';
import ExamPaper from '@/components/result/ExamPaper';
import TopBar from '@/components/TopBar';
import { Download, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!assessment) return;
    setRegenerating(true);
    try {
      await assessmentApi.delete(assessment._id);
      // Navigate to /create — the create page will be fresh
      router.push('/create');
    } catch (err) {
      console.error('Regenerate failed:', err);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    assessmentApi.getById(id).then(setAssessment).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F4F4F5' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .result-main { padding: 0 16px 60px; width: 100%; max-width: none; }
        .grey-wrapper { padding: 32px; border-radius: 24px; }
        .doc-wrapper { padding: 40px; }

        @media (max-width: 768px) {
          .result-main { padding: 90px 16px 120px !important; }
          .grey-wrapper { padding: 16px !important; border-radius: 16px !important; }
          .doc-wrapper { padding: 20px 16px !important; border-radius: 12px !important; }
        }
      `}} />

      <TopBar title="Assignments" showBack={true} onBack={() => router.push('/')} />

      {loading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--brand-orange-light, #FFE0C2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse-ring 2s ease infinite',
          }}>
            <Loader2 size={36} color="var(--brand-orange, #D9502A)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #18181B)', marginBottom: 8 }}>
              Loading Assignment
            </h2>
            <p style={{ color: 'var(--text-secondary, #71717A)', fontSize: 15 }}>Retrieving your generated document...</p>
          </div>
        </div>
      ) : !assessment || assessment.status !== 'completed' || !assessment.result ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary, #18181B)', marginBottom: 12 }}>
              Assignment Unavailable
            </h2>
            <p style={{ color: 'var(--text-secondary, #71717A)', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
              {assessment?.status === 'failed' ? `Error: ${assessment.error}` : 'This assignment is still being generated. Please check back in a few moments.'}
            </p>
            <Link href="/" className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <main className="page-content result-main" style={{ flex: 1 }}>
          <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 8px', gap: 12 }}>
            <button
              id="regenerate-btn"
              onClick={handleRegenerate}
              disabled={regenerating}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                border: '1px solid var(--border-color, #E4E4E7)', borderRadius: '50px',
                background: regenerating ? '#F4F4F5' : 'white',
                color: 'var(--text-secondary)',
                fontSize: 13, cursor: regenerating ? 'not-allowed' : 'pointer', fontWeight: 500,
                opacity: regenerating ? 0.6 : 1,
              }}
            >
              <RefreshCw size={14} style={{ animation: regenerating ? 'spin 1s linear infinite' : 'none' }} />
              {regenerating ? 'Redirecting...' : 'Regenerate'}
            </button>
            <button
              id="toggle-answers-btn"
              onClick={() => setShowAnswers(!showAnswers)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                border: '1px solid var(--border-color, #E4E4E7)', borderRadius: '50px',
                background: showAnswers ? '#F0FDF4' : 'white',
                color: showAnswers ? '#166534' : 'var(--text-secondary)',
                fontSize: 13, cursor: 'pointer', fontWeight: 500,
              }}
            >
              {showAnswers ? <EyeOff size={14} /> : <Eye size={14} />}
              {showAnswers ? 'Hide' : 'Show'} Answer Key
            </button>
          </div>

          <div className="grey-wrapper" style={{
            background: '#404040',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          }}>
            <div className="no-print" style={{
              background: '#1A1A1A',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
            }}>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: '#FFFFFF', margin: 0, letterSpacing: '0.2px' }}>
                Certainly! Here are customized Question Paper for your{' '}
                <strong style={{ color: '#FFFFFF' }}>{assessment.result.subject || 'class'}</strong> classes on the requested chapters:
              </p>

              <button
                id="print-btn"
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: '50px',
                  background: '#FFFFFF',
                  border: 'none',
                  color: '#1A1A1A',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Download size={18} strokeWidth={2.5} /> Download as PDF
              </button>
            </div>

            <div className="doc-wrapper" style={{
              background: '#FFFFFF',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <ExamPaper result={assessment.result} showAnswers={showAnswers} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}