import { LightingResourceIndex, resourceMetadata } from "@/components/lighting-resource-page";

export const metadata = resourceMetadata("applications");

export default function Page() {
  return <LightingResourceIndex kind="applications" />;
}
