import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Gallery } from "@/components/gallery";
import { Action } from "@/components/ui";
import { architecturalProducts, findArchitecturalProduct } from "@/lib/architectural-products";
import { brand } from "@/lib/site";
import { pageMetadata, paths } from "@/lib/seo";
import { PageSchema } from "@/components/seo-data";
import { LightingFaq, LightingLinks, LightingSections } from "@/components/lighting-content";
import { lightingDivisions } from "@/lib/lighting-divisions";
import { architectureEditorial, architectureRelated } from "@/lib/product-editorial";
import { CatalogueImage } from "@/components/catalogue-image";
import { RelatedCatalogueGrid } from "@/components/related-catalogue-grid";
import styles from "../../products.module.css";
import detailStyles from "../../product-detail.module.css";

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
  const quote = `/contact?architectural=${item.slug}`;
  const message = encodeURIComponent(`Hello Bharat Lums, I would like more information about ${item.name}. Please confirm availability and specifications.`);
  const editorial = architectureEditorial(item.slug, item.name, item.selection);
  const related = architectureRelated(item.slug)
    .flatMap(slug => architecturalProducts.filter(other => other.slug === slug && other.slug !== item.slug));
  return (
    <div className={`shell ${styles.page} ${styles.compactPage}`}>
      <PageSchema title={item.name} path={paths.architecturalFixture(item.slug)} summary={item.selection} ancestors={[
        { name: "Products", href: paths.products },
        { name: lightingDivisions.architectural.title, href: paths.architecture },
      ]} />
      <section className={styles.intro}><h1>{item.name}</h1><p>{item.application}</p></section>
      <section className={`detail-grid section-tight catalogue-detail-motion ${detailStyles.detail}`} aria-label="Product details">
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
      <LightingSections sections={editorial.sections} />
      <LightingFaq entries={editorial.faq} />
      {related.length > 0 && <section className="section-tight" aria-labelledby="related-architecture">
        <h2 id="related-architecture" className="catalogue-section-title">Related architectural fixture references</h2>
        <RelatedCatalogueGrid signature={related.map(p => p.slug).join("|")}>
          {related.map(p => <article key={p.slug} data-catalogue-item={p.slug} className="catalogue-motion-item media-card product-card">
            {p.image && <Link className="image-link" href={paths.architecturalFixture(p.slug)} aria-label={"View " + p.name}><CatalogueImage src={p.image.src} alt={p.image.alt} sizes="(max-width: 900px) 46vw, 30vw" /></Link>}
            <div className="card-body"><h3><Link href={paths.architecturalFixture(p.slug)}>{p.name}</Link></h3><p>{p.application}</p><p>Reference image</p>
              <div className="card-actions"><Link className="text-link" href={paths.architecturalFixture(p.slug)}>View details</Link><Link className="text-link" href={"/contact?architectural=" + p.slug}>Enquire now</Link></div>
            </div>
          </article>)}
        </RelatedCatalogueGrid>
      </section>}
      <LightingLinks title="Lighting project resources" links={[{name:"Architectural lighting catalogue",href:paths.architecture},{name:"Lighting applications",href:"/applications"},{name:"Lighting selection guides",href:"/lighting-guides"}]} />
    </div>
  );
}
