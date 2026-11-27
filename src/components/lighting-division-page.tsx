import { LightingCategoryGrid } from "./lighting-category-grid";
import { DivisionImage } from "./division-image";
import { ProductsBrowser } from "@/components/browse";
import { Action } from "@/components/ui";
import { catalogueCategories } from "@/lib/catalogue";
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
      {division === "architectural" && (
        <>
          <section className={divisionStyles.hero} aria-labelledby="division-title">
            <div>
              <p className="eyebrow">Bharat Lums lighting solutions</p>
              <h1 id="division-title">{info.title}</h1>
              <p>{info.description}</p>
              <div className={divisionStyles.tags}>{info.highlights.map(text => <span key={text}>{text}</span>)}</div>
              <Action href="/request-quote">Discuss your project</Action>
            </div>
            <div className={divisionStyles.heroImage} data-division={division}>
              <DivisionImage src={info.image} fallbackSrc={info.fallbackImage} alt={info.alt} sizes="(max-width: 800px) 92vw, 45vw" priority />
            </div>
          </section>
          <LightingCategoryGrid href={info.href} allowedCategories={allowed} />
        </>
      )}
      {categories.length > 0 ? <section id="division-catalogue" className={styles.catalogue} aria-labelledby="division-products">
        {division === "infrastructure" ? (
          <h1 id="division-products">Explore products</h1>
        ) : (
          <h2 id="division-products">Explore products</h2>
        )}
        <ProductsBrowser key={initialCategory} initialCategory={initialCategory} allowedCategories={allowed} />
      </section> : <section className={styles.catalogue} aria-label="Architectural lighting enquiries"><p>Contact our team for available architectural and commercial lighting options.</p></section>}
      <section className={styles.quote}>
        <div><h2>Planning a lighting project?</h2><p>Contact our team to confirm available fixtures, specifications and suitable lighting for your space.</p></div>
        <Action href="/request-quote">Request a quote</Action>
      </section>
    </div>
  );
}
