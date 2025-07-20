'use client';

import { useEffect } from 'react';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsentNS from 'vanilla-cookieconsent';

export default function CookieConsentBanner() {
  useEffect(() => {
    const CookieConsent = CookieConsentNS as any;
    if (!CookieConsent || typeof CookieConsent.run !== 'function') {
      console.error('CookieConsent is undefined');
      return;
    }
    CookieConsent.run({
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: { toggle: true },
        targeting: { toggle: true }
      },
      theme: 'dark',
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies!',
              description: 'This website uses cookies to ensure you get the best experience. You can manage your preferences.',
              acceptAllBtn: 'Accept all',
              showPreferencesBtn: 'Manage preferences'
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Only necessary',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Cookie usage',
                  description: 'We use cookies to ensure basic functionality of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want.'
                },
                {
                  title: 'Strictly necessary cookies',
                  description: 'These cookies are essential for the proper functioning of our website.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Analytics cookies',
                  description: 'These cookies help us understand how visitors interact with our website.',
                  linkedCategory: 'analytics'
                },
                {
                  title: 'Targeting cookies',
                  description: 'These cookies are used for advertising and tracking purposes.',
                  linkedCategory: 'targeting'
                }
              ]
            }
          }
        }
      },
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom right',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          position: 'left'
        }
      },
      onConsent: ({ cookie }: { cookie: { categories: string[] } }) => {
        if (cookie.categories.includes('analytics')) {
          if (!document.getElementById('ga4-js')) {
            const gaScript = document.createElement('script');
            gaScript.id = 'ga4-js';
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z3LZYRG3N4';
            gaScript.async = true;
            document.head.appendChild(gaScript);

            const inlineScript = document.createElement('script');
            inlineScript.id = 'ga4-init';
            inlineScript.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Z3LZYRG3N4', {
                page_path: window.location.pathname,
              });
            `;
            document.head.appendChild(inlineScript);
          }
        }
        if (cookie.categories.includes('targeting')) {
          if (!document.getElementById('adsense-js')) {
            const adScript = document.createElement('script');
            adScript.id = 'adsense-js';
            adScript.async = true;
            adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2093140217864166';
            adScript.crossOrigin = 'anonymous';
            document.head.appendChild(adScript);
          }
        }
      }
    });
    // Expose to window for settings button
    if (typeof window !== 'undefined' && CookieConsent) {
      (window as any).CookieConsent = CookieConsent;
    }
  }, []);

  return null;
}