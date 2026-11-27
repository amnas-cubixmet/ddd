import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Gallery } from "@/components/gallery";
import { Action } from "@/components/ui";
import { architecturalProducts, findArchitecturalProduct } from "@/lib/architectural-products";
import { brand, metadata as pageMetadata } from "@/lib/site";
import styles from "../../products.module.css";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return architecturalProducts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const item = findArchitecturalProduct((await params).slug);
  return item ? pageMetadata(item.name, `/products/architectural-lighting/${item.slug}`, item.application, item.image?.src) : {};
}
export default async function Page({ params }: Params) {
  const item = findArchitecturalProduct((await params).slug);
  if (!item) notFound();
  const quote = `/request-quote?architectural=${item.slug}`;
  const message = encodeURIComponent(`Hello Bharat Lums, I would like more information about ${item.name}. Please confirm availability and specifications.`);
  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      <section className={styles.intro}><h1>{item.name}</h1><p>{item.application}</p></section>
      <section className="detail-grid section-tight" aria-label="Product details">
        {item.image && <Gallery images={[{ src: item.image.src, alt: item.image.alt, label: "Product reference", representative: item.image.representative }]} />}
        <div className="detail-copy">
          <h2>Applications</h2><p>{item.application}</p>
          <h2>Technical information</h2><p>Contact our team to confirm available models and verified specifications.</p>
          <p>Suggested catalogue. Product images are for reference only.</p>
          <div className="product-detail-actions">
            <Action href={quote}>Request a quote</Action>
            <a className="button button-outline" href={`https://wa.me/${brand.phoneHref.replace(/\D/g, "")}?text=${message}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> WhatsApp enquiry</a>
          </div>
          <p><Link className="text-link" href="/products/architectural-lighting">All architectural lighting</Link></p>
        </div>
      </section>
    </div>
  );
}
