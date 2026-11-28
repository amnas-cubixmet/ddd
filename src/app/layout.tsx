import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HomeIntroProvider } from "@/components/home-intro-context";
import { catalogueCategories, products } from "@/lib/catalogue";
import Header from "@/components/nav";
import { Footer } from "@/components/ui";
import { brand } from "@/lib/site";
import { applications, guides } from "@/lib/lighting-content";
import { absoluteUrl, description, indexableSite, metadataOrigin, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo-data";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Bharat Lums | Professional LED Lighting",
    template: "%s | Bharat Lums",
  },
  description,
  applicationName: brand.name,
  robots: { index: indexableSite, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
    other: process.env.BING_SITE_VERIFICATION?.trim() ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION.trim() } : undefined,
  },
  metadataBase: metadataOrigin ? new URL(metadataOrigin) : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hanken.variable}>
      <body id="top">
        {siteUrl && <JsonLd data={[
          {
            "@type": "Organization",
            "@id": absoluteUrl("/#organization"),
            name: brand.name,
            url: siteUrl,
            logo: absoluteUrl("/images/logo/bharat-lums-blue.png"),
            email: brand.email,
            telephone: brand.phone,
            slogan: brand.tagline,
          },
          {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            name: brand.name,
            url: siteUrl,
            inLanguage: "en",
            publisher: { "@id": absoluteUrl("/#organization") },
          },
        ]} />}
        <HomeIntroProvider>
        <Header />
        <main id="main-content">
          <Suspense fallback={null}>
            <Breadcrumbs
              categories={catalogueCategories.map(({ slug, name }) => ({ slug, name }))}
              applications={applications.map(({ slug, title }) => ({ slug, name: title }))}
              guides={guides.map(({ slug, title }) => ({ slug, name: title }))}
              products={products.map(({ slug, name, categories }) => ({ slug, name, category: categories[0] }))}
            />
          </Suspense>
          {children}
        </main>
        <Footer />
        <a
          className="floating-whatsapp"
          href={`https://wa.me/${brand.phoneHref.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Bharat Lums on WhatsApp"
          title="Chat on WhatsApp"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.148-.174.198-.298.297-.496.1-.199.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.377l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.25c.002-5.45 4.437-9.884 9.888-9.884a9.82 9.82 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.893 6.994c-.002 5.45-4.437 9.884-9.887 9.884M20.46 3.488A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.447h.005c6.554 0 11.89-5.335 11.893-11.891a11.82 11.82 0 0 0-3.483-8.414Z" />
              </svg>
        </a>
        </HomeIntroProvider>
      </body>
    </html>
  );
}
