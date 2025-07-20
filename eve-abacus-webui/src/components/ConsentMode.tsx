"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "consent",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export default function ConsentMode() {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Default consent state (denied by default for GDPR compliance)
    const defaultConsent = {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted', // Always granted for functionality
      security_storage: 'granted' // Always granted for security
    };

    // Check for existing consent in localStorage
    const savedConsent = localStorage.getItem('google_consent');
    let consentState = defaultConsent;

    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        consentState = { ...defaultConsent, ...parsed };
      } catch {
        console.warn('Failed to parse saved consent, using defaults');
      }
    }

    // Set initial consent state
    if (window.gtag) {
      window.gtag('consent', 'default', consentState);
    }

    // Create consent management functions
    const updateConsent = (newConsent: Partial<typeof defaultConsent>) => {
      const updatedConsent = { ...consentState, ...newConsent };
      
      // Clear cookies if consent is revoked
      if (newConsent.analytics_storage === 'denied' && consentState.analytics_storage === 'granted') {
        clearCookies(['_ga', '_ga_', '_gid', '_gat']);
      }
      
      if (newConsent.ad_storage === 'denied' && consentState.ad_storage === 'granted') {
        clearCookies(['_gads', '_gac_', '_gcl_au', '_gcl_dc']);
        // Remove AdSense script if it exists
        const adsenseScript = document.getElementById('adsense-script');
        if (adsenseScript) {
          adsenseScript.remove();
          console.log('AdSense script removed');
        }
      }
      
      // Save to localStorage
      localStorage.setItem('google_consent', JSON.stringify(updatedConsent));
      
      // Update gtag consent
      if (window.gtag) {
        window.gtag('consent', 'update', updatedConsent);
      }
      
      consentState = updatedConsent;
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

    // Expose consent management to window
    (window as unknown as Record<string, unknown>).updateGoogleConsent = updateConsent;
    (window as unknown as Record<string, unknown>).getGoogleConsent = () => consentState;

    // Create a simple consent banner if no consent has been given
    if (!savedConsent) {
      createConsentBanner();
    }
  }, []);

  const createConsentBanner = () => {
    // Remove any existing banner
    const existingBanner = document.getElementById('consent-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1f2937;
      color: white;
      padding: 20px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
    `;

    banner.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">We use cookies and similar technologies</h3>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            This website uses cookies and similar technologies to provide you with a better experience, 
            analyze site usage, and deliver personalized content and advertisements.
          </p>
        </div>
        <div style="display: flex; gap: 12px; flex-shrink: 0;">
          <button id="consent-necessary" style="
            background: #374151;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">Necessary Only</button>
          <button id="consent-all" style="
            background: #60fed2;
            color: #000;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">Accept All</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('consent-necessary')?.addEventListener('click', () => {
      (window as any).updateGoogleConsent({
        ad_storage: 'denied',
        analytics_storage: 'denied'
      });
      banner.remove();
    });

    document.getElementById('consent-all')?.addEventListener('click', () => {
      (window as any).updateGoogleConsent({
        ad_storage: 'granted',
        analytics_storage: 'granted'
      });
      banner.remove();
    });
  };

  return null;
} 