---
name: bharat-lums-product-image-system
description: Generate, retouch, optimize, validate and integrate premium photorealistic LED lighting product imagery for Bharat Lums. Preserve original product identities, create clearly identified representative imagery when photographs are unavailable, maintain #002652 navy and produce three distinct angles per product.
---
# Bharat Lums product imaging

## Inspect and resume
- Read src/lib/fixture-photos.ts, src/lib/catalogue.ts, src/lib/architectural-products.ts and data/product-image-manifest.json. Inventory actual slugs and image paths; never count numbered alternate photos as products.
- Confirm files exist and inspect all visual references. Distinguish confirmed physical products from representative architectural product types. Preserve originals, descriptions, specifications, routing and metadata.
- Process pending products in batches of 2–3, starting with deep-reflector and panel-light. Skip completed assets only after checking files and QC. Never claim image creation without actual files.

## Generate and review
- Use actual image generation/editing capabilities with existing references. Do not substitute generic fixtures for authentic products. Keep housing, optics, mounting, screws, fins, driver, materials and proportions unchanged. Remove hands, backgrounds and clutter.
- If actual photographs are unavailable, research product type and create commercially plausible representative imagery, explicitly marked as such. Do not invent ratings, labels or technical details.
- Produce three separate images: 01 front/three-quarter hero, 02 side/alternate three-quarter, 03 rear/top/underside or mounting detail. Preserve physical identity between views; reject near duplicates or uncertain geometry.
- One fixture, 75–85% usable area as shape permits, no essential crops, no text/watermarks/fake marks, premium softbox studio lighting and clean #002652 background.
- Inspect image for identity, materials, geometry, unwanted elements, background consistency, sharpness and viewpoint variety. Record uncertain details for review; don't publish unverified results.

## Optimize and store
- Use Sharp or Pillow: 1600x1600, sRGB WebP, approximately 100–300 KB when practical; preserve detail and aspect ratio. Padding rather than stretching. Verify actual dimensions, MIME, file size and decode.
- Save public/images/products/catalogue/<slug>/01.webp, 02.webp, 03.webp. Never overwrite originals.
- Update the manifest only for actual completed work: reference paths, generation type, final paths, dimensions, file sizes, QC, integration and completion. Retain pending/blocked statuses and reasons.

## Integrate
- Inspect existing product cards, both product detail routes, gallery and home featured products. Centralize accepted image mapping; use existing images as fallback until all three replacement views pass QC. Keep architectural representative attribution and distinguish reference-based renderings from authentic photographs.
- Use Next.js Image with accurate alt, sizes, fixed aspect ratio, sensible loading and priority. Gallery: accessible thumbnail selection, zoom, swipe, keyboard and error handling. Preserve existing UI, metadata, enquiry behavior and URLs.

## Verify and publish
- Test at 320,375,390,430,768,1024,1280,1440,1920 px: homepage, listing, detail, gallery, image crop/load, errors and overflow.
- Run applicable npm install, npx tsc --noEmit, npm run lint, npm run build and existing tests. Record actual results and limitations, not assumed passes.
- Review changed files, original preservation, no secrets or unrelated changes. Commit verified changes; push to authorized branch, or create a feature branch/PR if main is protected. Report commit SHA/PR only after remote success.
- Report confirmed products, target/generated/optimized/integrated counts, reference-based/representative splits, paths, size, completed/pending batches, failures and testing/build/publish results.
