export type Country = {
  code: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
};

export const countries = [
  {
    code: "IN",
    name: "India",
    region: "South Asia",
    latitude: 21.0,
    longitude: 79.0,
  },
  {
    code: "BD",
    name: "Bangladesh",
    region: "South Asia",
    latitude: 23.7,
    longitude: 90.35,
  },
  {
    code: "TH",
    name: "Thailand",
    region: "Southeast Asia",
    latitude: 15.4,
    longitude: 101.1,
  },
  {
    code: "SD",
    name: "Sudan",
    region: "Northeast Africa",
    latitude: 16.2,
    longitude: 30.3,
  },
  {
    code: "BH",
    name: "Bahrain",
    region: "Middle East",
    latitude: 26.06,
    longitude: 50.55,
  },
  {
    code: "LK",
    name: "Sri Lanka",
    region: "South Asia",
    latitude: 7.72,
    longitude: 80.7,
  },
  {
    code: "MV",
    name: "Maldives",
    region: "Indian Ocean",
    latitude: 3.95,
    longitude: 73.48,
  },
  {
    code: "OM",
    name: "Oman",
    region: "Middle East",
    latitude: 21.51,
    longitude: 56.2,
  },
] as const satisfies readonly Country[];

export const origin = countries[0];
