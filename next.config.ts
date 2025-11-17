import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: false,

  // ✅ Allow external images (for local + production servers)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.15",
        port: "4000",
        pathname: "/uploads/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "yourdomain.com", // 👉 replace with your actual live domain when deployed
      //   pathname: "/uploads/**",
      // },
    ],
  },

  // ✅ Keep your SVG loader intact
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
