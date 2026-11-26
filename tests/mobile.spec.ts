import { expect, test } from "@playwright/test";

test("keeps the hero, navigation and controls usable in portrait and landscape", async ({ page }) => {
  await page.goto("/");
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("streetlight-poster")).toHaveJSProperty("complete", true);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(viewport.width);
    const power = page.getByRole("button", { name: "Fixture power" });
    await power.click();
    await expect(page.getByRole("slider", { name: "Brightness" })).toBeDisabled();
    await power.click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Products", exact: true }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});
