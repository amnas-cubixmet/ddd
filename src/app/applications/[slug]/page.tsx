import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowRight, BookOpen, Layers, ExternalLink, CheckCircle2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { applicationImage } from "@/lib/application-images";
import { PageSchema } from "@/components/seo-data";
import { Action } from "@/components/ui";
import { applications } from "@/lib/lighting-content";
import { paths } from "@/lib/seo";
import styles from "./application-detail.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => applications.map(({ slug }) => ({ slug }));


export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = applications.find(item => item.slug === slug);
  return entry ? pageMetadata({ title: entry.title, path: paths.application(slug), summary: entry.summary, image: applicationImage(slug) }) : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = applications.find(item => item.slug === slug);
  if (!entry) notFound();
  const image = applicationImage(slug);
  const enquiry = `/contact?application=${entry.slug}`;
  return (
    <div className={styles.page}>
      <PageSchema title={entry.title} path={paths.application(slug)} summary={entry.summary}
        ancestors={[{ name: "LED lighting applications", href: paths.applications }]} />
      <section className={`shell ${styles.hero}`} aria-labelledby="application-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Lighting application</p>
          <h1 id="application-title">{entry.title}</h1>
          <p className={styles.lead}>{entry.summary}</p>
          <div className={styles.actions}>
            <Action href={enquiry}>Discuss your requirements</Action>
            <Link href="#planning" className={styles.secondary}>Planning guide <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className={`${styles.heroImage} ${image.fixture ? styles.fixture : ""}`}>
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 92vw, 45vw" preload />
        </div>
      </section>
      <section className={styles.planning} id="planning" aria-labelledby="planning-title">
        <div className="shell">
          <p className={styles.kicker}>Project planning</p>
          <h2 id="planning-title">Plan your lighting project</h2>
          <div className={styles.steps} data-testid="application-planning">
            {entry.sections.map((section, index) => (
              <section className={styles.step} key={section.title}>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
                {section.points?.length ? <ul>{section.points.map(point => <li key={point}><CheckCircle2 size={16} aria-hidden="true" /><span>{point}</span></li>)}</ul> : null}
              </section>
            ))}
          </div>
        </div>
      </section>
      <div className={`shell ${styles.lower}`}>
        <section aria-labelledby="related-title">
          <h2 id="related-title">Related lighting resources</h2>
          <div className={styles.links}>
            {entry.related.map(link => {
              const Icon = link.href.startsWith("/products") ? Layers : BookOpen;
              return <Link key={link.href} href={link.href} className={styles.resource}>
                <span className={styles.icon}><Icon size={21} aria-hidden="true" /></span>
                <span>{link.name}</span><ArrowUpRight size={17} aria-hidden="true" />
              </Link>;
            })}
          </div>
        </section>
        {entry.sources?.length ? (
          <section className={styles.references} aria-labelledby="references-title">
            <h2 id="references-title">Technical references</h2>
            <ul>{entry.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer"><span>{source.name}</span><ExternalLink size={15} aria-hidden="true" /></a></li>)}</ul>
          </section>
        ) : null}
        <section className={styles.enquiry} aria-labelledby="enquiry-title">
          <div><p className={styles.kicker}>Project enquiries</p><h2 id="enquiry-title">Have a lighting project in mind?</h2><p>Share your site layout, quantities and lighting requirements with our team.</p></div>
          <Action href={enquiry}>Discuss your lighting requirements</Action>
        </section>
        <Link href={paths.applications} className={styles.back}>← All lighting applications</Link>
      </div>
    </div>
  );
}
