import type { MetadataRoute } from "next";
import { products, projects } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    "/",
    "/products",
    "/portfolio",
    "/about",
    "/contact",
    "/request-quote",
    ...products.map((item) => `/products/${item.slug}`),
    ...projects.map((item) => `/portfolio/${item.slug}`),
  ].map((path) => ({ url: new URL(path, siteUrl).href }));
}
