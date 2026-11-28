import { absoluteUrl } from "@/lib/seo";

export type Breadcrumb = { name: string; href: string };

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const content = Array.isArray(data) ? { "@graph": data } : data;
  const json = JSON.stringify({ "@context": "https://schema.org", ...content }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function PageSchema({ title, path, summary, ancestors = [], items }: {
  title: string;
  path: string;
  summary: string;
  ancestors?: Breadcrumb[];
  items?: Breadcrumb[];
}) {
  const url = absoluteUrl(path);
  if (!url) return null;

  const data: Record<string, unknown>[] = [{
    "@type": items ? "CollectionPage" : "WebPage",
    "@id": `${url}#page`,
    name: title,
    description: summary,
    url,
    isPartOf: { "@id": absoluteUrl("/#website") },
    ...(path !== "/" ? { breadcrumb: { "@id": `${url}#breadcrumbs` } } : {}),
    ...(items?.length ? { mainEntity: { "@id": `${url}#items` } } : {}),
  }];

  if (path !== "/") {
    data.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [{ name: "Home", href: "/" }, ...ancestors, { name: title, href: path }].map(({ name, href }, index) => ({
        "@type": "ListItem", position: index + 1, name, item: absoluteUrl(href),
      })),
    });
  }
  if (items?.length) {
    data.push({
      "@type": "ItemList",
      "@id": `${url}#items`,
      itemListElement: items.map(({ name, href }, index) => ({
        "@type": "ListItem", position: index + 1, name, url: absoluteUrl(href),
      })),
    });
  }
  return <JsonLd data={data} />;
}
