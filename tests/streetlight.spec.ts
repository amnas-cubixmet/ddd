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
  await expect(page.getByTestId("home-intro")).toHaveCount(1);
  await expect(page.getByTestId("home-intro")).toBeHidden({ timeout: 25_000 });
});

test("the streetlight hero reflows from narrow mobile to tablet around the same canvas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");

  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "true", { timeout: 25_000 });
  const hero = stage.locator("xpath=ancestor::section[1]");
  const heading = hero.getByRole("heading", { level: 1 });
  const explore = hero.getByRole("link", { name: "Explore Products" });
  const catalogue = hero.getByRole("link", { name: /Catalogue/ });
  const canvas = await stage.locator("canvas").elementHandle();

  await expect(heading).toHaveCSS("font-size", "32px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  const stageOnMobile = (await stage.boundingBox())!;
  expect(stageOnMobile.width).toBe(320);
  expect(stageOnMobile.y + stageOnMobile.height).toBeLessThan((await heading.boundingBox())!.y);
  expect((await explore.boundingBox())!.y).toBe((await catalogue.boundingBox())!.y);

  const slider = hero.getByRole("slider", { name: "Brightness" });
  await slider.scrollIntoViewIfNeeded();
  await expect(slider).toBeInViewport({ ratio: 1 });

  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(heading).toHaveCSS("font-size", "52px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);
  const stageOnTablet = (await stage.boundingBox())!;
  const headingOnTablet = (await heading.boundingBox())!;
  expect(stageOnTablet.x).toBeGreaterThan(headingOnTablet.x + headingOnTablet.width);
  expect(await canvas!.evaluate((element) => element.isConnected)).toBe(true);
});

test("inner pages do not show the branded homepage intro", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByTestId("home-intro")).toHaveCount(0);
  await expect(page.getByTestId("page-loading")).toHaveCount(0);
});
