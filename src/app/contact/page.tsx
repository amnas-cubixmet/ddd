import {
  findArchitecturalProduct,
  findCollection,
  products,
} from "@/lib/catalogue";
import { applications } from "@/lib/lighting-content";
import { ContactSection } from "@/components/contact";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import styles from "./contact.module.css";

const description =
  "Contact Bharat Lums about fixture specifications, catalogue availability or LED lighting for a commercial, industrial or infrastructure project.";

export const metadata = pageMetadata({ title: "Contact for LED Lighting Enquiries", path: "/contact", summary: description });

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const product = products.find((item) => item.slug === query.product);
  const collection = findCollection(query.collection);
  const architecturalProduct = findArchitecturalProduct(query.architectural);
  const application = applications.find((item) => item.slug === query.application);
  const defaults = query.catalogue === "1"
    ? { interest: "LED product catalogue", message: "Please share the current Bharat Lums product catalogue." }
    : { interest: product?.name ?? collection?.name ?? architecturalProduct?.name ?? application?.title };
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
      <ContactSection defaults={defaults} />
    </>
  );
}
