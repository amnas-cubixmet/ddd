import { ProductsBrowser } from "@/components/browse";
import type { architecturalProducts } from "@/lib/catalogue";

export function ArchitecturalCards({ items }: { items: readonly (typeof architecturalProducts)[number][] }) {
  return <ProductsBrowser architectureItems={items} />;
}
