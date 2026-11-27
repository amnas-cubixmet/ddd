import { findArchitecturalProduct } from "@/lib/architectural-products";
import { ContactSection } from "@/components/contact";
import { PageIntro } from "@/components/ui";
import { findCollection, products } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Request a Quote", "/request-quote");

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const product = products.find((item) => item.slug === query.product);
  const collection = findCollection(query.collection);
  const architecturalProduct = findArchitecturalProduct(query.architectural);
  const defaults =
    query.catalogue === "1"
      ? {
          interest: "LED product catalogue",
          message: "Please share the current Bharat Lums product catalogue.",
        }
      : { interest: product?.name ?? collection?.name ?? architecturalProduct?.name };
  return (
    <>
      <PageIntro
        eyebrow="Project enquiry"
        title="Request a quote."
        description="Share what you are planning and the lighting you need. Include quantities and project location where available."
      />
      <ContactSection source="quote" defaults={defaults} />
    </>
  );
}
