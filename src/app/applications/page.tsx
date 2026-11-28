import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Route, Warehouse, Factory, Building2, ShoppingBag, Hotel, CarFront, Layers, BookOpen } from "lucide-react";
import { resourceMetadata } from "@/components/lighting-resource-page";
import { PageSchema } from "@/components/seo-data";
import { applications } from "@/lib/lighting-content";
import { paths } from "@/lib/seo";
import styles from "./applications.module.css";

export const metadata = resourceMetadata("applications");

const title = "LED lighting applications";
const summary = "Explore lighting requirements for roads, factories, warehouses, parking areas, offices, showrooms and hospitality projects.";
const icons = {
  "road-and-highway-lighting": Route,
  "warehouse-lighting": Warehouse,
  "factory-lighting": Factory,
  "office-lighting": Building2,
  "retail-lighting": ShoppingBag,
  "parking-area-lighting": CarFront,
  "hospitality-lighting": Hotel,
};
const resources = [
  { name: "LED lighting catalogue", text: "Explore fixtures and compare product information.", href: paths.products, icon: Layers },
  { name: "LED lighting guides", text: "Understand light output, optics and fixture selection.", href: paths.guides, icon: BookOpen },
];

export default function Page() {
  return (
    <div className={styles.page}>
      <PageSchema title={title} summary={summary} path={paths.applications}
        items={applications.map(entry => ({ name: entry.title, href: paths.application(entry.slug), summary: entry.summary }))} />
      <section className={`shell ${styles.hero}`} aria-labelledby="applications-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Project planning</p>
          <h1 id="applications-title">{title}</h1>
          <p className={styles.lead}>{summary}</p>
          <a className={styles.primary} href="#project-types">Explore applications <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <div className={styles.heroImage}>
          <Image src="/images/lighting-by-application.webp" alt="Illustrative exterior lighting at an industrial and commercial building" fill sizes="(max-width: 767px) 92vw, 48vw" preload />
        </div>
      </section>
      <section className={styles.band} id="project-types" aria-labelledby="project-types-title">
        <div className="shell">
          <p className={styles.kicker}>Solutions by sector</p>
          <h2 id="project-types-title">Explore by project type</h2>
          <ul className={styles.grid} data-testid="application-grid">
            {applications.map(entry => {
              const Icon = icons[entry.slug as keyof typeof icons] ?? Layers;
              return (
                <li key={entry.slug}>
                  <Link href={paths.application(entry.slug)} className={styles.applicationCard}>
                    <div className={styles.cardTop}><span className={styles.icon}><Icon size={24} strokeWidth={1.65} aria-hidden="true" /></span><ArrowUpRight size={17} aria-hidden="true" /></div>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <span className={styles.cardLink}>Explore application <ArrowUpRight size={14} aria-hidden="true" /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className={`shell ${styles.resources}`} aria-labelledby="resources-title">
        <h2 id="resources-title">More from Bharat Lums</h2>
        <div className={styles.resourceGrid}>
          {resources.map(({ name, text, href, icon: Icon }) => (
            <Link key={href} href={href} className={styles.resourceCard}>
              <span className={styles.icon}><Icon size={23} strokeWidth={1.65} aria-hidden="true" /></span>
              <div><h3>{name}</h3><p>{text}</p></div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
