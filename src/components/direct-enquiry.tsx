import { MessageCircle } from "lucide-react";
import { brand } from "@/lib/site";
import styles from "./direct-enquiry.module.css";

export function DirectEnquiry({ defaults }: {
  defaults?: { interest?: string; message?: string };
}) {
  const message = defaults?.message || (defaults?.interest
    ? `Hello Bharat Lums, I would like a quotation and more information about ${defaults.interest}.`
    : "Hello Bharat Lums, I would like to enquire about your lighting products and services.");
  const whatsappNumber = brand.phoneHref.replace(/\D/g, "");
  return (
    <div className={styles.content}>
      {defaults?.interest && <p className={styles.interest}>Product interest: <strong>{defaults.interest}</strong></p>}
      <p>Contact our team directly on WhatsApp. Review and send your message in WhatsApp.</p>
      <div className={styles.actions}>
        <a className={`button button-primary ${styles.whatsapp}`} href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={19} aria-hidden="true" /> Send via WhatsApp
        </a>
      </div>
    </div>
  );
}
