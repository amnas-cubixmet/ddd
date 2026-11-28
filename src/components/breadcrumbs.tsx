"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./breadcrumbs.module.css";
import { findArchitecturalProduct } from "@/lib/catalogue";

type Category = { slug: string; name: string };
type Product = { slug: string; name: string; category?: string };
type Crumb = { name: string; href: string };

const infrastructure = "/products/infrastructure-lighting";
const architectural = "/products/architectural-lighting";
const staticPages: Record<string, string> = {
  "/about": "About",
  "/contact": "Contact",
  "/request-quote": "Request a quote",
};

export function Breadcrumbs({ categories, products, applications, guides }: {
  categories: Category[]; products: Product[]; applications: Category[]; guides: Category[];
}) {
  const path = usePathname();
  const params = useSearchParams();
  if (!path || path === "/") return null;
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }];
  const category = categories.find(item => item.slug === params.get("category"));
  const categoryHref = (slug: string, parent: string) =>
    `${parent}?category=${encodeURIComponent(slug)}${parent === infrastructure ? "#division-catalogue" : ""}`;

  const resource = [
    { href: "/applications", name: "LED lighting applications", entries: applications },
    { href: "/lighting-guides", name: "LED lighting guides", entries: guides },
  ].find(({ href }) => path === href || path.startsWith(`${href}/`));

  if (resource) {
    crumbs.push({ name: resource.name, href: resource.href });
    if (path !== resource.href) {
      const entry = resource.entries.find(({ slug }) => path === `${resource.href}/${slug}`);
      if (!entry) return null;
      crumbs.push({ name: entry.name, href: path });
    }
  } else if (staticPages[path]) {
    crumbs.push({ name: staticPages[path], href: path });
  } else if (path === "/products" || path.startsWith("/products/")) {
    crumbs.push({ name: "Products", href: "/products" });
    if (path === architectural || path.startsWith(`${architectural}/`)) {
      crumbs.push({ name: "Architectural & Commercial Lighting", href: architectural });
      if (path !== architectural) {
        const item = findArchitecturalProduct(path.slice(architectural.length + 1));
        if (!item) return null;
        crumbs.push({ name: item.name, href: path });
      }
    } else if (path === infrastructure) {
      crumbs.push({ name: "Outdoor & Infrastructure Lighting", href: infrastructure });
      if (category) crumbs.push({ name: category.name, href: categoryHref(category.slug, infrastructure) });
    } else if (path.startsWith("/products/categories/")) {
      const family = categories.find(({ slug }) => path === `/products/categories/${slug}`);
      if (!family) return null;
      crumbs.push({ name: "Outdoor & Infrastructure Lighting", href: infrastructure });
      crumbs.push({ name: family.name, href: path });
    } else if (path === "/products") {
      if (category) crumbs.push({ name: category.name, href: categoryHref(category.slug, path) });
    } else {
      const product = products.find(item => path === `/products/${item.slug}`);
      if (!product) return null;
      const family = categories.find(item => item.slug === product.category);
      crumbs.push({ name: "Outdoor & Infrastructure Lighting", href: infrastructure });
      if (family) crumbs.push({ name: family.name, href: `/products/categories/${family.slug}` });
      crumbs.push({ name: product.name, href: path });
    }
  } else {
    return null;
  }

  return (
    <nav className={`shell ${styles.nav}`} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className={styles.item}>
            {i > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
            {i === crumbs.length - 1 ? (
              <span className={styles.current} aria-current="page">{crumb.name}</span>
            ) : (
              <Link href={crumb.href}>{crumb.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
