import { ContactSection } from "@/components/contact";
import { metadata as pageMetadata } from "@/lib/site";
import styles from "./contact.module.css";

const description =
  "Ask about a product, request a quote or tell us what you need for your lighting project.";

export const metadata = pageMetadata("Contact", "/contact", description);

export default function ContactPage() {
  return (
    <>
      <section className={`shell ${styles.intro}`} aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">Contact Bharat Lums</p>
          <h1 id="contact-title">Let’s talk lighting.</h1>
        </div>
        <p>{description}</p>
      </section>
      <ContactSection />
    </>
  );
}
