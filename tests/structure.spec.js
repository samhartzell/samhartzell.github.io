const { test, expect } = require("@playwright/test");

test.describe("Document structure and semantics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("index.html");
  });

  test("page has exactly one h1 element", async ({ page }) => {
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("heading hierarchy has no skipped levels", async ({ page }) => {
    // Collect all headings in document order
    const headings = await page.evaluate(() => {
      const els = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      return Array.from(els).map((el) => parseInt(el.tagName[1]));
    });

    expect(headings.length).toBeGreaterThan(0);

    // First heading should be h1
    expect(headings[0]).toBe(1);

    // No heading should skip a level (e.g., h1 -> h3)
    for (let i = 1; i < headings.length; i++) {
      const jump = headings[i] - headings[i - 1];
      expect(
        jump,
        `Heading level jumped from h${headings[i - 1]} to h${headings[i]}`
      ).toBeLessThanOrEqual(1);
    }
  });

  test("page uses a <main> landmark element", async ({ page }) => {
    const mainCount = await page.locator("main").count();
    expect(mainCount).toBe(1);
  });

  test("project cards use semantic link elements", async ({ page }) => {
    // Each project should be a link wrapping a heading and description
    const cards = await page.locator("a.project").all();
    expect(cards.length).toBe(4);

    for (const card of cards) {
      // Each card should contain a heading
      const headingCount = await card.locator("h2").count();
      expect(headingCount).toBe(1);

      // Each card should contain a paragraph
      const pCount = await card.locator("p").count();
      expect(pCount).toBe(1);
    }
  });

  test("touch targets meet minimum size on mobile", async ({ page }) => {
    const cards = await page.locator("a.project").all();

    for (const card of cards) {
      const box = await card.boundingBox();
      // WCAG 2.2 Success Criterion 2.5.8: minimum 24x24px target size
      expect(
        box.height,
        "Card touch target should be at least 24px tall"
      ).toBeGreaterThanOrEqual(24);
      expect(
        box.width,
        "Card touch target should be at least 24px wide"
      ).toBeGreaterThanOrEqual(24);
    }
  });
});
