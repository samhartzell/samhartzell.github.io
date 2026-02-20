const { test, expect } = require("@playwright/test");

test.describe("Keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("index.html");
  });

  test("Tab key navigates through all project links in order", async ({
    page,
  }) => {
    const expectedOrder = [
      "Science Olympiad",
      "WCPSS SSA Prep",
      "Court Monitor",
      "Writing Tools",
    ];

    for (const expectedTitle of expectedOrder) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toHaveAttribute("href", /.+/);
      const heading = focused.locator("h2");
      await expect(heading).toHaveText(expectedTitle);
    }
  });

  test("focused project cards have a visible focus indicator", async ({
    page,
  }) => {
    // Tab to the first link
    await page.keyboard.press("Tab");
    const focused = page.locator("a.project:focus");

    const outline = await focused.evaluate(
      (el) => getComputedStyle(el).outlineStyle
    );
    const outlineWidth = await focused.evaluate((el) =>
      parseFloat(getComputedStyle(el).outlineWidth)
    );

    // Browser default focus styles vary, but there should be some visible
    // outline. If outline is 'none' with 0 width, the card lacks a focus
    // indicator entirely.
    const hasFocusRing = outline !== "none" && outlineWidth > 0;

    // Also check for box-shadow as an alternative focus indicator
    const boxShadow = await focused.evaluate(
      (el) => getComputedStyle(el).boxShadow
    );
    const hasBoxShadow = boxShadow !== "none" && boxShadow !== "";

    expect(
      hasFocusRing || hasBoxShadow,
      "Focused card should have a visible focus indicator (outline or box-shadow)"
    ).toBeTruthy();
  });

  test("Enter key activates a focused project link", async ({ page }) => {
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    const href = await focused.getAttribute("href");

    // Pressing Enter on a focused <a> should trigger navigation
    const [response] = await Promise.all([
      page.waitForEvent("framenavigated").catch(() => null),
      page.keyboard.press("Enter"),
    ]);

    // The page should attempt to navigate away from the original URL
    const currentUrl = page.url();
    expect(currentUrl).not.toContain("index.html");
  });
});
