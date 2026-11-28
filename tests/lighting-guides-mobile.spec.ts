import { test, expect } from "@playwright/test";

test("lighting guides directory has a compact responsive mobile layout", async ({ page }) => {
  await page.goto("/lighting-guides");
  const index = page.getByTestId("lighting-guide-index");
  await expect(index.getByRole("heading", { level: 1 })).toHaveText("LED lighting guides");
  const list = index.getByRole("list").first();
  await expect(list.getByRole("link")).toHaveCount(5);
  for (const width of [320,360,375,390,430,600,768,805,1024,1440,1920]) {
    await page.setViewportSize({ width, height: 850 });
    await expect.poll(() => list.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width < 600 ? 1 : width < 1024 ? 2 : 3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width <= 805) await expect(index.locator(".page-intro")).toHaveCSS("padding-top", "24px");
    else expect(await index.locator(".page-intro").evaluate(el => parseFloat(getComputedStyle(el).paddingTop))).toBeLessThanOrEqual(48);
  }
  await page.setViewportSize({ width: 320, height: 850 });
  await list.getByRole("link", { name: /How to specify LED street lights/ }).click();
  await expect(page).toHaveURL(/\/lighting-guides\/led-street-light-guide\/?$/);
});
