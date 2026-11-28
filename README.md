# Bharat Lums

A responsive LED lighting website and product catalogue. Next.js App Router, TypeScript and Tailwind CSS handle the application. GSAP drives the homepage entrance and scroll reveals. Three.js and React Three Fiber render the homepage streetlight and globe.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The catalogue and enquiry forms work without email service credentials.

## Content and assets

- The Illustrator logo was exported as an original-colour SVG and transparent PNG. The website uses a lighter blue treatment of the same artwork. The business card supplied the contact name, phone and email.
- The catalogue distinguishes model-label photos from illustrative lighting references. Use supplier catalogue records for provenance and verify exact specifications and availability before expanding the public catalogue.
- See [the SEO audit](docs/seo/seo-audit.md) and [release configuration](docs/seo/technical-seo-report.md) for the crawl, canonical and verification settings.
- For future SEO work, use [the repository SEO skill](.agents/skills/bharat-lums-seo-engine/SKILL.md). Clients without skill discovery can load the file directly.

## Enquiries

The public forms open a prefilled WhatsApp message for the visitor to review and send. Enquiries are sent through WhatsApp; there is no server-side email submission endpoint.

## Checks

```sh
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm test
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an installed Chromium binary. The Playwright suite runs against the built production server.
