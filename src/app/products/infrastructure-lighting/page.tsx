import { LightingDivisionPage } from "@/components/lighting-division-page";
import { lightingDivisions } from "@/lib/lighting-divisions";
import { metadata as pageMetadata } from "@/lib/site";

const division = lightingDivisions.infrastructure;
export const metadata = pageMetadata(division.title, division.href, division.description);

export default function Page({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  return <LightingDivisionPage division="infrastructure" searchParams={searchParams} />;
}
