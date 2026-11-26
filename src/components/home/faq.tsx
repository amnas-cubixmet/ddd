"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "../motion";
import { brand } from "@/lib/site";
import styles from "./home.module.css";

export function HomeFaq({ catalogue }: { catalogue?: string }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const entries = [
    [
      "What types of LED lighting can I enquire about?",
      <>
        Explore lighting applications for roads, outdoor sites, warehouses,
        commercial buildings and offices in our{" "}
        <Link href="/products">product catalogue</Link>. Our team can
        confirm which fixtures suit your project.
      </>,
    ],
    [
      "How can I request a quotation?",
      <>
        Use our <Link href="/request-quote">quote form</Link> and include the
        application, location and quantities you have in mind.
      </>,
    ],
    [
      "Can I download the product catalogue?",
      catalogue ? (
        <>
          Yes.{" "}
          <a href={catalogue} download>
            Download the product catalogue
          </a>
          .
        </>
      ) : (
        <>
          You can{" "}
          <Link href="/request-quote?catalogue=1">request a catalogue</Link>{" "}
          from our team. There is currently no public download.
        </>
      ),
    ],
    [
      "How can I contact the Bharat Lums team?",
      <>
        Call <a href={brand.phoneHref}>{brand.phone}</a>, email{" "}
        <a href={`mailto:${brand.email}`}>{brand.email}</a> or use the{" "}
        <Link href="/contact">contact form</Link>.
      </>,
    ],
    [
      "Where can I find technical specifications?",
      <>
        Verified specifications appear on individual product pages when
        available. For a specific project,{" "}
        <Link href="/request-quote">ask the team</Link> for model and technical
        details.
      </>,
    ],
  ] as const;

  return (
    <section className={styles.faq} id="faq" aria-labelledby="faq-heading">
      <Reveal className={`shell ${styles.faqInner}`}>
        <h2 id="faq-heading">FAQ</h2>
        <div>
          {entries.map(([question, answer], index) => (
            <div className={styles.faqRow} key={question}>
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  {question}
                  <Plus size={22} aria-hidden="true" />
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                className={styles.faqAnswer}
                data-open={expanded === index}
                inert={expanded !== index}
              >
                <div>
                  <p>{answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
