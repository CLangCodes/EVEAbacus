import React from 'react';

const cookies = [
  {
    name: 'Essential Cookies',
    provider: 'https://eveabacus.com',
    purpose: 'Required for basic site functionality and security.',
    duration: 'Session or persistent',
    category: 'Necessary',
  },
  {
    name: 'Google Analytics',
    provider: 'https://www.google.com',
    purpose: 'Collects anonymous statistics to help us improve the site.',
    duration: 'Up to 2 years',
    category: 'Analytics',
  },
  {
    name: 'Google AdSense',
    provider: 'https://googleads.g.doubleclick.net',
    purpose: 'Delivers personalized ads based on your interests.',
    duration: 'Up to 2 years',
    category: 'Targeting',
  },
];

export default function CookiePolicy() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1>Cookie Policy</h1>
      <p>
        This page explains what cookies are, which cookies we use, and how you can manage your preferences.
      </p>
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device by your browser. They help websites remember information about your visit.
      </p>
      <h2>Cookies we use</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Provider</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Purpose</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Duration</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie) => (
            <tr key={cookie.name}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{cookie.name}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{cookie.provider}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{cookie.purpose}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{cookie.duration}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{cookie.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Managing your preferences</h2>
      <p>
        You can change your cookie preferences at any time by clicking the <b>Cookie Settings</b> link at the bottom of the page.
      </p>
      <p>
        For more information about cookies and your rights, please visit <a href="https://gdpr.eu/cookies/" target="_blank" rel="noopener noreferrer">gdpr.eu/cookies/</a>.
      </p>
    </div>
  );
} 