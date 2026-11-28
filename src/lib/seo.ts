import type { Metadata } from "next";
import { brand } from "./site";

const configuredOrigin = process.env.SITE_URL?.trim();

function parseOrigin(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (["http:", "https:"].includes(url.protocol) &&
      url.pathname === "/" && !url.username && !url.password && !url.search && !url.hash) {
      return url.origin;
    }
  } catch {
    return undefined;
  }
}

export const siteUrl = parseOrigin(configuredOrigin);
const deployment = process.env.VERCEL_ENV;
export const indexableSite = Boolean(siteUrl && (!deployment || deployment === "production") &&
  process.env.SITE_INDEXING !== "disabled");
const deploymentOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
export const metadataOrigin = siteUrl ?? parseOrigin(deploymentOrigin);
export const description = "Compare professional LED lighting for roads, industrial facilities and commercial interiors. Explore the Bharat Lums catalogue and request a project quote.";

export const paths = {
  products: "/products",
  infrastructure: "/products/infrastructure-lighting",
  architecture: "/products/architectural-lighting",
  applications: "/applications",
  guides: "/lighting-guides",
  product: (slug: string) => `/products/${slug}`,
  category: (slug: string) => `/products/categories/${slug}`,
  architecturalFixture: (slug: string) => `/products/architectural-lighting/${slug}`,
  application: (slug: string) => `/applications/${slug}`,
  guide: (slug: string) => `/lighting-guides/${slug}`,
};

export type ShareImage = { src: string; alt: string };
const defaultImage = { src: "/opengraph-image", alt: "Bharat Lums — Powering a Brighter Tomorrow" };

export function absoluteUrl(path: string) {
  return siteUrl ? new URL(path, siteUrl).href : undefined;
}

export function pageMetadata({
  title,
  path,
  summary,
  image = defaultImage,
  article,
  index = true,
  home = false,
}: {
  title: string;
  path: string;
  summary: string;
  image?: ShareImage;
  article?: { publishedTime: string; modifiedTime?: string };
  index?: boolean;
  home?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = `${title} | ${brand.name}`;
  const shareImage = metadataOrigin ? { url: new URL(image.src, metadataOrigin), alt: image.alt } : undefined;
  return {
    title: home ? { absolute: socialTitle } : title,
    description: summary,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: indexableSite && index, follow: true },
    openGraph: {
      title: socialTitle,
      description: summary,
      siteName: brand.name,
      url,
      ...(article ? { type: "article", ...article, authors: [brand.name] } : { type: "website" }),
      images: shareImage ? [shareImage] : undefined,
    },
    twitter: { card: "summary_large_image", title: socialTitle, description: summary, images: shareImage ? [shareImage] : undefined },
  };
}
