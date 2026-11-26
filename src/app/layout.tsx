import type { Metadata } from "next";
import Header from "@/components/nav";
import { Footer } from "@/components/ui";
import { brand, description, metadataOrigin, siteUrl } from "@/lib/site";
import "@fontsource-variable/manrope";
import "./globals.css";

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
    <html lang="en">
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
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
