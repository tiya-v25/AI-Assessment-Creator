'use client';

import { Bell, ChevronDown, ArrowLeft, LayoutGrid, Menu } from 'lucide-react';
import Image from 'next/image';
// import ProfileAvatar from "@public/assets/profile-avatar.png";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function TopBar({ title = 'Assignment', showBack = true, onBack }: TopBarProps) {
  return (
    <>
      {/* Desktop Top Bar */}
      <header
        className="hidden md:flex"
        style={{
          margin: '16px',
          height: 64,
          background: 'var(--bg-sidebar, #ffffff)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {showBack && (
            <button
              onClick={onBack}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                color: 'var(--text-secondary, #71717A)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary, #18181B)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary, #71717A)')}
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="desktop-only" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-secondary, #71717A)',
          }}>
            <LayoutGrid size={18} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{title}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}>
            <Bell size={20} color="var(--text-secondary, #71717A)" />
            <span style={{
              position: 'absolute', top: 0, right: 2,
              width: 8, height: 8, borderRadius: '50%',
              background: '#EF4444',
              border: '2px solid var(--bg-white, #FFFFFF)',
            }} />
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            border: '0px solid black', background: 'transparent',
            borderRadius: '24px',
            boxShadow: '-2px 3px 3px rgba(0, 0, 0, 0.10)',
            padding: '8px 8px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#FFE0C2',
            }}>

              <Image
                src="/assets/profile-avatar.png"
                alt="Profile Avatar"
                width={40}  // Add appropriate width
                height={40} // Add appropriate height
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #18181B)' }}>
              John Doe
            </span>
            <ChevronDown size={16} color="var(--text-muted, #A1A1AA)" />
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header
        className="flex md:hidden"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          right: '16px',
          background: '#FFFFFF',
          borderRadius: '100px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px 8px 12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#2B2B2B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>V</span>
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: 20,
            color: '#18181B',
            letterSpacing: '-0.04em'
          }}>
            VedaAI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            position: 'relative',
            background: '#F4F4F5',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            cursor: 'pointer',
          }}>
            <Bell size={18} color="#18181B" />
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 12, height: 12, borderRadius: '50%',
              background: '#D9502A',
              border: '2.5px solid #FFFFFF',
            }} />
          </button>

          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#FFE0C2',
          }}>

            <Image
              src="/assets/profile-avatar.png"
              alt="Profile Avatar"
              width={40}  // Add appropriate width
              height={40} // Add appropriate height
            />
          </div>

          <button style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            cursor: 'pointer',
          }}>
            <Menu size={26} color="#18181B" strokeWidth={2.5} />
          </button>
        </div>
      </header>
    </>
  );
}
