import Image from "next/image";
import { ProductsBrowser } from "@/components/browse";
import { LightingDivisions } from "@/components/lighting-divisions";
import { Action } from "@/components/ui";
import { catalogueCategories, findCollection } from "@/lib/catalogue";
import { fixtureOverviewPhotos } from "@/lib/fixture-photos";
import { pageMetadata, paths } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import { LightingLinks } from "@/components/lighting-content";
import { lightingDivisions } from "@/lib/lighting-divisions";
import styles from "./products.module.css";

const description =
  "Browse LED lighting products for infrastructure, commercial interiors and industrial sites. Compare fixture types, photographed models and enquiry options.";

export const metadata = pageMetadata({ title: "LED Lighting Products and Catalogue", path: paths.products, summary: description });

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const initialCategory = category === "architectural" ? category : findCollection(category)?.slug ?? "";

  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      <PageSchema title="Products" path={paths.products} summary={description}
        items={Object.values(lightingDivisions).map(({ title, href }) => ({ name: title, href }))} />
      <section className={styles.intro} aria-labelledby="products-title">
        <div>
          <p className="eyebrow">Product catalogue</p>
          <h1 id="products-title">All LED lighting</h1>
        </div>
        <p>{description}</p>
      </section>

      <section className={styles.catalogue} aria-label="Browse LED lighting">
        <ProductsBrowser key={initialCategory} initialCategory={initialCategory} includeArchitecture />
      </section>

      <div className={styles.divisions}><LightingDivisions /></div>
      <LightingLinks title="Browse by fixture type" links={catalogueCategories.map(({ name, slug }) => ({
        name, href: paths.category(slug),
      }))} />
      <details className={styles.overview}>
        <summary>More fixture photos</summary>
        <div className={styles.overviewGrid}>
          {fixtureOverviewPhotos.map((src, index) => (
            <div className={styles.overviewPhoto} key={src}>
              <Image
                src={src}
                alt={`Lighting fixture overview, photo ${index + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 540px) 46vw, (max-width: 900px) 29vw, 22vw"
              />
            </div>
          ))}
        </div>
      </details>

      <section className={styles.quote} aria-labelledby="products-quote">
        <div>
          <h2 id="products-quote">Need help choosing?</h2>
          <p>Tell us what you need to light. We can help you compare fixtures and confirm availability and specifications.</p>
        </div>
        <div className={styles.quoteActions}>
          <Action href="/contact" diagonal>
            Request a quote
          </Action>
          <Action href="/contact" secondary>
            Contact our team
          </Action>
        </div>
      </section>
    </div>
  );
}
