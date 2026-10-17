import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim())
    : [],
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
