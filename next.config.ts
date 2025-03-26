import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    loader: 'akamai',
    path: '/',
  },
};

export default nextConfig;
