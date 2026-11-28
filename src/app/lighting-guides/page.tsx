import Link from "next/link";
import { ArrowUpRight, ArrowRight, BookOpen, Route, Lightbulb, Factory, Gauge, ShieldCheck, Layers, Compass } from "lucide-react";
import { resourceMetadata } from "@/components/lighting-resource-page";
import { PageSchema } from "@/components/seo-data";
import { PageIntro } from "@/components/ui";
import { guides } from "@/lib/lighting-content";
import { paths } from "@/lib/seo";
import styles from "./guides.module.css";

export const metadata = resourceMetadata("guides");
const title = "LED lighting guides";
const summary = "Practical guides to choosing LED street lights, flood lights and industrial high bays, reading ingress ratings and comparing lumens, watts and lux.";

const topics = {
  "led-street-light-guide": { icon: Route, label: "Street lighting" },
  "choose-led-flood-lights": { icon: Lightbulb, label: "Outdoor lighting" },
  "led-high-bay-lighting-guide": { icon: Factory, label: "Industrial lighting" },
  "lumens-watts-lux": { icon: Gauge, label: "Lighting fundamentals" },
  "ip65-ip66-lighting": { icon: ShieldCheck, label: "Fixture protection" },
};

const resources = [
  { name: "LED lighting catalogue", text: "Explore our lighting fixtures and product information.", href: paths.products, icon: Layers },
  { name: "LED lighting applications", text: "Find lighting solutions for your project environment.", href: paths.applications, icon: Compass },
];

export default function Page() {
  return (
    <div className={styles.guideIndex} data-testid="lighting-guide-index">
      <PageSchema title={title} summary={summary} path={paths.guides}
        items={guides.map(entry => ({ name: entry.title, href: paths.guide(entry.slug), summary: entry.summary }))} />
      <PageIntro eyebrow="Knowledge centre" title={title} description={summary} />
      <section className={styles.band} aria-labelledby="technical-guides-title">
        <div className="shell">
          <h2 id="technical-guides-title">Technical guides</h2>
          <ul className={styles.grid}>
            {guides.map(entry => {
              const topic = topics[entry.slug as keyof typeof topics] ?? { icon: BookOpen, label: "Lighting guide" };
              const Icon = topic.icon;
              return (
                <li key={entry.slug}>
                  <Link href={paths.guide(entry.slug)} className={styles.card} prefetch={false}>
                    <div className={styles.cardTop}>
                      <span className={styles.icon}><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </div>
                    <span className={styles.topic}>{topic.label}</span>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <span className={styles.read}>Read guide <ArrowRight size={15} aria-hidden="true" /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className={`shell ${styles.resources}`} aria-labelledby="guide-resources-title">
        <h2 id="guide-resources-title">More from Bharat Lums</h2>
        <div className={styles.resourceGrid}>
          {resources.map(({ name, text, href, icon: Icon }) => (
            <Link href={href} key={href} className={styles.resource}>
              <span className={styles.icon}><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
              <div><h3>{name}</h3><p>{text}</p></div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
