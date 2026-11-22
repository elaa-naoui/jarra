/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "supabase.co"],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
};

module.exports = nextConfig;
