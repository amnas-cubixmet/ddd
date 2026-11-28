import Image from "next/image";
import { DivisionImage } from "@/components/division-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
import { PageSchema } from "@/components/seo-data";

const homeTitle = "Professional LED Lighting Solutions";
export const metadata = pageMetadata({ title: homeTitle, path: "/", summary: description, home: true });

const slides = catalogueCategories.map((category) => ({
  ...category,
  image: artwork(category.image),
  href: `${lightingDivisions.infrastructure.href}?category=${category.slug}#division-catalogue`,
}));

export default function Home() {
  return (
    <>
      <PageSchema title={homeTitle} path="/" summary={description} />
      <HomeHero catalogue={catalogueDownload} />
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

      <CompanyValues />

      <div className="shell"><LightingDivisions /></div>
      <div className={styles.catalogueBand}>
        <CatalogueSlider slides={slides} />
      </div>

      <GlobalPresenceSection />

      <HomeFaq catalogue={catalogueDownload} />

      <section className={styles.applicationBand} aria-labelledby="home-applications">
        <div className={`shell ${styles.applicationFeature}`}>
          <div className={styles.applicationFeatureImage}>
            <DivisionImage
              src="/images/lighting-by-application.webp"
              fallbackSrc="/images/conference-room-linear-lighting.webp"
              alt="Illustrative LED lighting across an industrial complex, roadways, loading bays and office interiors"
              sizes="(max-width: 700px) 90vw, (max-width: 1450px) 43vw, 560px"
            />
          </div>
          <div className={styles.applicationFeatureCopy}>
            <p className={styles.applicationKicker}>Solutions by sector</p>
            <h2 id="home-applications">Lighting by application</h2>
            <p>From LED street lights and industrial high bays to architectural wall washers, explore lighting solutions for roads, workplaces, commercial interiors and outdoor spaces. Choose fixtures around your project requirements, light distribution and installation conditions.</p>
            <div className={styles.applicationFeatureLinks}>
              <Link href={paths.applications} className={styles.applicationAll}>
                Explore applications <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link href={paths.products} className={styles.applicationSecondary}>
                All products <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <Link href={paths.guides} className={styles.applicationGuide}>Lighting specification guides <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className={styles.enquiryBand}><HomeEnquiry /></div>
    </>
  );
}
