import Link from "next/link";
import Image from "next/image";
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
      <section className={catalogueStyles.catalogue} aria-labelledby="architectural-products">
        <div className={catalogueStyles.heading}>
          <h1 id="architectural-products">Recommended product list</h1>
          <p>{architecturalProducts.length} lighting types</p>
        </div>
        <p className={catalogueStyles.notice}>Suggested catalogue. Contact our team to confirm availability and specifications. Product images are for reference only.</p>
        <ul className={catalogueStyles.grid} data-testid="architectural-catalogue">
          {architecturalProducts.map((item) => (
            <li key={item.slug} className={catalogueStyles.card}>
              {item.image && (
                <div className={catalogueStyles.image}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 380px) 100vw, (max-width: 760px) 50vw, (max-width: 1000px) 33vw, 25vw"
                    loading="lazy"
                  />
                </div>
              )}
              <div className={catalogueStyles.content}>
                <ArrowUpRight className={catalogueStyles.arrow} size={18} aria-hidden="true" />
                <h3>{item.name}</h3>
                <p>{item.application}</p>
                {item.image && (!item.image.sourceUrl.startsWith("/images/") || item.image.licenseUrl) && (
                  <p className={catalogueStyles.credit}>
                    <a href={item.image.sourceUrl}>{item.image.credit}</a>
                    {item.image.licenseUrl && <> · <a href={item.image.licenseUrl}>Image license</a></>}
                  </p>
                )}
                <Link className={catalogueStyles.enquiry} href={`/request-quote?architectural=${item.slug}`}>
                  Enquire now <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
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
