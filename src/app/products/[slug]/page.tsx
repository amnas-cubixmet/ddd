import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, MessageCircle } from "lucide-react";
import { Gallery } from "@/components/gallery";
import { RelatedCatalogueGrid } from "@/components/related-catalogue-grid";
import { Action, ProductCard, QuoteBanner } from "@/components/ui";
import {
  catalogueLabel,
  collections,
  isIndexableProduct,
  products,
  relatedProducts,
  fixturePhoto,
  fixturePhotoGroups,
  categoryDetails,
  lightingDivisions,
  infrastructureEditorial,
} from "@/lib/catalogue";
import { brand } from "@/lib/site";
import { absoluteUrl, pageMetadata, paths } from "@/lib/seo";
import { JsonLd, PageSchema } from "@/components/seo-data";
import { LightingFaq, LightingLinks, LightingSections } from "@/components/lighting-content";
import photoStyles from "./fixture-photos.module.css";
import detailStyles from "../product-detail.module.css";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  const category = collections.find((collection) => collection.slug === item?.categories[0]);
  return item ? pageMetadata({
    title: item.model && category ? `${item.name} – ${category.name}` : item.name,
    path: paths.product(slug),
    summary: item.description,
    image: item.images[0],
    index: isIndexableProduct(item),
  }) : {};
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  if (!item) notFound();

  const photographed = item.status === "photographed";
  const specs = item.status === "draft" ? [] : [...(item.specifications ?? [])];
  if (item.model) {
    specs.unshift({ name: "Model code", value: item.model.code });
    specs.unshift({ name: "Brand on label", value: item.model.brand });
  }
  if (item.status !== "draft" && item.wattages?.length) {
    specs.unshift({ name: "Wattage", value: `${item.wattages.join(" / ")} W` });
  }
  const downloads =
    item.status === "verified"
      ? [
          { label: "Download datasheet", href: item.datasheet },
          { label: "Download catalogue", href: item.catalogue },
        ].filter((download) => download.href)
      : [];
  const preferredRelated = relatedProducts(item);
  const related = [...preferredRelated, ...products.filter(product => product.slug !== item.slug && product.status !== "draft" && product.categories.some(category => item.categories.includes(category)) && !preferredRelated.some(other => other.slug === product.slug))].slice(0, 4);
  const photoGroup = fixturePhotoGroups[slug];
  const enquiryHref =
    item.status === "draft"
      ? `/contact?collection=${item.categories[0]}`
      : `/contact?product=${slug}`;
  const whatsappNumber = brand.phoneHref.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hello Bharat Lums, I would like more information about ${item.name}. Please share the available options and specifications.`,
  );

  const path = paths.product(slug);
  const url = absoluteUrl(path);
  const family = collections.find(({ slug }) => item.categories.includes(slug));
  const guidance = family ? categoryDetails(family.slug) : undefined;
  const editorial = infrastructureEditorial(item);

  return (
    <>
      <PageSchema title={item.name} path={path} summary={item.description} ancestors={[
        { name: "Products", href: paths.products },
        { name: lightingDivisions.infrastructure.title, href: paths.infrastructure },
        ...(family ? [{ name: family.name, href: paths.category(family.slug) }] : []),
      ]} />
      {url && isIndexableProduct(item) && <JsonLd data={{
        "@type": "Product",
        "@id": `${url}#product`,
        name: item.name,
        description: item.description,
        url,
        image: item.images.map(({ src }) => absoluteUrl(src)),
        category: family?.name,
        ...(item.model ? { brand: { "@type": "Brand", name: item.model.brand }, model: item.model.code } : {}),
        additionalProperty: specs.filter(({ name }) => name !== "Brand on label" && name !== "Model code")
          .map(({ name, value }) => ({ "@type": "PropertyValue", name, value })),
      }} />}
      <section className={`shell detail-grid catalogue-detail-motion ${detailStyles.detail}`} aria-labelledby="fixture-title">
        <div className={detailStyles.mediaColumn}>
        <Gallery images={item.images} />
        <div className={detailStyles.specifications}>
          <h2 id="specifications-title">Technical specifications</h2>
          {specs.length > 0 ? (
            <table className="product-spec-table">
              <caption className={photographed ? photoStyles.specCaption : "sr-only"}>
                {photographed ? "As marked on the fixture label" : "Verified fixture specifications"}
              </caption>
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.name}>
                    <th scope="row">{spec.name}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              Ask our team for available models and verified specifications.
            </p>
          )}
          {specs.length > 0 && photographed && (
            <p>Ask for the exact datasheet and current availability. Confirm light output, electrical requirements, mounting and any project-specific ratings before ordering.</p>
          )}
          {downloads.length > 0 && (
            <div className="product-detail-actions">
              {downloads.map(({ href, label }) => (
                <a download className="text-link" href={href} key={label}>
                  {label} <Download size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
          <div className={detailStyles.editorial}><LightingSections sections={editorial.sections} /></div>
        </div>
        <div className={detailStyles.infoColumn}>
        <div className={`detail-copy ${detailStyles.summary}`}>
          <p className={detailStyles.eyebrow}>{[item.model?.brand, family?.name ?? catalogueLabel(item)].filter(Boolean).join(" · ")}</p>
          <h1 id="fixture-title">{item.name}</h1>
          <p className={detailStyles.lead}>{item.description}</p>
          {specs.length > 0 && <ul className={detailStyles.highlights} aria-label="Key product information">
            {specs.slice(0,4).map(({name,value}) => <li key={name}><span>{name}</span><strong>{value}</strong></li>)}
          </ul>}
          {item.status === "draft" && <p className={detailStyles.note}>Fixture reference. Confirm the exact model and specifications with our team.</p>}
          <div className={detailStyles.cta}>
            <p>Share your requirements to confirm model availability and request a project quotation.</p>
          <div className="product-detail-actions">
            <Action href={enquiryHref}>Request a quote</Action>
            <a
              className="button button-outline"
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp enquiry
            </a>
          </div>
          </div>
          {family && <Link className={detailStyles.categoryLink} href={paths.category(family.slug)}>Explore {family.name.toLowerCase()} <span aria-hidden="true">↗</span></Link>}
        </div>
        <aside className={detailStyles.projectPanel} aria-label="Project enquiry and applications">
          <h2>Planning a lighting project?</h2>
          <p>Send your fixture reference, quantities, mounting requirements and project location to request suitable options.</p>
          <Action href={enquiryHref}>Request a project quote</Action>
          {family && <><h3>Lighting application</h3><Link className={detailStyles.resourceLink} href={paths.category(family.slug)}>{family.name} <span aria-hidden="true">↗</span></Link></>}
          {item.applications && <p>{item.applications}</p>}
          {guidance && <><h3>Selection and installation</h3><p>{guidance.selection}</p></>}
          {item.features.length > 0 && <><h3>Fixture features</h3><ul>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul></>}
        </aside>
        </div>
      </section>
      <div className="shell"><LightingFaq entries={editorial.faq} /></div>
      {photoGroup && (
        <section className="shell section-tight" aria-labelledby="fixture-photos">
          <div className={photoStyles.intro}>
            <h2 id="fixture-photos">{photoGroup.title}</h2>
            <p>{photoGroup.description}</p>
          </div>
          <div className="card-grid">
            {photoGroup.photos.map(({ image, name, wattage, rating }) => {
              const title = wattage ? `${name} · ${wattage}W` : name;
              return (
                <figure className={photoStyles.figure} key={image}>
                  <Link href={`/products/${image}`} className={photoStyles.photo} aria-label={`View ${title}`}>
                    <Image
                      src={fixturePhoto(image)}
                      alt={`${title} fixture photograph`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 560px) 92vw, (max-width: 805px) 45vw, (max-width: 1450px) 30vw, 430px"
                    />
                  </Link>
                  <figcaption className={photoStyles.caption}>
                    <h3>{title}</h3>
                    {rating && <p>{rating} on label</p>}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}
      {guidance && <div className="shell"><LightingLinks title="Lighting guides and applications" links={[
        { name: "Lighting application planning", href: paths.application(guidance.application) },
        { name: "Fixture selection guide", href: paths.guide(guidance.guide) },
      ]} /></div>}
      {related.length > 0 && (
        <section className="shell section-tight" aria-labelledby="related-fixtures">
          <h2 className="catalogue-section-title" id="related-fixtures">
            Related fixtures
          </h2>
          <RelatedCatalogueGrid signature={related.map(product => product.slug).join("|")}>
            {related.map(product => (
              <div className="catalogue-motion-item" data-catalogue-item={product.slug} key={product.slug}>
                <ProductCard item={product} managedMotion />
              </div>
            ))}
          </RelatedCatalogueGrid>
        </section>
      )}

      <QuoteBanner />
    </>
  );
}
