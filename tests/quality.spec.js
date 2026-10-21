import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/pages/home2.html",
  "/pages/simulator-sessions.html",
  "/pages/theory-test-prep.html",
  "/pages/schedule.html",
  "/pages/pricing.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/pages/login.html",
  "/pages/register.html",
  "/pages/student-dashboard.html",
  "/pages/mock-test.html?count=10",
];

test("major routes have no broken images or runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("#app")).not.toBeEmpty();
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.getAttribute("src")),
      );
    expect(broken, `${route} contains broken images`).toEqual([]);
  }
  expect(errors, "browser runtime errors").toEqual([]);
});

test("sticky navigation and focus targets remain usable", async ({ page }) => {
  await page.goto("/");
  expect(
    await page
      .locator(".site-header")
      .evaluate((node) => getComputedStyle(node).position),
  ).toBe("sticky");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.locator(".skip-link").press("Enter");
  await expect(page.locator("#main")).toBeVisible();
});
