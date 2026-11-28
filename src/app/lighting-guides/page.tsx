import { LightingResourceIndex, resourceMetadata } from "@/components/lighting-resource-page";

export const metadata = resourceMetadata("guides");

export default function Page() {
  return <LightingResourceIndex kind="guides" />;
}
