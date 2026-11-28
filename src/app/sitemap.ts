import type { MetadataRoute } from "next";
import { catalogueCategories, products, isIndexableProduct } from "@/lib/catalogue";
import { applications, guides, guidePublicationDate } from "@/lib/lighting-content";
import { absoluteUrl, indexableSite, paths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexableSite) return [];
  const pagePaths = [
    "/", "/about", "/contact", "/request-quote",
    paths.products, paths.architecture, paths.infrastructure, paths.applications, paths.guides,
    ...catalogueCategories.map(({ slug }) => paths.category(slug)),
    ...products.filter(isIndexableProduct).map(({ slug }) => paths.product(slug)),
    ...applications.map(({ slug }) => paths.application(slug)),
  ];

  return [
    ...pagePaths.map((path) => ({ path })),
    ...guides.map(({ slug }) => ({ path: paths.guide(slug), lastModified: guidePublicationDate })),
  ].flatMap(({ path, ...entry }) => {
    const url = absoluteUrl(path);
    return url ? [{ url, ...entry }] : [];
  });
}
