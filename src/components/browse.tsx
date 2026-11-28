"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Filter } from "lucide-react";
import {
  catalogueCategories,
  publishedProducts,
  architecturalProducts,
} from "@/lib/catalogue";
import { paths } from "@/lib/seo";
import { CatalogueImage } from "./catalogue-image";
import { useCatalogueMotion } from "./catalogue-motion";
import styles from "./browse.module.css";

type ArchitectureItem = (typeof architecturalProducts)[number];
type Listing = {
  key: string; slug: string; name: string; category: string; categoryName: string;
  brand?: string; watts?: number; description: string; image?: {src: string; alt: string};
  href: string; enquiry: string; reference?: boolean; credit?: {url: string; label: string; license?: string};
};

const outdoor: Listing[] = publishedProducts.map(p => ({
  key: p.slug, slug: p.slug, name: p.name, category: p.categories[0],
  categoryName: catalogueCategories.find(c => c.slug === p.categories[0])?.name ?? "LED lighting",
  brand: p.model?.brand, watts: p.wattages?.[0], description: p.description,
  image: p.images[0], href: paths.product(p.slug), enquiry: "/contact?product=" + p.slug,
}));
const indoor = (items: readonly ArchitectureItem[], separate: boolean): Listing[] => items.map(p => ({
  key: "architectural-" + p.slug, slug: p.slug, name: p.name,
  category: separate ? p.slug : "architectural",
  categoryName: separate ? p.name : "Architectural & commercial lighting",
  description: p.application, image: p.image, href: paths.architecturalFixture(p.slug),
  enquiry: "/contact?architectural=" + p.slug, reference: p.image?.representative,
  credit: p.image && (!p.image.sourceUrl.startsWith("/images/") || p.image.licenseUrl)
    ? {url: p.image.sourceUrl, label: p.image.credit, license: p.image.licenseUrl} : undefined,
}));
const ranges = [
  {value: "", label: "Any"}, {value: "30", label: "Up to 30 W"},
  {value: "100", label: "31–100 W"}, {value: "250", label: "101–250 W"},
  {value: "above", label: "Above 250 W"}, {value: "unknown", label: "Not specified"},
];
function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/(\d)\s*w(?:atts?)?\b/g, "$1w").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function matchesSearch(product: Listing, query: string) {
  const haystack = normalizeSearch([product.name, product.categoryName, product.description, product.slug, product.brand, product.watts === undefined ? "" : product.watts + "W"].join(" "));
  return normalizeSearch(query).split(" ").filter(Boolean).every(term =>
    /^\d+w$/.test(term) ? haystack.split(" ").includes(term) : haystack.includes(term));
}
function matchesWatts(watts: number | undefined, range: string) {
  if (!range) return true;
  if (range === "unknown") return watts === undefined;
  if (watts === undefined) return false;
  if (range === "30") return watts <= 30;
  if (range === "100") return watts > 30 && watts <= 100;
  if (range === "250") return watts > 100 && watts <= 250;
  return watts > 250;
}

export function ProductsBrowser({ initialCategory = "", allowedCategories, includeArchitecture = false, architectureItems, fixedCategory = false }: {
  initialCategory?: string; allowedCategories?: readonly string[]; includeArchitecture?: boolean;
  architectureItems?: readonly ArchitectureItem[]; fixedCategory?: boolean;
}) {
  const architecturalOnly = architectureItems !== undefined;
  const scope = architecturalOnly ? indoor(architectureItems, true) : [
    ...outdoor.filter(p => !allowedCategories || allowedCategories.includes(p.category)),
    ...(includeArchitecture ? indoor(architecturalProducts, false) : []),
  ];
  const categories = Array.from(new Map(scope.map(p => [p.category, p.categoryName])).entries());
  const brands = Array.from(new Set(scope.flatMap(p => p.brand ? [p.brand] : [])));
  const hasWattage = scope.some(p => p.watts !== undefined);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState("");
  const [wattage, setWattage] = useState("");
  const [sort, setSort] = useState("featured");
  const search = query.trim();
  const active = Number(Boolean(category && !fixedCategory)) + Number(Boolean(brand)) + Number(Boolean(wattage));
  const matching = scope.filter(p =>
    (!brand || (brand === "unknown" ? !p.brand : p.brand === brand)) &&
    matchesWatts(p.watts, wattage) && matchesSearch(p, search));
  const visible = matching.filter(p => !category || p.category === category);
  if (sort === "name" || sort === "name-desc") visible.sort((a,b) =>
    sort === "name" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  if (sort === "watts-asc" || sort === "watts-desc") visible.sort((a,b) => {
    if (a.watts === undefined) return b.watts === undefined ? 0 : 1;
    if (b.watts === undefined) return -1;
    return sort === "watts-asc" ? a.watts-b.watts : b.watts-a.watts;
  });
  const { grid, capture } = useCatalogueMotion<HTMLUListElement>(visible.map(p => p.key).join("|"));

  function changeCategory(value: string) {
    capture(); setCategory(value);
    if (!architecturalOnly && !fixedCategory) {
      const url = new URL(window.location.href);
      if (value) url.searchParams.set("category", value); else url.searchParams.delete("category");
      window.history.replaceState(null, "", url);
    }
  }
  function clearFilters() {
    capture(); setQuery(""); setBrand(""); setWattage("");
    changeCategory(fixedCategory ? initialCategory : "");
  }
  const filterPills = (choices: {value: string; label: string}[], value: string, update: (v:string)=>void) => (
    <div className={styles.pills}>{choices.map(choice => (
      <button key={choice.value} type="button" aria-pressed={value === choice.value}
        onClick={() => { capture(); update(choice.value); }}>{choice.label}</button>
    ))}</div>
  );
  return (
    <div className={styles.browser}>
      <form className={styles.search} role="search" onSubmit={e => { e.preventDefault(); }}>
        <input type="search" aria-label="Search products" value={query} placeholder="Search model, name or wattage"
          onChange={e => { capture(); setQuery(e.target.value); }} />
        <button type="submit">Search</button>
      </form>
      <button className={styles.filterToggle} type="button" aria-expanded={open} aria-controls="product-filter-panel" onClick={() => setOpen(!open)}>
        <Filter size={18} aria-hidden="true" /> Filters {active > 0 && <span className={styles.count}>{active}</span>}
        <ChevronDown className={styles.chevron} size={20} aria-hidden="true" />
      </button>
      <div className={styles.panel} id="product-filter-panel" hidden={!open}>
        <div className={styles.panelHead}><h3>Filters</h3>{(active > 0 || query) && <button type="button" onClick={clearFilters}>Reset</button>}</div>
        {!fixedCategory && <fieldset className={styles.group}>
          <legend>Category</legend>
          {[["", "All categories"], ...categories].map(([value, label]) => (
            <button type="button" key={value} className={styles.category} aria-pressed={category === value} onClick={() => changeCategory(value)}>
              <span>{label}</span><span className={styles.categoryEnd}><span className={styles.count}>{value ? matching.filter(p=>p.category===value).length : matching.length}</span>{category === value && <Check size={16} aria-hidden="true" />}</span>
            </button>
          ))}
        </fieldset>}
        {(brands.length > 0 || scope.some(p => !p.brand)) && <fieldset className={styles.group}><legend>Brand</legend>{filterPills([{value:"",label:"Any"},...brands.map(value=>({value,label:value})),{value:"unknown",label:"Not specified"}],brand,setBrand)}</fieldset>}
        {(hasWattage || scope.some(p => p.watts === undefined)) && <fieldset className={styles.group}><legend>Wattage</legend>{filterPills(hasWattage ? ranges : ranges.filter(r => r.value === "" || r.value === "unknown"),wattage,setWattage)}</fieldset>}
        <button type="button" className={styles.apply} onClick={() => setOpen(false)}>Show {visible.length} products</button>
      </div>
      <div className={styles.toolbar}>
        <p role="status"><strong>{visible.length}</strong> {visible.length === 1 ? "product" : "products"}</p>
        <select aria-label="Sort" value={sort} onChange={e => {capture(); setSort(e.target.value);}}>
          <option value="featured">Featured</option><option value="name">Name: A to Z</option><option value="name-desc">Name: Z to A</option>
          {hasWattage && <><option value="watts-asc">Wattage: low to high</option><option value="watts-desc">Wattage: high to low</option></>}
        </select>
      </div>
      {(active > 0 || query) && <button type="button" className={styles.clear} onClick={clearFilters}>Clear filters</button>}
      <ul className={styles.grid} ref={grid} data-testid={architecturalOnly ? "architectural-catalogue" : includeArchitecture ? "all-products-catalogue" : "infrastructure-catalogue"}>
        {visible.map(p => (
          <li key={p.key} className="catalogue-motion-item" data-catalogue-item={p.key}>
            <article className="media-card product-card">
              {p.image && <Link href={p.href} className="image-link" aria-label={"View " + p.name}>
                <CatalogueImage src={p.image.src} alt={p.image.alt} sizes="(max-width: 900px) 46vw, 31vw" />
              </Link>}
              <div className="card-body">
                <p className="label">{p.brand ? p.brand + " · " : ""}{p.categoryName}</p>
                <h3><Link href={p.href}>{p.name}</Link></h3>
                <p className={styles.description}>{p.description}</p>
                {p.reference && <p className={styles.note}>Reference image</p>}
                {p.credit && <p className={styles.note}><a href={p.credit.url}>{p.credit.label}</a>{p.credit.license && <> · <a href={p.credit.license}>Image license</a></>}</p>}
                <div className="card-actions">
                  <Link className="text-link" href={p.href}>View details <ArrowRight size={13} aria-hidden="true" /></Link>
                  <Link className="text-link" href={p.enquiry}>Enquire now <ArrowUpRight size={13} aria-hidden="true" /></Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <div className="empty-state"><p>No lighting results match. Try another search or clear the filters.</p></div>}
    </div>
  );
}
