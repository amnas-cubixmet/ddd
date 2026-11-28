// Single source of truth for product, category, division, image and editorial data.
// Keep this module browser-safe: it is shared by server and client components.
import { paths } from "./seo";

// --- Fixture photo inventory and image paths ---

type FixturePhoto = {
  image: string;
  name: string;
  photoCount: number;
  wattage?: number;
  rating?: string;
};

type FixturePhotoGroup = {
  title: string;
  description: string;
  photos: FixturePhoto[];
};

const labelNote =
  "Model names, wattages and IP ratings come from the photographed labels where readable. Contact us to confirm availability and request a datasheet.";

export const fixturePhotoGroups: Record<string, FixturePhotoGroup> = {
  "led-flood-light": {
    title: "Oreli flood light variants",
    description: labelNote,
    photos: [
      { image: "oron-30", name: "OFL-ORON", photoCount: 3, wattage: 30, rating: "IP65" },
      { image: "oron-50", name: "OFL-ORON", photoCount: 4, wattage: 50, rating: "IP65" },
      { image: "oron-100", name: "OFL-ORON", photoCount: 4, wattage: 100, rating: "IP65" },
      { image: "glowbee-150", name: "OFL-GlowBee", photoCount: 4, wattage: 150, rating: "IP65" },
      { image: "glowbee-200", name: "OFL-GlowBee", photoCount: 5, wattage: 200, rating: "IP65" },
      { image: "vimio-150", name: "VIMIO15D150", photoCount: 5, wattage: 150, rating: "IP65" },
    ],
  },
  "led-street-light": {
    title: "Oreli street light variants",
    description: labelNote,
    photos: [
      { image: "neona-18", name: "OSL-NEONA", photoCount: 4, wattage: 18, rating: "IP65" },
      { image: "neona-24", name: "OSL-NEONA", photoCount: 2, wattage: 24, rating: "IP65" },
      { image: "neona-36", name: "OSL-NEONA", photoCount: 5, wattage: 36, rating: "IP65" },
      { image: "neona-50", name: "OSL-NEONA", photoCount: 4, wattage: 50, rating: "IP65" },
      { image: "neona-100", name: "OSL-NEONA", photoCount: 4, wattage: 100, rating: "IP65" },
      { image: "novapro-50", name: "OSL-NOVAPRO", photoCount: 7, wattage: 50 },
      { image: "novapro-100", name: "OSL-NOVAPRO", photoCount: 5, wattage: 100 },
    ],
  },
  "led-high-bay-light": {
    title: "Round fixture photo references",
    description: "Browse the photographed round fixtures and reflector designs. Contact us to confirm models, mounting applications and ratings.",
    photos: [
      { image: "round-black-exposed", photoCount: 8, name: "Black round fixture with exposed LED board" },
      { image: "round-black-grouped", photoCount: 12, name: "Black round fixture with grouped lens modules" },
      { image: "round-black-multilens", photoCount: 9, name: "Black bracket-mounted multi-lens fixture" },
      { image: "round-silver-multilens", photoCount: 9, name: "Silver bracket-mounted multi-lens fixture" },
      { image: "round-silver-face", photoCount: 7, name: "Silver round LED fixture" },
      { image: "reflector-grouped", photoCount: 9, name: "Round reflector with grouped lenses" },
      { image: "reflector-exposed", photoCount: 6, name: "Round reflector with exposed LED board" },
      { image: "reflector-dark-ring", photoCount: 6, name: "Large round reflector with dark inner ring" },
      { image: "deep-reflector", photoCount: 3, name: "Round fixture with deep reflector" },
    ],
  },
  "led-warehouse-light": {
    title: "Linear fixture photo references",
    description: "Browse the photographed single-bar and dual-bar fixtures. Contact us to confirm models, mounting applications and ratings.",
    photos: [
      { image: "linear-single", name: "Single-bar modular LED fixture", photoCount: 5 },
      { image: "linear-dual", name: "Dual-bar modular LED fixture", photoCount: 3 },
    ],
  },
};

export const fixturePhoto = (image: string) =>
  `/images/products/fixture-photos/${image}.webp`;

export const fixtureOverviewPhotos = Array.from({ length: 7 }, (_, i) =>
  fixturePhoto(`overview-${i + 1}`),
);

// --- Infrastructure product catalogue and categories ---

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

// --- Architectural and commercial product catalogue ---

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

// --- Lighting divisions ---

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

// --- Category and division content ---

export const categoryContent = {
  floodlights: {
    summary: "Compare photographed Oreli LED flood lights from 30 W to 200 W and learn what to check for yards, entrances and other exterior areas.",
    application: "parking-area-lighting",
    guide: "choose-led-flood-lights",
    use: "Flood lights are used to illuminate defined outdoor areas such as yards, loading zones and entrances. Compare the width and depth of the target area, mounting height and aiming direction.",
    selection: "Compare beam distribution, mounting adjustment and model-specific ingress protection against the actual site. Review glare and light spill from normal sightlines before approving an aiming plan.",
    question: "How do I choose a floodlight wattage?",
    answer: "Use the target light level, mounting distance and exact beam distribution. Wattage describes power use. Ask for the photometric file and calculate coverage before selecting the model.",
  },
  "led-street-lights": {
    summary: "Browse photographed Oreli LED street lights with labelled options from 18 W to 100 W. Compare roadway optics, mounting requirements and quotation details.",
    application: "road-and-highway-lighting",
    guide: "led-street-light-guide",
    use: "Street luminaires distribute light along a route. Applications include access roads, pedestrian links and carriageways, subject to project requirements and the selected optic.",
    selection: "Provide road width, mounting height, pole spacing, bracket dimensions and any required surge protection. Use the exact luminaire's photometric data to check coverage across lanes and between poles.",
    question: "Can I replace an existing street light with the same wattage?",
    answer: "Check the existing pole positions, bracket fit and new fixture photometry first. The same wattage can produce a different distribution and a different result on the road.",
  },
  "high-bay-industrial-lighting": {
    summary: "Explore industrial LED high bay fixture designs and learn how to compare mounting height, optics and glare in tall workshops and production spaces.",
    application: "factory-lighting",
    guide: "led-high-bay-lighting-guide",
    use: "High bay fixtures are considered for taller production, workshop and storage interiors. In the catalogue, rounded designs and reflectors serve as photographed references for discussion.",
    selection: "List ceiling height, work heights, the locations of large equipment and any cleaning or temperature constraints. Compare optics and expected glare at practical viewing angles. Confirm mounting hardware, ratings and the exact model with the team.",
    question: "Are round LED high bays suitable for every industrial site?",
    answer: "Suitability depends on the layout, environmental requirements and task. Narrow aisles, open workshops and inspection areas can require different distributions or supplementary task lighting.",
  },
  "led-warehouse-lighting": {
    summary: "Review photographed linear LED fixture designs for warehouse lighting discussions. Learn what to check for rack aisles, staging areas and picking stations.",
    application: "warehouse-lighting",
    guide: "led-high-bay-lighting-guide",
    use: "Warehouse fixtures may be used over rack aisles, packing benches and staging areas. The catalogue shows single-bar and dual-bar references. Match the fixture to the particular zone and task.",
    selection: "Plan illuminance on shelf labels and work surfaces as well as floor coverage. Mark rack heights and obstructions, confirm mounting and exact optics, and account for the way stock changes through the day.",
    question: "When is a linear fixture worth considering?",
    answer: "For a long aisle, a linear distribution can be a starting point. Check the exact fixture in a project layout to confirm light on the rack faces and uniformity along the aisle.",
  },
} as const;

export function categoryDetails(slug: string) {
  return Object.entries(categoryContent).find(([key]) => key === slug)?.[1];
}

export const divisionContent = {
  infrastructure: {
    sections: [
      { title: "Roadways and open sites", text: "Street lights distribute light along a route. Aimed floodlights serve defined exterior areas such as entrances, yards and parking spaces. Use site geometry and exact model photometry to evaluate glare, uniformity and site boundaries." },
      { title: "Industrial bays and warehouse aisles", text: "Compare round and linear high bay layouts against work height, racks and machinery. Consider driver access, environmental exposure and operating hours before choosing controls and mounting hardware." },
      { title: "Request model information", text: "Product records show model and wattage when readable on the photographed label. Share the mounting plan, required specifications and estimated quantities to confirm a suitable option and current availability." },
    ],
    faq: [
      { question: "What is the difference between a street light and a flood light?", answer: "Street lights are typically selected to distribute light along a route. Flood lights are aimed at defined areas. Compare the exact optical distribution with the intended layout." },
      { question: "What information should I include in an outdoor lighting enquiry?", answer: "Include the site plan, mounting positions and heights, intended use, quantities, the project location and any required technical or environmental ratings." },
    ],
    links: [
      { name: "Roadway lighting design considerations", href: paths.application("road-and-highway-lighting") },
      { name: "Warehouse lighting applications", href: paths.application("warehouse-lighting") },
      { name: "Choosing LED flood lights", href: paths.guide("choose-led-flood-lights") },
    ],
  },
  architectural: {
    sections: [
      { title: "General, task and accent lighting", text: "Panels, downlights and linear fixtures can provide general or task light. Track spots, wall washers and pendants can help define displays, wall surfaces or reception areas. Plan the lighting layers around the work or activity in each area." },
      { title: "Comfort, colour and finish", text: "Review bright sources from normal seated and standing positions. Check colour temperature and colour rendering against real finishes and merchandise, especially when combining several fixture families in one space." },
      { title: "Installation and controls", text: "Record ceiling type, suspension height, track or driver compatibility, driver access and dimming requirements. Send ceiling plans and quantities with the enquiry. The catalogue shows reference fixture types to guide that discussion." },
    ],
    faq: [
      { question: "Which fixtures suit a meeting room?", answer: "Panels and suspended linear fixtures can contribute to general or table lighting. Check camera sightlines, screens, daylight and how the room switches between meetings and presentations." },
      { question: "Can the reference images be used as a fixture schedule?", answer: "Use them to communicate the type or appearance you want. Ask Bharat Lums to confirm the actual model, dimensions, photometry and availability before specifying it." },
    ],
    links: [
      { name: "Office lighting applications", href: paths.application("office-lighting") },
      { name: "Retail and showroom lighting", href: paths.application("retail-lighting") },
      { name: "Hospitality lighting applications", href: paths.application("hospitality-lighting") },
    ],
  },
};

// --- Product editorial content, FAQs and related fixtures ---

export const catalogueSections = [
  { title: "Professional LED lighting products for project requirements", text: "The Bharat Lums catalogue brings together photographed outdoor and industrial fixtures and architectural lighting references for commercial interiors. Contractors, consultants and procurement teams can use the catalogue to narrow down a fixture family before discussing the exact model. Browse by category, compare recorded wattages where available and use the enquiry form to share the product you have selected. A catalogue photograph identifies a design or labelled fixture; it does not establish stock, warranty or suitability for a particular installation." },
  { title: "Infrastructure and industrial lighting", text: "Street lights are intended for route lighting discussions, while floodlights are considered for defined outdoor areas such as yards, entrances and parking zones. For factories and warehouses, evaluate ceiling height, rack layout, working surfaces, equipment and maintenance access before choosing a high bay or linear design. The appropriate optic and mounting arrangement depend on the project geometry, not simply on the wattage of a previous fixture. Ask for the exact model photometric data when comparing alternatives." },
  { title: "Architectural and commercial LED lighting", text: "Downlights, track lights, linear fittings, panels and accent lighting serve different functions in offices, shops, hospitality spaces and other interiors. A useful lighting brief describes the room dimensions, ceiling construction, visual tasks, display surfaces, control requirements and intended atmosphere. Compare the general lighting layer with accent or task lighting and consider glare in normal viewing positions. Architectural reference images illustrate fixture types rather than confirmed manufacturer models." },
  { title: "Compare energy use, light output and technical data", text: "Wattage measures electrical power, while luminous flux describes light output. Illuminance at the work surface also depends on distribution, distance, spacing and reflections. Compare the exact fixture data and expected operating hours when assessing electricity use. Request confirmation of input voltage, mounting compatibility, ingress protection, colour temperature, driver options and other requirements where relevant. Send your project drawings, quantities and site conditions with an enquiry so the team can discuss suitable options and quote availability." },
];

export const catalogueFaq = [
  {question:"How do I choose the right LED lighting fixture?",answer:"Start with the application, required illumination, mounting position and environmental conditions. Compare fixture families before requesting exact model data."},
  {question:"Does a higher wattage always provide better lighting?",answer:"No. Power, luminous flux, distribution and installed geometry are different considerations. Compare photometry against the target area."},
  {question:"Can indoor and outdoor fixtures be used interchangeably?",answer:"Do not assume interchangeability. Confirm environmental ratings, electrical suitability and mounting with the exact fixture documentation."},
  {question:"How can I request a datasheet?",answer:"Use the enquiry link and include the catalogue name or model code. Ask for the manufacturer's current datasheet and photometric file if required."},
  {question:"Are all catalogue entries available to order?",answer:"Availability is not implied by listing a fixture or reference image. Contact the team to confirm the exact model, quantity and lead time."},
  {question:"What is needed for a project quotation?",answer:"Share the fixture reference, quantities, delivery location, drawings or dimensions, and required technical criteria. The team can use these details to discuss a quotation."},
];

const architectureNotes: Record<string, [string,string]> = {
  "recessed-downlight":["A recessed downlight sits within a ceiling opening and can provide general or focused lighting depending on the selected optic. Plan the position around ceiling services and intended sightlines.","Can the fitting be installed in my existing ceiling?"],
  "surface-downlight":["A surface downlight is considered when a recessed opening is impractical or a visible fixture is part of the interior design. Coordinate the junction and fixing arrangement with the ceiling finish.","What should I check before replacing a recessed fitting with a surface fitting?"],
  "cob-spotlight":["A COB spotlight can be considered for directed accent lighting. Its visual effect depends on the actual optic, distance to the object and control of glare rather than the LED package alone.","How do I select a spotlight for a merchandise display?"],
  "track-light":["Track-mounted luminaires allow an installation to be planned around adjustable accent positions. Retail layouts can benefit from reviewing the aiming direction and beam overlap as displays change.","Can any track light fit an existing rail?"],
  "magnetic-track-light":["A magnetic track system groups compatible luminaires into a common mounting and electrical arrangement. Coordinate the system components and switching layout before choosing individual modules.","Are magnetic track components interchangeable?"],
  "linear-light":["Linear luminaires create a continuous or segmented light pattern along a room or corridor. Coordinate fixture runs with ceiling modules, controls and reflections on work surfaces.","How should a continuous linear lighting run be planned?"],
  "suspended-linear-light":["Suspended linear lighting can serve a table or work zone independently of the ceiling plane. The suspension position should be coordinated with furniture, screen sightlines and structural support.","What should be checked above a conference table?"],
  "panel-light":["Panel lighting is commonly considered for broad illumination in office ceilings. Compare the selected panel distribution with desk positions, screen reflections and ceiling access.","Will a panel fit my existing ceiling grid?"],
  "pendant-light":["Pendant lighting places the luminaire below the ceiling plane and can define reception or hospitality zones. Consider the visual relationship to the desk or table as well as circulation clearance.","How do I choose a pendant suspension height?"],
  "wall-washer":["Wall washing aims for an even visual emphasis across a vertical surface. The actual wall texture, fixture setback and optic determine the appearance of the lit surface.","How can I reduce scalloping or uneven wall illumination?"],
  "strip-light":["LED strip lighting is considered for concealed accents or continuous illuminated details. The system design includes the strip, power supply, mounting channel and access for maintenance.","What should I check before specifying a long LED strip run?"],
  "profile-light":["Profile lighting integrates a linear source and diffuser within a visible or recessed channel. Coordinate the channel depth, joints and finishing details with the surrounding material.","How do I select a profile and diffuser for an interior detail?"],
  "adjustable-spotlight":["Adjustable spotlights help direct attention to selected exhibits or surfaces. The required aiming range depends on the ceiling position, display height and viewing angles.","How should a spotlight be aimed for a gallery display?"],
  "grille-light":["Grille luminaires group light heads within a ceiling assembly. Plan the orientation of each head around intended targets and verify the service access before specifying the fitting.","What should I confirm for a multi-head grille fitting?"],
  "ceiling-light":["Ceiling-mounted lighting can provide general illumination where a fixture is fixed directly to the ceiling. Consider the relationship to circulation, seating and the room's other light sources.","How do I choose a ceiling light for a shared interior?"],
  "cylinder-light":["A cylindrical luminaire can introduce a compact visible form in an interior lighting layout. Compare the intended mounting arrangement and aperture shielding from normal viewing positions.","What should I compare when choosing a cylindrical fixture?"],
};
export function architectureEditorial(slug: string, name: string, selection: string) {
  const [about, question] = architectureNotes[slug] ?? ["Discuss the fixture type in relation to the ceiling and intended visual task.","What should I check before selecting a fixture?"];
  return { sections: [
    {title:"About this lighting type",text:about + " This catalogue entry is a reference for the fixture type, not an approved manufacturer model."},
    {title:"Project selection and technical confirmation",text:selection + " Share the drawings, intended quantities and required controls with the team. Request the exact model datasheet for electrical requirements, light output, colour quality and dimensions before approval."},
  ], faq:[
    {question,answer:selection},
    {question:"Does the reference image establish the specifications of this " + name.toLowerCase() + "?",answer:"No. Confirm the proposed model and its datasheet through an enquiry. The image illustrates a fixture type only."},
    {question:"What should I include in a " + name.toLowerCase() + " quotation request?",answer:"Provide the ceiling arrangement, application, quantities, finish and any lighting control requirements."},
  ]};
}
export function infrastructureEditorial(item: Product) {
  const details = categoryDetails(item.categories[0]);
  const label = item.model ? "The catalogue records the model as " + item.model.code + " from the fixture label." : "The photograph is a design reference; the exact model and ratings require confirmation.";
  return {sections:[
    {title:"About this fixture",text:item.description + " " + label + " " + (details?.use ?? "")},
    {title:"Project selection and installation guidance",text:(details?.selection ?? "Confirm site conditions and mounting with the supplier.") + " Request the current datasheet for the exact fixture before approving installation. Assess operating hours and the proposed lighting layout rather than assuming an energy-saving percentage."},
  ],faq:[
    {question:details?.question ?? "What information is needed to select this fixture?",answer:details?.answer ?? "Confirm the application and technical requirements with the team."},
    {question:"Which specifications are confirmed for " + item.name + "?",answer:item.model ? "The catalogue records label information where readable. Ask for the current datasheet to confirm other technical attributes." : "No exact model rating is established by this photograph. Request a confirmed model and technical data."},
    {question:"How can I request a quote for " + item.name + "?",answer:"Use the product enquiry or WhatsApp link and include the quantities, site dimensions, mounting conditions and technical requirements."},
  ]};
}

// Related references share a lighting function, mounting approach or project application.
const architectureRelations: Record<string, string[]> = {
  "recessed-downlight":["surface-downlight","adjustable-spotlight","cob-spotlight"],
  "surface-downlight":["recessed-downlight","ceiling-light","cylinder-light"],
  "cob-spotlight":["adjustable-spotlight","track-light","grille-light"],
  "track-light":["magnetic-track-light","adjustable-spotlight","cob-spotlight"],
  "magnetic-track-light":["track-light","profile-light","linear-light"],
  "linear-light":["suspended-linear-light","profile-light","panel-light"],
  "suspended-linear-light":["linear-light","pendant-light","panel-light"],
  "panel-light":["linear-light","suspended-linear-light","ceiling-light"],
  "pendant-light":["suspended-linear-light","cylinder-light","ceiling-light"],
  "wall-washer":["adjustable-spotlight","track-light","strip-light"],
  "strip-light":["profile-light","wall-washer","linear-light"],
  "profile-light":["strip-light","linear-light","magnetic-track-light"],
  "adjustable-spotlight":["cob-spotlight","track-light","grille-light"],
  "grille-light":["adjustable-spotlight","cob-spotlight","recessed-downlight"],
  "ceiling-light":["surface-downlight","panel-light","pendant-light"],
  "cylinder-light":["surface-downlight","pendant-light","adjustable-spotlight"],
};
export function architectureRelated(slug: string) { return architectureRelations[slug] ?? []; }

const categoryPlanning: Record<string, [string,string]> = {
  floodlights:["A floodlighting brief should identify the boundaries of the area, the location of entrances, nearby properties, vehicle movements and any obstructions. Provide a site plan with proposed mounting points and directions. The exact beam distribution determines how much light reaches each part of the site; the angle and position may also affect glare for pedestrians and drivers. Compare alternatives on installed coverage rather than assuming a higher wattage solves a dark area.","Ask for an exact model datasheet and photometric file. Confirm bracket dimensions, aiming adjustment, supply requirements and environmental suitability, including any exposure to dust or water. Agree the lighting design before purchase and allow for safe maintenance access."],
  "led-street-lights":["Road lighting planning starts with route geometry. Record the carriageway width, pedestrian areas, pole positions and any changes in road alignment. Check whether poles are on one side or both sides and note existing bracket outreach. Compare the light distribution from the exact model with the required coverage, uniformity and glare criteria for the intended route.","When replacing existing fixtures, record the pole and bracket connection as well as the electrical supply. Include the model reference, desired quantity, delivery location and any surge or environmental requirements in your enquiry. A model label identifies a variant but does not establish a compliant road layout."],
  "high-bay-industrial-lighting":["Start the industrial lighting brief by identifying work zones, production equipment, inspection benches and storage areas. Record the ceiling and task heights and possible obstructions from machines or building services. An open production floor and a narrow passage can require different distributions. Consider how staff move through the site and where glare might affect work.","The photographed round fixtures provide design references for comparison. Confirm the exact model, mounting method, available optics, electrical supply, environmental ratings and safe access for maintenance. Assess operating hours and required illumination as part of the energy comparison."],
  "led-warehouse-lighting":["Divide the warehouse into rack aisles, loading and staging zones, packing benches and circulation areas. Mark shelf heights, aisle widths and the position of work surfaces. Consider light on vertical labels as well as horizontal surfaces, including changes to stock and obstructions during operation. Compare the proposed distribution in a lighting layout rather than selecting a fixture by shape alone.","For the photographed single-bar and dual-bar designs, request the exact model and dimensions before approving a layout. Confirm suspension or bracket arrangements, supply and control requirements, environmental conditions and maintenance access. Include the warehouse plan and expected quantities in a project enquiry."],
};
export function categoryEditorial(slug: string) {
  const notes = categoryPlanning[slug];
  return notes ? [{title:"Prepare a project lighting brief",text:notes[0]},{title:"Technical confirmation and quotation",text:notes[1]}] : [];
}
