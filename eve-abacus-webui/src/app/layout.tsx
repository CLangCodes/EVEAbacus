import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavMenu } from "@/components/NavMenu";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { useEffect } from 'react';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import CookieSettingsFooter from '@/components/CookieSettingsFooter';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVE Abacus",
  description: "EVE Abacus Service for EVE Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* CookieConsentBanner will handle script injection. */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieConsentBanner />
        <Analytics />
        <NavMenu />
        <main className="p-4">
          {children}
        </main>
        <CookieSettingsFooter />
      </body>
    </html>
  );
}