import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`product gallery is a horizontal slider at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/products/round-black-grouped");
    const gallery = page.getByRole("region", { name: "Product image slider" });
    const rail = gallery.getByRole("group", { name: "Image gallery" });
    const thumbnails = rail.getByRole("button");
    expect(await thumbnails.count()).toBeGreaterThan(2);
    await expect(thumbnails.first()).toHaveAttribute("aria-pressed", "true");
    await gallery.getByRole("button", { name: "Next image", exact: true }).click();
    await expect(thumbnails.nth(1)).toHaveAttribute("aria-pressed", "true");
    await gallery.getByRole("button", { name: "Previous image", exact: true }).click();
    await expect(thumbnails.first()).toHaveAttribute("aria-pressed", "true");
    const a = await thumbnails.first().boundingBox();
    const b = await thumbnails.nth(1).boundingBox();
    expect(Math.abs(a!.y - b!.y)).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await gallery.getByRole("button", { name: "Open full-size fixture image" }).click();
    await expect(gallery.getByRole("dialog")).toBeVisible();
    await gallery.getByRole("button", { name: "Next full-size image" }).click();
    await gallery.getByRole("button", { name: "Close fixture image" }).click();
    await expect(thumbnails.nth(1)).toHaveAttribute("aria-pressed", "true");
  });
}
