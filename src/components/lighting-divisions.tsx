import { DivisionImage } from "./division-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { lightingDivisions } from "@/lib/lighting-divisions";
import styles from "./lighting-divisions.module.css";

export function LightingDivisions() {
  return (
    <section className={styles.section} aria-labelledby="lighting-divisions-title">
      <h2 id="lighting-divisions-title">Lighting for every scale.</h2>
      <div className={styles.grid}>
        {Object.entries(lightingDivisions).map(([key, division]) => (
          <Link key={division.href} href={division.href} className={styles.card} data-division={key}>
            <div className={styles.image}>
              <DivisionImage src={division.image} fallbackSrc={division.fallbackImage} alt={division.alt} sizes="(max-width: 700px) 92vw, 42vw" />
            </div>
            <div className={styles.copy}>
              <h3>{division.title}</h3>
              <p>{division.description}</p>
              <div className={styles.tags}>{division.highlights.map(text => <span key={text}>{text}</span>)}</div>
              <span className={styles.link}>Explore collection <span className={styles.arrow}><ArrowUpRight size={19} aria-hidden="true" /></span></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
