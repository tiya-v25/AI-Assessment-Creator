'use client';

import Link from 'next/link';
import Image from 'next/image';
// import VedaLogo from "../Public/assets/veda-logo.png";
// import ProfileAvatar from "../Public/assets/profile-avatar.png";
import { Bricolage_Grotesque } from 'next/font/google';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid, Users, FileText, Smartphone, History, Settings, Sparkles
} from 'lucide-react';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

const navItems = [
  { href: '/', icon: LayoutGrid, label: 'Home' },
  { href: '/groups', icon: Users, label: 'My Groups' },
  { href: '/assignments', icon: FileText, label: 'Assignments' },
  { href: '/toolkit', icon: Smartphone, label: "AI Teacher's Toolkit" },
  { href: '/library', icon: History, label: 'My Library' },
];

export default function Sidebar() {
  const pathname = usePathname() || '/';

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside
      id="main-sidebar"
      style={{
        width: '320px',
        height: 'calc(100vh - 32px)',
        margin: '16px',
        borderRadius: '24px',
        background: 'var(--bg-sidebar, #ffffff)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '16px',
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      <div style={{ padding: '32px 24px 24px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src="/assets/veda-logo.png"
            alt="Veda Logo"
            width={40} // Adjust width as needed
            height={40} // Adjust height as needed
          />
          <span
            className={bricolage.className}
            style={{
              fontWeight: 700,
              fontSize: 28,
              color: '#303030',
              letterSpacing: '-0.06em',
            }}
          >
            VedaAI
          </span>
        </Link>
      </div>

      <div style={{ padding: '0 24px 32px' }}>
        <Link
          href="/create"
          id="sidebar-create-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 600,
            padding: '14px 16px',
            background: '#2B2B2B',
            color: '#FFFFFF',
            border: '5px solid #D9502A',
            textDecoration: 'none',
            boxSizing: 'border-box'
          }}
        >
          <Sparkles size={18} />
          <span>Create Assignment</span>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '0 16px' }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase().replace(/[\s']+/g, '-')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderRadius: 12,
                marginBottom: 6,
                textDecoration: 'none',
                background: active ? 'var(--bg-page, #F4F4F5)' : 'transparent',
                color: active ? 'var(--text-primary, #18181B)' : 'var(--text-secondary, #71717A)',
                fontWeight: active ? 600 : 500,
                fontSize: 16,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--bg-page, #F4F4F5)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={22} style={{ flexShrink: 0, opacity: active ? 1 : 0.8 }} />
              <span style={{ flex: 1 }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 16px 24px' }}>
        <Link
          href="/settings"
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '14px 20px', borderRadius: 12, textDecoration: 'none',
            color: 'var(--text-secondary, #71717A)', fontSize: 16, fontWeight: 500,
            transition: 'background 0.15s ease',
            marginBottom: 16,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-page, #F4F4F5)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Settings size={22} style={{ opacity: 0.8 }} />
          <span>Settings</span>
        </Link>

        <div style={{
          padding: '12px', borderRadius: 16,
          background: 'var(--bg-page, #F4F4F5)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#FFE0C2',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <Image
              src="/assets/profile-avatar.png"
              alt="Profile Avatar"
              width={40}
              height={40}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary, #18181B)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 2px 0' }}>
              Delhi Public School
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary, #71717A)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
