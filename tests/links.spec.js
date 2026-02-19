const { test, expect } = require("@playwright/test");

test.describe("Link validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("index.html");
  });

  test("all project links have valid href attributes", async ({ page }) => {
    const hrefs = await page
      .locator("a.project")
      .evaluateAll((els) => els.map((el) => el.href));

    for (const href of hrefs) {
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https:\/\//);
    }
  });

  test("all project links have non-empty text content", async ({ page }) => {
    const links = await page.locator("a.project").all();

    for (const link of links) {
      const text = await link.textContent();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  test("project links are reachable (HTTP 200) @network", async ({ page, request }) => {
    const hrefs = await page
      .locator("a.project")
      .evaluateAll((els) => els.map((el) => el.href));

    for (const href of hrefs) {
      const response = await request.get(href);
      expect(
        response.ok(),
        `Expected ${href} to return 200, got ${response.status()}`
      ).toBeTruthy();
    }
  });
});
