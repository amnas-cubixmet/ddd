import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BookOpen, ExternalLink, Layers, MessageCircle } from "lucide-react";
import { resourceMetadata } from "@/components/lighting-resource-page";
import { JsonLd, PageSchema } from "@/components/seo-data";
import { Action } from "@/components/ui";
import { guides, guidePublicationDate } from "@/lib/lighting-content";
import { absoluteUrl, paths } from "@/lib/seo";
import { brand } from "@/lib/site";
import styles from "./guide-detail.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => guides.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  return resourceMetadata("guides", (await params).slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = guides.find(item => item.slug === slug);
  if (!entry) notFound();
  const path = paths.guide(slug);
  const url = absoluteUrl(path);
  return (
    <div className={styles.page} data-testid="guide-detail">
      <PageSchema title={entry.title} path={path} summary={entry.summary} ancestors={[{ name: "LED lighting guides", href: paths.guides }]} />
      {url && <JsonLd data={{
        "@type": "Article", "@id": `${url}#article`, headline: entry.title,
        description: entry.summary, datePublished: guidePublicationDate, inLanguage: "en",
        mainEntityOfPage: { "@id": `${url}#page` }, image: absoluteUrl(entry.image?.src ?? "/opengraph-image"),
        author: { "@type": "Organization", name: brand.name, "@id": absoluteUrl("/#organization") },
        publisher: { "@id": absoluteUrl("/#organization") },
      }} />}
      <header className={`shell ${styles.hero} ${entry.image ? styles.withImage : ""}`}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Lighting guide</p>
          <h1>{entry.title}</h1>
          <p className={styles.lead}>{entry.summary}</p>
          <div className={styles.byline}><BookOpen size={16} aria-hidden="true" /><span>By Bharat Lums</span><span aria-hidden="true">·</span><time dateTime={guidePublicationDate}>28 November 2026</time></div>
        </div>
        {entry.image && <figure className={styles.figure}>
          <div className={styles.photo}><Image src={entry.image.src} alt={entry.image.alt} fill sizes="(max-width: 767px) 92vw, 38vw" preload /></div>
          <figcaption>{entry.image.alt}</figcaption>
        </figure>}
      </header>
      <div className={styles.band}>
        <div className={`shell ${styles.layout}`}>
          <article className={styles.article} aria-label={entry.title}>
            {entry.sections.map((section, index) => (
              <section key={section.title} className={styles.section} id={`topic-${index + 1}`}>
                <div className={styles.sectionHead}>
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h2>{section.title}</h2>
                </div>
                <p>{section.text}</p>
                {section.points?.length ? <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul> : null}
              </section>
            ))}
          </article>
          <aside className={styles.sidebar} aria-label="Guide resources">
            {entry.sources?.length ? <section className={styles.panel} aria-labelledby="technical-references-title">
              <h2 id="technical-references-title">Technical references</h2>
              <ul>{entry.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer"><span>{source.name}</span><ExternalLink size={15} aria-hidden="true" /></a></li>)}</ul>
            </section> : null}
            <section className={styles.panel} aria-labelledby="related-resources-title">
              <h2 id="related-resources-title">Related lighting resources</h2>
              <ul>{entry.related.map(link => {
                const Icon = link.href.startsWith("/products") ? Layers : BookOpen;
                return <li key={link.href}><Link href={link.href}><Icon size={19} aria-hidden="true" /><span>{link.name}</span><ArrowUpRight size={15} aria-hidden="true" /></Link></li>;
              })}</ul>
            </section>
            <section className={styles.enquiry} aria-labelledby="guide-enquiry-title">
              <MessageCircle size={24} aria-hidden="true" />
              <h2 id="guide-enquiry-title">Need help with your project?</h2>
              <p>Share your lighting requirements, site conditions and quantities with our team.</p>
              <Action href="/contact">Discuss your lighting requirements</Action>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
