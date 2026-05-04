import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    // domains: ["api.telmis.ir"], // Allow images from this domain
    remotePatterns: [
      {
        protocol: "http",
        // protocol: "https",
        hostname: "localhost",
        // hostname: "api.telmis.ir",
        port: "4000",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
