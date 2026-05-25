'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { assessmentApi, Assessment } from '@/lib/api';
import TopBar from '@/components/TopBar';
import { MoreVertical, Search, Filter, Plus, Loader2 } from 'lucide-react';
// import NoAssigment from "@/public/assets/no-assignments.png";

function StatusDot({ status }: { status: Assessment['status'] }) {
  const colors = {
    completed: '#10B981',
    processing: '#F59E0B',
    pending: '#A1A1AA',
    failed: '#EF4444',
  };
  return (
    <span style={{
      display: 'inline-block',
      width: 10, height: 10,
      borderRadius: '50%',
      background: colors[status],
      marginRight: 6,
      boxShadow: `0 0 0 2px ${colors[status]}33`
    }} />
  );
}

function AssignmentCard({ a, onDelete }: { a: Assessment; onDelete: (id: string) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const created = new Date(a.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-');
  const due = a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '—';
  const title = a.result?.title || a.title || 'Untitled Assignment';

  return (
    <div
      className="assignment-card"
      style={{
        background: '#FFFFFF',
        padding: '24px 28px',
        borderRadius: '24px',
        border: '1px solid var(--border-color, #E4E4E7)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '160px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.02)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
        {a.status === 'completed' ? (
          <Link href={`/result/${a._id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary, #18181B)', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              {title}
            </h3>
          </Link>
        ) : (
          <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary, #18181B)', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
            {title}
          </h3>
        )}

        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <MoreVertical size={20} color="var(--text-muted, #A1A1AA)" />
          </button>

          {showMenu && (
            <div style={{
              position: 'absolute', right: 0, top: 32, zIndex: 50,
              background: '#FFFFFF', border: '1px solid var(--border-color, #E4E4E7)',
              borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              minWidth: 'max-content',
              overflow: 'hidden', padding: 8,
            }}>
              {a.status === 'completed' && (
                <Link href={`/result/${a._id}`} style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary, #18181B)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-page, #F4F4F5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                  View Assignment
                </Link>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(a._id); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '8px', fontSize: 13, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary, #71717A)', fontWeight: 500 }}>
          <strong style={{ color: 'var(--text-primary, #18181B)', fontWeight: 700 }}>Assigned on</strong> : {created}
        </span>
        {a.dueDate && (
          <span style={{ fontSize: 12, color: 'var(--text-secondary, #71717A)', fontWeight: 500 }}>
            <strong style={{ color: 'var(--text-primary, #18181B)', fontWeight: 700 }}>Due</strong> : {due}
          </span>
        )}
      </div>

      {(a.status === 'processing' || a.status === 'pending') ? (
        <div style={{ position: 'absolute', bottom: 20, left: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Loader2 size={14} color="#A1A1AA" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#A1A1AA' }}>Generating...</span>
        </div>
      ) : null}
    </div>
  );
}


export default function AssignmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    assessmentApi.list().then(setAssessments).catch(console.error);
    const interval = setInterval(() => {
      assessmentApi.list().then(setAssessments).catch(() => { });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = assessments.filter((a) =>
    (a.result?.title || a.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await assessmentApi.delete(id);
      setAssessments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page, #F4F4F5)' }}>
      <TopBar title="Assignments" showBack={false} />

      <style dangerouslySetInnerHTML={{
        __html: `
        .assignments-main { padding: 40px 48px; max-width: 1200px; width: 100%; margin: 0 auto; }
        .filter-search-box { display: flex; justify-content: space-between; align-items: center; }
        .search-input-wrapper { width: 320px; max-width: 50%; }
        .cards-grid { grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); }

        @media (max-width: 768px) {
          .assignments-main { padding: 90px 16px 120px !important; }
          .filter-search-box { padding: 8px 12px !important; }
          .filter-btn { font-size: 13px !important; padding-left: 4px !important; }
          .search-input-wrapper { max-width: 60% !important; padding: 6px 12px !important; }
          .cards-grid { grid-template-columns: repeat(auto-fit, minmax(100%, 1fr)) !important; gap: 16px !important; }
          .assignment-card { padding: 20px !important; min-height: auto !important; }
          .blur-backdrop { left: 0 !important; }
        }
      `}} />

      <main className="page-content assignments-main">
        {assessments.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '60vh' }}>
            <Image
              src="/assets/no-assignments.png"
              alt="No Assignments"
              width={250} // Adjust width as needed for your design
              height={250} // Adjust height as needed for your design
              style={{ marginBottom: 24 }}
            />
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #18181B)', marginBottom: 12, letterSpacing: '-0.02em' }}>
              No assignments yet
            </h2>
            <p style={{ color: 'var(--text-secondary, #71717A)', fontSize: 15, textAlign: 'center', maxWidth: 460, lineHeight: 1.6, marginBottom: 32 }}>
              Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
            </p>
            <Link href="/create" id="empty-create-btn" className="btn-primary" style={{ padding: '14px 24px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} /> Create Your First Assignment
            </Link>
          </div>

        ) : (
          <>
            <div style={{ marginBottom: 32, paddingLeft: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)'
                }} />
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #18181B)', letterSpacing: '-0.02em' }}>
                  Assignments
                </h1>
              </div>
              <p style={{ color: 'var(--text-secondary, #A1A1AA)', fontSize: 14, paddingLeft: 24 }}>
                Manage and create assignments for your classes.
              </p>
            </div>

            <div className="filter-search-box" style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-color, #E4E4E7)',
              borderRadius: '15px',
              padding: '8px 16px',
              marginBottom: 32,
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}>
              <button className="filter-btn" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                color: '#71717A',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                paddingLeft: 8
              }}>
                <Filter size={18} color="#71717A" /> Filter By
              </button>

              <div className="search-input-wrapper" style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-page, #F4F4F5)',
                borderRadius: '50px',
                padding: '8px 16px',
              }}>
                <Search size={18} color="#A1A1AA" style={{ flexShrink: 0 }} />
                <input
                  placeholder="Search Assignment"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    paddingLeft: 10,
                    fontSize: 14,
                    color: '',
                    background: 'transparent',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div className="cards-grid" style={{
              display: 'grid',
              gap: 24,
              marginBottom: 120,
            }}>
              {filtered.map((a) => <AssignmentCard key={a._id} a={a} onDelete={handleDelete} />)}
            </div>
          </>
        )}
      </main>

      {assessments.length > 0 && (
        <>
          <div
            className="no-print blur-backdrop"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 'var(--sidebar-width, 240px)',
              right: 0,
              height: '100px',
              background: 'linear-gradient(180deg, rgba(244, 244, 245, 0) 0%, #F4F4F5 60%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />

          <div
            className="no-print desktop-only"
            style={{
              position: 'fixed',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(calc(-50% + (var(--sidebar-width, 240px) / 2)))',
              zIndex: 11,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/create"
              className="btn-primary"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '16px 28px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                borderRadius: '50px',
              }}
            >
              <Plus size={22} strokeWidth={2.5} /> Create Assignment
            </Link>
          </div>
        </>
      )}
    </div>
  );
}