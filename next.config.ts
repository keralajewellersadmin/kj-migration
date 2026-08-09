import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  "frame-src 'self' https://www.google.com https://maps.google.com https://res.cloudinary.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["pg", "payload"],
  images: cloudinaryCloudName
    ? {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: `/${cloudinaryCloudName}/**`,
          },
        ],
      }
    : undefined,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/kj-portal-0d7cfad1",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/kj-portal-0d7cfad1",
        destination: "/admin",
      },
      {
        source: "/kj-portal-0d7cfad1/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
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
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/api/frontend-products",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=600" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
