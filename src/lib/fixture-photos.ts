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
