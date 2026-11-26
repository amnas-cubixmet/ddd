import { expect, test } from "@playwright/test";
test("mobile homepage navigation and form fit viewport", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByText("Global Presence")).toHaveCount(0);
  await page.getByRole("button", { name: "Close menu" }).click();
  const section = page.locator("#contact-enquiry");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole("button", { name: "Send Enquiry" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
});
