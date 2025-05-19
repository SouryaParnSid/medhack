const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack configuration (moved from experimental.turbo to turbopack)
  turbopack: {
    // Configure Turbopack
    resolveAlias: {
      // Add any aliases if needed
    },
  },
  // Allow cross-origin requests during development
  allowedDevOrigins: [
    '192.168.56.1',
    'localhost',
    '127.0.0.1'
  ],
};

module.exports = withPWA(nextConfig);