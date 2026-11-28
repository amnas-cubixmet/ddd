"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function CatalogueImage({
  src,
  alt,
  sizes,
  eager = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (failedSrc === src) {
    return (
      <span
        className="catalogue-image-fallback"
        role="img"
        aria-label={
          alt ? `Image unavailable: ${alt}` : "Fixture image unavailable"
        }
      >
        <ImageOff size={24} aria-hidden="true" /> Image unavailable
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      onError={() => setFailedSrc(src)}
    />
  );
}
