import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`homepage enquiry layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const section = page.locator("#contact-enquiry");
    await section.scrollIntoViewIfNeeded();
    const subject = section.getByLabel("Subject");
    const message = section.getByLabel("Message", { exact: true });
    const name = section.getByLabel("Full name");
    const company = section.getByLabel("Company name");
    await expect(subject).toBeVisible();
    const [s, m, n, c] = await Promise.all([subject.boundingBox(), message.boundingBox(), name.boundingBox(), company.boundingBox()]);
    expect(s && m && n && c).toBeTruthy();
    expect(Math.abs(s!.width - m!.width)).toBeLessThan(2);
    if (width <= 600) {
      expect(Math.abs(n!.width - s!.width)).toBeLessThan(2);
      expect(c!.y).toBeGreaterThan(n!.y);
    } else {
      expect(Math.abs(n!.y - c!.y)).toBeLessThan(2);
      expect(s!.width).toBeGreaterThan(n!.width);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
  });
}
