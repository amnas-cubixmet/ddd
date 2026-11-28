import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  publishedProducts,
  architecturalProducts,
} from "@/lib/catalogue";
import { paths } from "@/lib/seo";
import styles from "./featured-products.module.css";

const outdoor = [
  { slug: "neona-50", title: "LED Street Light" },
  { slug: "oron-100", title: "LED Flood Light" },
  { slug: "round-black-grouped", title: "LED High Bay Light" },
  { slug: "linear-dual", title: "LED Warehouse Light" },
] as const;
const indoor = ["panel-light", "track-light"] as const;

const featured = [
  ...outdoor.flatMap(({ slug, title }) => {
    const product = publishedProducts.find((item) => item.slug === slug);
    if (!product) return [];
    return [{
      title,
      subtitle: product.name,
      image: product.images[0].src,
      alt: product.images[0].alt,
      href: paths.product(product.slug),
    }];
  }),
  ...indoor.flatMap((slug) => {
    const product = architecturalProducts.find((item) => item.slug === slug);
    if (!product?.image) return [];
    return [{
      title: product.name,
      subtitle: product.application,
      image: product.image.src,
      alt: product.image.alt,
      href: paths.architecturalFixture(product.slug),
    }];
  }),
];

export function FeaturedProducts() {
  return (
    <section className={`shell ${styles.section}`} aria-labelledby="featured-products-heading">
      <div className={styles.heading}>
        <h2 id="featured-products-heading">Featured Products</h2>
        <Link href={paths.products} className={styles.all}>All Products <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <ul className={styles.grid} role="list" data-testid="featured-products">
        {featured.map((product) => (
          <li key={product.href}>
            <Link href={product.href} className={styles.card} prefetch={false}>
              <div className={styles.image}>
                <Image src={product.image} alt={product.alt} fill sizes="(max-width: 767px) 45vw, (max-width: 1450px) 30vw, 440px" loading="lazy" />
              </div>
              <div className={styles.copy}>
                <h3>{product.title}</h3>
                <p>{product.subtitle}</p>
                <span className={styles.details}>View details <ArrowUpRight size={14} aria-hidden="true" /></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
