import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { lightingDivisions } from "@/lib/lighting-divisions";
import styles from "./lighting-divisions.module.css";

export function LightingDivisions() {
  return (
    <section className={styles.section} aria-labelledby="lighting-divisions-title">
      <p className="eyebrow">Lighting solutions</p>
      <h2 id="lighting-divisions-title">Lighting for every scale.</h2>
      <div className={styles.grid}>
        {Object.values(lightingDivisions).map((division) => (
          <Link key={division.href} href={division.href} className={styles.card}>
            <div className={styles.image}>
              <Image src={division.image} alt={division.alt} fill sizes="(max-width: 700px) 92vw, 45vw" loading="lazy" />
            </div>
            <div className={styles.copy}>
              <h3>{division.title}</h3>
              <p>{division.description}</p>
              <span className={styles.link}>Explore lighting <ArrowUpRight size={18} aria-hidden="true" /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
