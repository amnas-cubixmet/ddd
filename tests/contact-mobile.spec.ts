import { test, expect } from "@playwright/test";

test("contact mobile layout keeps fields readable, links functional and product context", async ({ page }) => {
  await page.goto("/contact?catalogue=1");
  const form = page.getByRole("form", { name: "Project enquiry" });
  await expect(form.getByLabel("Product interest")).toHaveValue("LED product catalogue");
  await expect(form.getByLabel("Message")).toHaveValue("Please share the current Bharat Lums product catalogue.");
  for (const width of [320,360,375,390,430,600,768,805]) {
    await page.setViewportSize({ width, height: 850 });
    await expect(form.getByLabel("Full name")).toHaveCSS("font-size", "16px");
    await expect(form.locator("label").filter({hasText: "Full name"})).toBeVisible();
    expect(await form.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 320, height: 850 });
  await expect(page.getByRole("link", { name: /Call/ }).filter({ hasText: "Call" })).toHaveAttribute("href", /^tel:/);
  await expect(form.getByRole("button", { name: "Send via WhatsApp" })).toBeVisible();
  await form.getByRole("button", { name: "Send via WhatsApp" }).click();
  await expect(form.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
  await expect(form.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
});
