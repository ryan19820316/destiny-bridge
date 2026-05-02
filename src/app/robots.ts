import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/feedback/"],
    },
    sitemap: "https://destinybridge.app/sitemap.xml",
  };
}
