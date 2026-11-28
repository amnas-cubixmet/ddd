import Image from "next/image";
import { LightingLinks, LightingSections } from "@/components/lighting-content";
import { JsonLd, PageSchema } from "@/components/seo-data";
import { Action, PageIntro } from "@/components/ui";
import { applications, guides, guidePublicationDate } from "@/lib/lighting-content";
import { absoluteUrl, pageMetadata, paths } from "@/lib/seo";
import { brand } from "@/lib/site";
import styles from "./lighting-content.module.css";

const collections = {
  applications: {
    route: paths.application,
    path: paths.applications,
    title: "LED lighting applications",
    summary: "Explore lighting requirements for roads, factories, warehouses, parking areas, offices, showrooms and hospitality projects.",
    entries: applications,
  },
  guides: {
    route: paths.guide,
    path: paths.guides,
    title: "LED lighting guides",
    summary: "Practical guides to choosing LED street lights, flood lights and industrial high bays, reading ingress ratings and comparing lumens, watts and lux.",
    entries: guides,
  },
};

type Collection = keyof typeof collections;

export function resourceMetadata(kind: Collection, slug?: string) {
  const collection = collections[kind];
  if (!slug) return pageMetadata(collection);
  const entry = collection.entries.find((item) => item.slug === slug);
  if (!entry) return {};
  const article = kind === "guides" ? { publishedTime: guidePublicationDate } : undefined;
  return pageMetadata({ ...entry, path: collection.route(slug), article });
}

export function LightingResourceIndex({ kind }: { kind: Collection }) {
  const { title, summary, path, entries, route } = collections[kind];
  const items = entries.map((entry) => ({ name: entry.title, href: route(entry.slug), summary: entry.summary }));
  const relatedKind = kind === "guides" ? "applications" : "guides";
  return (
    <>
      <PageSchema title={title} summary={summary} path={path} items={items} />
      <PageIntro eyebrow={kind === "guides" ? "Knowledge centre" : "Project planning"} title={title} description={summary} />
      <div className="shell section-tight">
        <LightingLinks title={kind === "guides" ? "Technical guides" : "Explore by project type"} links={items} />
        <LightingLinks title="More from Bharat Lums" links={[
          { name: "LED lighting catalogue", href: paths.products },
          { name: collections[relatedKind].title, href: collections[relatedKind].path },
        ]} />
      </div>
    </>
  );
}

export function LightingResourcePage({ kind, entry }: { kind: Collection; entry: (typeof guides)[number] }) {
  const collection = collections[kind];
  const path = collection.route(entry.slug);
  const url = absoluteUrl(path);
  const guide = kind === "guides";
  return (
    <>
      <PageSchema title={entry.title} path={path} summary={entry.summary} ancestors={[{ name: collection.title, href: collection.path }]} />
      {guide && url && <JsonLd data={{
        "@type": "Article", "@id": `${url}#article`, headline: entry.title,
        description: entry.summary, datePublished: guidePublicationDate, inLanguage: "en",
        mainEntityOfPage: { "@id": `${url}#page` }, image: absoluteUrl(entry.image?.src ?? "/opengraph-image"),
        author: { "@type": "Organization", name: brand.name, "@id": absoluteUrl("/#organization") },
        publisher: { "@id": absoluteUrl("/#organization") },
      }} />}
      <PageIntro eyebrow={guide ? "Lighting guide" : "Lighting application"} title={entry.title} description={entry.summary} />
      <div className="shell section-tight">
        <article aria-label={entry.title}>
          {guide && <p>By Bharat Lums · <time dateTime={guidePublicationDate}>28 November 2026</time></p>}
          {entry.image && (
            <figure className={styles.guideFigure}>
              <Image src={entry.image.src} alt={entry.image.alt} width={1448} height={1086}
                sizes="(max-width: 700px) 92vw, 560px" />
              <figcaption>{entry.image.alt}</figcaption>
            </figure>
          )}
          <LightingSections sections={entry.sections} />
          {entry.sources?.length ? (
            <section className={styles.sources}>
              <h2>Technical references</h2>
              <ul>{entry.sources.map(({ name, href }) => <li key={href}><a href={href}>{name}</a></li>)}</ul>
            </section>
          ) : null}
        </article>
        <LightingLinks title="Related lighting resources" links={entry.related} />
        <Action href={guide ? "/contact" : `/contact?application=${entry.slug}`}>Discuss your lighting requirements</Action>
      </div>
    </>
  );
}
