import { ArchitecturalCards } from "./architectural-cards";
import { Action } from "@/components/ui";
import { architecturalProducts } from "@/lib/architectural-products";
import { lightingDivisions } from "@/lib/lighting-divisions";
import { metadata as pageMetadata } from "@/lib/site";
import styles from "../products.module.css";
import catalogueStyles from "./architectural.module.css";

const division = lightingDivisions.architectural;
export const metadata = pageMetadata(division.title, division.href, division.description);

export default function Page() {
  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      <section className={catalogueStyles.catalogue} aria-labelledby="architectural-products">
        <div className={catalogueStyles.heading}>
          <h1 id="architectural-products">Recommended product list</h1>
          <p>{architecturalProducts.length} lighting types</p>
        </div>
        <p className={catalogueStyles.notice}>Suggested catalogue. Contact our team to confirm availability and specifications. Product images are for reference only.</p>
        <ArchitecturalCards items={architecturalProducts} />
      </section>
      <section className={styles.quote}>
        <div><h2>Planning a lighting project?</h2><p>Contact our team to confirm available fixtures and suitable lighting for your space.</p></div>
        <Action href="/request-quote">Request a quote</Action>
      </section>
    </div>
  );
}
