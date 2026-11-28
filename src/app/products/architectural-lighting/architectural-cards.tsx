import { ProductsBrowser } from "@/components/browse";
import type { architecturalProducts } from "@/lib/architectural-products";

export function ArchitecturalCards({ items }: { items: readonly (typeof architecturalProducts)[number][] }) {
  return <ProductsBrowser architectureItems={items} />;
}
