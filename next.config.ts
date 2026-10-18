import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to allow deployment
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.s3.amazonaws.com" },
      { protocol: "https", hostname: "**.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "**.notion-static.com" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  // Dev server is reached through a Docker bridge network during local testing.
  allowedDevOrigins: ["172.17.0.1"],
};

export default nextConfig;
