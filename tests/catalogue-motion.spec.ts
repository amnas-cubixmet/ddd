import { test, expect } from "@playwright/test";

const divisions = [
  { path: "/products/infrastructure-lighting", grid: "infrastructure-catalogue", count: 24 },
  { path: "/products/architectural-lighting", grid: "architectural-catalogue", count: 16 },
];

test("catalogue filtering, sorting and detail navigation remain usable", async ({ page }) => {
  for (const { path, grid: id, count } of divisions) {
    await page.goto(path);
    const grid = page.getByTestId(id);
    const cards = grid.locator("[data-catalogue-item]");
    const search = page.getByRole("searchbox", { name: "Search products" });
    await expect(cards).toHaveCount(count);
    await expect(grid.getByRole("button", { name: "Quick preview" })).toHaveCount(0);
    await search.fill("no-match-xyz");
    await expect(cards).toHaveCount(0);
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(cards).toHaveCount(count);
    await page.getByRole("combobox", { name: "Sort" }).selectOption("name");
    await search.fill("LED");
    await search.fill("");
    await expect(cards).toHaveCount(count);
    await grid.getByRole("link", { name: "View details" }).first().click();
    await expect(page.locator(".catalogue-detail-motion")).toBeVisible();
    await expect(page.getByRole("link", { name: "WhatsApp enquiry" }).first()).toBeVisible();
  }
});

test("motion-safe responsive cards preserve images and controls", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    for (const { path, grid: id, count } of divisions) {
      await page.goto(path);
      const grid = page.getByTestId(id);
      await expect(grid.locator("[data-catalogue-item]")).toHaveCount(count);
      const image = grid.locator("img").first();
      await expect(image).toHaveCSS("object-fit", "contain");
      await expect(grid.locator("[data-catalogue-item]").first()).toHaveCSS("transform", "none");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${id}-${width}.png`), fullPage: true, animations: "disabled" });
    }
  }
});

 test("desktop cards lift on hover without zooming the image", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const { path, grid: id } of divisions) {
    await page.goto(path);
    const card = page.getByTestId(id).locator(".product-card").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect.poll(() => card.evaluate(node => {
      const transform = getComputedStyle(node).transform;
      return transform !== "none" && Math.abs(new DOMMatrix(transform).m42 + 5) < 0.5;
    })).toBe(true);
    await expect(card.locator("img")).toHaveCSS("transform", "none");
    await expect(card.locator("img")).toHaveCSS("object-fit", "contain");
    await expect.poll(() => card.locator(".image-link").evaluate(node => getComputedStyle(node, "::after").animationName)).toBe("catalogue-light-sweep");
  }
});

test("light sweep and gallery fade respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const { path, grid: id } of divisions) {
    await page.goto(path);
    const card = page.getByTestId(id).locator(".product-card").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    expect(await card.locator(".image-link").evaluate(node => getComputedStyle(node, "::after").animationName)).toBe("none");
    await card.getByRole("link", { name: "View details" }).click();
    await expect(page.locator(".catalogue-detail-motion .gallery-image-transition")).toHaveCSS("animation-name", "none");
  }
});
