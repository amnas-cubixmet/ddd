const architecturalProductTypes = [
  { slug: "recessed-downlight", name: "LED Recessed Downlight", application: "Shopping malls, hotels", selection: "Check ceiling cut-out, recess depth, driver access and beam control against the ceiling plan." },
  { slug: "surface-downlight", name: "LED Surface Downlight", application: "Commercial interiors", selection: "Confirm the surface fixing, junction location and glare control where the fitting is visible." },
  { slug: "cob-spotlight", name: "LED COB Spotlight", application: "Retail, showrooms", selection: "Review beam spread, aiming angle and colour rendering against the actual merchandise or display." },
  { slug: "track-light", name: "LED Track Light", application: "Retail displays", selection: "Confirm track type, adaptor compatibility, aiming range and beam spread at the display distance." },
  { slug: "magnetic-track-light", name: "Magnetic Track Light", application: "Premium interiors", selection: "Confirm system voltage, track profile, mounting type and compatible drivers with the exact system." },
  { slug: "linear-light", name: "LED Linear Light", application: "Offices, shopping malls", selection: "Review run lengths, junctions, light distribution and controls across the intended ceiling layout." },
  { slug: "suspended-linear-light", name: "Suspended Linear Light", application: "Conference rooms", selection: "Check suspension height, support spacing and potential reflections on screens around the table." },
  { slug: "panel-light", name: "LED Panel Light", application: "Offices", selection: "Confirm ceiling grid compatibility, driver access and glare at the normal seated position." },
  { slug: "pendant-light", name: "LED Pendant Light", application: "Hospitality, reception", selection: "Check suspension clearance, installation support and light distribution over the reception desk or table." },
  { slug: "wall-washer", name: "LED Wall Washer", application: "Architectural interiors", selection: "Compare the setback and spacing required for even illumination on the actual wall finish." },
  { slug: "strip-light", name: "LED Strip Light", application: "Cove and accent lighting", selection: "Confirm driver loading, approved run length, channel heat management and suitable mounting conditions." },
  { slug: "profile-light", name: "LED Profile Light", application: "Modern interiors", selection: "Review the recess, diffuser appearance, joining details and access for driver service." },
  { slug: "adjustable-spotlight", name: "LED Adjustable Spotlight", application: "Showrooms, galleries", selection: "Confirm the aiming range, ceiling clearance and beam edge at the actual display distance." },
  { slug: "grille-light", name: "LED Grille Light", application: "Retail, commercial spaces", selection: "Check the ceiling opening, support and aiming access for each light head." },
  { slug: "ceiling-light", name: "LED Ceiling Light", application: "Hotels, offices", selection: "Review the fixing surface, light spread and access to the wiring and driver." },
  { slug: "cylinder-light", name: "LED Cylinder Light", application: "Premium commercial interiors", selection: "Compare surface or suspended mounting, aperture shielding and beam distribution against the room layout." },
] as const;

type ArchitecturalSlug = (typeof architecturalProductTypes)[number]["slug"];

type ArchitecturalPhoto = {
  src?: string;
  alt: string;
  sourceUrl: string;
  credit: string;
  licenseUrl?: string;
  representative: boolean;
};

// Use verified photographs or explicitly identified reference images supplied for the catalogue.
// Explicit src overrides the default architectural image path.
const suppliedImageFiles: Record<ArchitecturalSlug, string> = {
  "recessed-downlight": "led-recessed-downlight.webp",
  "surface-downlight": "led-surface-downlight.webp",
  "cob-spotlight": "led-cob-spotlight.webp",
  "track-light": "led-track-light.webp",
  "magnetic-track-light": "magnetic-track-light.webp",
  "linear-light": "led-linear-light.webp",
  "suspended-linear-light": "suspended-linear-light.webp",
  "panel-light": "led-panel-light.webp",
  "pendant-light": "led-pendant-light.webp",
  "wall-washer": "led-wall-washer.webp",
  "strip-light": "led-strip-light.webp",
  "profile-light": "led-profile-light.webp",
  "adjustable-spotlight": "led-adjustable-spotlight.webp",
  "grille-light": "led-grille-light.webp",
  "ceiling-light": "led-ceiling-light.webp",
  "cylinder-light": "led-cylinder-light.webp",
};

const approvedPhotos: Partial<Record<ArchitecturalSlug, ArchitecturalPhoto>> = Object.fromEntries(
  architecturalProductTypes.map(item => {
    const src = `/images/products/fixture-photos/${suppliedImageFiles[item.slug]}`;
    return [item.slug, {
      src,
      alt: `${item.name} reference image`,
      sourceUrl: src,
      credit: "Reference image",
      representative: true,
    }];
  }),
);

export const architecturalProducts = architecturalProductTypes.map(item => {
  const photo = approvedPhotos[item.slug];
  return {
    ...item,
    image: photo
      ? { ...photo, src: photo.src ?? `/images/products/architectural/${item.slug}.webp` }
      : undefined,
  };
});

export function findArchitecturalProduct(slug: unknown) {
  return architecturalProducts.find(item => item.slug === slug);
}
