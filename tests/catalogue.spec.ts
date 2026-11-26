import { expect, test } from "@playwright/test";

test("filters the catalogue and opens a preselected quote", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("searchbox", { name: "Search products" }).fill("round fixture with exposed LED board");
  await expect(page.getByRole("heading", { name: "Black round fixture with exposed LED board" })).toBeVisible();
  await page.getByRole("link", { name: "View details" }).click();
  await expect(page).toHaveURL(/\/products\/round-black-exposed$/);
  await page.getByRole("main").getByRole("link", { name: "Request a quote", exact: true }).first().click();
  await expect(page).toHaveURL(/product=round-black-exposed/);
  await expect(page.getByLabel("Product interest")).toHaveValue(/Black round fixture/);
});

test("rejects invalid enquiries before reaching SMTP", async ({ request }) => {
  const response = await request.post("/api/enquiry", { data: { email: "invalid" } });
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ ok: false });
});
