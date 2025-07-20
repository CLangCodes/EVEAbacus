'use client';

import Link from 'next/link';

export default function CookieSettingsFooter() {
  return (
    <footer
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        background: '#1f2937', // Tailwind's bg-gray-800
        textAlign: 'center',
        padding: '12px 0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
        zIndex: 1000
      }}
    >
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontSize: '1rem',
          marginRight: 16
        }}
        onClick={() => {
          if (
            typeof window !== 'undefined' &&
            window.CookieConsent &&
            typeof window.CookieConsent.show === 'function'
          ) {
            window.CookieConsent.show();
          }
        }}
        aria-label="Cookie Settings"
      >
        Cookie Settings
      </button>
      <Link href="/cookie-policy" style={{ color: '#fff', textDecoration: 'underline', fontSize: '1rem' }}>
        Cookie Policy
      </Link>
    </footer>
  );
}