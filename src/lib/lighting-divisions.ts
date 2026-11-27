export const lightingDivisions = {
  architectural: {
    title: "Architectural & Commercial Lighting",
    href: "/products/architectural-lighting",
    description: "Lighting for shopping malls, showrooms, hospitality, offices and refined interiors.",
    image: "/images/products/office-linear.webp",
    alt: "Representative suspended linear LED fixture for architectural interiors",
    highlights: ["Shopping malls", "Retail & showrooms", "Hospitality", "Offices"],
    categories: ["commercial-lighting", "led-panel-lights", "led-office-lights", "indoor-spot-lights", "recessed-down-lights", "surface-down-lights", "track-lights", "wall-lights", "ceiling-lights", "foot-lights", "led-lamps", "pendant-lamps", "led-strip-lights", "magnetic-track-48v"],
  },
  infrastructure: {
    title: "Outdoor & Infrastructure Lighting",
    href: "/products/infrastructure-lighting",
    description: "Large-area lighting for roads, highways, industrial sites, warehouses and exterior spaces.",
    image: "/images/conference-room-linear-lighting.webp",
    alt: "Illustrative outdoor road and street lighting application",
    highlights: ["Roads & highways", "High mast & flood lighting", "Industrial facilities", "Outdoor spaces"],
    categories: ["floodlights", "led-street-lights", "high-bay-industrial-lighting", "led-industrial-lights", "outdoor-lighting", "led-high-mast-lighting", "led-warehouse-lighting", "outdoor-spot-lights", "spike-lights", "wall-washer-lights", "bollard-lights", "gate-lights", "inground-lights", "pole-lights", "underwater-lights"],
  },
} as const;

export type LightingDivisionKey = keyof typeof lightingDivisions;
