"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./breadcrumbs.module.css";

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

export function Breadcrumbs({ categories, products }: { categories: Category[]; products: Product[] }) {
  const path = usePathname();
  const params = useSearchParams();
  if (!path || path === "/") return null;
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }];
  const category = categories.find(item => item.slug === params.get("category"));
  const categoryHref = (slug: string, parent: string) =>
    `${parent}?category=${encodeURIComponent(slug)}${parent === infrastructure ? "#division-catalogue" : ""}`;

  if (staticPages[path]) {
    crumbs.push({ name: staticPages[path], href: path });
  } else if (path === "/products" || path.startsWith("/products/")) {
    crumbs.push({ name: "Products", href: "/products" });
    if (path === architectural) {
      crumbs.push({ name: "Architectural & Commercial Lighting", href: architectural });
    } else if (path === infrastructure) {
      crumbs.push({ name: "Outdoor & Infrastructure Lighting", href: infrastructure });
      if (category) crumbs.push({ name: category.name, href: categoryHref(category.slug, infrastructure) });
    } else if (path === "/products") {
      if (category) crumbs.push({ name: category.name, href: categoryHref(category.slug, path) });
    } else {
      const product = products.find(item => path === `/products/${item.slug}`);
      if (!product) return null;
      const family = categories.find(item => item.slug === product.category);
      crumbs.push({ name: "Outdoor & Infrastructure Lighting", href: infrastructure });
      if (family) crumbs.push({ name: family.name, href: categoryHref(family.slug, infrastructure) });
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
