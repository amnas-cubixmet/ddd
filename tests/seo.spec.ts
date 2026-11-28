import { expect, test } from "@playwright/test";

const site = process.env.SITE_URL?.trim().replace(/\/$/, "");
const indexable = Boolean(site && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") &&
  process.env.SITE_INDEXING !== "disabled");

test("sitemap, canonical URL and indexing rules agree", async ({ request, page }) => {
  const robots = await request.get("/robots.txt");
  const sitemap = await request.get("/sitemap.xml");
  expect(robots.ok()).toBe(true);
  expect(sitemap.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /api/");

  const xml = await sitemap.text();
  if (indexable) {
    expect(await robots.text()).toContain(`Sitemap: ${site}/sitemap.xml`);
    expect(xml).toContain(`<loc>${site}/products/oron-30</loc>`);
    expect(xml).toContain(`<loc>${site}/products/categories/floodlights</loc>`);
    expect(xml).toContain(`<loc>${site}/applications/warehouse-lighting</loc>`);
    expect(xml).toContain(`<loc>${site}/lighting-guides/led-high-bay-lighting-guide</loc>`);
    expect(xml).not.toContain("/products/round-black-grouped");
    expect(xml).not.toContain("/products/architectural-lighting/panel-light");
  } else {
    expect(xml).not.toContain("<loc>");
    expect(await robots.text()).not.toContain("Sitemap:");
  }

  await page.goto("/products/infrastructure-lighting?category=floodlights");
  if (site) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${site}/products/infrastructure-lighting`);
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", indexable ? "index, follow" : "noindex, follow");
  await page.goto("/products/architectural-lighting/panel-light");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await expect(page.getByRole("heading", { name: "LED Panel Light", exact: true })).toBeVisible();
});

test("application and guide content works without JavaScript", async ({ browser, request, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/applications/warehouse-lighting");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("LED lighting for warehouses");
    await expect(page.getByRole("link", { name: "LED warehouse fixture catalogue" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Discuss your lighting requirements" }))
      .toHaveAttribute("href", "/request-quote?application=warehouse-lighting");
    await page.goto("/lighting-guides/led-high-bay-lighting-guide");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("LED high bay lighting guide");
    await expect(page.getByRole("heading", { name: "Technical references" })).toBeVisible();
  } finally {
    await context.close();
  }

  for (const route of ["/products/fixture-that-does-not-exist", "/lighting-guides/unknown-guide", "/applications/unknown-application", "/products/categories/unknown-category"]) {
    expect((await request.get(route)).status()).toBe(404);
  }
});

test("warehouse quote retains context on the form and WhatsApp link", async ({ page }) => {
  await page.goto("/request-quote?application=warehouse-lighting");
  await expect(page.getByRole("combobox", { name: "Product interest" })).toHaveValue("LED lighting for warehouses");
  const chat = page.getByRole("link", { name: /WhatsApp Chat with our team/ });
  const href = await chat.getAttribute("href");
  expect(new URL(href!).searchParams.get("text")).toContain("LED lighting for warehouses");
});
