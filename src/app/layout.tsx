import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { catalogueCategories, products } from "@/lib/catalogue";
import Header from "@/components/nav";
import { Footer } from "@/components/ui";
import { brand, description, metadataOrigin, siteUrl } from "@/lib/site";
import { Hanken_Grotesk, Montserrat } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Bharat Lums | Architectural Lighting",
    template: "%s | Bharat Lums",
  },
  description,
  applicationName: brand.name,
  keywords: [
    "architectural lighting",
    "linear LED lighting",
    "suspended linear lighting",
    "Bharat Lums",
  ],
  metadataBase: metadataOrigin ? new URL(metadataOrigin) : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${hanken.variable} ${montserrat.variable}`}>
      <body id="top">
        {siteUrl && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: brand.name,
                url: siteUrl,
                logo: new URL("/images/logo/bharat-lums-blue.png", siteUrl)
                  .href,
                email: brand.email,
                telephone: brand.phone,
                slogan: brand.tagline,
              }).replace(/</g, "\\u003c"),
            }}
          />
        )}
        <Header />
        <main id="main-content">
          <Suspense fallback={null}>
            <Breadcrumbs
              categories={catalogueCategories.map(({ slug, name }) => ({ slug, name }))}
              products={products.map(({ slug, name, categories }) => ({ slug, name, category: categories[0] }))}
            />
          </Suspense>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
