import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Action } from "@/components/ui";
import { artwork } from "@/lib/catalogue";
import { brand, metadata as pageMetadata } from "@/lib/site";
import conferenceRoom from "../../../public/images/about-bharat-lums-conference.webp";
import styles from "./about.module.css";

const intro =
  "Bharat Lums offers LED lighting solutions for commercial, industrial and outdoor spaces.";

export const metadata = pageMetadata("About", "/about", intro);

const applications = [
  {
    name: "Commercial",
    description: "Lighting for offices, shops and shared interiors.",
    image: "commercial-troffer",
    category: "commercial-lighting",
  },
  {
    name: "Industrial",
    description: "Lighting for manufacturing, utility and storage spaces.",
    image: "high-bay",
    category: "led-industrial-lights",
  },
  {
    name: "Outdoor",
    description: "Lighting for paths, entrances and landscaped areas.",
    image: "outdoor-bollard",
    category: "outdoor-lighting",
  },
];

export default function AboutPage() {
  return (
    <div className={`shell ${styles.page}`}>
      <section className={styles.hero} aria-labelledby="about-title">
        <Reveal className={styles.heroCopy}>
          <p className="eyebrow">About Bharat Lums</p>
          <h1 id="about-title">Engineering brighter possibilities.</h1>
          <p className={styles.lead}>{intro}</p>
          <Action href="/products" diagonal>
            Explore products
          </Action>
        </Reveal>
        <figure className={styles.heroFigure}>
          <div className={styles.heroImage}>
            <Image
              src={conferenceRoom}
              alt="Suspended linear LED fixtures above a conference table"
              fill
              preload
              sizes="(max-width: 760px) 92vw, (max-width: 1450px) 50vw, 690px"
            />
          </div>
          <figcaption>Lighting application reference</figcaption>
        </figure>
      </section>

      <section
        className={styles.applications}
        aria-labelledby="applications-title"
      >
        <Reveal className={styles.sectionHeading}>
          <p className="eyebrow">Our lighting solutions</p>
          <h2 id="applications-title">Lighting by application.</h2>
        </Reveal>
        <div className={styles.applicationGrid}>
          {applications.map((item) => (
            <Reveal
              as="article"
              className={styles.applicationItem}
              key={item.category}
            >
              <Link
                className={styles.applicationCard}
                href={`/products?category=${item.category}`}
              >
                <div className={styles.applicationImage}>
                  <Image
                    src={artwork(`products/${item.image}`)}
                    alt=""
                    fill
                    sizes="(max-width: 650px) 92vw, (max-width: 1450px) 30vw, 430px"
                  />
                </div>
                <div className={styles.applicationCopy}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.approach} aria-labelledby="approach-title">
        <Reveal className={styles.sectionHeading}>
          <p className="eyebrow">Our approach</p>
          <h2 id="approach-title">Start with the space.</h2>
        </Reveal>
        <Reveal className={styles.approachCopy}>
          <p>
            Tell us how people use the space, what needs to be lit and where the
            fixtures can go. We can then help you explore lighting categories
            that fit your project.
          </p>
          <ol className={styles.steps}>
            {["Understand how the space is used", "Identify what needs to be lit", "Explore suitable lighting categories"].map((step, index) => (
              <li key={step}><span aria-hidden="true">0{index + 1}</span>{step}</li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className={styles.contact} aria-labelledby="about-contact">
        <div>
          <p className="eyebrow">{brand.tagline}</p>
          <h2 id="about-contact">Planning a lighting project?</h2>
          <p>
            Share your project location, quantities and lighting requirements.
          </p>
        </div>
        <Action href="/request-quote" diagonal>
          Request a quote
        </Action>
      </section>
    </div>
  );
}
