import { expect, test } from "@playwright/test";

test("shows all ten product categories and links featured fixtures to quotes", async ({ page }) => {
  await page.goto("/");
  const categories = page.getByRole("list", { name: "LED lighting categories" });
  await expect(categories.getByRole("link")).toHaveCount(10);
  await expect(categories.getByRole("link", { name: "LED High Bay Lights" }))
    .toHaveAttribute("href", "/products/led-high-bay-light");

  const featured = page.getByRole("region", { name: "Featured products" });
  const product = featured.getByRole("article").filter({
    has: page.getByRole("heading", { name: "Black round fixture with exposed LED board" }),
  });
  await expect(product.getByRole("link", { name: "View details" }))
    .toHaveAttribute("href", "/products/round-black-exposed");
  await expect(product.getByRole("link", { name: "Enquire now" }))
    .toHaveAttribute("href", "/request-quote?product=round-black-exposed");
});

test("toggles hero illumination and brightness availability", async ({ page }) => {
  await page.goto("/");
  const power = page.getByRole("button", { name: "Fixture power" });
  const brightness = page.getByRole("slider", { name: "Brightness" });
  await expect(brightness).toBeEnabled();
  await power.click();
  await expect(power).toHaveAttribute("aria-pressed", "false");
  await expect(brightness).toBeDisabled();
  await power.click();
  await expect(brightness).toBeEnabled();
  await expect(power).toHaveAttribute("aria-pressed", "true");
});

test("portfolio routes are removed and the homepage does not link to them", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('a[href="/portfolio"], a[href^="/portfolio/"]')).toHaveCount(0);
  for (const path of ["/portfolio", "/portfolio/sample-project"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  }
});
