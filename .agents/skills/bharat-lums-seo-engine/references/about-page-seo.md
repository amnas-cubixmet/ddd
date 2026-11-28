# About page SEO — Bharat Lums
Research date: 2026-11-28. Market focus: professional B2B lighting; geographic company claims require separate evidence.

## Sources and methodology
Reviewed public pages for industry terminology, corporate structure, audience needs, catalogue/application links and enquiry paths:
- https://hilums.com/about — company profile, product divisions, mission/vision and contact. Its manufacturing, testing and warranty statements are not Bharat Lums facts.
- https://changilighting.com/ — architectural positioning and enquiry presentation.
- https://www.signify.com/en-in/our-company/about-us and https://www.signify.com/en-in/prof — corporate identity, fixture taxonomy and professional catalogue.
- https://www.wiproconsumerlighting.com/about-us and https://www.wiprolighting.com/applications — distinguish consumer from professional lighting; application-led navigation.
- https://www.havells.com/ — electrical and lighting category hierarchy.
- https://developers.google.com/search/docs/appearance/structured-data/organization and https://developers.google.com/search/docs/appearance/structured-data/breadcrumb — consistent entity and navigation markup.
Text-based access verified; competitor mobile rendering not audited. No keyword volume or difficulty data was obtained.

## Intent and ownership
- /about: branded company research, professional LED lighting company/profile, project enquiry approach. Mention broad product terms naturally.
- /: broad LED lighting solutions.
- /products/infrastructure-lighting: infrastructure and outdoor lighting.
- /products/categories/high-bay-industrial-lighting: industrial and high bay lighting.
- /products/categories/led-warehouse-lighting: warehouse lighting.
- /products/architectural-lighting: architectural and commercial lighting.
- /applications: project environments and long-tail sector terms.
- /lighting-guides: specification and selection questions.
Manufacturer, exporter and geographical company queries remain research-only until verified. Do not invent keyword metrics.

## Evidence and content
Repository evidence: src/lib/site.ts defines brand and contact; src/lib/lighting-divisions.ts and catalogue routes describe fixture types; existing enquiry form opens WhatsApp; existing globe is illustrative. These are site-level facts, not independently audited corporate claims. Mission/vision and commitment copy are proposed customer-focused statements for owner review. Do not attribute photographed model brands, factories, standards, warranties, delivery markets, offices, completed projects, testimonials, founding year or revenue to Bharat Lums without owner-approved evidence. Confirm availability and technical specifications. Application imagery is illustrative, not project proof.

Use original professional English; explain actual selection factors (mounting, optics, glare, energy use, operating conditions) without promises. Use a single H1, descriptive H2/H3, native FAQ details, readable paragraphs and contextual links. Link to both divisions, applications, guides and contact. Reuse existing enquiry implementation and globe; do not duplicate global layout components.

## Metadata, schema and indexing
Use shared pageMetadata with About-specific title, description, social image and canonical from SITE_URL. Keep indexability consistent with sitemap and robots. Reuse site Organization and WebSite stable IDs; AboutPage is a WebPage subtype, so avoid duplicate page nodes. Add one BreadcrumbList matching the existing visible breadcrumbs. FAQPage markup is omitted: this commercial page uses visible native FAQ content, without promising rich results. Do not hardcode an unverified deployment origin.

## Mobile, accessibility and QA
16px gutters at 320–767px, one-column at 320–374px; use compact two-column expertise/industry grids from 375px, with natural wrapping and equal heights. Test 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920px. Verify no horizontal overflow, clipping, overlap or broken images; test native FAQ, map controls, navigation and WhatsApp redirect using a mocked destination. Check keyboard focus and reduced motion; reserve image aspect ratios and lazy-load below-fold assets. Validate rendered canonical, metadata, schema and sitemap; measure LCP/CLS/INP rather than promising gains. Run npm run lint, npm run typecheck, npm run build and Playwright; capture 320/390/1440 screenshots. Do not merge into production until checks pass. Record unavailable facts and actual test outcomes.
