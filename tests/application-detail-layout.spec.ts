import { test, expect } from "@playwright/test";

test("application detail pages retain content and fit narrow screens", async ({ page }) => {
  for (const slug of ["road-and-highway-lighting","warehouse-lighting","factory-lighting","office-lighting","retail-lighting","parking-area-lighting","hospitality-lighting"]) {
    await page.goto("/applications/" + slug);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Technical references" })).toHaveCount(0);
    await expect(page.getByTestId("application-planning").getByRole("heading", { level: 3 })).toHaveCount(3);
    await expect(page.getByRole("link", { name: "Discuss your lighting requirements", exact: true })).toHaveAttribute("href", "/contact?application=" + slug);
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({ width, height: 850 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});
