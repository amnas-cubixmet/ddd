import { ProductsBrowser } from "@/components/browse";
import { notFound } from "next/navigation";
import { LightingFaq, LightingLinks, LightingSections } from "@/components/lighting-content";
import { PageSchema } from "@/components/seo-data";
import { Action, PageIntro } from "@/components/ui";
import { catalogueCategories, findCollection, isIndexableProduct, publishedProducts } from "@/lib/catalogue";
import { categoryDetails } from "@/lib/category-content";
import { categoryEditorial } from "@/lib/product-editorial";
import { pageMetadata, paths } from "@/lib/seo";
import { lightingDivisions } from "@/lib/lighting-divisions";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogueCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = findCollection(slug);
  const content = categoryDetails(slug);
  return category && content ? pageMetadata({ title: category.name, path: paths.category(slug), summary: content.summary }) : {};
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = findCollection(slug);
  const content = categoryDetails(slug);
  if (!category || !content) notFound();
  const fixtures = publishedProducts.filter(({ categories }) => categories.includes(slug));
  const wattages = Array.from(new Set(fixtures.flatMap((fixture) => fixture.wattages ?? []))).sort((a, b) => a - b);

  return (
    <>
      <PageSchema title={category.name} path={paths.category(slug)} summary={content.summary}
        ancestors={[{ name: "Products", href: paths.products }, { name: lightingDivisions.infrastructure.title, href: paths.infrastructure }]}
        items={fixtures.filter(isIndexableProduct).map(({ name, slug }) => ({ name, href: paths.product(slug) }))} />
      <PageIntro title={category.name} eyebrow="Lighting catalogue" description={content.summary} />
      <div className="shell section-tight">
        <section aria-labelledby="category-list">
          <h2 className="catalogue-section-title" id="category-list">Catalogue fixtures</h2>
          {wattages.length > 0 && <p>Photographed label wattages include {wattages.join(", ")} W. Contact us to confirm the exact specifications and quote availability.</p>}
          <ProductsBrowser initialCategory={slug} allowedCategories={[slug]} fixedCategory />
        </section>
        <LightingSections sections={[
          { title: "Applications", text: content.use },
          { title: "How to compare fixtures", text: content.selection },
          ...categoryEditorial(slug),
        ]} />
        <LightingFaq entries={[{ question: content.question, answer: content.answer }]} />
        <LightingLinks title="Related lighting resources" links={[
          { name: "Project application and planning", href: paths.application(content.application) },
          { name: "Technical selection guide", href: paths.guide(content.guide) },
          ...catalogueCategories.filter((item) => item.slug !== slug)
            .map((item) => ({ name: item.name, href: paths.category(item.slug) })),
        ]} />
        <Action href={`/contact?collection=${slug}`}>Request a quote for {category.name}</Action>
      </div>
    </>
  );
}
