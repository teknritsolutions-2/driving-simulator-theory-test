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

test("scenario studio keeps controlled equal desktop panels and a 4:3 mobile image", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const desktop = await page.locator(".scenario-stage").evaluate((stage) => {
    const image = stage
      .querySelector(".scenario-image")
      .getBoundingClientRect();
    const brief = stage
      .querySelector(".scenario-brief")
      .getBoundingClientRect();
    return {
      stage: stage.getBoundingClientRect().height,
      image: image.height,
      brief: brief.height,
    };
  });
  expect(desktop.stage).toBeGreaterThanOrEqual(520);
  expect(desktop.stage).toBeLessThanOrEqual(640);
  expect(Math.abs(desktop.image - desktop.brief)).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.locator(".scenario-image").evaluate((image) => {
    const rect = image.getBoundingClientRect();
    return rect.width / rect.height;
  });
  expect(mobile).toBeGreaterThan(1.3);
  expect(mobile).toBeLessThan(1.36);
});

test("readiness workflow renders five aligned evidence steps", async ({
  page,
}) => {
  await page.goto("/pages/home2.html");
  await expect(page.locator(".process-track > li")).toHaveCount(5);
  await expect(page.locator(".process-track")).toContainText(
    "Build an initial score baseline.",
  );
  await expect(page.locator(".process-track")).toContainText(
    "Choose the next useful focus.",
  );
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

test("pricing cards use one complete row each at tablet width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/pages/pricing.html");
  const cards = await page.locator(".pricing-plan").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }),
  );
  expect(cards).toHaveLength(3);
  expect(new Set(cards.map((card) => Math.round(card.x))).size).toBe(1);
  expect(new Set(cards.map((card) => Math.round(card.width))).size).toBe(1);
  expect(cards[1].y).toBeGreaterThan(cards[0].y + cards[0].height);
  expect(cards[2].y).toBeGreaterThan(cards[1].y + cards[1].height);
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

test("tablet dashboard drawer exposes visible text labels when opened", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/pages/student-dashboard.html");
  await page.locator(".dashboard-menu-toggle").click();
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
  const emptyIcons = await page.locator(".empty-state .empty-icon svg").count();
  expect(emptyIcons).toBeGreaterThan(0);
});

test("tablet and mobile dashboards move navigation and preferences into a hamburger drawer", async ({
  page,
}) => {
  for (const viewport of [
    { width: 768, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/pages/student-dashboard.html");
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width);

    const menuButton = page.locator(".dashboard-menu-toggle");
    const drawer = page.locator(".dashboard-drawer");
    await expect(menuButton).toBeVisible();
    await expect(drawer).toBeHidden();

    await menuButton.click();
    await expect(drawer).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(drawer.locator(".theme-toggle")).toBeVisible();
    await expect(drawer.locator(".direction-toggle")).toBeVisible();
    await expect(drawer.locator(".dashboard-exit")).toBeVisible();

    await drawer.locator('[data-view="tests"]').click();
    await expect(drawer).toBeHidden();
    await expect(
      page.locator('[data-view="tests"].dashboard-view'),
    ).toBeVisible();
  }
});

test("mock-test entry is centered on desktop and removes its visual below desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1680, height: 1268 });
  await page.goto("/pages/mock-test.html?count=30");

  const desktopCard = await page.locator(".test-start").boundingBox();
  expect(desktopCard).not.toBeNull();
  expect(Math.abs(desktopCard.x + desktopCard.width / 2 - 840)).toBeLessThan(2);
  expect(Math.abs(desktopCard.y + desktopCard.height / 2 - 634)).toBeLessThan(
    2,
  );
  await expect(page.locator(".test-start-visual")).toBeVisible();

  await page.setViewportSize({ width: 1024, height: 900 });
  const tabletCard = await page.locator(".test-start").boundingBox();
  expect(tabletCard).not.toBeNull();
  expect(Math.abs(tabletCard.x + tabletCard.width / 2 - 512)).toBeLessThan(2);
  expect(Math.abs(tabletCard.y + tabletCard.height / 2 - 450)).toBeLessThan(2);
  await expect(page.locator(".test-start-visual")).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".test-start-visual")).toBeHidden();
});

test("responsive header aligns its logo to the start and keeps navigation inside a viewport drawer", async ({
  page,
}) => {
  for (const viewport of [
    { width: 768, height: 900, headerHeight: 74 },
    { width: 390, height: 844, headerHeight: 68 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const logo = await page.locator(".nav-row > .brand").boundingBox();
    expect(logo).not.toBeNull();
    expect(logo.x).toBeLessThan(viewport.width / 4);
    expect(logo.x).toBeGreaterThan(0);

    const actions = await page.locator(".nav-actions").boundingBox();
    expect(actions).not.toBeNull();
    expect(actions.x).toBeGreaterThan(logo.x + logo.width);

    await page.locator(".menu-toggle").click();
    const drawer = page.locator(".mobile-menu");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveCSS("position", "fixed");
    await expect(page.locator(".menu-toggle .close-icon")).toBeVisible();
    await expect(page.locator(".menu-toggle .menu-icon")).toBeHidden();
    await expect(drawer.locator(".mobile-preferences")).toHaveText("RTL");
    await expect(
      drawer.locator('.preference-button[aria-label="Switch color theme"]'),
    ).toBeVisible();
    await expect(
      drawer.locator('.preference-button[aria-label="Switch text direction"]'),
    ).toBeVisible();
    expect(
      await drawer.evaluate((element) => element.closest(".site-header")),
    ).toBeNull();

    const drawerBox = await drawer.boundingBox();
    expect(drawerBox).not.toBeNull();
    expect(
      Math.abs(drawerBox.x + drawerBox.width - viewport.width),
    ).toBeLessThan(1);
    expect(Math.abs(drawerBox.y - viewport.headerHeight)).toBeLessThan(1);

    await page.mouse.click(4, viewport.headerHeight + 40);
    await expect(drawer).toBeHidden();
  }
});
