"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "consent",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: any[];
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
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted' // Always granted for security
    };

    // Check for existing consent in localStorage
    const savedConsent = localStorage.getItem('google_consent');
    let consentState = defaultConsent;

    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        consentState = { ...defaultConsent, ...parsed };
      } catch (e) {
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
      
      // Save to localStorage
      localStorage.setItem('google_consent', JSON.stringify(updatedConsent));
      
      // Update gtag consent
      if (window.gtag) {
        window.gtag('consent', 'update', updatedConsent);
      }
      
      consentState = updatedConsent;
    };

    // Expose consent management to window
    (window as any).updateGoogleConsent = updateConsent;
    (window as any).getGoogleConsent = () => consentState;

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
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied'
      });
      banner.remove();
    });

    document.getElementById('consent-all')?.addEventListener('click', () => {
      (window as any).updateGoogleConsent({
        ad_storage: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted'
      });
      banner.remove();
    });
  };

  return null;
} 