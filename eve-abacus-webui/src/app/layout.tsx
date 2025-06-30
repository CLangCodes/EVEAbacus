import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavMenu } from "@/components/NavMenu";

const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/geist/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/geist/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    // Add more weights/styles as needed
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/geist/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    // Add more weights/styles as needed
  ],
  variable: "--font-geist-mono",
  display: "swap",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavMenu />
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
