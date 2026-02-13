import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: false,

  images: {
    remotePatterns: [
      // ✅ Local server
      {
        protocol: "http",
        hostname: "192.168.0.15",
        port: "4000",
        pathname: "/uploads/**",
      },

      // ✅ Production server
      {
        protocol: "https",
        hostname: "inclusable.app",
        pathname: "/api/uploads/**",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
