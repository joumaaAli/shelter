/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during build
  },
  webpack: (config) => {
    // Custom webpack configuration
    return config;
  },
};

export default nextConfig;
