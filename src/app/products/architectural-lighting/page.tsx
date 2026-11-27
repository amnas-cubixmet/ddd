import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      <section className={styles.intro} aria-labelledby="architectural-title">
        <h1 id="architectural-title">{division.title}</h1>
        <p>{division.description}</p>
      </section>
      <section className={catalogueStyles.catalogue} aria-labelledby="architectural-products">
        <div className={catalogueStyles.heading}>
          <h2 id="architectural-products">Recommended product list</h2>
          <p>{architecturalProducts.length} lighting types</p>
        </div>
        <p className={catalogueStyles.notice}>Suggested catalogue. Contact our team to confirm product availability, photographs and specifications.</p>
        <ul className={catalogueStyles.grid}>
          {architecturalProducts.map((item, index) => (
            <li key={item.slug} className={catalogueStyles.card}>
              <span className={catalogueStyles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.name}</h3>
              <p>{item.application}</p>
              <Link className={catalogueStyles.enquiry} href={`/request-quote?architectural=${item.slug}`}>
                Enquire now <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.quote}>
        <div><h2>Planning a lighting project?</h2><p>Contact our team to confirm available fixtures and suitable lighting for your space.</p></div>
        <Action href="/request-quote">Request a quote</Action>
      </section>
    </div>
  );
}
