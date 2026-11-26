import type { Metadata } from "next";

export const brand = {
  name: "Bharat Lums",
  tagline: "Powering a Brighter Tomorrow",
  email: "info@bharatlums.com",
  phone: "+91 99618 39602",
  website: "https://bharatlums.com",
  phoneHref: "tel:+919961839602",
};

export const siteUrl =
  process.env.SITE_URL?.trim().replace(/\/$/, "") || undefined;
const previewHost = process.env.VERCEL_URL;
export const metadataOrigin =
  siteUrl ?? (previewHost ? `https://${previewHost}` : undefined);

export const description =
  "Explore the Bharat Lums LED lighting catalogue for commercial, industrial and outdoor projects.";

export function metadata(
  title: string,
  path: string,
  summary = description,
  image = "/images/about-bharat-lums-conference.webp",
): Metadata {
  const url = siteUrl ? new URL(path, siteUrl) : undefined;
  return {
    title,
    description: summary,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: `${title} | ${brand.name}`,
      description: summary,
      siteName: brand.name,
      url: metadataOrigin ? new URL(path, metadataOrigin) : undefined,
      type: "website",
      images: metadataOrigin
        ? [
            {
              url: new URL(image, metadataOrigin),
              alt: "Bharat Lums architectural lighting concept",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: metadataOrigin ? [new URL(image, metadataOrigin)] : undefined,
    },
  };
}
