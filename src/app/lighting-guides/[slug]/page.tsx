import { notFound } from "next/navigation";
import { LightingResourcePage, resourceMetadata } from "@/components/lighting-resource-page";
import { guides } from "@/lib/lighting-content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => guides.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  return resourceMetadata("guides", (await params).slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = guides.find((item) => item.slug === slug);
  if (!entry) notFound();
  return <LightingResourcePage kind="guides" entry={entry} />;
}
