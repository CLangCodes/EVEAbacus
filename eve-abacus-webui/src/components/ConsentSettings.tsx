"use client";

import { useState, useEffect } from 'react';

interface ConsentState {
  ad_storage: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
}

export default function ConsentSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    ad_storage: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted'
  });

  useEffect(() => {
    // Load current consent state
    const savedConsent = localStorage.getItem('google_consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed);
      } catch {
        console.warn('Failed to parse saved consent');
      }
    }
  }, [isOpen]); // Reload when modal opens

  const updateConsent = (newConsent: Partial<ConsentState>) => {
    const updatedConsent = { ...consent, ...newConsent };
    setConsent(updatedConsent);
    
    // Save to localStorage
    localStorage.setItem('google_consent', JSON.stringify(updatedConsent));
    
    // Clear cookies if consent is revoked
    if (newConsent.analytics_storage === 'denied' && consent.analytics_storage === 'granted') {
      // Clear Google Analytics cookies
      clearCookies(['_ga', '_ga_', '_gid', '_gat']);
    }
    
    if (newConsent.ad_storage === 'denied' && consent.ad_storage === 'granted') {
      // Clear AdSense cookies
      clearCookies(['_gads', '_gac_', '_gcl_au', '_gcl_dc']);
      // Remove AdSense script if it exists
      const adsenseScript = document.getElementById('adsense-script');
      if (adsenseScript) {
        adsenseScript.remove();
        console.log('AdSense script removed');
      }
    }
    
    // Update gtag consent
    if (window.gtag) {
      window.gtag('consent', 'update', updatedConsent);
    }
    
    // Update global consent function
    const updateGoogleConsent = (window as unknown as Record<string, unknown>).updateGoogleConsent as ((consent: Partial<ConsentState>) => void) | undefined;
    if (updateGoogleConsent) {
      updateGoogleConsent(updatedConsent);
    }
  };

  const clearCookies = (cookieNames: string[]) => {
    console.log('Attempting to clear tracking cookies...');
    
    // Try to clear what we can from client-side
    cookieNames.forEach(cookieName => {
      const clearOptions = [
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
      ];
      
              clearOptions.forEach(option => {
          try {
            document.cookie = option;
          } catch {
            // Ignore domain errors
          }
        });
    });
    
    console.log('Consent revoked. Tracking has been stopped.');
    console.log('Note: Some cookies may remain in browser storage but are no longer active for tracking.');
  };

  const handleSave = () => {
    updateConsent(consent);
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    const allGranted = {
      ad_storage: 'granted' as const,
      analytics_storage: 'granted' as const,
      functionality_storage: 'granted' as const,
    };
    setConsent(allGranted);
    updateConsent(allGranted);
    setIsOpen(false);
  };

  const handleRejectAll = () => {
    // Clear all tracking cookies
    clearCookies(['_ga', '_ga_', '_gid', '_gat', '_gads', '_gac_', '_gcl_au', '_gcl_dc']);
    
    const allDenied = {
      ad_storage: 'denied' as const,
      analytics_storage: 'denied' as const,
      functionality_storage: 'granted' as const, // Always granted
    };
    setConsent(allDenied);
    updateConsent(allDenied);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#1f2937',
          color: 'white',
          border: 'none',
          padding: '12px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        Cookie Settings
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <div
        style={{
          background: '#1f2937',
          color: 'white',
          padding: '32px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '600' }}>
          Cookie Preferences
        </h2>
        
        <p style={{ margin: '0 0 24px 0', opacity: 0.9, lineHeight: '1.5' }}>
          Manage your cookie preferences. You can change these settings at any time.
        </p>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={true}
                disabled
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: '500' }}>Security Cookies (Required)</span>
            </label>
            <p style={{ margin: '0 0 0 28px', fontSize: '14px', opacity: 0.7 }}>
              Essential for website security and cannot be disabled.
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={true}
                disabled
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: '500' }}>Functionality Cookies (Required)</span>
            </label>
            <p style={{ margin: '0 0 0 28px', fontSize: '14px', opacity: 0.7 }}>
              Essential for website functionality and cannot be disabled.
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={consent.analytics_storage === 'granted'}
                onChange={(e) => updateConsent({ analytics_storage: e.target.checked ? 'granted' : 'denied' })}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: '500' }}>Analytics Cookies</span>
            </label>
            <p style={{ margin: '0 0 0 28px', fontSize: '14px', opacity: 0.7 }}>
              Help us understand how visitors use our website.
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={consent.ad_storage === 'granted'}
                onChange={(e) => updateConsent({ ad_storage: e.target.checked ? 'granted' : 'denied' })}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: '500' }}>Advertising Cookies</span>
            </label>
            <p style={{ margin: '0 0 0 28px', fontSize: '14px', opacity: 0.7 }}>
              Used to deliver personalized advertisements.
            </p>
          </div>

        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleRejectAll}
            style={{
              background: '#374151',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Reject All
          </button>
          <button
            onClick={handleAcceptAll}
            style={{
              background: '#60fed2',
              color: '#000',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Accept All
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#60fed2',
              color: '#000',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
} 