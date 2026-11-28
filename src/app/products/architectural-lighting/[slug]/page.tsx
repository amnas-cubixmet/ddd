import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Gallery } from "@/components/gallery";
import { Action } from "@/components/ui";
import { architecturalProducts, findArchitecturalProduct } from "@/lib/architectural-products";
import { brand } from "@/lib/site";
import { pageMetadata, paths } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import { LightingLinks } from "@/components/lighting-content";
import { lightingDivisions } from "@/lib/lighting-divisions";
import styles from "../../products.module.css";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return architecturalProducts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const item = findArchitecturalProduct((await params).slug);
  return item ? pageMetadata({
    title: item.name, path: paths.architecturalFixture(item.slug),
    summary: `${item.name} reference for ${item.application.toLowerCase()}. ${item.selection}`,
    image: item.image, index: false,
  }) : {};
}
export default async function Page({ params }: Params) {
  const item = findArchitecturalProduct((await params).slug);
  if (!item) notFound();
  const quote = `/request-quote?architectural=${item.slug}`;
  const message = encodeURIComponent(`Hello Bharat Lums, I would like more information about ${item.name}. Please confirm availability and specifications.`);
  const uses = item.application.toLowerCase().split(", ");
  const related = architecturalProducts.filter(({ slug }) => slug !== item.slug)
    .map((other) => ({ other, overlap: other.application.toLowerCase().split(", ").filter((use) => uses.includes(use)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3).map(({ other }) => ({ name: other.name, href: paths.architecturalFixture(other.slug) }));
  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      <PageSchema title={item.name} path={paths.architecturalFixture(item.slug)} summary={item.selection} ancestors={[
        { name: "Products", href: paths.products },
        { name: lightingDivisions.architectural.title, href: paths.architecture },
      ]} />
      <section className={styles.intro}><h1>{item.name}</h1><p>{item.application}</p></section>
      <section className="detail-grid section-tight catalogue-detail-motion" aria-label="Product details">
        {item.image && <Gallery images={[{ src: item.image.src, alt: item.image.alt, label: "Product reference", representative: item.image.representative }]} />}
        <div className="detail-copy">
          <h2>Applications</h2><p>{item.application}</p>
          <h2>Selection and installation</h2><p>{item.selection}</p>
          <h2>Technical information</h2><p>Contact our team to confirm available models and verified specifications.</p>
          <p>Suggested catalogue. Product images are for reference only.</p>
          <div className="product-detail-actions">
            <Action href={quote}>Request a quote</Action>
            <a className="button button-outline" href={`https://wa.me/${brand.phoneHref.replace(/\D/g, "")}?text=${message}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> WhatsApp enquiry</a>
          </div>
          <p><Link className="text-link" href="/products/architectural-lighting">All architectural lighting</Link></p>
        </div>
      </section>
      <LightingLinks title="Related architectural fixture references" links={related} />
    </div>
  );
}
