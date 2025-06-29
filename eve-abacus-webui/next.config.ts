import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for production deployment (industry standard)
  output: 'standalone',
  // Handle Windows symlink issues
  webpack: (config, { isServer }) => {
    if (isServer && process.platform === 'win32') {
      // On Windows, avoid symlinks in standalone builds
      config.experiments = {
        ...config.experiments,
        outputModule: false,
      };
    }
    return config;
  },
  /* config options here */
};

export default nextConfig;
