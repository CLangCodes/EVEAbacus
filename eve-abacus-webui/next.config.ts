import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for production deployment (industry standard)
  output: 'standalone',
  // Handle Windows symlink issues and ensure all dependencies are bundled
  webpack: (config, { isServer }) => {
    if (isServer && process.platform === 'win32') {
      // On Windows, avoid symlinks in standalone builds
      config.experiments = {
        ...config.experiments,
        outputModule: false,
      };
    }
    
    // Ensure all dependencies are bundled in standalone builds
    if (isServer) {
      // Remove all externals to ensure dependencies are bundled
      config.externals = [];
      
      // Ensure specific dependencies are not treated as externals
      const dependenciesToBundle = [
        'styled-jsx',
        '@swc/helpers',
        'next',
        'react',
        'react-dom',
        'ioredis',
        'redis',
        'swagger-jsdoc',
        'swagger-ui-express',
        'zod'
      ];
      
      // If externals is a function, we need to handle it differently
      if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = (context: any, request: any, callback: any) => {
          // Check if the request is one of our dependencies to bundle
          if (dependenciesToBundle.some(dep => request === dep || request.startsWith(dep + '/'))) {
            return callback(null, false); // Don't externalize
          }
          return originalExternals(context, request, callback);
        };
      } else if (Array.isArray(config.externals)) {
        // Filter out dependencies we want to bundle
        config.externals = config.externals.filter((external: any) => {
          if (typeof external === 'string') {
            return !dependenciesToBundle.some(dep => external === dep || external.startsWith(dep + '/'));
          }
          return true;
        });
      }
    }
    
    return config;
  },
  /* config options here */
};

export default nextConfig;
