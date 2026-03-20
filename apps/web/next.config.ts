import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
