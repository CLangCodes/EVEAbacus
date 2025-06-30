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
    
    // Ensure styled-jsx is not excluded from the build
    if (isServer) {
      config.externals = config.externals || [];
      // Remove styled-jsx from externals if it's there
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter((external: any) => 
          typeof external === 'string' ? external !== 'styled-jsx' : true
        );
      }
    }
    
    return config;
  },
  /* config options here */
};

export default nextConfig;
