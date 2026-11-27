import { DirectEnquiry } from "./direct-enquiry";
import { Reveal } from "./motion";
import styles from "./home-enquiry.module.css";

export function HomeEnquiry() {
  return (
    <section id="contact-enquiry" className={`shell ${styles.section}`} aria-labelledby="enquiry-title">
      <Reveal className={styles.inner}>
        <div className={styles.heading}>
          <p className={styles.kicker}>GET IN TOUCH</p>
          <h2 id="enquiry-title">Send an enquiry</h2>
          <p>Tell us about your lighting requirements and send your enquiry through WhatsApp.</p>
        </div>
        <div className={styles.panel}>
          <DirectEnquiry home />
        </div>
      </Reveal>
    </section>
  );
}
