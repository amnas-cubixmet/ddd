import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

type Visual = { src: string; alt: string; fixture?: boolean };
const images: Record<string, { alt: string; fallback: Visual }> = {
  "road-and-highway-lighting": { alt: "Illustrative LED street lighting illuminating a modern highway at dusk", fallback: { src: "/images/products/street-light.webp", alt: "LED street lighting fixture reference", fixture: true } },
  "warehouse-lighting": { alt: "Illustrative LED high bay lighting inside a logistics warehouse", fallback: { src: "/images/products/warehouse-high-bay.webp", alt: "Warehouse lighting fixture reference", fixture: true } },
  "factory-lighting": { alt: "Illustrative industrial LED lighting over factory machinery", fallback: { src: "/images/products/high-bay.webp", alt: "Industrial high bay fixture reference", fixture: true } },
  "office-lighting": { alt: "Illustrative office with suspended linear LED lights and ceiling panels", fallback: { src: "/images/conference-room-linear-lighting.webp", alt: "Conference room with linear lighting" } },
  "retail-lighting": { alt: "Illustrative LED track lighting in a retail showroom", fallback: { src: "/images/architectural-commercial-lighting.webp", alt: "Architectural and commercial lighting reference" } },
  "parking-area-lighting": { alt: "Illustrative LED area lighting over commercial parking bays", fallback: { src: "/images/lighting-by-application.webp", alt: "Illustrative exterior lighting near a commercial building" } },
  "hospitality-lighting": { alt: "Illustrative warm architectural LED lighting in a hotel lobby", fallback: { src: "/images/architectural-commercial-lighting.webp", alt: "Architectural interior lighting reference" } },
};

export function applicationImage(slug: string): Visual {
  const entry = images[slug];
  if (!entry) return { src: "/images/lighting-by-application.webp", alt: "Illustrative lighting application" };
  const src = `/images/applications/${slug}.webp`;
  return existsSync(join(process.cwd(), "public", "images", "applications", `${slug}.webp`))
    ? { src, alt: entry.alt }
    : entry.fallback;
}
