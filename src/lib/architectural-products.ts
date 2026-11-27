export const architecturalProducts = [
  { slug: "recessed-downlight", name: "LED Recessed Downlight", application: "Shopping malls, hotels" },
  { slug: "surface-downlight", name: "LED Surface Downlight", application: "Commercial interiors" },
  { slug: "cob-spotlight", name: "LED COB Spotlight", application: "Retail, showrooms" },
  { slug: "track-light", name: "LED Track Light", application: "Retail displays" },
  { slug: "magnetic-track-light", name: "Magnetic Track Light", application: "Premium interiors" },
  { slug: "linear-light", name: "LED Linear Light", application: "Offices, shopping malls" },
  { slug: "suspended-linear-light", name: "Suspended Linear Light", application: "Conference rooms" },
  { slug: "panel-light", name: "LED Panel Light", application: "Offices" },
  { slug: "pendant-light", name: "LED Pendant Light", application: "Hospitality, reception" },
  { slug: "wall-washer", name: "LED Wall Washer", application: "Architectural interiors" },
  { slug: "strip-light", name: "LED Strip Light", application: "Cove and accent lighting" },
  { slug: "profile-light", name: "LED Profile Light", application: "Modern interiors" },
  { slug: "adjustable-spotlight", name: "LED Adjustable Spotlight", application: "Showrooms, galleries" },
  { slug: "grille-light", name: "LED Grille Light", application: "Retail, commercial spaces" },
  { slug: "ceiling-light", name: "LED Ceiling Light", application: "Hotels, offices" },
  { slug: "cylinder-light", name: "LED Cylinder Light", application: "Premium commercial interiors" },
] as const;

export function findArchitecturalProduct(slug: unknown) {
  return architecturalProducts.find(item => item.slug === slug);
}
