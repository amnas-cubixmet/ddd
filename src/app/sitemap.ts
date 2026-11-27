import type { MetadataRoute } from "next";
import { products } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    "/",
    "/products",
    "/products/architectural-lighting",
    "/products/infrastructure-lighting",
    "/about",
    "/contact",
    "/request-quote",
    ...products.map((item) => `/products/${item.slug}`),
  ].map((path) => ({ url: new URL(path, siteUrl).href }));
}
