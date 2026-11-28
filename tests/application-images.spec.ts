import { test, expect } from "@playwright/test";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const slugs = ["road-and-highway-lighting","warehouse-lighting","factory-lighting","office-lighting","retail-lighting","parking-area-lighting","hospitality-lighting"];

for (const slug of slugs) {
  test("optimized WebP asset: " + slug, async () => {
    const file = join(process.cwd(), "public", "images", "applications", slug + ".webp");
    const [info, metadata] = await Promise.all([stat(file), sharp(file).metadata()]);
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBeGreaterThanOrEqual(1600);
    expect(metadata.height).toBeGreaterThanOrEqual(1200);
    expect(Math.abs((metadata.width ?? 0) / (metadata.height ?? 1) - 4/3)).toBeLessThan(.005);
    expect(info.size).toBeLessThanOrEqual(300 * 1024);
  });
}
