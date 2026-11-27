import { test, expect } from "@playwright/test";

const route = "/products/architectural-lighting";

test("all 16 lighting cards preserve product-specific enquiry selection", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto(route);
  const cards = page.getByTestId("architectural-catalogue").getByRole("listitem");
  await expect(cards).toHaveCount(16);
  const products = await cards.evaluateAll(items => items.map(item => ({
    name: item.querySelector("h3")?.textContent?.trim() ?? "",
    href: item.querySelector('a[href^="/request-quote"]')?.getAttribute("href") ?? "",
  })));
  expect(new Set(products.map(item => item.href)).size).toBe(16);
  for (const product of products) {
    expect(product.name).not.toBe("");
    expect(product.href).toMatch(/^\/request-quote\?architectural=[a-z-]+$/);
    await page.goto(product.href);
    await expect(page.getByRole("combobox", { name: "Product interest" })).toHaveValue(product.name);
  }
});

test("responsive architectural grid has no overflow or broken approved photographs", async ({ page }, testInfo) => {
  for (const [width, columns] of [[1440, 3], [900, 2], [430, 1], [360, 1]]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    const grid = page.getByTestId("architectural-catalogue");
    await expect(grid.getByRole("listitem")).toHaveCount(16);
    expect(await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(columns);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(grid.locator("img")).toHaveCount(16);
    await expect(grid.getByRole("img", { name: "LED Strip Light reference image", exact: true })).toHaveCount(1);
    for (const photo of await grid.locator("img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveAttribute("alt", /\S/);
      await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      expect(await photo.evaluate(img => Math.abs(img.clientWidth - img.clientHeight * 4 / 3))).toBeLessThanOrEqual(1);
    }
    await page.screenshot({ path: testInfo.outputPath(`architectural-${width}.png`), fullPage: true });
  }
});

 test("architectural product details are available without quick preview", async ({ page }) => {
  await page.goto(route);
  const first = page.getByTestId("architectural-catalogue").getByRole("listitem").first();
  await expect(page.getByRole("button", { name: "Quick preview" })).toHaveCount(0);
  await first.getByRole("link", { name: "View details" }).click();
  await expect(page).toHaveURL(/architectural-lighting\/recessed-downlight$/);
  await expect(page.getByRole("heading", { name: "LED Recessed Downlight", exact: true })).toBeVisible();
});
