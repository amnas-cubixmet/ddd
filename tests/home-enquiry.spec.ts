import { expect, test } from "@playwright/test";

test("homepage globe remains and enquiry replaces the old CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByText("Global Presence")).toHaveCount(0);
  await expect(page.locator("#global-presence")).toBeAttached();
  await expect(page.getByText("Connecting Markets. Illuminating Possibilities.")).toHaveCount(0);
  await expect(page.getByText("Let’s light up your next project.")).toHaveCount(0);
  const form = page.locator("#contact-enquiry");
  await expect(form.getByRole("button", { name: "Send Enquiry" })).toBeVisible();
  await form.getByLabel("Full name").fill("Test Customer");
  await form.getByLabel("Email address").fill("customer@example.com");
  await form.getByLabel("Phone number").fill("+919876543210");
  await form.getByLabel("Company name").fill("Example Co");
  await form.getByLabel("Subject").fill("Lighting enquiry");
  await form.getByLabel("Message").fill("Please share lighting specifications.");
  await form.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(form.getByText("Online submission is unavailable. Send your enquiry by email.")).toBeVisible();
});

test("removed admin routes are unavailable", async ({ request }) => {
  expect((await request.get("/admin/email-settings")).status()).toBe(404);
  expect((await request.get("/api/admin/email-settings")).status()).toBe(404);
  expect((await request.post("/api/admin/email-settings", { data: { action: "test" } })).status()).toBe(404);
});

test("public enquiry rejects malformed and honeypot submissions", async ({ request }) => {
  expect((await request.post("/api/enquiry", { data: {} })).status()).toBe(400);
  const data = { name: "Test Customer", company: "", email: "customer@example.com", phone: "+919876543210", subject: "Test", interest: "", projectType: "", location: "", quantity: "", message: "A valid test enquiry", website: "spam", requestId: "5b746ef9-935e-4b77-a657-25fc5299c60e", home: true };
  expect((await request.post("/api/enquiry", { data })).status()).toBe(400);
});
