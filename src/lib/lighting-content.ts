import { paths, type ShareImage } from "./seo";
import { fixturePhoto } from "./catalogue";

export type ContentSection = { title: string; text: string; points?: string[] };
export type ContentLink = { name: string; href: string };
type Resource = {
  slug: string;
  title: string;
  summary: string;
  sections: ContentSection[];
  related: ContentLink[];
  sources?: ContentLink[];
  image?: ShareImage;
};

const road = { name: "FHWA Roadway Lighting Resources", href: "https://highways.dot.gov/safety/other/visibility/roadway-lighting-resources" };
const led = { name: "U.S. Department of Energy LED Basics", href: "https://www.energy.gov/cmei/ssl/led-basics" };
const controls = { name: "GSA LED Lighting and Controls Guidance", href: "https://www.gsa.gov/system/files?file=LED+and+Controls+Guidance+for+GSA_15Jan25.pdf" };
const outdoor = { name: "U.S. Department of Energy LED Outdoor Area Lighting", href: "https://betterbuildingssolutioncenter.energy.gov/sites/default/files/attachments/outdoor_area_lighting.pdf" };
const ingress = { name: "IEC 60529 Degrees of protection provided by enclosures", href: "https://webstore.iec.ch/en/publication/2447" };

const streetFixtures = { name: "LED street light catalogue", href: paths.category("led-street-lights") };
const floodFixtures = { name: "LED flood light catalogue", href: paths.category("floodlights") };
const warehouseFixtures = { name: "LED warehouse fixture catalogue", href: paths.category("led-warehouse-lighting") };
const highBayFixtures = { name: "Industrial LED high bay fixtures", href: paths.category("high-bay-industrial-lighting") };
const architectural = { name: "Architectural and commercial fixtures", href: paths.architecture };
const streetGuide = { name: "How to specify LED street lights", href: paths.guide("led-street-light-guide") };
const floodGuide = { name: "How to choose LED flood lights", href: paths.guide("choose-led-flood-lights") };
const highBayGuide = { name: "LED high bay lighting guide", href: paths.guide("led-high-bay-lighting-guide") };
const metricsGuide = { name: "Lumens, watts and lux explained", href: paths.guide("lumens-watts-lux") };

export const applications: Resource[] = [
  {
    slug: "road-and-highway-lighting", title: "Road and highway LED lighting",
    summary: "Plan roadway lighting around road geometry, pole spacing, pedestrian crossings and the light distribution needed across the carriageway.",
    sections: [
      { title: "Start with road geometry", text: "Map lane widths, curves, medians and conflict points such as junctions and crossings. A side-mounted luminaire must reach the far lane while keeping glare under control for approaching drivers. Requirements at a pedestrian crossing may differ from those along the uninterrupted road." },
      { title: "Check the pole layout and optics", text: "Record pole height, bracket overhang, tilt and spacing. Ask for the exact model’s photometric file and check maintained lighting levels, uniformity and glare against the project requirements under the applicable local standard.", points: ["Show intersections and pedestrian movement on the layout.", "Record any supply, control or existing bracket constraints.", "Confirm the luminaire mounting interface and maintenance access."] },
      { title: "Prepare the project enquiry", text: "Share the road plan, typical section, pole schedule and required specification. For retrofits, add a photo and dimensions of the existing bracket. This lets the team clarify what fixture information is needed before a quotation." },
    ], related: [streetFixtures, streetGuide], sources: [road, outdoor],
  },
  {
    slug: "warehouse-lighting", title: "LED lighting for warehouses",
    summary: "Plan warehouse lighting for aisles, shelves, loading areas and picking stations using mounting height, rack geometry and visual task requirements.",
    sections: [
      { title: "Plan for the work in each zone", text: "Separate storage aisles, open staging, loading docks and inspection or packing benches. Staff reading labels on tall racks need light on vertical faces. A layout that looks uniform on the floor can still leave the rack faces hard to read." },
      { title: "Match the fixture distribution to the space", text: "A linear distribution aligned with a rack aisle and a round high bay over open staging are useful starting points. Compare the exact optics using a site model with racks and obstructions included. Review circulation, shadows at picking height and glare for operators looking upward." },
      { title: "Plan operating hours and controls", text: "Separate frequently used zones from intermittently occupied aisles. Confirm sensor coverage and approved control behaviour, including any minimum light levels needed for traffic or security. Send bay sizes, rack heights, mounting levels and operating hours with the enquiry." },
    ], related: [warehouseFixtures, highBayFixtures, highBayGuide], sources: [controls, led],
  },
  {
    slug: "factory-lighting", title: "LED lighting for factories and workshops",
    summary: "Scope factory lighting for production areas, workshops, inspection stations and shared circulation space.",
    sections: [
      { title: "Map tasks and working planes", text: "Identify the points where operators read gauges, handle materials or inspect products. Lighting calculations need the plane used for each task, which could be a bench, a vertical machine face or the floor along a travel route." },
      { title: "Account for equipment and operating conditions", text: "Overhead structures, cranes and machinery can shade the work area. Document heat, dust, cleaning methods, vibration and any hazardous area classification. The exact luminaire, mounting assembly and any required certification must match the site specification." },
      { title: "Check service and controls", text: "Plan access to fixtures without unnecessary production disruption. Confirm driver and control compatibility and separate the needs of continuously occupied work areas from short-use storage zones. Include ceiling heights, beam positions, shift patterns and environmental conditions when requesting a quote." },
    ], related: [highBayFixtures, highBayGuide, metricsGuide], sources: [controls, led],
  },
  {
    slug: "office-lighting", title: "LED lighting for offices and meeting rooms",
    summary: "Compare panels, linear fixtures and accent lighting for desks, meeting tables, circulation spaces and reception areas.",
    sections: [
      { title: "Manage screen reflections and glare", text: "Locate monitors and presentation screens before selecting fixture positions. Compare luminaires from normal seated and standing viewing positions. A bright ceiling source is especially noticeable when reflected on a glossy screen or a dark video display." },
      { title: "Choose fixtures around the ceiling and layout", text: "Panels are one option for compatible ceiling grids. Suspended linear fixtures can define a meeting table, while surface fixtures offer an option where the ceiling void is limited. Confirm mounting clearances, driver access and how daylight affects each zone." },
      { title: "Separate lighting by office activity", text: "Use the plan to distinguish desks, meeting rooms, reception and circulation. Group controls so the lighting can adapt when a meeting room switches between a presentation and table work. Share ceiling type, dimensions and control requirements with a quote enquiry." },
    ], related: [architectural, { name: "LED panel lighting reference", href: paths.architecturalFixture("panel-light") }, metricsGuide], sources: [controls, led],
  },
  {
    slug: "retail-lighting", title: "LED lighting for retail and showrooms",
    summary: "Plan layered retail lighting for displays, merchandise, circulation and changing store layouts.",
    sections: [
      { title: "Light merchandise and circulation separately", text: "Start by providing comfortable visibility through the space. Map the displays that should draw attention and identify where vertical light is needed on shelving or signage. Accent beams should support the display without shining directly into normal sightlines." },
      { title: "Compare track fixtures and downlights", text: "Adjustable track fixtures work as a planning option when displays move. Downlights provide fixed positions for general or accent coverage. Check beam spread at the actual mounting distance and assess how the chosen colour temperature and colour rendering affect sample merchandise." },
      { title: "Build a flexible fixture schedule", text: "Group fixtures by display, circulation and feature zones. Document mounting details, track and driver compatibility and aiming access. Send a floor plan, sample display heights and any visual references with the project enquiry." },
    ], related: [architectural, { name: "LED track light reference", href: paths.architecturalFixture("track-light") }, metricsGuide], sources: [controls, led],
  },
  {
    slug: "parking-area-lighting", title: "LED lighting for outdoor parking areas",
    summary: "Plan exterior parking lighting for vehicle lanes, pedestrian routes and site entrances while managing glare and spill light.",
    sections: [
      { title: "Identify travel paths and conflicts", text: "Mark parking bays, entries, exits and routes from the parking area to the building. Check sightlines wherever vehicles cross pedestrian routes. Lighting should support these movements even when parked vehicles shade some areas." },
      { title: "Compare fixture positions and aiming", text: "A suitable area or street-light optic can serve a circulation route, while an aimed floodlight can cover a distinct zone. Review the complete layout for gaps, brightness at site boundaries and glare from adjacent roads or properties." },
      { title: "Include weather and access in the brief", text: "Record bracket positions, heights, exposure and nearby properties. Ask for model-specific ingress protection and photometric information before approving the layout. Keep maintenance access and overnight lighting schedules in the project brief." },
    ], related: [streetFixtures, floodFixtures, floodGuide], sources: [outdoor, road],
  },
  {
    slug: "hospitality-lighting", title: "LED lighting for hotels and hospitality",
    summary: "Compare interior lighting types for reception desks, corridors, guest areas and feature walls.",
    sections: [
      { title: "Separate arrival, circulation and feature lighting", text: "Reception desks, circulation paths and feature surfaces serve different tasks. Begin with even light along movement routes and add fixtures for the desk, signage and architectural details where useful." },
      { title: "Check comfort at guest viewing angles", text: "Review bright sources from seated and standing positions. Compare downlights, pendants and wall washers against ceiling height and surface finishes. Check a sample for colour consistency where fixtures will be visible together." },
      { title: "Confirm controls and installation details", text: "Share ceiling plans, room finishes and operating schedules. Confirm control compatibility, access to drivers, mounting clearances and the required specifications for each area before preparing the fixture schedule." },
    ], related: [architectural, { name: "LED wall washer reference", href: paths.architecturalFixture("wall-washer") }, metricsGuide], sources: [controls, led],
  },
];

export const guides: Resource[] = [
  {
    image: { src: fixturePhoto("neona-50"), alt: "Photographed Oreli OSL-NEONA 50 W LED street light" },
    slug: "led-street-light-guide", title: "How to specify LED street lights",
    summary: "Learn what to check before selecting an LED street light, from photometric distribution and mounting height to surge requirements and maintenance access.",
    sections: [
      { title: "Start with what the street needs", text: "Record the carriageway width, footpaths, conflict points and the road’s function. Identify the project criteria for maintained light levels, uniformity and glare. Use the applicable local design standard and the authority’s requirements for acceptance." },
      { title: "Read photometry alongside the wattage", text: "Wattage tells you the fixture’s input power. Photometry describes where its light goes. Two streetlights with the same wattage can produce different results when mounted at the same height. Ask for the exact optic’s IES or LDT file and assess it against the pole layout." },
      { title: "Example with an existing pole line", text: "For a retrofit on one side of an access road, record the pole height, spacing, arm overhang and tilt. Test whether the far edge and the spaces between poles meet the required lighting levels. Include crossings or bends as distinct checks." },
      { title: "Request model-specific installation information", text: "Confirm the spigot fit, supply characteristics, required surge protection, ingress rating and safe access for maintenance. Match these to the datasheet or project approval for the exact model before ordering." },
    ], related: [streetFixtures, { name: "Road and highway lighting applications", href: paths.application("road-and-highway-lighting") }, metricsGuide], sources: [road, outdoor],
  },
  {
    image: { src: fixturePhoto("oron-30"), alt: "Photographed Oreli OFL-ORON 30 W LED flood light" },
    slug: "choose-led-flood-lights", title: "How to choose LED flood lights",
    summary: "Compare floodlight beam coverage, aiming, glare, enclosure protection and installation requirements before requesting a quotation.",
    sections: [
      { title: "Measure the area and mounting position", text: "Draw the target area and account for the mounting height, offset and tilt. Identify people or drivers who could see the fixture directly. Include property boundaries and windows when planning the aiming direction." },
      { title: "Compare distributions at the actual distance", text: "A wide beam can suit a nearby broad area. Longer throws or more confined zones may need a narrower or asymmetric distribution. Compare the full photometric distribution and the calculated lighting across the target surface, including the edges and overlaps." },
      { title: "Example at a loading yard", text: "A single fixture above a loading door can create shadows behind vehicles. A layout with fixtures at different positions may reduce those shadows. Check spill light, the driver’s view and the visibility of staff working near the dock before confirming the arrangement." },
      { title: "Confirm exposure and maintenance needs", text: "Check the model’s verified ingress rating and mounting conditions. Record exposure to rain, dust and any cleaning processes, then confirm whether the fixture, brackets and cable entries meet the site requirements." },
    ], related: [floodFixtures, { name: "Parking area lighting applications", href: paths.application("parking-area-lighting") }, { name: "Understanding IP65 and IP66", href: paths.guide("ip65-ip66-lighting") }], sources: [outdoor, ingress],
  },
  {
    image: { src: fixturePhoto("round-black-grouped"), alt: "Photographed round LED fixture with grouped lens modules" },
    slug: "led-high-bay-lighting-guide", title: "LED high bay lighting guide",
    summary: "Understand how LED high bays are selected for tall interiors, with practical checks for optics, clearances, glare and controls.",
    sections: [
      { title: "Define mounting height and working plane", text: "Measure the mounting height and the height where the work takes place. In the same building the design might need to account for a packing bench, rack faces and the floor of an open staging area. Mark obstructions such as cranes, beams and tall shelving." },
      { title: "Compare the light distribution", text: "Layout, optics and fixture spacing influence illumination and uniformity. For an aisle, evaluate whether light reaches the rack faces without sending unnecessary light above shelving. For a wide bay, review overlap from neighbouring fixtures and glare at normal sightlines." },
      { title: "Example with two interior zones", text: "A warehouse with deep racks and an adjacent open floor may need different optics and spacing in each zone. Evaluate both areas in the same model to check transition points and ensure lighting at the work surface." },
      { title: "Check the installation and controls", text: "Confirm mounting hardware, load limits, temperature and environmental requirements with the exact datasheet and project team. For occupancy or daylight controls, check driver compatibility, sensor position, zoning and operating behaviour." },
    ], related: [highBayFixtures, warehouseFixtures, { name: "Warehouse lighting applications", href: paths.application("warehouse-lighting") }], sources: [controls, led],
  },
  {
    slug: "lumens-watts-lux", title: "Lumens, watts and lux explained",
    summary: "Understand the difference between light output, power use and illuminance, and how to compare LED fixtures for a real project.",
    sections: [
      { title: "Watts describe electrical input", text: "Watts measure the rate of power use. Use the complete luminaire input power for comparing electricity consumption, including the driver where applicable." },
      { title: "Lumens measure light output", text: "Lumens describe the total light emitted. Luminous efficacy divides that light output by input power and is expressed in lumens per watt. Compare published values measured on the complete fixture under comparable conditions." },
      { title: "Lux describes light reaching a surface", text: "One lux equals one lumen per square metre. A desk, aisle or road receives only part of the fixture's light. Mounting position, distance, distribution, obstructions and reflectance affect the result on the working plane." },
      { title: "Example using two fixtures", text: "A 100 W luminaire rated at 12,000 lm has a stated efficacy of 120 lm/W. A second 100 W luminaire with the same output can still deliver a different light pattern. Compare photometric files in the same project layout before judging which fixture meets the requirement." },
    ], related: [highBayFixtures, streetGuide, floodGuide], sources: [led, controls],
  },
  {
    slug: "ip65-ip66-lighting", title: "What IP65 and IP66 mean for LED lighting",
    summary: "Read LED fixture ingress protection ratings and understand what to verify for outdoor, dusty or regularly cleaned areas.",
    sections: [
      { title: "Read both digits", text: "IEC 60529 defines the IP code for enclosure protection. In both IP65 and IP66, the first digit 6 denotes dust-tight protection. The second digit refers to water ingress. IPX5 concerns jets and IPX6 concerns powerful jets under the standard’s test conditions." },
      { title: "Match the label to the installation", text: "Check the rating for the exact luminaire configuration, including any cable glands and connections covered by the manufacturer’s documentation. Follow specified orientation and sealing instructions. Ask separately about corrosion, impact or cleaning chemicals if the site requires them." },
      { title: "Example at an exposed loading area", text: "A fixture exposed to rain and a fixture routinely subjected to powerful cleaning jets face different conditions. Specify the exposure and cleaning method first. Check the product documentation against that requirement before placing the order." },
    ], related: [floodFixtures, floodGuide], sources: [ingress],
  },
];

export const guidePublicationDate = "2026-11-28";
