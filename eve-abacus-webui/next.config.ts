import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Force Next.js to include all dependencies
  transpilePackages: [],
  // Ensure styled-jsx is properly handled
  compiler: {
    styledComponents: false,
  },
};

export default nextConfig;
