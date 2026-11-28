import { expect, test } from "@playwright/test";

test("homepage sections fit mobile screens and retain interactive controls", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await expect(page.getByTestId("home-intro")).toBeHidden({ timeout: 25000 });
  const main = page.locator("#main-content");
  const grid = page.getByTestId("featured-products");
  for (const width of [320, 360, 375, 390, 430, 600, 768]) {
    await page.setViewportSize({ width, height: 850 });
    await page.evaluate(() => document.fonts.ready);
    await expect(grid.getByRole("listitem")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const overflowing = await main.locator("section").evaluateAll(sections => sections.filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.getAttribute("aria-labelledby") || el.id || el.className));
    expect(overflowing).toEqual([]);
    await expect.poll(() => grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width < 768 ? 2 : 3);
  }
  await page.setViewportSize({ width: 320, height: 700 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();
  const faq = page.locator("#faq").getByRole("button").first();
  await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#contact-enquiry form")).toBeVisible();
});
