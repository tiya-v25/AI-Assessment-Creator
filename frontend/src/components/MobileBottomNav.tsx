'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Inbox, FilePlus, Sparkles, Plus } from 'lucide-react';

const tabs = [
  { href: '/', icon: LayoutGrid, label: 'Home' },
  { href: '/assignments', icon: Inbox, label: 'Assignments' },
  { href: '/library', icon: FilePlus, label: 'Library' },
  { href: '/toolkit', icon: Sparkles, label: 'AI Toolkit' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="mobile-bottom-nav-wrapper md:hidden no-print">
      <div
        className="no-print"
        style={{
          position: 'fixed',
          bottom: '130px',
          right: '24px',
          zIndex: 51,
        }}
      >
        <Link
          href="/create"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            color: '#D9502A',
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={32} strokeWidth={2.5} />
        </Link>
      </div>

      <nav
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '16px',
          right: '16px',
          background: '#1A1A1A',
          padding: '12px 8px',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 50,
        }}
      >
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                textDecoration: 'none',
                color: active ? '#FFFFFF' : '#8B8B8B',
                flex: 1,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Icon
                size={24}
                fill={active ? "currentColor" : "none"}
                strokeWidth={active ? 2 : 1.5}
                style={{ color: active ? '#FFFFFF' : '#8B8B8B' }}
              />
              <span style={{
                fontSize: '11px',
                fontWeight: active ? 600 : 500,
                letterSpacing: '0.2px'
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}