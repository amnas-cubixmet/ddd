"use client";

import Image from "next/image";
import { useState } from "react";

export function DivisionImage({ src, fallbackSrc, alt, sizes, priority = false }: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const usingFallback = failedSrc === src && !!fallbackSrc;
  return (
    <Image
      src={usingFallback ? fallbackSrc! : src}
      alt={usingFallback ? "Representative architectural lighting fixture" : alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => { if (!usingFallback && fallbackSrc) setFailedSrc(src); }}
    />
  );
}
