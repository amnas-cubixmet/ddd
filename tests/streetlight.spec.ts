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

test("the hero uses one absolute stage and full-section lighting across viewports", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "true", { timeout: 25_000 });
  await expect(page.getByTestId("home-intro")).toBeHidden();
  const hero = stage.locator("xpath=ancestor::section[1]");
  const heading = hero.getByRole("heading", { level: 1 });
  const slider = hero.getByRole("slider", { name: "Brightness" });
  const power = hero.getByRole("button", { name: "Fixture power" });
  const explore = hero.getByRole("link", { name: "Explore Products" });
  const catalogue = hero.getByRole("link", { name: /Catalogue/ });
  const canvas = await stage.locator("canvas").elementHandle();
  const backgroundRGB = () => hero.evaluate(el => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = getComputedStyle(el).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3);
  });
  const glow = hero.locator('[class*="heroIllumination"]');
  const sizes = [[320,568],[375,667],[390,844],[430,932],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080],[2560,1440]];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => document.fonts.ready);
    await expect(stage).toHaveCSS("position", "absolute");
    await expect(stage).toHaveCSS("pointer-events", "none");
    await expect(hero).toHaveCSS("position", "relative");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const h = (await hero.boundingBox())!;
    const st = (await stage.boundingBox())!;
    const g = (await glow.boundingBox())!;
    expect(g.width).toBeCloseTo(h.width, 0);
    expect(g.height).toBeCloseTo(h.height, 0);
    expect(st.x).toBeGreaterThanOrEqual(h.x - 1);
    expect(st.x + st.width).toBeLessThanOrEqual(h.x + h.width + 1);
    expect(st.y).toBeGreaterThanOrEqual(h.y - 1);
    expect(st.y + st.height).toBeLessThanOrEqual(h.y + h.height + 1);
    const typography = await heading.evaluate(el => ({font: parseFloat(getComputedStyle(el).fontSize), clipped: Array.from(el.children).some(child => child.scrollWidth > child.clientWidth + 1)}));
    expect(typography.font).toBeGreaterThanOrEqual(width <= 900 ? 38 : 64);
    expect(typography.clipped).toBe(false);
    for (const control of [explore, catalogue, slider, power]) {
      const b = (await control.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(h.x - 1);
      expect(b.x + b.width).toBeLessThanOrEqual(h.x + h.width + 1);
      expect(b.y + b.height).toBeLessThanOrEqual(h.y + h.height + 1);
      await expect(control).toBeVisible();
    }
    await slider.fill("100");
    await expect(hero).toHaveCSS("--hero-light-power", "1");
    await expect.poll(backgroundRGB).toEqual([20, 32, 46]);
    if (width === 390 || width === 1440) await hero.screenshot({ path: testInfo.outputPath(`hero-${width}-on.png`) });
    await slider.fill("0");
    await expect.poll(backgroundRGB).toEqual([31, 115, 189]);
    if (width === 390 || width === 1440) await hero.screenshot({ path: testInfo.outputPath(`hero-${width}-off.png`) });
    expect(await canvas!.evaluate(element => element.isConnected)).toBe(true);
  }
});

test("inner pages do not show the branded homepage intro", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByTestId("home-intro")).toHaveCount(0);
  await expect(page.getByTestId("page-loading")).toHaveCount(0);
});
