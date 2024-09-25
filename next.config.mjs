const nextConfig = {
  webpack: (config) => {
    config.cache = false; // Disables Webpack's caching for problematic items
    return config;
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
