const { test, expect } = require("@playwright/test");

test.describe("Keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("index.html");
  });

  test("Tab key navigates through the skip link then all project links in DOM order", async ({
    page,
  }) => {
    const expectedOrder = await page
      .locator("a.project h3")
      .allTextContents();
    expect(expectedOrder.length).toBeGreaterThan(0);

    // First Tab focuses the skip link
    await page.keyboard.press("Tab");
    const skipLink = page.locator(":focus");
    await expect(skipLink).toHaveAttribute("href", "#main");

    // Subsequent Tabs focus each project card in order
    for (const expectedTitle of expectedOrder) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toHaveAttribute("href", /.+/);
      const heading = focused.locator("h3");
      await expect(heading).toHaveText(expectedTitle);
    }
  });

  test("focused project cards have a visible focus indicator", async ({
    page,
  }) => {
    // Tab past the skip link, then to the first project card
    await page.keyboard.press("Tab");
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
    // Tab past the skip link, then to the first project card
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    const href = await focused.getAttribute("href");
    expect(href).toBeTruthy();

    // Pressing Enter on a focused <a> should trigger navigation
    await Promise.all([
      page.waitForEvent("framenavigated").catch(() => null),
      page.keyboard.press("Enter"),
    ]);

    // The page should attempt to navigate away from the original URL
    const currentUrl = page.url();
    expect(currentUrl).not.toContain("index.html");
  });
});
