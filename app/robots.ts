import type { MetadataRoute } from "next";
import { ADMIN_PATH } from "@/lib/admin-path";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://keralajewellers.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", `${ADMIN_PATH}/`],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
