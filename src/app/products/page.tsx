import Image from "next/image";
import { ProductsBrowser } from "@/components/browse";
import { Action } from "@/components/ui";
import { findCollection } from "@/lib/catalogue";
import { fixtureOverviewPhotos } from "@/lib/fixture-photos";
import { metadata as pageMetadata } from "@/lib/site";
import styles from "./products.module.css";

const description =
  "Explore LED lighting for commercial, industrial and outdoor spaces.";

export const metadata = pageMetadata("Lighting Products", "/products", description);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const initialCategory = findCollection(category)?.slug ?? "";

  return (
    <div className={`shell ${styles.page}`}>
      <section className={styles.intro} aria-labelledby="products-title">
        <div>
          <p className="eyebrow">Product catalogue</p>
          <h1 id="products-title">LED lighting catalogue.</h1>
        </div>
        <p>{description}</p>
      </section>

      <section className={styles.catalogue} aria-label="Browse LED lighting">
        <ProductsBrowser key={initialCategory} initialCategory={initialCategory} />
      </section>

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
          <Action href="/request-quote" diagonal>
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
