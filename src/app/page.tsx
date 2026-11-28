import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Route, Warehouse, Factory, Building2, Store, CarFront, Hotel } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CompanyValues } from "@/components/company-values";
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
import { description, pageMetadata, paths } from "@/lib/seo";
import { LightingLinks, LightingSections } from "@/components/lighting-content";
import { PageSchema } from "@/components/seo-data";
import { applications, guides } from "@/lib/lighting-content";

const homeTitle = "Professional LED Lighting Solutions";
export const metadata = pageMetadata({ title: homeTitle, path: "/", summary: description, home: true });

const slides = catalogueCategories.map((category) => ({
  ...category,
  image: artwork(category.image),
  href: `${lightingDivisions.infrastructure.href}?category=${category.slug}#division-catalogue`,
}));

const applicationIcons: Record<string, LucideIcon> = {
  "road-and-highway-lighting": Route,
  "warehouse-lighting": Warehouse,
  "factory-lighting": Factory,
  "office-lighting": Building2,
  "retail-lighting": Store,
  "parking-area-lighting": CarFront,
  "hospitality-lighting": Hotel,
};

export default function Home() {
  return (
    <>
      <PageSchema title={homeTitle} path="/" summary={description} />
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
              Bharat Lums presents LED fixtures for infrastructure, industrial
              facilities and commercial interiors. Browse photographed street and
              flood light models, high bay and warehouse fixture references, and
              interior lighting types. Share your layout, quantities and required
              specifications to confirm suitable models and availability.
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

      <div className="shell">
        <section className={styles.applications} aria-labelledby="home-applications">
          <div className={styles.applicationHeading}>
            <div>
              <p className={styles.applicationKicker}>Solutions by sector</p>
              <h2 id="home-applications">Lighting by application</h2>
              <p className={styles.applicationIntro}>Explore LED lighting solutions for infrastructure, industrial spaces and commercial interiors.</p>
            </div>
            <Link href={paths.applications} className={styles.applicationAll}>
              View all applications <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ul className={styles.applicationGrid}>
            {applications.map((entry) => {
              const Icon = applicationIcons[entry.slug] ?? Building2;
              return (
                <li key={entry.slug}>
                  <Link href={paths.application(entry.slug)} className={styles.applicationCard} prefetch={false}>
                    <span className={styles.applicationIcon}><Icon size={26} strokeWidth={1.65} aria-hidden="true" /></span>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <span className={styles.applicationCardAction}>Explore application <ArrowUpRight size={17} aria-hidden="true" /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <LightingSections sections={[
          { title: "Light output and energy use", text: "Compare lumens and input watts together to understand luminous efficacy. Check the distribution and mounting position to see how much light reaches the working area." },
          { title: "Colour and visual comfort", text: "Colour temperature describes how warm or cool the light appears. Colour rendering describes how it represents colours. Use the actual finishes, displays and working conditions when comparing choices." },
          { title: "Optics and installation", text: "Beam distribution, mounting height and position affect coverage. Ask for the model’s verified ingress rating and installation instructions for the conditions on site." },
        ]} />
        <LightingLinks title="Lighting specification guides" links={[
          ...guides.slice(0, 3).map((entry) => ({ name: entry.title, href: paths.guide(entry.slug) })),
          { name: "All lighting guides", href: paths.guides },
        ]} />
      </div>

      <CompanyValues />

      <GlobalPresenceSection />

      <HomeFaq catalogue={catalogueDownload} />
      <div className={styles.enquiryBand}><HomeEnquiry /></div>
    </>
  );
}
