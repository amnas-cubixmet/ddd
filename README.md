# Bharat Lums

A responsive LED lighting website and product catalogue. Next.js App Router, TypeScript and Tailwind CSS handle the application. GSAP drives the homepage entrance and scroll reveals. Three.js and React Three Fiber render the homepage streetlight and globe.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The catalogue and email-draft fallback work without service credentials.

## Content and assets

- The Illustrator logo was exported as an original-colour SVG and transparent PNG. The website uses a lighter blue treatment of the same artwork. The business card supplied the contact name, phone and email.
- The catalogue shows ten LED lighting categories. Source records and representative imagery are in `src/lib/catalogue.ts`. Add verified product records and datasheets before publishing individual models.
- Hero imagery is AI-generated. Replace it with approved photography when available.

## Enquiries

Create `.env.local` from `.env.example`. All three forms use server-only Gmail SMTP via Nodemailer. No database or admin page is needed. See [email setup](docs/email-setup.md).

## Checks

```sh
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm test
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an installed Chromium binary. Desktop and mobile tests run against the production server. The CI workflow installs Chromium and runs the same checks.

See [email setup](docs/email-setup.md) and [responsive audit](docs/responsive-audit.md).
