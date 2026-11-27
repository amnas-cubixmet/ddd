import { test, expect } from "@playwright/test";

test("streetlight renders and restores the selected brightness after a power cycle", async ({
  page,
}) => {
  await page.goto("/");
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "true", {
    timeout: 25_000,
  });
  await expect(page.getByTestId("home-intro")).toBeHidden();
  const slider = page.getByRole("slider", { name: "Brightness" });
  const power = page.getByRole("button", { name: "Fixture power" });
  const hero = stage.locator("xpath=ancestor::section[1]");
  await expect(slider).toHaveValue("0");
  for (const value of [0, 25, 50, 75, 100]) {
    await slider.fill(String(value));
    await expect(hero).toHaveCSS("--hero-light-power", String(value / 100));
  }
  await power.click();
  await expect(slider).toBeDisabled();
  await expect(hero).toHaveCSS("--hero-light-power", "0");
  await power.click();
  await expect(slider).toBeEnabled();
  await expect(hero).toHaveCSS("--hero-light-power", "1");
  await page.reload();
  await expect(stage).toHaveAttribute("data-ready", "true", {
    timeout: 25_000,
  });
  await expect(slider).toHaveValue("0");
  await page
    .getByRole("link", { name: "Explore Products", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/products\/?$/);
  await expect(page.getByTestId("home-intro")).toHaveCount(0);
  await expect(page.getByTestId("page-loading")).toHaveCount(0);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("home-intro")).toHaveCount(0);
});

 test("inner pages do not show the branded homepage intro", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByTestId("home-intro")).toHaveCount(0);
  await expect(page.getByTestId("page-loading")).toHaveCount(0);
});
