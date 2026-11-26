import { expect, test } from "@playwright/test";
import { buildEnquiryEmail, sampleEnquiry } from "../src/lib/email-template";
import { defaultTemplates, templateSources } from "../src/lib/email-template-settings";

for (const [source, path] of [["home", "/"], ["contact", "/contact"], ["quote", "/request-quote"]] as const) {
  test(`${source} submits to the shared email API`, async ({ page }) => {
    await page.goto(path);
    const form = page.locator("form.enquiry-form");
    await form.getByLabel("Full name").fill("Sample Customer");
    await form.getByLabel("Email address").fill("customer@example.com");
    await form.getByLabel("Phone number").fill("+919876543210");
    if (source === "home") await form.getByLabel("Subject").fill("Lighting");
    await form.getByLabel("Message", { exact: true }).fill("Please share your lighting options.");
    await page.route("**/api/enquiry", async route => {
      expect(route.request().postDataJSON().source).toBe(source);
      await route.fulfill({ status: 200, json: { ok: true, message: "Accepted by test email service." } });
    });
    await form.getByRole("button", { name: source === "quote" ? "Send Quote Request" : "Send Enquiry" }).click();
    await expect(form.getByText("Accepted by test email service.")).toBeVisible();
  });
}

test("templates escape customer HTML and distinguish each form", () => {
  for (const source of templateSources) {
    const email = buildEnquiryEmail({ ...sampleEnquiry, message: "<script>alert(1)</script>\nLine two" }, source, defaultTemplates, "TEST", true);
    expect(email.subject).toContain(defaultTemplates[source].subject);
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).not.toContain("<script>");
    expect(email.text).toContain("Line two");
    expect(email.subject).toContain("[TEST]");
  }
});
