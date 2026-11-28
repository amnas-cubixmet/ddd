import { findArchitecturalProduct } from "@/lib/architectural-products";
import { ContactSection } from "@/components/contact";
import { PageIntro } from "@/components/ui";
import { findCollection, products } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import { applications } from "@/lib/lighting-content";

const title = "Request an LED Lighting Quote";
const summary = "Request a Bharat Lums quotation. Share the application, site location, estimated quantity, mounting details and any fixture models you are considering.";
export const metadata = pageMetadata({ title, path: "/request-quote", summary });

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const product = products.find((item) => item.slug === query.product);
  const collection = findCollection(query.collection);
  const architecturalProduct = findArchitecturalProduct(query.architectural);
  const application = applications.find((item) => item.slug === query.application);
  const defaults =
    query.catalogue === "1"
      ? {
          interest: "LED product catalogue",
          message: "Please share the current Bharat Lums product catalogue.",
        }
      : { interest: product?.name ?? collection?.name ?? architecturalProduct?.name ?? application?.title };
  return (
    <>
      <PageSchema title="Request a quote" path="/request-quote" summary={summary} />
      <PageIntro eyebrow="Project enquiry" title={title} description={summary} />
      <ContactSection source="quote" defaults={defaults} />
    </>
  );
}
