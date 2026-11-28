import { test, expect } from "@playwright/test";

test("all products mobile catalogue has live filters and sorting", async ({page}) => {
  await page.setViewportSize({width:320,height:700});
  await page.goto("/products");
  const grid = page.getByTestId("all-products-catalogue");
  await expect(grid.getByRole("listitem")).toHaveCount(40);
  await expect(page.getByRole("button",{name:"Filters",exact:true})).toHaveAttribute("aria-expanded","false");
  for (const width of [320,360,375,390,414,430,600,768,900,1024,1280,1440,1920]) {
    await page.setViewportSize({width,height:900});
    expect(await grid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width<=900?2:3);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.getByRole("button",{name:"Filters",exact:true}).click();
  await page.getByRole("button",{name:/LED Street Lights/}).click();
  await expect(grid.getByRole("listitem")).toHaveCount(7);
  await page.getByRole("button",{name:"31–100 W",exact:true}).click();
  await expect(grid.getByRole("listitem")).toHaveCount(5);
  await page.getByRole("combobox",{name:"Sort"}).selectOption("watts-desc");
  await page.getByRole("button",{name:"Clear filters"}).click();
  await expect(grid.getByRole("listitem")).toHaveCount(40);
  await page.getByRole("searchbox",{name:"Search products"}).fill("NEONA");
  await expect(grid.getByRole("listitem")).toHaveCount(5);
});

 test("catalogue search handles wattage formatting and reverse sorting", async ({page}) => {
  await page.goto("/products");
  const grid = page.getByTestId("all-products-catalogue");
  const search = page.getByRole("searchbox", {name:"Search products"});
  await search.fill("NEONA 50W");
  await expect(grid.getByRole("listitem")).toHaveCount(1);
  await search.fill("NEONA 50 W");
  await expect(grid.getByRole("listitem")).toHaveCount(1);
  await search.fill("");
  const sort = page.getByRole("combobox",{name:"Sort"});
  await sort.selectOption("name");
  const forward = await grid.locator("h3").allTextContents();
  await sort.selectOption("name-desc");
  expect(await grid.locator("h3").allTextContents()).toEqual([...forward].reverse());
  await sort.selectOption("watts-desc");
  await expect(grid.locator("h3").first()).toContainText("200 W");
});
