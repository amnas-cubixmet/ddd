import { test, expect } from "@playwright/test";

const slugs = ["road-and-highway-lighting","warehouse-lighting","factory-lighting","office-lighting","retail-lighting","parking-area-lighting","hospitality-lighting"];
const widths = [320, 360, 375, 390, 430, 480, 767, 768, 1023, 1024, 1280, 1440, 1920];

for (const slug of slugs) {
  test("application detail layout and image: " + slug, async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/applications/" + slug);
    const heading = page.getByRole("heading", { level: 1 });
    const hero = page.getByTestId("application-hero-image");
    const img = hero.locator("img");
    await expect(heading).toHaveCount(1);
    await expect(page.getByTestId("application-planning").getByRole("heading", { level: 3 })).toHaveCount(3);
    await expect(page.getByRole("link", { name: "Discuss your lighting requirements", exact: true })).toHaveAttribute("href", "/contact?application=" + slug);
    await expect(img).toHaveAttribute("src", new RegExp(slug + "\\.webp"));
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 850 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const photo = await hero.boundingBox();
      const text = await heading.boundingBox();
      if (!photo || !text) throw new Error("Missing hero content");
      expect(Math.abs(photo.width / photo.height - 4/3)).toBeLessThan(.02);
      if (width < 768) expect(photo.y + photo.height).toBeLessThanOrEqual(text.y);
      else expect(text.x).toBeLessThan(photo.x);
    }
  });
}
