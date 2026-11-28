import Image from "next/image";
import { Reveal } from "@/components/motion";
import { CompanyValues } from "@/components/company-values";
import { GlobalPresenceSection } from "@/components/global-presence/global-presence";
import { Action } from "@/components/ui";
import { brand } from "@/lib/site";
import { pageMetadata, paths } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import { LightingLinks, LightingSections } from "@/components/lighting-content";
import conferenceRoom from "../../../public/images/about-bharat-lums-conference.webp";
import styles from "./about.module.css";

const intro =
  "Meet Bharat Lums and learn how to brief an LED lighting enquiry for commercial interiors, industrial sites and outdoor infrastructure.";

export const metadata = pageMetadata({ title: "About Our Lighting Approach", path: "/about", summary: intro });

export default function AboutPage() {
  return (
    <>
    <PageSchema title="About" path="/about" summary={intro} />
    <div className={`shell ${styles.page}`}>
      <section className={styles.hero} aria-labelledby="about-title">
        <Reveal className={styles.heroCopy}>
          <p className="eyebrow">About Bharat Lums</p>
          <h1 id="about-title">About Bharat Lums</h1>
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

      <LightingSections sections={[
        { title: "What the catalogue covers", text: "The infrastructure catalogue includes photographed street lights, flood lights and industrial fixture designs. The architectural collection illustrates common lighting types for commercial interiors. Model-specific labels and reference imagery are identified in the catalogue." },
        { title: "What to send with a project enquiry", text: "Tell us the application, site dimensions, mounting heights and quantities. Include any required datasheet, optic, environmental rating or control compatibility. These details help us discuss the appropriate fixture type and confirm the model information for your project." },
      ]} />
      <LightingLinks title="Explore the catalogue and project resources" links={[
        { name: "Outdoor and infrastructure lighting", href: paths.infrastructure },
        { name: "Architectural and commercial lighting", href: paths.architecture },
        { name: "Lighting applications", href: paths.applications },
      ]} />
    </div>
    <CompanyValues page="about" />
    <GlobalPresenceSection />
    <div className={`shell ${styles.page}`} style={{ paddingTop: "clamp(24px, 4vw, 48px)" }}>
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
    </>
  );
}
