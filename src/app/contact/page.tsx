import { ContactSection } from "@/components/contact";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import styles from "./contact.module.css";

const description =
  "Contact Bharat Lums about fixture specifications, catalogue availability or LED lighting for a commercial, industrial or infrastructure project.";

export const metadata = pageMetadata({ title: "Contact for LED Lighting Enquiries", path: "/contact", summary: description });

export default function ContactPage() {
  return (
    <>
      <PageSchema title="Contact" path="/contact" summary={description} />
      <section className={`shell ${styles.intro}`} aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">Contact Bharat Lums</p>
          <h1 id="contact-title">Contact Bharat Lums</h1>
        </div>
        <p>{description}</p>
      </section>
      <ContactSection />
    </>
  );
}
