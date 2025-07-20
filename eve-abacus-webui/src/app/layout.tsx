import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavMenu } from "@/components/NavMenu";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import ConsentMode from "@/components/ConsentMode";
import ConsentSettings from "@/components/ConsentSettings";
import AdSenseLoader from "@/components/AdSenseLoader";



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
        {/* Google Analytics with Consent Mode v2 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z3LZYRG3N4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Initialize with default consent (denied)
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted'
            });
            
            gtag('config', 'G-Z3LZYRG3N4', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConsentMode />
        <ConsentSettings />
        <AdSenseLoader />
        <Analytics />
        <NavMenu />
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}