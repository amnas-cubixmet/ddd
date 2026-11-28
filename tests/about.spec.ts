import { expect, test } from "@playwright/test";

test("About page is responsive, accessible and retains enquiry controls", async ({ page, request }, testInfo) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto("/about");
  const about = page.getByTestId("about-page");
  await expect(about.getByRole("heading", { level: 1 })).toHaveText("Engineering Brighter Possibilities.");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page).toHaveTitle("About Bharat Lums | Professional LED Lighting Solutions");
  for (const width of [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 850 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const overflowing = await about.locator("section").evaluateAll(sections => sections.filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.getAttribute("aria-labelledby") || el.id || el.className));
    expect(overflowing, "Overflow at " + width).toEqual([]);
    if ([320, 390, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath("about-" + width + ".png"), fullPage: true, animations: "disabled" });
  }
  const faq = about.locator("details").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await expect(faq.locator("p")).toBeVisible();
  await faq.locator("summary").click();
  await expect(faq.locator("p")).toBeHidden();
  await expect(about.locator("#global-presence")).toBeVisible();
  const countries = about.getByRole("group", { name: "Countries on the map" });
  await countries.getByRole("button").nth(1).click();
  await expect(countries.getByRole("button").nth(1)).toHaveAttribute("aria-pressed", "true");
  for (const href of ["/products", "/products/infrastructure-lighting", "/products/architectural-lighting", "/products/categories/high-bay-industrial-lighting", "/applications", "/lighting-guides", "/contact"]) {
    await expect(about.locator('a[href="' + href + '"]').first()).toBeAttached();
    expect((await request.get(href)).ok(), href).toBe(true);
  }
  for (const img of await about.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
  const form = about.locator("#contact-enquiry form");
  await form.getByLabel("Full name").fill("QA Test");
  await form.getByLabel("Email address").fill("qa@example.com");
  await form.getByLabel("Phone number").fill("+91 9000000000");
  await form.getByLabel("Subject").fill("Lighting enquiry");
  await form.getByLabel("Message").fill("Warehouse lighting project test.");
  await page.route("https://wa.me/**", route => route.fulfill({ status: 200, contentType: "text/plain", body: "Mock WhatsApp destination" }));
  await form.getByRole("button", { name: "Send via WhatsApp" }).click();
  await expect(page).toHaveURL(/https:\/\/wa\.me\//);
  expect(new URL(page.url()).searchParams.get("text")).toContain("Warehouse lighting project test.");
});

test("About schema references existing organization and breadcrumb", async ({ page }) => {
  await page.goto("/about");
  const canonical = page.locator('link[rel="canonical"]');
  if (!(await canonical.count())) return;
  const url = await canonical.getAttribute("href");
  const nodes = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.flatMap(script => {
    const data = JSON.parse(script.textContent || "{}");
    return data["@graph"] || [data];
  }));
  expect(nodes.filter(node => node["@type"] === "AboutPage")).toHaveLength(1);
  expect(nodes.filter(node => node["@type"] === "Organization")).toHaveLength(1);
  expect(nodes.find(node => node["@type"] === "AboutPage").url).toBe(url);
  expect(nodes.find(node => node["@type"] === "BreadcrumbList").itemListElement).toHaveLength(2);
});
