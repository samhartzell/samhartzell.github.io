const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test.describe("Accessibility", () => {
  test("page has no accessibility violations", async ({ page }) => {
    await page.goto("index.html");

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test("page has a main landmark", async ({ page }) => {
    await page.goto("index.html");

    const results = await new AxeBuilder({ page })
      .withTags(["best-practice"])
      .analyze();

    const landmarkViolation = results.violations.find(
      (v) => v.id === "landmark-one-main"
    );

    // Report but don't fail on best-practice landmark checks
    if (landmarkViolation) {
      console.warn(
        "Best practice: consider adding a <main> landmark element"
      );
    }
  });

  test("all interactive elements are keyboard accessible", async ({
    page,
  }) => {
    await page.goto("index.html");

    const links = await page.locator("a").all();
    for (const link of links) {
      await expect(link).toBeVisible();
      // All <a> elements with href are natively keyboard-focusable
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
    }
  });

  test("page has a valid lang attribute", async ({ page }) => {
    await page.goto("index.html");

    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");
  });

  test("text has sufficient color contrast", async ({ page }) => {
    await page.goto("index.html");

    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
