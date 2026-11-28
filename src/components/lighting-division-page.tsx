import { ProductsBrowser } from "@/components/browse";
import { Action } from "@/components/ui";
import { catalogueCategories } from "@/lib/catalogue";
import { lightingDivisions, type LightingDivisionKey } from "@/lib/lighting-divisions";
import styles from "@/app/products/products.module.css";
import { PageSchema } from "@/components/seo-data";
import { LightingFaq, LightingLinks, LightingSections } from "@/components/lighting-content";
import { divisionContent } from "@/lib/category-content";
import { paths } from "@/lib/seo";

export async function LightingDivisionPage({ division, searchParams }: { division: LightingDivisionKey; searchParams: Promise<{ category?: string | string[] }> }) {
  const info = lightingDivisions[division];
  const content = divisionContent[division];
  const allowed: readonly string[] = info.categories;
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" && allowed.includes(category) ? category : "";
  const categories = catalogueCategories.filter(item => allowed.includes(item.slug));
  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      <PageSchema title={info.title} path={info.href} summary={info.description}
        ancestors={[{ name: "Products", href: paths.products }]}
        items={categories.map(({ name, slug }) => ({ name, href: paths.category(slug) }))} />
      <section className={styles.intro}><h1>{info.title}</h1><p>{info.description}</p></section>
      <section id="division-catalogue" className={styles.catalogue} aria-labelledby="division-products">
        <h2 id="division-products">Explore products</h2>
        <ProductsBrowser key={initialCategory} initialCategory={initialCategory} allowedCategories={allowed} />
      </section>
      <LightingLinks title="Explore fixture categories" links={categories.map(({ name, slug }) => ({ name, href: paths.category(slug) }))} />
      <LightingSections sections={content.sections} />
      <LightingFaq entries={content.faq} />
      <LightingLinks title="Related lighting resources" links={content.links} />
      <section className={styles.quote}>
        <div><h2>Planning a lighting project?</h2><p>Contact our team to confirm available fixtures, specifications and suitable lighting for your space.</p></div>
        <Action href="/contact">Request a quote</Action>
      </section>
    </div>
  );
}
