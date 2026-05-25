'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div style={{ padding: '32px 36px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Library</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>All your generated assessments</p>
      <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-surface)', borderRadius: 16, border: '1px dashed var(--border-default)' }}>
        <BookOpen size={40} color="var(--brand-primary)" style={{ marginBottom: 16 }} />
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Go to the dashboard to view all assessments</p>
        <Link href="/" style={{ padding: '10px 24px', borderRadius: 8, background: 'var(--grad-primary)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
