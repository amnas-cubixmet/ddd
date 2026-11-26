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

test("toggles hero illumination and pauses fixture movement", async ({ page }) => {
  await page.goto("/");
  const power = page.getByRole("button", { name: "Fixture power" });
  const brightness = page.getByRole("slider", { name: "Brightness" });
  await expect(brightness).toBeEnabled();
  await power.click();
  await expect(power).toHaveAttribute("aria-pressed", "false");
  await expect(brightness).toBeDisabled();
  await power.click();
  await expect(brightness).toBeEnabled();
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.getByTestId("streetlight-motion"))
    .toHaveAttribute("data-motion-paused", "true");
});
