import { brand } from "@/lib/site";
import EnquiryForm from "./enquiry-form";
import { Reveal } from "./motion";
import styles from "./home-enquiry.module.css";

export function HomeEnquiry() {
  return (
    <section id="contact-enquiry" className={`shell ${styles.section}`} aria-labelledby="enquiry-title">
      <Reveal className={styles.inner}>
        <div className={styles.heading}>
          <p className={styles.kicker}>GET IN TOUCH</p>
          <h2 id="enquiry-title">Send an enquiry</h2>
          <p>Tell us about your lighting requirements. Our team will be in touch.</p>
        </div>
        <div className={styles.panel}>
          <EnquiryForm home online email={brand.email} whatsappNumber={brand.phoneHref.replace(/\D/g, "")} />
        </div>
      </Reveal>
    </section>
  );
}
