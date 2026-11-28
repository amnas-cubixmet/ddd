import Image from "next/image";
import { ProductsBrowser } from "@/components/browse";
import { LightingDivisions } from "@/components/lighting-divisions";
import { Action } from "@/components/ui";
import { catalogueCategories, findCollection, publishedProducts, isIndexableProduct } from "@/lib/catalogue";
import { fixtureOverviewPhotos } from "@/lib/fixture-photos";
import { pageMetadata, paths } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import { LightingFaq, LightingLinks, LightingSections } from "@/components/lighting-content";
import { brand } from "@/lib/site";
import { catalogueFaq, catalogueSections } from "@/lib/product-editorial";
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
        items={publishedProducts.filter(isIndexableProduct).map(({ name, slug }) => ({ name, href: paths.product(slug) }))} />
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

      <LightingSections sections={catalogueSections} />
      <LightingLinks title="Plan your lighting project" links={[
        { name: "Lighting application guides", href: "/applications" },
        { name: "Technical lighting selection guides", href: "/lighting-guides" },
        { name: "About Bharat Lums", href: "/about" },
      ]} />
      <LightingFaq entries={catalogueFaq} />
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
          <a className="button button-outline" href={`https://wa.me/${brand.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Bharat Lums, I would like help selecting LED lighting for a project.")}`} target="_blank" rel="noopener noreferrer">WhatsApp enquiry</a>
        </div>
      </section>
    </div>
  );
}
