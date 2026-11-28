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
      if (width <= 805) {
        const gallery = await detail.locator(".product-gallery-image").boundingBox();
        expect(Math.abs(gallery!.width - gallery!.height)).toBeLessThanOrEqual(2);
        const order = await Promise.all([
          detail.locator(".product-gallery").boundingBox(),
          detail.locator(".detail-copy").boundingBox(),
          detail.locator("#specifications-title").boundingBox(),
          detail.getByRole("complementary", { name: "Project enquiry and applications" }).boundingBox(),
        ]);
        for (let index = 1; index < order.length; index++) {
          expect(order[index]!.y).toBeGreaterThanOrEqual(order[index - 1]!.y + order[index - 1]!.height - 1);
        }
      }
    }
    const summary = detail.locator(".detail-copy");
    const panel = detail.getByRole("complementary", { name: "Project enquiry and applications" });
    const gallery = detail.locator(".product-gallery");
    const specs = detail.locator("#specifications-title");
    const [summaryBox, panelBox, galleryBox, specsBox] = await Promise.all([summary.boundingBox(), panel.boundingBox(), gallery.boundingBox(), specs.boundingBox()]);
    expect(panelBox!.y - (summaryBox!.y + summaryBox!.height)).toBeLessThanOrEqual(24);
    expect(specsBox!.y - (galleryBox!.y + galleryBox!.height)).toBeLessThanOrEqual(24);
    await expect(detail.locator(".product-lightbox")).toHaveCount(0);
    await detail.locator(".product-gallery-image").click({position: {x: 30, y: 30}});
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const next = gallery.getByRole("button", { name: "Next image" });
    if (await next.count()) {
      await next.click();
      await expect(gallery.locator('[aria-live="polite"]')).toContainText("Image 2 of");
      await gallery.getByRole("button", { name: "Previous image" }).click();
      await expect(gallery.locator('[aria-live="polite"]')).toContainText("Image 1 of");
    }
  }
});
