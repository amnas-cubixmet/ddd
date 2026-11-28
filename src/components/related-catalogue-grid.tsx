"use client";

import type { ReactNode } from "react";
import { useCatalogueMotion } from "./catalogue-motion";

export function RelatedCatalogueGrid({ signature, children }: { signature: string; children: ReactNode }) {
  const { grid } = useCatalogueMotion<HTMLDivElement>(signature);
  return <div className="card-grid" ref={grid}>{children}</div>;
}
