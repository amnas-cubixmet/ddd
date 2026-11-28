import { ArrowUpRight, Globe2, Mail, MessageCircle, Phone } from "lucide-react";
import { brand } from "@/lib/site";
import { enquiryEmailHref } from "@/lib/enquiry";
import { DirectEnquiry } from "./direct-enquiry";
import styles from "./contact.module.css";

export function ContactSection({
  defaults,
  source = "contact",
}: {
  defaults?: { interest?: string; message?: string };
  source?: "contact" | "quote";
}) {
  const whatsappNumber = brand.phoneHref.replace(/\D/g, "");

  const whatsapp = new URL(`https://wa.me/${whatsappNumber}`);
  if (defaults?.interest) {
    whatsapp.searchParams.set("text", `Hello Bharat Lums, I would like to enquire about ${defaults.interest}. Please confirm the options and availability.`);
  }

  return (
    <section
      className={`shell section-tight contact-grid ${styles.layout}`}
      aria-label="Enquiry form and contact details"
    >
      <aside className={styles.panel} aria-labelledby="contact-team">
        <h2 id="contact-team">Contact our team</h2>
        <p className={styles.person}>
          <strong>Suhail Kidangayam</strong>
          Co-founder, Bharat Lums
        </p>
        <ul className={styles.methods}>
          <li>
            <a href={enquiryEmailHref(brand.email)}>
              <Mail size={19} aria-hidden="true" />
              <span>
                <strong>Email</strong>
                {brand.email}
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </li>
          {source === "quote" && (
            <li>
              <a href={brand.website}>
                <Globe2 size={19} aria-hidden="true" />
                <span>
                  <strong>Website</strong>
                  bharatlums.com
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </li>
          )}
          <li>
            <a href={brand.phoneHref}>
              <Phone size={19} aria-hidden="true" />
              <span>
                <strong>Call</strong>
                {brand.phone}
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} aria-hidden="true" />
              <span>
                <strong>WhatsApp</strong>
                Chat with our team
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </aside>
      <div className={styles.panel}>
        <h2 className={styles.formHeading} id="enquiry-title">
          {source === "quote" ? "Request a quote" : "Project enquiry"}
        </h2>
        <DirectEnquiry defaults={defaults} />
      </div>
    </section>
  );
}
