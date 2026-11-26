import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Action,
  PageIntro,
  ProjectCard,
  QuoteBanner,
  SectionHead,
} from "@/components/ui";
import {
  artwork,
  projects,
  publishedProducts,
} from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const item = projects.find((project) => project.slug === slug);
  return item
    ? pageMetadata(
        item.name,
        `/portfolio/${slug}`,
        item.overview,
        artwork(item.image),
      )
    : {};
}
export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const item = projects.find((project) => project.slug === slug);
  if (!item) notFound();
  const published = publishedProducts.some(({ slug }) => slug === item.product);
  const fixtureHref = published ? `/products/${item.product}` : "/products";
  return (
    <>
      <PageIntro
        eyebrow={`${item.category} · Concept / inspiration`}
        title={item.name}
        description={item.overview}
      />
      <section className="shell section-tight" aria-label="Project details">
        <div className="project-hero">
          <Image
            src={artwork(item.image)}
            alt={`${item.name} architectural lighting concept`}
            fill
            loading="lazy"
            sizes="95vw"
          />
        </div>
        <div className="detail-grid">
          <div className="detail-copy">
            <h2>Lighting approach</h2>
            <p>{item.approach}</p>
            <h2>Fixture used in the concept</h2>
            <p>{item.application}</p>
            <Action href={fixtureHref} secondary>
              {published ? "View fixture" : "Explore the product catalogue"}
            </Action>
          </div>
          <div className="detail-image">
            <Image
              src={artwork(item.gallery)}
              alt={`${item.application} lighting study`}
              fill
              loading="lazy"
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="related">
          <SectionHead eyebrow="More inspiration" title="Related concepts." />
          <div className="card-grid wide">
            {projects
              .filter((project) => project.slug !== slug)
              .slice(0, 2)
              .map((project) => (
                <ProjectCard item={project} key={project.slug} />
              ))}
          </div>
        </div>
      </section>
      <QuoteBanner />
    </>
  );
}
