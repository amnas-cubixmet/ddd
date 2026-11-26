"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function CatalogueImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
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
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
