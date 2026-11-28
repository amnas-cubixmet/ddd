import { ArchitecturalCards } from "./architectural-cards";
import { Action } from "@/components/ui";
import { architecturalProducts } from "@/lib/architectural-products";
import { lightingDivisions } from "@/lib/lighting-divisions";
import { pageMetadata, paths } from "@/lib/seo";
import { divisionContent } from "@/lib/category-content";
import { LightingFaq, LightingLinks, LightingSections } from "@/components/lighting-content";
import { PageSchema } from "@/components/seo-data";
import styles from "../products.module.css";
import catalogueStyles from "./architectural.module.css";

const division = lightingDivisions.architectural;
export const metadata = pageMetadata({ title: division.title, path: division.href, summary: division.description });

export default function Page() {
  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      <PageSchema title={division.title} path={division.href} summary={division.description}
        ancestors={[{ name: "Products", href: paths.products }]} />
      <section className={styles.intro}><h1>{division.title}</h1><p>{division.description}</p></section>
      <section className={styles.catalogue} aria-labelledby="architectural-products">
        <h2 id="architectural-products">Explore products</h2>
        <p className={catalogueStyles.notice}>Suggested catalogue. Contact our team to confirm availability and specifications. Product images are for reference only.</p>
        <ArchitecturalCards items={architecturalProducts} />
      </section>
      <LightingSections sections={divisionContent.architectural.sections} />
      <LightingFaq entries={divisionContent.architectural.faq} />
      <LightingLinks title="Related lighting applications" links={divisionContent.architectural.links} />
      <section className={styles.quote}>
        <div><h2>Planning a lighting project?</h2><p>Contact our team to confirm available fixtures, specifications and suitable lighting for your space.</p></div>
        <Action href="/contact">Request a quote</Action>
      </section>
    </div>
  );
}
