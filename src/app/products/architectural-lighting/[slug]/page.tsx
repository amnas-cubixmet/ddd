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
      <section className={`detail-grid catalogue-detail-motion ${detailStyles.detail}`} aria-labelledby="fixture-title">
        {item.image && <Gallery images={[{ src: item.image.src, alt: item.image.alt, label: "Product reference", representative: item.image.representative }]} />}
        <div className={`detail-copy ${detailStyles.summary}`}>
          <p className={detailStyles.eyebrow}>Architectural &amp; Commercial Lighting</p>
          <h1 id="fixture-title">{item.name}</h1>
          <p className={detailStyles.lead}>{item.application}</p>
          <p>{item.selection}</p>
          <p className={detailStyles.note}>Product reference image. Confirm the exact fixture model and technical specifications with our team.</p>
          <div className={detailStyles.cta}>
            <p>Share your requirements to request model information and a project quotation.</p>
            <div className="product-detail-actions">
              <Action href={quote}>Request a quote</Action>
              <a className="button button-outline" href={`https://wa.me/${brand.phoneHref.replace(/\D/g, "")}?text=${message}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> WhatsApp enquiry</a>
            </div>
          </div>
          <Link className={detailStyles.categoryLink} href={paths.architecture}>All architectural lighting <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className={detailStyles.specLayout} aria-labelledby="specifications-title">
        <div className={detailStyles.specifications}>
          <h2 id="specifications-title">Product information</h2>
          <table className="product-spec-table">
            <tbody><tr><th scope="row">Fixture type</th><td>{item.name}</td></tr><tr><th scope="row">Typical applications</th><td>{item.application}</td></tr></tbody>
          </table>
          <p>Contact our team to confirm available models and verified specifications.</p>
        </div>
        <aside className={detailStyles.projectPanel} aria-label="Project enquiry and applications">
          <h2>Planning a lighting project?</h2>
          <p>Share your layout, quantities and lighting requirements to discuss suitable fixture options.</p>
          <Action href={quote}>Request a project quote</Action>
          <h3>Selection and installation</h3><p>{item.selection}</p>
        </aside>
      </section>
      <LightingSections sections={editorial.sections} />
      <LightingFaq entries={editorial.faq} />
      <LightingLinks title="Lighting guides and applications" links={[{name:"Architectural lighting catalogue",href:paths.architecture},{name:"Lighting applications",href:"/applications"},{name:"Lighting selection guides",href:"/lighting-guides"}]} />
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

    </div>
  );
}
