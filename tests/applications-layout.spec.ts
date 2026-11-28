import { test, expect } from "@playwright/test";

const slugs = ["road-and-highway-lighting","warehouse-lighting","factory-lighting","office-lighting","retail-lighting","parking-area-lighting","hospitality-lighting"];
const widths = [320, 360, 375, 390, 430, 480, 767, 768, 1023, 1024, 1280, 1440, 1920];

test("application directory is responsive and links to every project type", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/applications");
  const grid = page.getByTestId("application-grid");
  await expect(grid.getByRole("listitem")).toHaveCount(7);
  await expect(grid.getByRole("link")).toHaveCount(7);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect.poll(() => grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width < 480 ? 1 : width < 1024 ? 2 : 3);
  }
  for (const slug of slugs) {
    const link = grid.locator('a[href="/applications/' + slug + '"]');
    const img = link.locator("img");
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await expect(img).toHaveAttribute("src", new RegExp(slug + "\\.webp"));
    await link.click();
    await expect(page).toHaveURL(new RegExp("/applications/" + slug + "/?$"));
    await page.goto("/applications");
  }
});
