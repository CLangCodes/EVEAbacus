"use client";

import { useAdSenseAuto } from "@/hooks/useAdSense";

export default function AdSenseLoader() {
  useAdSenseAuto();
  
  // This component doesn't render anything visible
  return null;
} 