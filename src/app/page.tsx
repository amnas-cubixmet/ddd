import Image from "next/image";
import { Crosshair, Handshake, Lightbulb } from "lucide-react";
import { Action } from "@/components/ui";
import { GlobalPresenceSection } from "@/components/global-presence/global-presence";
import { HomeHero } from "@/components/home-hero";
import { LightingDivisions } from "@/components/lighting-divisions";
import { CatalogueSlider } from "@/components/home/catalogue-slider";
import { lightingDivisions } from "@/lib/lighting-divisions";
import { HomeEnquiry } from "@/components/home-enquiry";
import { HomeFaq } from "@/components/home/faq";
import styles from "@/components/home/home.module.css";
import { Reveal } from "@/components/motion";
import conferenceRoom from "../../public/images/about-bharat-lums-conference.webp";
import { artwork, catalogueCategories, catalogueDownload } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata(
    "LED Lighting",
    "/",
    "Bharat Lums LED lighting solutions for commercial, industrial and outdoor environments.",
  ),
  title: { absolute: "Bharat Lums | Powering a Brighter Tomorrow" },
};

const slides = catalogueCategories.map((category) => ({
  ...category,
  image: artwork(category.image),
  href: `${lightingDivisions.infrastructure.href}?category=${category.slug}#division-catalogue`,
}));

export default function Home() {
  return (
    <>
      <HomeHero catalogue={catalogueDownload} />
      <div className="shell"><LightingDivisions /></div>
      <div className={styles.catalogueBand}>
        <CatalogueSlider slides={slides} />
      </div>
      <section className={styles.about} aria-labelledby="home-about">
        <Reveal className={`shell ${styles.aboutInner}`}>
          <div className={styles.aboutCopy}>
            <p className={styles.sectionKicker}>About Bharat Lums</p>
            <h2 id="home-about">Engineering brighter possibilities.</h2>
            <p>
              Bharat Lums takes a practical approach to LED lighting. Tell us
              how your space is used, what needs to be lit and where the
              fixtures will go so we can help you explore the options.
            </p>
            <Action href="/about">About Bharat Lums</Action>
          </div>
          <div className={styles.aboutArt}>
            <Image
              src={conferenceRoom}
              alt="Lighting application reference showing suspended linear LED fixtures above a conference table"
              loading="lazy"
              sizes="(max-width: 650px) 92vw, (max-width: 1450px) 41vw, 570px"
            />
          </div>
        </Reveal>
      </section>

      <section className={styles.mission} aria-label="Mission and vision">
        <div className="shell">
          <div>
            <h2>Our mission</h2>
            <p>To manufacture reliable, high-quality LED lighting in India, built with precision and delivered with honesty.</p>
          </div>
          <div>
            <h2>Our vision</h2>
            <p>To bring Indian manufacturing excellence to international markets and illuminate the world, one point of light at a time.</p>
          </div>
        </div>
      </section>

      <section className={styles.strengths} aria-labelledby="home-strengths">
        <div className="shell">
          <h2 id="home-strengths">Built in India, designed to serve wider markets.</h2>
          <ul>
            <li>
              <span className={styles.strengthIcon} aria-hidden="true">
                <Crosshair size={23} strokeWidth={1.7} />
              </span>
              <h3>Precision and craftsmanship</h3>
              <p>Our manufacturing approach puts care and attention to detail into LED lighting for real spaces.</p>
            </li>
            <li>
              <span className={styles.strengthIcon} aria-hidden="true">
                <Lightbulb size={23} strokeWidth={1.7} />
              </span>
              <h3>Reliable LED lighting</h3>
              <p>We develop lighting for commercial, industrial and outdoor applications, with reliability as a design priority.</p>
            </li>
            <li>
              <span className={styles.strengthIcon} aria-hidden="true">
                <Handshake size={23} strokeWidth={1.7} />
              </span>
              <h3>Cooperation and shared purpose</h3>
              <p>We work with customers and partners to understand the application and select suitable lighting.</p>
            </li>
          </ul>
        </div>
      </section>

      <GlobalPresenceSection />

      <HomeFaq catalogue={catalogueDownload} />
      <div className={styles.enquiryBand}><HomeEnquiry /></div>
    </>
  );
}
