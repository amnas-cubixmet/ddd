import Link from "next/link";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import {
  findCollection,
  type Product,
} from "@/lib/catalogue";
import { brand } from "@/lib/site";
import { BrandMark } from "./nav";

import { Action } from "./action";
import { FooterProject } from "./footer-project";
import { Reveal } from "./motion";
import { CatalogueImage } from "./catalogue-image";

export { Action };

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro shell">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro-copy">{description}</p>
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  href,
  link,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <Reveal className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-link">
          {link}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </Reveal>
  );
}

export function ProductCard({
  item,
  managedMotion = false,
}: {
  item: Product;
  managedMotion?: boolean;
}) {
  const className = `media-card product-card${item.status === "photographed" ? " product-card-photographed" : ""}`;
  const content = (
    <>
      <Link
        href={`/products/${item.slug}`}
        className="image-link"
        aria-label={`View ${item.name}`}
      >
        <CatalogueImage
          src={item.images[0].src}
          alt={item.images[0].alt}
          sizes="(max-width: 540px) 92vw, (max-width: 900px) 46vw, 32vw"
        />
        <span className="card-icon">
          <ArrowUpRight size={19} />
        </span>
      </Link>
      <div className="card-body">
        <h3>
          <Link href={`/products/${item.slug}`}>
            {item.categories.map(findCollection).find(Boolean)?.name
              ? `${item.categories.map(findCollection).find(Boolean)?.name} (${item.name})`
              : item.name}
          </Link>
        </h3>
        <p>{item.description}</p>
        {item.status === "verified" &&
        (item.wattages?.length || item.specifications?.length) ? (
          <ul className="product-card-specs">
            {item.wattages?.length ? (
              <li>{item.wattages.join(" / ")} W</li>
            ) : null}
            {item.specifications?.slice(0, 2).map((spec) => (
              <li key={spec.name}>
                {spec.name} {spec.value}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="card-actions">
          <Link className="text-link" href={`/products/${item.slug}`}>
            View details <ArrowRight size={13} />
          </Link>
          <Link
            className="text-link"
            href={`/request-quote?product=${item.slug}`}
          >
            Enquire now <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
  return managedMotion
    ? <article className={className}>{content}</article>
    : <Reveal as="article" className={className}>{content}</Reveal>;
}

export function QuoteBanner() {
  return (
    <section className="quote-banner">
      <div className="shell quote-inner">
        <div>
          <p className="eyebrow">Work with us</p>
          <h2>Have a space in mind?</h2>
          <p>
            Tell us what you’re working on. We’ll help you explore the lighting
            options.
          </p>
        </div>
        <Action href="/request-quote" diagonal>
          Request a quote
        </Action>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <FooterProject />
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="brand-link">
              <BrandMark />
            </Link>
            <p>LED lighting for commercial, industrial and outdoor spaces.</p>
          </div>
          <nav className="footer-links" aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            <Link href="/products">Product Catalogue</Link>
            <Link href="/about">Company Information</Link>
            <Link href="/#global-presence">Global presence</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="footer-links">
            <h2>Get in touch</h2>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={brand.phoneHref}>{brand.phone}</a>
            <a
              href={`https://wa.me/${brand.phoneHref.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp enquiries
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bharat Lums</span>
          <a href="#top">
            Back to top <ArrowDown size={14} className="rotate-180" />
          </a>
        </div>
      </div>
    </footer>
  );
}
