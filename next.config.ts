import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = "/weather-lens";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? basePath : undefined,
  assetPrefix: isProd ? `${basePath}/` : undefined,
};

export default nextConfig;
