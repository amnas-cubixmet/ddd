import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Action } from "@/components/ui";
import { GlobalPresenceSection } from "@/components/global-presence/global-presence";
import { HomeEnquiry } from "@/components/home-enquiry";
import { JsonLd } from "@/components/seo-data";
import { absoluteUrl, pageMetadata, paths } from "@/lib/seo";
import conferenceRoom from "../../../public/images/about-bharat-lums-conference.webp";
import styles from "./about.module.css";

const summary = "Discover Bharat Lums and explore professional LED lighting solutions for infrastructure, industrial facilities, architectural spaces and commercial projects.";
const title = "About Bharat Lums | Professional LED Lighting Solutions";
const social = pageMetadata({ title: "Professional LED Lighting Solutions", path: "/about", summary, image: { src: "/images/about-bharat-lums-conference.webp", alt: "Conference room lighting application reference" } });
export const metadata = {
  ...social,
  title: { absolute: title },
  openGraph: { ...social.openGraph, title },
  twitter: { ...social.twitter, title },
};

const expertise = [
  { title: "Infrastructure lighting", image: "/images/products/street-light.webp", alt: "Street lighting fixture reference", href: paths.infrastructure, text: "Explore street and flood lighting for roads, access routes and outdoor areas. Consider pole height, spacing, beam distribution and exposure when comparing fixtures." },
  { title: "Industrial lighting", image: "/images/products/warehouse-high-bay.webp", alt: "Warehouse high bay lighting reference", href: paths.category("high-bay-industrial-lighting"), text: "Review high bay and warehouse fixture types for factories, storage facilities and logistics areas. Mounting height, operating hours and task visibility help define the selection." },
  { title: "Architectural lighting", image: "/images/architectural-commercial-lighting.webp", alt: "Architectural and commercial lighting reference", href: paths.architecture, text: "Explore downlights, track lighting, wall washers and linear fixtures for interiors where accent, orientation and visual character matter." },
  { title: "Commercial lighting", image: "/images/conference-room-linear-lighting.webp", alt: "Linear luminaires in a conference room", href: paths.architecture, text: "Compare panel, suspended and linear lighting types for offices, retail and hospitality. Balance workplane illumination, glare, ceiling layout and appearance." },
];

const industries = [
  ["Roads and highways", "Street and access-route lighting"],
  ["Warehouses and logistics", "Storage aisles and loading zones"],
  ["Factories and manufacturing", "Production areas and workstations"],
  ["Offices and workspaces", "Desks, meeting rooms and circulation"],
  ["Retail and shopping malls", "Displays and customer-facing areas"],
  ["Hotels and hospitality", "Reception and shared interiors"],
  ["Outdoor parking areas", "Vehicle routes and pedestrian zones"],
];

const steps = [
  ["Understand the project", "Describe the activity, dimensions, layout and hours of operation. Share drawings or a fixture schedule if available."],
  ["Identify fixture types", "Compare the catalogue against the intended application, including existing fittings for a retrofit."],
  ["Review distribution and mounting", "Consider beam spread, mounting height, spacing, obstructions and the direction in which light is needed."],
  ["Consider energy use", "Compare input power and operating hours alongside the required light output and visual conditions."],
  ["Confirm specifications", "Request model-specific details such as output, colour temperature, optics, environmental rating and control compatibility where relevant."],
  ["Send a project enquiry", "Share the selected references, quantities, location and timeline so current specifications and availability can be discussed."],
];

const strengths = [
  ["Diverse catalogue", "Explore photographed infrastructure fixtures and clearly identified interior lighting references."],
  ["Application-led navigation", "Browse lighting by the environment in which it is intended to be used."],
  ["Specification discussions", "Include model references and required technical details when asking about a product."],
  ["Project-oriented guidance", "Use the lighting guides and application pages to prepare a more useful brief."],
  ["Direct enquiries", "Contact the team with project requirements, quantities and a preferred timeline."],
];

const faqs = [
  ["What is Bharat Lums?", "Bharat Lums presents a professional LED lighting catalogue for infrastructure, industrial facilities and architectural and commercial interiors, together with resources for project enquiries."],
  ["What types of LED lighting does Bharat Lums offer?", "The catalogue includes street lights, flood lights, industrial and warehouse fixture references, and interior fixture types such as downlights, panels, track and linear lights. Confirm model availability and specifications before ordering."],
  ["Can I enquire about industrial lighting?", "Yes. Include ceiling or mounting heights, the work or storage layout, operating conditions and quantities when enquiring about industrial or warehouse lighting."],
  ["Can I enquire about commercial projects?", "Yes. Describe the intended use of the space, ceiling arrangement, lighting preferences and any fixture schedule or drawings for offices, retail or hospitality projects."],
  ["How can I choose a suitable LED fixture?", "Start with the activity, required illumination, mounting conditions and environment. Compare fixture types and request current technical information for the model before making a final selection."],
  ["Where can I explore the product catalogue?", "The Products page leads to the infrastructure and architectural and commercial lighting divisions. Application pages and lighting guides provide additional selection context."],
  ["How can I contact Bharat Lums?", "Use the enquiry form below or visit the Contact page. Review your details in WhatsApp before sending your message."],
];

function AboutSchema() {
  const url = absoluteUrl("/about");
  const home = absoluteUrl("/");
  if (!url || !home) return null;
  return <JsonLd data={[
    { "@type": "AboutPage", "@id": url + "#page", url, name: title, description: summary, inLanguage: "en", isPartOf: { "@id": home + "#website" }, about: { "@id": home + "#organization" }, breadcrumb: { "@id": url + "#breadcrumbs" } },
    { "@type": "BreadcrumbList", "@id": url + "#breadcrumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: home },
      { "@type": "ListItem", position: 2, name: "About", item: url },
    ] },
  ]} />;
}

export default function AboutPage() {
  return (
    <div className={styles.page} data-testid="about-page">
      <AboutSchema />
      <section className={styles.inner + " " + styles.hero} aria-labelledby="about-title">
        <div className={styles.copy}>
          <p className={styles.kicker}>About Bharat Lums</p>
          <h1 id="about-title">Engineering Brighter Possibilities.</h1>
          <p className={styles.lead}>Professional LED lighting starts with understanding the space. Bharat Lums brings together lighting fixture references for infrastructure, industrial environments and commercial interiors, helping project teams explore the options and prepare informed enquiries.</p>
          <Action href="/products" diagonal>Explore our catalogue</Action>
        </div>
        <figure className={styles.figure}>
          <div className={styles.heroImage}><Image src={conferenceRoom} alt="Suspended linear LED fixtures above a conference table" fill preload sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1450px) 48vw, 640px" /></div>
          <figcaption>Lighting application reference</figcaption>
        </figure>
      </section>
      <section className={styles.band} aria-labelledby="who-title">
        <div className={styles.inner + " " + styles.split}>
          <div><p className={styles.kicker}>Company profile</p><h2 id="who-title">Who we are</h2></div>
          <div className={styles.prose}>
            <p>Bharat Lums is focused on professional LED lighting solutions for built environments and outdoor infrastructure. Our catalogue brings together different fixture types for project teams exploring lighting for roads, industrial facilities and commercial spaces. The aim is to make the connection between a lighting requirement and a suitable product category easier to understand.</p>
            <p>For outdoor and industrial projects, the catalogue covers street lights, flood lights and high bay and warehouse fixture references. The architectural and commercial collection brings together interior lighting types, including downlights, panels, spotlights and linear fixtures. Photographed models and illustrative references are identified in the catalogue, so customers can distinguish a specific fixture from a suggested lighting type.</p>
            <p>Lighting selection depends on more than appearance or wattage. Mounting conditions, light distribution, the activity taking place and the operating environment all influence the choice. We encourage contractors, specifiers, facility teams and procurement professionals to share their project brief, fixture quantities and required technical details when making an enquiry. Model specifications and availability should be confirmed for each project.</p>
            <Link className={styles.textLink} href={paths.products}>Browse the lighting catalogue <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <section className={styles.navy} aria-label="Mission and vision">
        <div className={styles.inner + " " + styles.values}>
          <div><h2>Our Mission</h2><p>To manufacture reliable, high-quality LED lighting in India - built with precision, delivered with honesty.</p></div>
          <div><h2>Our Vision</h2><p>To bring Indian manufacturing excellence to international markets and illuminate the world, one point of light at a time.</p></div>
        </div>
      </section>
      <section className={styles.inner + " " + styles.section} aria-labelledby="expertise-title">
        <p className={styles.kicker}>Lighting portfolio</p><h2 id="expertise-title">Our lighting expertise</h2>
        <div className={styles.expertiseGrid}>
          {expertise.map(item => <article key={item.title} className={styles.card}>
            <div className={styles.cardImage}><Image src={item.image} alt={item.alt} fill loading="lazy" sizes="(max-width: 374px) 90vw, (max-width: 767px) 46vw, (max-width: 1199px) 45vw, 320px" /></div>
            <div className={styles.cardBody}><h3>{item.title}</h3><p>{item.text}</p><Link href={item.href} prefetch={false} className={styles.textLink}>Explore {item.title.toLowerCase()} <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
          </article>)}
        </div>
        <p className={styles.note}>Images show fixture or application references; they do not establish completed Bharat Lums projects.</p>
      </section>
      <section className={styles.band} aria-labelledby="industries-title">
        <div className={styles.inner}>
          <p className={styles.kicker}>Applications</p><h2 id="industries-title">Industries we serve</h2>
          <p className={styles.lead}>Explore lighting categories for these project environments. Confirm the requirements of the actual site before choosing a fixture.</p>
          <ul className={styles.industryGrid}>{industries.map(([name, text]) => <li key={name}><h3>{name}</h3><p>{text}</p></li>)}</ul>
          <Action href={paths.applications}>Explore lighting applications</Action>
        </div>
      </section>
      <section className={styles.inner + " " + styles.section + " " + styles.split} aria-labelledby="approach-title">
        <div><p className={styles.kicker}>Specification process</p><h2 id="approach-title">Our approach to lighting</h2><p className={styles.lead}>A useful enquiry starts with the site and ends with specific questions about the fixture. These steps help prepare a practical brief.</p><Link href={paths.guides} className={styles.textLink}>Read lighting specification guides <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        <ol className={styles.steps}>{steps.map(([name, text], i) => <li key={name}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><h3>{name}</h3><p>{text}</p></div></li>)}</ol>
      </section>
      <section className={styles.navy} aria-labelledby="why-title">
        <div className={styles.inner}><p className={styles.kicker}>Working with us</p><h2 id="why-title">Why choose Bharat Lums?</h2>
          <ul className={styles.strengthGrid}>{strengths.map(([name, text]) => <li key={name}><h3>{name}</h3><p>{text}</p></li>)}</ul>
        </div>
      </section>
      <section className={styles.inner + " " + styles.section + " " + styles.split} aria-labelledby="commitment-title">
        <div><p className={styles.kicker}>Responsible selection</p><h2 id="commitment-title">Our commitment</h2></div>
        <div className={styles.prose}>
          <p>Effective lighting considers the people using a space and the conditions in which a fixture will operate. Energy efficiency should be assessed alongside the required light distribution and illumination, not through input power alone. For long operating hours, compare power consumption, operating schedules and available model-specific performance information.</p>
          <p>Visual comfort also matters. Consider glare, contrast, shadows and colour appearance in work areas and public interiors. Outdoor and industrial installations may require additional attention to exposure, mounting arrangements, electrical compatibility and maintenance access.</p>
          <p>We encourage customers to confirm technical specifications and installation requirements before making a purchase decision. Long-term performance depends on the selected fixture, operating conditions and maintenance; project-specific results should be assessed using suitable technical information.</p>
        </div>
      </section>
      <section aria-labelledby="map-title">
        <div className={styles.inner + " " + styles.mapIntro}><p className={styles.kicker}>Project locations</p><h2 id="map-title">Explore the regional map</h2><p className={styles.lead}>Use the interactive map to explore locations. It is illustrative, not a record of offices, exports or completed projects.</p></div>
        <GlobalPresenceSection />
      </section>
      <section className={styles.inner + " " + styles.section + " " + styles.split} aria-labelledby="faq-title">
        <div><p className={styles.kicker}>Frequently asked questions</p><h2 id="faq-title">Helpful information</h2><p className={styles.lead}>Answers to common questions about the catalogue and project enquiries.</p></div>
        <div className={styles.faq}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
      </section>
      <div className={styles.enquiry}>
        <HomeEnquiry />
        <div className={styles.inner + " " + styles.contactLink}><Link href="/contact" className={styles.textLink}>Visit our contact page <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </div>
    </div>
  );
}
