export const lightingDivisions = {
  architectural: {
    title: "Architectural & Commercial Lighting",
    href: "/products/architectural-lighting",
    description: "Lighting for shopping malls, showrooms, hospitality, offices and refined interiors.",
    image: "/images/architectural-commercial-lighting.webp",
    alt: "Architectural and commercial lighting",
    fallbackImage: "/images/products/office-linear.webp",
    highlights: ["Shopping malls", "Retail & showrooms", "Hospitality", "Offices"],
    categories: [],
  },
  infrastructure: {
    title: "Outdoor & Infrastructure Lighting",
    href: "/products/infrastructure-lighting",
    description: "Large-area lighting for roads, highways, industrial sites, warehouses and exterior spaces.",
    image: "/images/conference-room-linear-lighting.webp",
    fallbackImage: undefined,
    alt: "Illustrative outdoor road and street lighting application",
    highlights: ["Roads & highways", "High mast & flood lighting", "Industrial facilities", "Outdoor spaces"],
    categories: ["floodlights", "led-street-lights", "high-bay-industrial-lighting", "led-warehouse-lighting"],
  },
} as const;

export type LightingDivisionKey = keyof typeof lightingDivisions;
