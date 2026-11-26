import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, MessageCircle } from "lucide-react";
import { Gallery } from "@/components/gallery";
import { Action, PageIntro, ProductCard, QuoteBanner } from "@/components/ui";
import {
  catalogueLabel,
  collections,
  products,
  relatedProducts,
} from "@/lib/catalogue";
import { fixturePhoto, fixturePhotoGroups } from "@/lib/fixture-photos";
import { brand, metadata as pageMetadata } from "@/lib/site";
import photoStyles from "./fixture-photos.module.css";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  return item
    ? pageMetadata(
        item.name,
        `/products/${slug}`,
        item.description,
        item.images[0].src,
      )
    : {};
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  if (!item) notFound();

  const photographed = item.status === "photographed";
  const specs = item.status === "draft" ? [] : [...(item.specifications ?? [])];
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
  const related = relatedProducts(item);
  const photoGroup = fixturePhotoGroups[slug];
  const enquiryHref =
    item.status === "draft"
      ? `/request-quote?collection=${item.categories[0]}`
      : `/request-quote?product=${slug}`;
  const whatsappNumber = brand.phoneHref.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hello Bharat Lums, I would like more information about ${item.name}. Please share the available options and specifications.`,
  );

  return (
    <>
      <PageIntro
        eyebrow={catalogueLabel(item)}
        title={item.name}
        description={item.description}
      />
      <section
        className="shell detail-grid section-tight"
        aria-label="Fixture details"
      >
        <Gallery images={item.images} />
        <div className="detail-copy">
          <Link className="text-link" href="/products">
            ← All products
          </Link>
          {item.features.length > 0 && (
            <>
              <h2>{item.status === "verified" ? "Fixture features" : "Design features"}</h2>
              <ul>
                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </>
          )}
          {item.applications && (
            <>
              <h2>Applications</h2>
              <p>{item.applications}</p>
            </>
          )}
          <h2>Technical information</h2>
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
          {downloads.length > 0 && (
            <div className="product-detail-actions">
              {downloads.map(({ href, label }) => (
                <a download className="text-link" href={href} key={label}>
                  {label} <Download size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
          <div className="filter-pills">
            {collections
              .filter((category) => item.categories.includes(category.slug))
              .map((category) => (
                <Link
                  className="text-link"
                  key={category.slug}
                  href={{ pathname: "/products", query: { category: category.slug } }}
                >
                  {category.name}
                </Link>
              ))}
          </div>
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
      </section>
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
                      alt=""
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
      {related.length > 0 && (
        <section className="shell section-tight" aria-labelledby="related-fixtures">
          <h2 className="catalogue-section-title" id="related-fixtures">
            Related fixtures
          </h2>
          <div className="card-grid">
            {related.map((product) => (
              <ProductCard item={product} key={product.slug} />
            ))}
          </div>
        </section>
      )}
      <QuoteBanner />
    </>
  );
}
