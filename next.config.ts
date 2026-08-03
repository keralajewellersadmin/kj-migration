import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const isProduction = process.env.NODE_ENV === "production";
const ADMIN_PATH = "/kj-portal-0d7cfad1";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self' https://www.google.com https://maps.google.com https://res.cloudinary.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg", "payload"],
  images: cloudinaryCloudName
    ? {
        loader: "custom",
        loaderFile: "./lib/cloudinaryLoader.ts",
        remotePatterns: [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: `/${cloudinaryCloudName}/**`,
          },
        ],
      }
    : undefined,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: `${ADMIN_PATH}/:path*`,
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
    ];
  },
};

export default withPayload(nextConfig);
