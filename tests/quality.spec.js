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

test("public navigation and customer-facing language match the final contract", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".desktop-nav > .nav-link")).toHaveText([
    "About",
    "Simulator Sessions",
    "Theory Test Prep",
    "Schedule",
    "Pricing",
    "Contact",
  ]);
  await page.locator(".home-menu-button").click();
  await expect(page.locator(".home-menu a")).toHaveText(["Home 1", "Home 2"]);
  await expect(page.locator(".portal-button")).toHaveText("Student Dashboard");
  await expect(page.locator(".site-footer")).toContainText("Home 1");
  await expect(page.locator(".site-footer")).toContainText("Home 2");

  const forbidden =
    /illustrative public preview|illustrative dashboard|illustrative recent average|configured request times|example price|empty sample profile/i;
  for (const route of routes.slice(0, 10)) {
    await page.goto(route);
    expect(await page.locator("body").innerText(), route).not.toMatch(
      forbidden,
    );
  }
});
