import { expect, test } from "@playwright/test";

const widths = [320, 360, 390, 430, 640, 768, 820, 1024, 1280, 1440, 1920];
const routes = [
  "/",
  "/pages/home2.html",
  "/pages/schedule.html",
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
        `${route} overflowed at ${width}px`,
      ).toBeLessThanOrEqual(width);
    }
  });
}
