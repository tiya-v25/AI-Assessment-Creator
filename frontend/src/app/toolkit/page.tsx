'use client';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';
import TopBar from '@/components/TopBar';

export default function ToolkitPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="AI Teacher's Toolkit" />
      <div className="page-content" style={{ flex: 1, padding: '32px 28px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Wand2 size={40} color="var(--brand-orange)" style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>AI Teacher's Toolkit</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            Create AI-powered assessments, rubrics, and grading criteria for your class.
          </p>
          <Link href="/create" className="btn-primary">Create New Assignment</Link>
        </div>
      </div>
    </div>
  );
}
