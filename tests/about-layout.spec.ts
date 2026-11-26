import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`about page layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Engineering brighter possibilities.");
    await expect(page.getByRole("heading", { name: "Lighting by application." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Start with the space." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Planning a lighting project?" })).toBeVisible();
    await expect(page.getByText("Let’s light up your next project.")).toHaveCount(0);
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(3);
    await expect(cards.first().getByRole("link")).toHaveAttribute("href", "/products?category=commercial-lighting");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
  });
}
