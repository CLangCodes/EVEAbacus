import { useEffect } from "react";

export function useAdSenseAuto() {
  useEffect(() => {
    // Only inject if ad_storage is granted
    const consent = localStorage.getItem("google_consent");
    if (!consent) return;
    
    try {
      const parsed = JSON.parse(consent);
      if (parsed.ad_storage !== "granted") return;
    } catch {
      return;
    }

    // Prevent duplicate script injection
    if (document.getElementById("adsense-script")) return;

    const script = document.createElement("script");
    script.id = "adsense-script";
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2093140217864166";
    script.crossOrigin = "anonymous";
    
    // Add error handling
    script.onerror = () => {
      console.warn("Failed to load AdSense script");
    };
    
    document.head.appendChild(script);
    
    console.log("AdSense Auto Ads script loaded");
  }, []);
} 