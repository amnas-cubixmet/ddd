import Image from "next/image";
import Link from "next/link";
import { ProductsBrowser } from "@/components/browse";
import { Action } from "@/components/ui";
import { artwork, catalogueCategories } from "@/lib/catalogue";
import { lightingDivisions, type LightingDivisionKey } from "@/lib/lighting-divisions";
import styles from "@/app/products/products.module.css";
import divisionStyles from "./lighting-division-page.module.css";

export async function LightingDivisionPage({ division, searchParams }: { division: LightingDivisionKey; searchParams: Promise<{ category?: string | string[] }> }) {
  const info = lightingDivisions[division];
  const allowed: readonly string[] = info.categories;
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" && allowed.includes(category) ? category : "";
  const categories = catalogueCategories.filter(item => allowed.includes(item.slug));
  return (
    <div className={`shell ${styles.page}`}>
      <Link className="text-link" href="/products">← All lighting products</Link>
      <section className={divisionStyles.hero} aria-labelledby="division-title">
        <div>
          <p className="eyebrow">Bharat Lums lighting solutions</p>
          <h1 id="division-title">{info.title}</h1>
          <p>{info.description}</p>
          <div className={divisionStyles.tags}>{info.highlights.map(text => <span key={text}>{text}</span>)}</div>
          <Action href="/request-quote">Discuss your project</Action>
        </div>
        <div className={divisionStyles.heroImage} data-division={division}>
          <Image src={info.image} alt={info.alt} fill sizes="(max-width: 800px) 92vw, 45vw" priority />
        </div>
      </section>
      <section className={divisionStyles.families} aria-labelledby="division-families">
        <h2 id="division-families">Lighting categories</h2>
        <div className={divisionStyles.categoryGrid}>
          {categories.map(item => (
            <Link className={divisionStyles.categoryCard} key={item.slug} href={`${info.href}?category=${item.slug}#division-catalogue`}>
              <div className={divisionStyles.categoryImage}><Image src={artwork(item.image)} alt="" fill sizes="(max-width: 600px) 45vw, 23vw" loading="lazy" /></div>
              <h3>{item.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section id="division-catalogue" className={styles.catalogue} aria-labelledby="division-products">
        <h2 id="division-products">Explore products</h2>
        <ProductsBrowser key={initialCategory} initialCategory={initialCategory} allowedCategories={allowed} />
      </section>
      <section className={styles.quote}>
        <div><h2>Planning a lighting project?</h2><p>Contact our team to confirm available fixtures, specifications and suitable lighting for your space.</p></div>
        <Action href="/request-quote">Request a quote</Action>
      </section>
    </div>
  );
}
