"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "../motion";
import { getFaqEntries } from "@/lib/faq";
import styles from "./home.module.css";

export function HomeFaq({ catalogue }: { catalogue?: string }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const entries = getFaqEntries(catalogue);

  return (
    <section className={styles.faq} id="faq" aria-labelledby="faq-heading">
      <Reveal className={`shell ${styles.faqInner}`}>
        <h2 id="faq-heading">FAQ</h2>
        <div>
          {entries.map(({ question, answer }, index) => (
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
                  <p>
                    {answer.map((part) =>
                      typeof part === "string" ? part : part.download ? (
                        <a key={part.href} href={part.href} download>{part.label}</a>
                      ) : part.href.startsWith("/") ? (
                        <Link key={part.href} href={part.href}>{part.label}</Link>
                      ) : (
                        <a key={part.href} href={part.href}>{part.label}</a>
                      ),
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
