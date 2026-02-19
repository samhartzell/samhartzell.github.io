const { test, expect } = require("@playwright/test");

test.describe("Visual and responsive layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("index.html");
  });

  test("page renders without errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.waitForLoadState("domcontentloaded");
    expect(errors).toHaveLength(0);
  });

  test("heading is visible", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Sam Hartzell");
  });

  test("all project cards are visible", async ({ page }) => {
    const cards = page.locator(".project");
    await expect(cards).toHaveCount(4);

    for (const card of await cards.all()) {
      await expect(card).toBeVisible();
    }
  });

  test("project cards have correct titles", async ({ page }) => {
    const titles = await page.locator(".project h2").allTextContents();
    expect(titles).toEqual([
      "Science Olympiad",
      "WCPSS SSA Prep",
      "Court Monitor",
      "Writing Tools",
    ]);
  });

  test("project cards have descriptions", async ({ page }) => {
    const descriptions = page.locator(".project p");
    await expect(descriptions).toHaveCount(4);

    for (const desc of await descriptions.all()) {
      const text = await desc.textContent();
      expect(text.length).toBeGreaterThan(10);
    }
  });

  test("project cards link to correct URLs", async ({ page }) => {
    const links = await page.locator(".project").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    );

    expect(links).toEqual([
      "https://samhartzell.github.io/Science-Olympiad/",
      "https://samhartzell.github.io/wcpss-ssa-prep/wcpss-ssa-prep.html",
      "https://samhartzell.github.io/Court-Monitor/",
      "https://samhartzell.github.io/writing-tools/",
    ]);
  });

  test("container does not exceed max-width", async ({ page }) => {
    const containerWidth = await page
      .locator(".container")
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(containerWidth).toBeLessThanOrEqual(720 + 48); // max-width + padding
  });

  test("project cards do not overflow viewport", async ({ page }) => {
    const viewportWidth = page.viewportSize().width;
    const cards = await page.locator(".project").all();

    for (const card of cards) {
      const box = await card.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 1); // 1px tolerance
    }
  });

  test("hover effect changes card border", async ({ page }) => {
    const card = page.locator(".project").first();
    const borderBefore = await card.evaluate(
      (el) => getComputedStyle(el).borderColor
    );

    await card.hover();

    const borderAfter = await card.evaluate(
      (el) => getComputedStyle(el).borderColor
    );
    expect(borderAfter).not.toBe(borderBefore);
  });
});
