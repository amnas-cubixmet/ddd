import { fixturePhoto, fixturePhotoGroups } from "./fixture-photos";

const photographedFamilies = [
  { slug: "led-flood-light", category: "floodlights", name: "LED Flood Light", label: "LED Flood Lights", description: "Photographed flood light fixtures.", image: "products/flood-light" },
  { slug: "led-street-light", category: "led-street-lights", name: "LED Street Light", label: "LED Street Lights", description: "Photographed street light fixtures.", image: "products/street-light" },
  { slug: "led-high-bay-light", category: "high-bay-industrial-lighting", name: "LED High Bay Light", label: "LED High Bay Lights", description: "Photographed round fixtures and reflectors.", image: "products/high-bay" },
  { slug: "led-warehouse-light", category: "led-warehouse-lighting", name: "LED Warehouse Light", label: "LED Warehouse Lighting", description: "Photographed linear modular fixtures.", image: "products/warehouse-high-bay" },
] as const;

export const catalogueCategories = photographedFamilies.map(family => ({
  slug: family.category,
  name: family.label,
  description: family.description,
  image: family.image,
}));
export const collections = catalogueCategories;
export function findCollection(slug: unknown) {
  return collections.find((item) => item.slug === slug);
}

export const artwork = (name: string) => `/images/${name.endsWith(".svg") ? name : `${name}.webp`}`;

export type ProductImage = {
  src: string;
  alt: string;
  label: string;
  representative: boolean;
};

export type Product = {
  slug: string;
  name: string;
  images: [ProductImage, ...ProductImage[]];
  categories: string[];
  description: string;
  features: string[];
  applications: string;
  status: "draft" | "photographed" | "verified";
  wattages?: number[];
  specifications?: { name: string; value: string }[];
  datasheet?: `/${string}.pdf`;
  catalogue?: `/${string}.pdf`;
};

const photographedProducts: Product[] = photographedFamilies.flatMap((family) =>
  (fixturePhotoGroups[family.slug]?.photos ?? []).map((photo) => {
    const name = photo.wattage
      ? `Oreli ${photo.name} · ${photo.wattage} W`
      : photo.name;
    const cover = {
      src: fixturePhoto(photo.image),
      alt: name,
      label: "Fixture view",
      representative: false,
    };
    return {
      slug: photo.image,
      name,
      status: "photographed",
      categories: [family.category],
      description: photo.wattage
        ? `Photographed ${family.name.toLowerCase()} with an Oreli model label.`
        : "Photographed fixture. Ask us for the exact model and specifications.",
      features: [],
      applications: "",
      images: [
        cover,
        ...Array.from({ length: photo.photoCount - 1 }, (_, i) => ({
          ...cover,
          src: fixturePhoto(`${photo.image}-${i + 2}`),
          alt: `${name}, photo ${i + 2}`,
          label: `Photo ${i + 2}`,
        })),
      ],
      wattages: photo.wattage ? [photo.wattage] : undefined,
      specifications: photo.rating
        ? [{ name: "IP rating", value: photo.rating }]
        : undefined,
    };
  }),
);

export const products = photographedProducts;

export function findCatalogueFixture(categorySlug: string) {
  return products.find((item) => item.categories.includes(categorySlug));
}

export const publishedProducts = products.filter(
  (product) => product.status !== "draft",
);
export const catalogueDownload = publishedProducts.find(
  (product) => product.status === "verified" && product.catalogue,
)?.catalogue;

export function catalogueLabel(product: Product) {
  if (product.status === "verified") return "Verified fixture";
  if (product.status === "photographed") return "Fixture photo";
  return "Representative fixture";
}

export function relatedProducts(product: Product) {
  return products
    .filter((item) => item.slug !== product.slug)
    .filter((item) => score(item) > 0)
    .sort((a, b) => score(b) - score(a) || Number(a.status === "draft") - Number(b.status === "draft"))
    .slice(0, 3);

  function score(item: Product) {
    const shared = item.categories.filter((category) =>
      product.categories.includes(category),
    ).length;
    return shared;
  }
}

export const projectCategories = [
  "Residential",
  "Hospitality",
  "Commercial",
  "Corporate",
  "Retail",
  "Restaurants",
  "Architecture",
  "Outdoor Spaces",
];

export type Project = {
  slug: string;
  name: string;
  category: (typeof projectCategories)[number];
  image: string;
  gallery: string;
  overview: string;
  approach: string;
  application: string;
  product: string;
};

export const projects: Project[] = [];
export type CatalogueCategory = (typeof catalogueCategories)[number];
