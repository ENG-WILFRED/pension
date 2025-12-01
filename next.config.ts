import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a standalone server build so runtime `node` can start the app
  // without relying on `next start` and its BUILD_ID checks.
  output: "standalone",
};

export default nextConfig;
