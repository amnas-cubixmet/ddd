import { LightingDivisionPage } from "@/components/lighting-division-page";
import { lightingDivisions } from "@/lib/lighting-divisions";
import { pageMetadata } from "@/lib/seo";

const division = lightingDivisions.infrastructure;
export const metadata = pageMetadata({ title: division.title, path: division.href, summary: division.description });

export default function Page({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  return <LightingDivisionPage division="infrastructure" searchParams={searchParams} />;
}
