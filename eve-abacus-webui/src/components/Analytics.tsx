"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-Z3LZYRG3N4", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}