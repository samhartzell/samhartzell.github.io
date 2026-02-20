const { test, expect } = require("@playwright/test");

test.describe("SEO and meta tags", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("index.html");
  });

  test("page has a non-empty title", async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test("page has a meta description", async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
    const content = await description.getAttribute("content");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  test("page has a meta viewport tag", async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
    const content = await viewport.getAttribute("content");
    expect(content).toContain("width=device-width");
  });

  test("page has a charset declaration", async ({ page }) => {
    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveCount(1);
    const value = await charset.getAttribute("charset");
    expect(value.toLowerCase()).toBe("utf-8");
  });

  test("page has Open Graph title and description", async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);
    const titleContent = await ogTitle.getAttribute("content");
    expect(titleContent.trim().length).toBeGreaterThan(0);

    const ogDesc = page.locator('meta[property="og:description"]');
    await expect(ogDesc).toHaveCount(1);
    const descContent = await ogDesc.getAttribute("content");
    expect(descContent.trim().length).toBeGreaterThan(0);
  });
});
