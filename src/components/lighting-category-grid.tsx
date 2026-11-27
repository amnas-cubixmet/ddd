import Image from "next/image";
import Link from "next/link";
import { artwork, catalogueCategories } from "@/lib/catalogue";
import styles from "./lighting-division-page.module.css";

export function LightingCategoryGrid({ href, allowedCategories, home = false }: {
  href: string;
  allowedCategories: readonly string[];
  home?: boolean;
}) {
  const categories = catalogueCategories.filter(item => allowedCategories.includes(item.slug));
  if (categories.length === 0) return null;
  return (
    <section className={styles.families} aria-labelledby="division-families" data-home={home || undefined}>
      <h2 id="division-families">Lighting categories</h2>
      <div className={styles.categoryGrid}>
        {categories.map(item => (
          <Link className={styles.categoryCard} key={item.slug} href={`${href}?category=${item.slug}#division-catalogue`}>
            <div className={styles.categoryImage}>
              <Image src={artwork(item.image)} alt="" fill sizes="(max-width: 600px) 45vw, (max-width: 800px) 30vw, 23vw" loading="lazy" />
            </div>
            <h3>{item.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
