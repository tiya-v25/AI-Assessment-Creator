'use client';
import TopBar from '@/components/TopBar';
import { Users } from 'lucide-react';

export default function GroupsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="My Groups" />
      <div className="page-content" style={{ flex: 1, padding: '32px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Users size={40} color="var(--text-muted)" style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>My Groups</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Group management coming soon.</p>
        </div>
      </div>
    </div>
  );
}
