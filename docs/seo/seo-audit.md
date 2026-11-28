# SEO audit

Researched and implemented on 28 November 2026.

Baseline GitHub main at `e63a174`. The Vercel homepage served the lighting catalogue without a canonical. The branded www domain returned a coming-soon homepage, with the apex redirecting to www. The deployment for the feature branch was not inferred from those responses.

| Priority | Baseline observation | Action in the branch |
| --- | --- | --- |
| P0 | The catalogue was live at the Vercel hostname and the intended www origin served a placeholder. A missing SITE_URL produced an empty sitemap and blocked all robots. Preview index behaviour depended on the same variable. | Document the domain handoff. Require a configured production origin and apply HTML noindex to previews and unconfigured builds. Generate a crawlable robots file and an indexable sitemap on release. |
| P1 | Existing mission and strengths copy presented domestic manufacture and broader markets without public verification supplied for this work. | Keep the mission and values layouts and use documented catalogue and enquiry language. |
| P1 | Filters used parameterised category URLs. Architecture and infrastructure pages had the same generic visible heading. | Keep filter URLs as UI states and add four self-canonical category landing pages with contextual product links. |
| P1 | 24 product photo routes and 16 illustrative detail routes were visible. Model references, labelled models and supplier discovery records had different evidence quality. | Keep all 40 routes navigable. Include the 13 labelled models in the sitemap. Add confirm-before-ordering information to photograph and reference pages. |
| P1 | Titles and descriptions were overly broad, model text often repeated and social images mostly used a generic reference. | Use explicit per-page title, description, robots and canonical metadata, a branded social card and model artwork where available. |
| P1 | Organization and Product JSON-LD existed. Breadcrumb, collection, website and editorial entities were absent. | Add structured graphs and use only visible, recorded attributes. |
| P2 | Short homepage and commerce copy, few contextual links, no dedicated guide and application hubs. | Add application and guide hubs, original content and links to the catalogue and enquiry. |
| P2 | The hero overlay could block interaction while the renderer loaded. Gallery leads used lazy loading. | Bound the intro wait, keep SSR text visible with JavaScript disabled, and prioritise lead product imagery. |
| P3 | Contact and quote used the existing WhatsApp journey, with context mainly in forms. | Prefill model and application context in the quote and WhatsApp entry points. Add a first-party client event for validated form handoff. |

Evidence from the local production build, source code and deployed HTTP responses. The live domain does not independently establish a business address, export markets, manufacturer status or delivery territories.

- [Branded website](https://www.bharatlums.com/)
- [Existing Vercel catalogue](https://bharat-lums.vercel.app/)
- [Google guidance on canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
