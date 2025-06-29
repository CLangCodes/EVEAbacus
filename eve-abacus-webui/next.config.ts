import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable standalone output to use regular Next.js build
  // output: 'standalone',
  // Disable symlinks on Windows to avoid permission issues
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
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
