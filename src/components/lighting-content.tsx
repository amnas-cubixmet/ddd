import Link from "next/link";
import type { ContentLink, ContentSection } from "@/lib/lighting-content";
import styles from "./lighting-content.module.css";

export function LightingSections({ sections }: { sections: ContentSection[] }) {
  return (
    <div className={styles.sections}>
      {sections.map(({ title, text, points }) => (
        <section className={styles.text} key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
          {points?.length ? <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
        </section>
      ))}
    </div>
  );
}

export function LightingLinks({ title, links }: { title: string; links: (ContentLink & { summary?: string })[] }) {
  return (
    <section className={styles.links}>
      <h2>{title}</h2>
      <ul className={styles.grid}>
        {links.map(({ name, href, summary }) => (
          <li key={href}>
            <Link href={href} prefetch={false}>{name}</Link>
            {summary && <p>{summary}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LightingFaq({ entries }: { entries: { question: string; answer: string }[] }) {
  return (
    <section className={styles.links}>
      <h2>Frequently asked questions</h2>
      <div className={styles.faq}>
        {entries.map(({ question, answer }) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
