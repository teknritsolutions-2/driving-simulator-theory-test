import { expect, test } from "@playwright/test";

const widths = [320, 360, 390, 430, 640, 768, 820, 1024, 1280, 1440, 1920];
const routes = [
  "/",
  "/pages/home2.html",
  "/pages/simulator-sessions.html",
  "/pages/theory-test-prep.html",
  "/pages/schedule.html",
  "/pages/pricing.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/pages/student-dashboard.html",
];

for (const width of widths) {
  test(`key layouts fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("#app")).not.toBeEmpty();
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(
        scrollWidth,
        `${route} overflowed at ${width}px: scrollWidth ${scrollWidth} > ${width}`,
      ).toBeLessThanOrEqual(width);
    }
  });
}

test("home 1 session cards have uniform image heights at 768px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const heights = await page
    .locator(".home-session-rail .session-photo img")
    .evaluateAll((imgs) =>
      imgs.map((img) => Math.round(img.getBoundingClientRect().height)),
    );
  expect(heights.length).toBe(4);
  const [firstHeight] = heights;
  for (const h of heights) {
    expect(
      Math.abs(h - firstHeight),
      `Image height mismatch in home-session-rail: ${heights}`,
    ).toBeLessThanOrEqual(2);
  }
});

test("home 2 gallery has balanced image heights at 768px and 390px", async ({
  page,
}) => {
  for (const width of [768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/pages/home2.html");
    const heights = await page
      .locator(".skill-mosaic .skill-tile img")
      .evaluateAll((imgs) =>
        imgs.map((img) => Math.round(img.getBoundingClientRect().height)),
      );
    expect(heights.length).toBe(4);
    const maxH = Math.max(...heights);
    const minH = Math.min(...heights);
    expect(
      maxH - minH,
      `Gallery image height imbalance at ${width}px: ${heights}`,
    ).toBeLessThanOrEqual(4);
    // Hazard Awareness must not be a massive 1000px+ portrait panel
    expect(maxH).toBeLessThan(450);
  }
});

test("theory prep topic image has wide landscape aspect ratio on tablet", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/pages/theory-test-prep.html");
  const dimensions = await page
    .locator("[data-topic-image]")
    .evaluate((img) => {
      const rect = img.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
  // Image must be wider than it is tall (not a 224x589 narrow vertical strip!)
  expect(dimensions.width).toBeGreaterThan(dimensions.height);
  const ratio = dimensions.width / dimensions.height;
  expect(ratio).toBeGreaterThanOrEqual(1.5);
});

test("tablet dashboard navigation exposes visible text labels", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/pages/student-dashboard.html");
  const labels = await page
    .locator(".dashboard-nav .nav-label")
    .evaluateAll((elements) =>
      elements.map((el) => {
        const style = window.getComputedStyle(el);
        return {
          text: el.textContent.trim(),
          visible: style.display !== "none" && style.visibility !== "hidden",
        };
      }),
    );
  expect(labels.length).toBeGreaterThanOrEqual(6);
  for (const item of labels) {
    expect(item.visible).toBe(true);
    expect(item.text.length).toBeGreaterThan(0);
  }
});

test("buttons and cards remain strictly within 320px viewport boundaries", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  for (const route of [
    "/pages/theory-test-prep.html",
    "/pages/pricing.html",
    "/pages/schedule.html",
  ]) {
    await page.goto(route);
    const buttons = await page.locator(".button").evaluateAll((btns) =>
      btns.map((btn) => {
        const rect = btn.getBoundingClientRect();
        return {
          right: Math.round(rect.right),
          text: btn.textContent.trim().slice(0, 20),
        };
      }),
    );
    for (const btn of buttons) {
      expect(
        btn.right,
        `Button ${btn.text} on ${route} extends past 320px`,
      ).toBeLessThanOrEqual(320);
    }
  }
});

test("empty states render SVG icons without missing glyph boxes", async ({
  page,
}) => {
  await page.goto("/pages/student-dashboard.html");
  const emptyIcons = await page
    .locator(".empty-state .empty-icon svg")
    .count();
  expect(emptyIcons).toBeGreaterThan(0);
});
