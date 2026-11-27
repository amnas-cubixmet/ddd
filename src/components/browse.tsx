"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  catalogueCategories,
  findCollection,
  publishedProducts,
} from "@/lib/catalogue";
import { ProductCard } from "./ui";

const catalogueWattages = [
  ...new Set(
    publishedProducts.flatMap((product) => product.wattages ?? []),
  ),
].sort((a, b) => a - b);

export function ProductsBrowser({ initialCategory, allowedCategories }: { initialCategory: string; allowedCategories?: readonly string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [wattage, setWattage] = useState("");
  const [sort, setSort] = useState("featured");
  const search = query.trim().toLowerCase();
  const hasFilters = Boolean(query || category || wattage);

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    const url = new URL(window.location.href);
    if (nextCategory) url.searchParams.set("category", nextCategory);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
  }

  function clearFilters() {
    setQuery("");
    changeCategory("");
    setWattage("");
  }

  const scope = publishedProducts;
  const scopedProducts = scope.filter(item => !allowedCategories || item.categories.some(slug => allowedCategories.includes(slug)));
  const categories = catalogueCategories.filter(item => !allowedCategories || allowedCategories.includes(item.slug));
  const wattages = allowedCategories ? catalogueWattages.filter(watts => scopedProducts.some(item => item.wattages?.includes(watts))) : catalogueWattages;
  const visible = scopedProducts.filter(
    (item) =>
      (!category || item.categories.includes(category)) &&
      (!wattage || item.wattages?.includes(Number(wattage))) &&
      `${item.name} ${item.description} ${item.categories.map((slug) => findCollection(slug)?.name).join(" ")}`
        .toLowerCase()
        .includes(search),
  );
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <div
        className={
          wattages.length
            ? "filters catalogue-filters-with-wattage"
            : "filters"
        }
      >
        <label className="catalogue-search">
          <span>Search products</span>
          <span className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. street lights"
            />
          </span>
        </label>
        <label>
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => changeCategory(event.target.value)}
          >
            <option value="">All categories</option>
            <optgroup label="LED lighting categories">
              {categories.map((item) => (
                <option value={item.slug} key={item.slug}>
                  {item.name}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        {wattages.length > 0 && (
          <label>
            <span>Wattage on label</span>
            <select
              value={wattage}
              onChange={(event) => setWattage(event.target.value)}
            >
              <option value="">All wattages</option>
              {wattages.map((watts) => (
                <option key={watts} value={watts}>
                  {watts} W
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured first</option>
            <option value="name">Name · A to Z</option>
          </select>
        </label>
      </div>
      <div className="catalogue-results">
        <p className="results-count" role="status">
          {`${visible.length} ${visible.length === 1 ? "fixture" : "fixtures"}`}
        </p>
        {hasFilters && (
          <button type="button" className="text-link" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>
      {visible.length > 0 && (
        <div className="card-grid catalogue-grid-transition" key={category}>
          {visible.map((item) => (
            <ProductCard
              item={item}
              key={item.slug}
            />
          ))}
        </div>
      )}
      {visible.length === 0 && (
        <div className="empty-state">
          <p>No lighting results match. Try another search or clear the filters.</p>
        </div>
      )}
    </>
  );
}
