"use client";

import type { ReactNode } from "react";
import { useCatalogueMotion } from "./catalogue-motion";
import styles from "./related-catalogue-grid.module.css";

export function RelatedCatalogueGrid({ signature, children }: { signature: string; children: ReactNode }) {
  const { grid } = useCatalogueMotion<HTMLDivElement>(signature);
  return <div className={`card-grid ${styles.grid}`} ref={grid}>{children}</div>;
}
