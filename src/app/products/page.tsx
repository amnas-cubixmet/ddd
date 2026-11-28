import { ProductsBrowser } from "@/components/browse";
import { LightingDivisions } from "@/components/lighting-divisions";
import { findCollection, publishedProducts, isIndexableProduct } from "@/lib/catalogue";
import { pageMetadata, paths } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
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

    </div>
  );
}
