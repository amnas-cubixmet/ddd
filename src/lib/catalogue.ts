import { fixturePhoto, fixturePhotoGroups } from "./fixture-photos";

const ledFamilies = [
  [
    "floodlights",
    "LED Flood Lights",
    "Wide-area lighting for façades, yards and project sites.",
    "products/flood-light",
  ],
  [
    "led-street-lights",
    "LED Street Lights",
    "Pole-mounted lighting concepts for roads and access routes.",
    "products/street-light",
  ],
  [
    "high-bay-industrial-lighting",
    "LED High Bay Lights",
    "Overhead lighting concepts for tall industrial spaces.",
    "products/high-bay",
  ],
  [
    "led-industrial-lights",
    "LED Industrial Lights",
    "Industrial fixtures for manufacturing areas and utility spaces.",
    "products/industrial-batten",
  ],
  [
    "commercial-lighting",
    "LED Commercial Lights",
    "Lighting concepts for shops, workplaces and shared buildings.",
    "products/commercial-troffer",
  ],
  [
    "led-panel-lights",
    "LED Panel Lights",
    "Slim luminous panels for modular ceilings and interiors.",
    "products/panel-light",
  ],
  [
    "led-office-lights",
    "LED Office Lights",
    "Lighting concepts for workstations, meeting rooms and offices.",
    "products/office-linear",
  ],
  [
    "outdoor-lighting",
    "LED Outdoor Lights",
    "Architectural lighting for paths, entrances and landscapes.",
    "products/outdoor-bollard",
  ],
  [
    "led-high-mast-lighting",
    "LED High Mast Lighting",
    "Elevated luminaires for large open sites.",
    "products/high-mast",
  ],
  [
    "led-warehouse-lighting",
    "LED Warehouse Lighting",
    "Overhead lighting for storage aisles and distribution facilities.",
    "products/warehouse-high-bay",
  ],
] as const;

// Reference category names; illustrations are conceptual, not verified product photos.
const additionalLightingFamilies = [
  ["indoor-spot-lights","Indoor Spot Light","Directional accent lighting for interiors.","categories/indoor-spot-lights.svg","Aiming and highlighting interior features."],
  ["recessed-down-lights","Recessed Down Light","Recessed ceiling lighting concepts.","categories/recessed-down-lights.svg","Flush-mounted ceiling lighting."],
  ["surface-down-lights","Surface Down Light","Surface-mounted ceiling lighting concepts.","categories/surface-down-lights.svg","Ceilings without a recessed mounting cavity."],
  ["track-lights","Track Light","Adjustable lighting along a mounting track.","categories/track-lights.svg","Retail displays and accent lighting."],
  ["wall-lights","Wall Light","Wall-mounted architectural lighting concepts.","categories/wall-lights.svg","Interior walls and circulation areas."],
  ["ceiling-lights","Ceiling Light","Ceiling-mounted general lighting concepts.","categories/ceiling-lights.svg","Interior ambient lighting."],
  ["foot-lights","Foot Light","Low-level lighting concepts.","categories/foot-lights.svg","Stairs and circulation routes."],
  ["led-lamps","LED Lamp","General lamp-format LED lighting concepts.","categories/led-lamps.svg","Suitable lamp holders and general lighting."],
  ["pendant-lamps","Pendant Lamp","Suspended decorative lighting concepts.","categories/pendant-lamps.svg","Dining spaces and reception areas."],
  ["led-strip-lights","LED Strip Light","Linear LED strip lighting concepts.","categories/led-strip-lights.svg","Coves and accent lighting."],
  ["outdoor-spot-lights","Outdoor Spot Light","Directional exterior accent lighting concepts.","categories/outdoor-spot-lights.svg","Landscape and architectural accents."],
  ["spike-lights","Spike Light","Ground-spike mounted lighting concepts.","categories/spike-lights.svg","Landscape accents and garden features."],
  ["wall-washer-lights","Wall-Washer Light","Linear lighting concepts for wall illumination.","categories/wall-washer-lights.svg","Façades and architectural surfaces."],
  ["bollard-lights","Bollard Light","Freestanding low-level exterior lighting concepts.","categories/bollard-lights.svg","Paths and landscaped circulation."],
  ["gate-lights","Gate Light","Entrance and gate-mounted lighting concepts.","categories/gate-lights.svg","Entrance pillars and gates."],
  ["inground-lights","Inground Light","Recessed ground lighting concepts.","categories/inground-lights.svg","Exterior architectural accents."],
  ["pole-lights","Pole Light","Pole-mounted area lighting concepts.","categories/pole-lights.svg","Open spaces and circulation routes."],
  ["magnetic-track-48v","48V Magnetic Track","Magnetic track lighting category.","categories/magnetic-track-48v.svg","Flexible interior lighting layouts; confirm system compatibility."],
  ["underwater-lights","Underwater Light","Submerged lighting category.","categories/underwater-lights.svg","Water features; confirm suitability and installation rating."],
] as const;

const collectionFrom = ([slug, name, description, image]: readonly [
  string,
  string,
  string,
  string,
]) => ({
  slug,
  name,
  description,
  image,
});
export const catalogueCategories = [
  ...ledFamilies.map(collectionFrom),
  ...additionalLightingFamilies.map(([slug, name, description, image]) => ({ slug, name, description, image })),
];
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

function representativeImage(file: string, alt: string) {
  return {
    status: "draft" as const,
    images: [
      {
        src: artwork(`products/${file}`),
        alt,
        label: "Fixture view",
        representative: true,
      },
      {
        src: artwork(`products/${file}-detail`),
        alt: `Detail of ${alt.toLowerCase()}`,
        label: "Detail crop",
        representative: true,
      },
    ] satisfies Product["images"],
  };
}

const representativeProducts: Product[] = [
  {
    slug: "led-flood-light",
    name: "LED Flood Light",
    categories: ["floodlights", "led-high-mast-lighting"],
    ...representativeImage(
      "flood-light",
      "Rectangular LED flood light with an adjustable bracket",
    ),
    description:
      "A rectangular floodlight concept with an adjustable bracket for aiming.",
    features: ["Rectangular fixture body", "Yoke-style mounting bracket"],
    applications: "Building façades, open yards and outdoor work areas.",
  },
  {
    slug: "led-street-light",
    name: "LED Street Light",
    categories: ["led-street-lights", "outdoor-lighting"],
    ...representativeImage(
      "street-light",
      "Silver LED street light head with a pole mounting socket",
    ),
    description:
      "An elongated LED luminaire concept for pole-mounted road lighting.",
    features: ["Slim pole-top housing", "Downward-facing lens array"],
    applications: "Access roads, site entrances and parking circulation.",
  },
  {
    slug: "led-high-bay-light",
    name: "LED High Bay Light",
    categories: [
      "high-bay-industrial-lighting",
      "led-industrial-lights",
      "led-warehouse-lighting",
    ],
    ...representativeImage(
      "high-bay",
      "Round black high bay light with cooling fins",
    ),
    description:
      "A circular hanging fixture concept for tall ceilings and open interiors.",
    features: ["Circular fixture body", "Suspended mounting concept"],
    applications: "Production halls, workshops and open storage spaces.",
  },
  {
    slug: "led-industrial-light",
    name: "LED Industrial Batten",
    categories: ["led-industrial-lights", "led-warehouse-lighting"],
    ...representativeImage(
      "industrial-batten",
      "Industrial LED batten with a rounded frosted cover and side clips",
    ),
    description: "An enclosed linear fixture concept for industrial spaces.",
    features: ["Linear housing", "Frosted cover and side clips"],
    applications: "Utility passages, work areas and manufacturing facilities.",
  },
  {
    slug: "led-commercial-light",
    name: "LED Commercial Troffer",
    categories: ["commercial-lighting", "led-office-lights"],
    ...representativeImage(
      "commercial-troffer",
      "Recessed commercial LED troffer with white diffusing channels",
    ),
    description: "A recessed ceiling fixture concept with diffusing channels.",
    features: ["Ceiling-grid form", "Integrated diffuser channels"],
    applications: "Retail interiors, shared workspaces and reception areas.",
  },
  {
    slug: "led-panel-light",
    name: "LED Flat Panel",
    categories: [
      "led-panel-lights",
      "led-office-lights",
      "commercial-lighting",
    ],
    ...representativeImage(
      "panel-light",
      "Square white LED flat panel with a slim perimeter frame",
    ),
    description: "A thin square fixture concept with a broad luminous face.",
    features: ["Square form factor", "Frosted face"],
    applications: "Modular ceilings, clinics and other commercial interiors.",
  },
  {
    slug: "led-office-light",
    name: "LED Office Linear Light",
    categories: ["led-office-lights", "commercial-lighting"],
    ...representativeImage(
      "office-linear",
      "White suspended office luminaire with a continuous diffuser",
    ),
    description:
      "A suspended, white linear fixture concept for workplace layouts.",
    features: ["Cable suspension concept", "Continuous linear diffuser"],
    applications: "Desk clusters, meeting rooms and office circulation.",
  },
  {
    slug: "led-outdoor-light",
    name: "LED Outdoor Bollard",
    categories: ["outdoor-lighting"],
    ...representativeImage(
      "outdoor-bollard",
      "Black rectangular outdoor bollard with a recessed light window",
    ),
    description:
      "A freestanding outdoor fixture concept with a recessed light opening.",
    features: ["Upright rectangular housing", "Recessed light opening"],
    applications: "Paths, entrances and landscaped circulation areas.",
  },
  {
    slug: "led-high-mast",
    name: "LED High Mast Assembly",
    categories: ["led-high-mast-lighting", "floodlights"],
    ...representativeImage(
      "high-mast",
      "High mast assembly with multiple LED luminaires on a circular support",
    ),
    description:
      "A high mast lighting concept with multiple individually aimed luminaires.",
    features: ["Circular luminaire support", "Multi-head arrangement"],
    applications: "Sports grounds, logistics yards and large outdoor sites.",
  },
  {
    slug: "led-warehouse-light",
    name: "LED Warehouse Linear High Bay",
    categories: [
      "led-warehouse-lighting",
      "led-industrial-lights",
      "high-bay-industrial-lighting",
    ],
    ...representativeImage(
      "warehouse-high-bay",
      "Rectangular warehouse high bay with two parallel rows of lenses",
    ),
    description:
      "A linear high bay fixture concept for storage and distribution spaces.",
    features: ["Rectangular overhead housing", "Parallel linear lens rows"],
    applications: "Warehouse aisles, loading areas and distribution halls.",
  },
];

// These entries support enquiries without asserting stock or technical specifications.
export const additionalRepresentativeProducts: Product[] = additionalLightingFamilies.map(
  ([slug, name, description, image, applications]) => ({
    slug: `concept-${slug}`,
    name,
    categories: [slug],
    status: "draft",
    description: `${description} Contact us to confirm available models.`,
    features: [],
    applications,
    images: [{ src: artwork(image), alt: `Representative illustration of ${name}`, label: "Concept illustration", representative: true }],
  }),
);

const photographedProducts: Product[] = representativeProducts.flatMap((family) =>
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
      categories: family.categories,
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

export const products = [...representativeProducts, ...photographedProducts, ...additionalRepresentativeProducts];

export function findCatalogueFixture(categorySlug: string) {
  return [...representativeProducts, ...additionalRepresentativeProducts].find((item) => item.categories[0] === categorySlug);
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
