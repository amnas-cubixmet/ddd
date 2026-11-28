import { paths } from "./seo";

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
