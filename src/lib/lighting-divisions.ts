export const lightingDivisions = {
  architectural: {
    title: "Architectural & Commercial Lighting",
    href: "/products/architectural-lighting",
    description: "Compare architectural and commercial LED lighting fixture types for offices, retail showrooms, shopping centres and hospitality interiors.",
    image: "/images/architectural-commercial-lighting.webp",
    alt: "Architectural and commercial lighting",
    fallbackImage: "/images/products/office-linear.webp",
    highlights: ["Shopping malls", "Retail & showrooms", "Hospitality", "Offices"],
    categories: [],
  },
  infrastructure: {
    title: "Outdoor & Infrastructure Lighting",
    href: "/products/infrastructure-lighting",
    description: "Explore outdoor and infrastructure LED lighting for roads, parking areas, industrial facilities and warehouses. Compare photographed fixtures and project requirements.",
    image: "/images/conference-room-linear-lighting.webp",
    fallbackImage: undefined,
    alt: "Illustrative outdoor road and street lighting application",
    highlights: ["Roads & highways", "Flood lighting", "Industrial facilities", "Outdoor spaces"],
    categories: ["floodlights", "led-street-lights", "high-bay-industrial-lighting", "led-warehouse-lighting"],
  },
} as const;

export type LightingDivisionKey = keyof typeof lightingDivisions;
