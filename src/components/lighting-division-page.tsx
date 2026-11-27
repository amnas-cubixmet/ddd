import { ProductsBrowser } from "@/components/browse";
import { Action } from "@/components/ui";
import { catalogueCategories } from "@/lib/catalogue";
import { lightingDivisions, type LightingDivisionKey } from "@/lib/lighting-divisions";
import styles from "@/app/products/products.module.css";

export async function LightingDivisionPage({ division, searchParams }: { division: LightingDivisionKey; searchParams: Promise<{ category?: string | string[] }> }) {
  const info = lightingDivisions[division];
  const allowed: readonly string[] = info.categories;
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" && allowed.includes(category) ? category : "";
  const categories = catalogueCategories.filter(item => allowed.includes(item.slug));
  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      {categories.length > 0 ? <section id="division-catalogue" className={styles.catalogue} aria-labelledby="division-products">
        {division === "infrastructure" ? (
          <h1 id="division-products">Explore products</h1>
        ) : (
          <h2 id="division-products">Explore products</h2>
        )}
        <ProductsBrowser key={initialCategory} initialCategory={initialCategory} allowedCategories={allowed} />
      </section> : null}
      <section className={styles.quote}>
        <div>{categories.length === 0 ? <h1>Planning a lighting project?</h1> : <h2>Planning a lighting project?</h2>}<p>Contact our team to confirm available fixtures, specifications and suitable lighting for your space.</p></div>
        <Action href="/request-quote">Request a quote</Action>
      </section>
    </div>
  );
}
