import { test, expect } from "@playwright/test";

test("application directory is responsive and links to every project type", async ({ page }) => {
  await page.goto("/applications");
  const grid = page.getByTestId("application-grid");
  await expect(grid.getByRole("listitem")).toHaveCount(7);
  await expect(grid.getByRole("link")).toHaveCount(7);
  await expect(grid.locator("img")).toHaveCount(7);
  for (const width of [320,375,430,600,768,1024,1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect.poll(() => grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width < 480 ? 1 : width < 1024 ? 2 : 3);
  }
  await grid.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/applications\/road-and-highway-lighting\/?$/);
});
