import Image from "next/image";
import { Action, ProductCard } from "@/components/ui";
import { GlobalPresenceSection } from "@/components/global-presence/global-presence";
import { HomeHero } from "@/components/home-hero";
import { CatalogueSlider } from "@/components/home/catalogue-slider";
import { HomeEnquiry } from "@/components/home-enquiry";
import { HomeFaq } from "@/components/home/faq";
import styles from "@/components/home/home.module.css";
import { Reveal } from "@/components/motion";
import conferenceRoom from "../../public/images/about-bharat-lums-conference.webp";
import {
  artwork,
  catalogueCategories,
  catalogueDownload,
  findCatalogueFixture,
  publishedProducts,
} from "@/lib/catalogue";
import { fixturePhotoGroups } from "@/lib/fixture-photos";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata(
    "LED Lighting",
    "/",
    "Bharat Lums LED lighting solutions for commercial, industrial and outdoor environments.",
  ),
  title: { absolute: "Bharat Lums | Powering a Brighter Tomorrow" },
};

const catalogue = catalogueCategories.map((category) => {
  const fixture = findCatalogueFixture(category.slug);
  const photoSlug = fixture && fixturePhotoGroups[fixture.slug]?.photos[0]?.image;
  const photo = publishedProducts.find((product) => product.slug === photoSlug);
  return {
    photo,
    slide: {
      ...category,
      image: photo?.images[0].src ?? artwork(category.image),
      href: fixture
        ? `/products/${fixture.slug}`
        : `/request-quote?collection=${category.slug}`,
    },
  };
});

const slides = catalogue.map(({ slide }) => slide);
const featuredProducts = catalogue
  .map(({ photo }) => photo)
  .filter((photo) => photo !== undefined);

export default function Home() {
  return (
    <>
      <HomeHero catalogue={catalogueDownload} />
      <CatalogueSlider slides={slides} />
      {featuredProducts.length > 0 && (
        <section className={styles.featured} aria-labelledby="home-featured">
          <div className="shell">
            <h2 id="home-featured">Featured products</h2>
            <div className="card-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} item={product} />
              ))}
            </div>
            <Action href="/products">View all products</Action>
          </div>
        </section>
      )}
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

      <GlobalPresenceSection />

      <HomeFaq catalogue={catalogueDownload} />
      <HomeEnquiry />
    </>
  );
}
