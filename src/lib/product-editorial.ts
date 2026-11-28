import type { Product } from "./catalogue";
import { categoryDetails } from "./category-content";

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
