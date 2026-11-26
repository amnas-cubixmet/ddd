import { expect, test } from "@playwright/test";

for (const viewport of [{width:320,height:570},{width:1440,height:900}]) {
  test(`hero animations preserve fixed framing at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const stage = page.getByTestId("streetlight-stage");
    const visual = page.getByTestId("streetlight-visual");
    await expect(stage).toBeVisible();
    expect(await visual.evaluate(el => getComputedStyle(el).animationName)).not.toBe("none");
    const copy = page.locator("[data-hero-enter]").first();
    expect(await copy.evaluate(el => getComputedStyle(el).animationName)).not.toBe("none");
    const before = await stage.boundingBox();
    await page.waitForTimeout(2000);
    const after = await stage.boundingBox();
    expect(after).toEqual(before);
    const power = page.getByRole("button", { name: "Streetlight power" });
    await power.click();
    await expect(power).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("slider", { name: "Brightness" })).toBeDisabled();
    await power.click();
    await expect(power).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("slider", { name: "Brightness" })).toBeEnabled();
  });
}
test("reduced motion retains hero without entrance animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("streetlight-stage")).toBeVisible();
  expect(await page.getByTestId("streetlight-visual").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
});
