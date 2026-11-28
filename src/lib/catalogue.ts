import { fixturePhoto, fixturePhotoGroups } from "./fixture-photos";

const photographedFamilies = [
  { slug: "led-flood-light", category: "floodlights", name: "LED Flood Light", label: "LED Flood Lights", description: "Compare labelled floodlights for entrances, yards and defined outdoor areas.", image: "products/flood-light" },
  { slug: "led-street-light", category: "led-street-lights", name: "LED Street Light", label: "LED Street Lights", description: "Explore roadway fixtures and compare mounting and light distribution requirements.", image: "products/street-light" },
  { slug: "led-high-bay-light", category: "high-bay-industrial-lighting", name: "LED High Bay Light", label: "LED High Bay Lights", description: "Explore round high bay and reflector designs for taller industrial spaces.", image: "products/high-bay" },
  { slug: "led-warehouse-light", category: "led-warehouse-lighting", name: "LED Warehouse Light", label: "LED Warehouse Lighting", description: "Browse linear fixture references for warehouse aisles and staging areas.", image: "products/warehouse-high-bay" },
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
  model?: { brand: string; code: string };
  specifications?: { name: string; value: string }[];
  datasheet?: `/${string}.pdf`;
  catalogue?: `/${string}.pdf`;
};

// Match only models linked to the existing product photos. Supplier references are recorded in
// docs/hilums-catalogue-reference.json and do not establish Bharat Lums stock or warranty.
const modelGuidance: Record<string, string> = {
  "oron-30": "For an entrance or short walkway, check close-range coverage and glare from the mounting position.",
  "oron-50": "When assessing a building perimeter, compare the beam footprint at the planned height and tilt.",
  "oron-100": "For a wider yard, check how the proposed beam meets the edges of the target area.",
  "glowbee-150": "When comparing floodlights for a loading area, assess shadows behind vehicles from the planned aiming positions.",
  "glowbee-200": "For a larger exterior area, check spill light and glare at site boundaries.",
  "vimio-150": "Use the VIMIO15D150 code when requesting the optic, mounting dimensions and full datasheet.",
  "neona-18": "For a pedestrian route, use the actual pole geometry to check the spaces between fixtures.",
  "neona-24": "When reviewing an access route, compare near- and far-side coverage at the intended bracket position.",
  "neona-36": "Compare distributions at the planned pole spacing and review illumination at path intersections.",
  "neona-50": "Include road width and bracket overhang when evaluating the layout.",
  "neona-100": "For a wider site, request the photometric file for the exact model and check coverage across all lanes.",
  "novapro-50": "For an existing pole line, confirm the bracket fit and compare the road-facing distribution.",
  "novapro-100": "Request the exact model data when reviewing the proposed layout, ingress requirements and surge protection.",
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
        ? `${name} is a photographed ${family.name.toLowerCase()}. ${modelGuidance[photo.image] ?? "Contact us for the model datasheet and availability."}`
        : `Photographed ${photo.name[0].toLowerCase() + photo.name.slice(1)} reference. Contact us to confirm the exact model, mounting and ratings.`,
      model: photo.wattage ? { brand: "Oreli", code: photo.name } : undefined,
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
export function isIndexableProduct(product: Product) {
  return product.status === "verified" || (product.status === "photographed" && Boolean(product.model));
}

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
