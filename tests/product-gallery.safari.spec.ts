import { expect, test } from "@playwright/test";
test("touch gallery switches images without opening zoom", async ({ page }) => {
  await page.goto("/products/round-black-grouped");
  const gallery = page.getByRole("region", { name: "Product image slider" });
  const main = gallery.getByRole("button", { name: "Open full-size fixture image" });
  await main.scrollIntoViewIfNeeded();
  await main.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 1, isPrimary: true, clientX: 230, clientY: 200 });
  await main.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 1, isPrimary: true, clientX: 100, clientY: 200 });
  await expect(gallery.getByRole("group", { name: "Image gallery" }).getByRole("button").nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(gallery.getByRole("dialog")).toBeHidden();
});
