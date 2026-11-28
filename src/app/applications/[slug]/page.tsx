import { notFound } from "next/navigation";
import { LightingResourcePage, resourceMetadata } from "@/components/lighting-resource-page";
import { applications } from "@/lib/lighting-content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => applications.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  return resourceMetadata("applications", (await params).slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = applications.find((item) => item.slug === slug);
  if (!entry) notFound();
  return <LightingResourcePage kind="applications" entry={entry} />;
}
