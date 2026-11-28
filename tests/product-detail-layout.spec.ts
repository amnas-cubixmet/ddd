import { test, expect } from "@playwright/test";

test("shared detail layout preserves gallery, enquiry, and mobile widths", async ({ page }) => {
  for (const route of ["/products/neona-50", "/products/architectural-lighting/panel-light"]) {
    await page.goto(route);
    const detail = page.locator(".catalogue-detail-motion");
    await expect(detail.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(detail.getByRole("link", { name: "Request a quote" })).toBeVisible();
    await expect(detail.getByRole("link", { name: "WhatsApp enquiry" })).toBeVisible();
    for (const width of [320, 375, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await detail.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width <= 805 ? 1 : 2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(detail.locator(".product-gallery-image img")).toHaveCSS("object-fit", "cover");
    }
    const summary = detail.locator(".detail-copy");
    const panel = detail.getByRole("complementary", { name: "Project enquiry and applications" });
    const gallery = detail.locator(".product-gallery");
    const specs = detail.locator("#specifications-title");
    const [summaryBox, panelBox, galleryBox, specsBox] = await Promise.all([summary.boundingBox(), panel.boundingBox(), gallery.boundingBox(), specs.boundingBox()]);
    expect(panelBox!.y - (summaryBox!.y + summaryBox!.height)).toBeLessThanOrEqual(24);
    expect(specsBox!.y - (galleryBox!.y + galleryBox!.height)).toBeLessThanOrEqual(24);
    await detail.getByRole("button", { name: "Open full-size fixture image" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(".lightbox-image img")).toHaveCSS("object-fit", "contain");
    await page.getByRole("button", { name: "Close fixture image" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  }
});
