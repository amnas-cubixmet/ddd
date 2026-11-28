import { test, expect } from "@playwright/test";

test("guide detail layouts preserve article content and resources on desktop and mobile", async ({ page }) => {
  for (const slug of ["led-street-light-guide","choose-led-flood-lights","led-high-bay-lighting-guide","lumens-watts-lux","ip65-ip66-lighting"]) {
    await page.goto("/lighting-guides/" + slug);
    const detail = page.getByTestId("guide-detail");
    await expect(detail.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(detail.locator("article > section")).toHaveCount(slug === "ip65-ip66-lighting" ? 3 : 4);
    await expect(detail.getByRole("heading", { name: "Technical references" })).toHaveCount(0);
    await expect(detail.getByRole("heading", { name: "Related lighting resources" })).toBeVisible();
    await expect(detail.getByRole("link", { name: "Discuss your lighting requirements" })).toHaveAttribute("href", "/contact");
    for (const width of [320,375,390,768,1024,1440,1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const article = await detail.locator("article").boundingBox();
      const resources = await detail.getByRole("complementary", { name: "Guide resources" }).boundingBox();
      if (width <= 805) expect(resources!.y).toBeGreaterThanOrEqual(article!.y + article!.height - 1);
      else expect(resources!.x).toBeGreaterThan(article!.x + article!.width);
    }
  }
});
