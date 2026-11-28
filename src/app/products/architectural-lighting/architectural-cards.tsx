"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { CatalogueImage } from "@/components/catalogue-image";
import { useCatalogueMotion } from "@/components/catalogue-motion";
import type { architecturalProducts } from "@/lib/architectural-products";
import styles from "./architectural.module.css";

type Item = (typeof architecturalProducts)[number];
const detailHref = (slug: string) => `/products/architectural-lighting/${slug}`;
const quoteHref = (slug: string) => `/request-quote?architectural=${slug}`;

export function ArchitecturalCards({ items }: { items: readonly Item[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("featured");
  const search = query.trim().toLowerCase();
  const visible = items.filter(item => (!type || item.slug === type) && `${item.name} ${item.application}`.toLowerCase().includes(search));
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  const { grid, capture } = useCatalogueMotion<HTMLUListElement>(visible.map(item => item.slug).join("|"));
  return (
    <>
      <div className="filters">
        <label className="catalogue-search">
          <span>Search products</span>
          <span className="search-field">
            <Search size={18} aria-hidden="true" />
            <input type="search" value={query} onChange={event => { capture(); setQuery(event.target.value); }} placeholder="e.g. downlights" />
          </span>
        </label>
        <label>
          <span>Lighting type</span>
          <select value={type} onChange={event => { capture(); setType(event.target.value); }}>
            <option value="">All lighting types</option>
            {items.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={event => { capture(); setSort(event.target.value); }}>
            <option value="featured">Featured first</option>
            <option value="name">Name · A to Z</option>
          </select>
        </label>
      </div>
      <div className="catalogue-results">
        <p className="results-count" role="status">{visible.length} {visible.length === 1 ? "lighting type" : "lighting types"}</p>
        {(query || type) && <button type="button" className="text-link" onClick={() => { capture(); setQuery(""); setType(""); }}>Clear filters</button>}
      </div>
      <ul className={`card-grid ${styles.grid}`} ref={grid} data-testid="architectural-catalogue">
        {visible.map(item => (
          <li key={item.slug} className="catalogue-motion-item" data-catalogue-item={item.slug}>
            <article className={`media-card product-card ${styles.card}`}>
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
              </div>
            </div>
            </article>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <div className="empty-state"><p>No lighting results match. Try another search or clear the filters.</p></div>}
    </>
  );
}
