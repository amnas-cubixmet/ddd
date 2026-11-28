import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ShareImage } from "./seo";

// Server-side only. Missing assets remain explicit placeholders in the review branch.
const images: Record<string, ShareImage> = {
  "road-and-highway-lighting": { src: "/images/applications/road-and-highway-lighting.webp", alt: "LED street lighting illuminating a modern highway at dusk." },
  "warehouse-lighting": { src: "/images/applications/warehouse-lighting.webp", alt: "Industrial LED high bay lighting inside a modern logistics warehouse." },
  "factory-lighting": { src: "/images/applications/factory-lighting.webp", alt: "LED industrial lighting illuminating factory machinery and production workstations." },
  "office-lighting": { src: "/images/applications/office-lighting.webp", alt: "Modern corporate office illuminated by linear LED fixtures and ceiling panel lights." },
  "retail-lighting": { src: "/images/applications/retail-lighting.webp", alt: "Architectural LED track lighting illuminating merchandise in a premium retail showroom." },
  "parking-area-lighting": { src: "/images/applications/parking-area-lighting.webp", alt: "Outdoor LED area lighting illuminating commercial parking bays and pedestrian routes." },
  "hospitality-lighting": { src: "/images/applications/hospitality-lighting.webp", alt: "Warm architectural LED lighting inside a contemporary hotel reception and lobby." },
};

export function getApplicationImage(slug: string): ShareImage | undefined {
  const image = images[slug];
  return image && existsSync(join(process.cwd(), "public", image.src.slice(1))) ? image : undefined;
}
