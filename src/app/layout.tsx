import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HomeIntroProvider } from "@/components/home-intro-context";
import { catalogueCategories, products } from "@/lib/catalogue";
import Header from "@/components/nav";
import { HeroWhatsApp } from "@/components/hero-whatsapp";
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
        <HeroWhatsApp />
        </HomeIntroProvider>
      </body>
    </html>
  );
}
