import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        // protocol: "http",
        protocol: "https",
        // hostname: "localhost", // Specify only the domain here
        hostname: "api.telmis.ir", // Specify only the domain here
        // port: "4000", // Specify the port separately
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
