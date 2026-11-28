# Technical SEO and release configuration

Researched and implemented on 28 November 2026.

`src/lib/seo.ts` shares route paths, absolute URLs and per-page metadata. The branded social image is served by the App Router `/opengraph-image` handler. Identified models render their own image metadata.

| Environment | Setup | Expected behaviour |
| --- | --- | --- |
| Production | Set `SITE_URL=https://www.bharatlums.com` once the catalogue is attached to the www domain. | Self-canonical indexed pages, public crawl paths and dynamic sitemap. |
| Vercel preview | Vercel provides `VERCEL_ENV=preview`. | HTML noindex and empty sitemap even if SITE_URL is shared. |
| Other staging | Set `SITE_INDEXING=disabled`. | HTML noindex and empty sitemap. |
| Local | Keep SITE_URL empty during normal development. Set it when validating a simulated release. | Local pages do not claim production indexing in the default setup. |

Crawlers must be allowed to read HTML meta robots. Robots excludes the API. Query-based filters and enquiry parameters keep the clean canonical path. Existing detail URLs stay stable. Legacy URLs without a documented equivalent return 404.

Add `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` only with tokens obtained from the verified property owners. Submit `https://www.bharatlums.com/sitemap.xml` after the cutover and inspect representative URL indexing. Configure GA4 or an approved tag manager through the business consent implementation. The first-party `bharat:whatsapp-enquiry-open` event contains source context and zero enquiry form information. It measures when the browser opens WhatsApp. Record qualified enquiries in the receiving channel or CRM.

- [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js sitemap API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google sitemap publishing](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
