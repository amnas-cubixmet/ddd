import { Crosshair, Handshake, Lightbulb } from "lucide-react";
import styles from "./home/home.module.css";

export function MissionVision() {
  return (
      <section className={styles.mission} aria-label="Mission and vision">
        <div className="shell">
          <div>
            <h2>Our Mission</h2><p>To manufacture reliable, high-quality LED lighting in India - built with precision, delivered with honesty.</p>
          </div>
          <div>
            <h2>Our Vision</h2><p>To bring Indian manufacturing excellence to international markets and illuminate the world, one point of light at a time.</p>
          </div>
        </div>
      </section>
  );
}

export function LightingEnquiryHelp({ page = "home" }: { page?: "home" | "about" }) {
  const strengthsId = `${page}-strengths`;
  return (
      <section className={styles.strengths} aria-labelledby={strengthsId}>
        <div className="shell">
          <h2 id={strengthsId}>How we help with lighting enquiries</h2>
          <ul>
            <li>
              <span className={styles.strengthIcon} aria-hidden="true">
                <Crosshair size={23} strokeWidth={1.7} />
              </span>
              <h3>Fixture selection</h3>
              <p>Start with the catalogue and tell us what you need to light, where the fittings can go and what performance the project requires.</p>
            </li>
            <li>
              <span className={styles.strengthIcon} aria-hidden="true">
                <Lightbulb size={23} strokeWidth={1.7} />
              </span>
              <h3>Model and specification details</h3>
              <p>Send the model name or fixture reference with your enquiry so the team can confirm current details and options.</p>
            </li>
            <li>
              <span className={styles.strengthIcon} aria-hidden="true">
                <Handshake size={23} strokeWidth={1.7} />
              </span>
              <h3>Project enquiries</h3>
              <p>Share the project location, quantities and timeline to help us respond to your requirements.</p>
            </li>
          </ul>
        </div>
      </section>
  );
}

export function CompanyValues({ page = "home" }: { page?: "home" | "about" }) {
  return (
    <>
      <MissionVision />
      <LightingEnquiryHelp page={page} />
    </>
  );
}
