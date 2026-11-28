import type { MetadataRoute } from "next";
import { absoluteUrl, indexableSite } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/api/" },
    sitemap: indexableSite ? absoluteUrl("/sitemap.xml") : undefined,
  };
}
