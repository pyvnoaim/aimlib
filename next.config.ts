import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: [
      'api.microlink.io', // Microlink Image Preview
    ],
  },
};

export default nextConfig;
