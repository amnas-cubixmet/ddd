import { test, expect } from "@playwright/test";

test("homepage features six linked products with two mobile columns", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const grid = page.getByTestId("featured-products");
  await expect(grid.getByRole("listitem")).toHaveCount(6);
  await expect(grid.getByRole("link")).toHaveCount(6);
  for (const width of [320, 375, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width < 768 ? 2 : 3);
    expect(await grid.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await expect(grid.locator("img").first()).toHaveCSS("object-fit", "contain");
  }
  await grid.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/products\/neona-50\/?$/);
});
