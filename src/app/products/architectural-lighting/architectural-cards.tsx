"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CatalogueImage } from "@/components/catalogue-image";
import type { architecturalProducts } from "@/lib/architectural-products";
import styles from "./architectural.module.css";

type Item = (typeof architecturalProducts)[number];
const detailHref = (slug: string) => `/products/architectural-lighting/${slug}`;
const quoteHref = (slug: string) => `/request-quote?architectural=${slug}`;

export function ArchitecturalCards({ items }: { items: readonly Item[] }) {
  const [selected, setSelected] = useState<Item | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
  }, [selected]);

  return (
    <>
      <ul className={styles.grid} data-testid="architectural-catalogue">
        {items.map(item => (
          <li key={item.slug} className={`media-card product-card ${styles.card}`}>
            {item.image && (
              <Link href={detailHref(item.slug)} className="image-link" aria-label={`View ${item.name}`}>
                <CatalogueImage src={item.image.src} alt={item.image.alt} sizes="(max-width: 540px) 92vw, (max-width: 900px) 46vw, 32vw" />
                <span className="card-icon"><ArrowUpRight size={19} aria-hidden="true" /></span>
              </Link>
            )}
            <div className="card-body">
              <h3><Link href={detailHref(item.slug)}>{item.name}</Link></h3>
              <p>{item.application}</p>
              {item.image && (!item.image.sourceUrl.startsWith("/images/") || item.image.licenseUrl) && (
                <p className={styles.credit}>
                  <a href={item.image.sourceUrl}>{item.image.credit}</a>
                  {item.image.licenseUrl && <> · <a href={item.image.licenseUrl}>Image license</a></>}
                </p>
              )}
              <div className="card-actions">
                <Link className="text-link" href={detailHref(item.slug)}>View details <ArrowRight size={13} /></Link>
                <Link className="text-link" href={quoteHref(item.slug)}>Enquire now <ArrowUpRight size={13} /></Link>
                <button type="button" className="text-link" onClick={() => setSelected(item)}>Quick preview</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <dialog ref={dialog} className="quick-preview" aria-labelledby="architectural-preview-title" onClose={() => setSelected(null)}>
        {selected && <>
          <button type="button" className="icon-button dialog-close" aria-label="Close preview" onClick={() => dialog.current?.close()}><X size={21} /></button>
          <h2 id="architectural-preview-title">{selected.name}</h2>
          {selected.image && <div className={styles.previewImage}><CatalogueImage src={selected.image.src} alt={selected.image.alt} sizes="(max-width: 560px) 90vw, 480px" /></div>}
          <p>{selected.application}</p>
          <p>Contact our team to confirm availability and specifications. Images are for reference only.</p>
          <div className="card-actions">
            <Link className="button button-primary" href={detailHref(selected.slug)}>View details</Link>
            <Link className="button button-outline" href={quoteHref(selected.slug)}>Enquire now</Link>
          </div>
        </>}
      </dialog>
    </>
  );
}
