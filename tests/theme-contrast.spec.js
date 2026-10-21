import { expect, test } from "@playwright/test";

const sampleAttempt = {
  id: "contrast-result",
  date: "2026-10-20T10:00:00.000Z",
  count: 10,
  score: 70,
  correct: 7,
  incorrect: 2,
  unanswered: 1,
  duration: 540,
  topics: { "Road Signs": { correct: 3, total: 5 } },
  review: [
    {
      question: "Sample review question",
      choices: ["First", "Second", "Third", "Fourth"],
      answer: 0,
      correctIndex: 1,
      correct: false,
      explanation: "A clear explanation appears here.",
      topic: "Road Signs",
    },
  ],
};

async function setState(page, theme) {
  await page.evaluate(
    ({ selectedTheme, attempt }) => {
      localStorage.setItem("dl-theme", selectedTheme);
      localStorage.setItem(
        "dl-profile",
        JSON.stringify({ name: "Contrast QA" }),
      );
      localStorage.setItem("dl-attempts", JSON.stringify([attempt]));
      localStorage.setItem(
        "dl-bookings",
        JSON.stringify([
          {
            id: "contrast-booking",
            session: "urban",
            date: "2026-11-05",
            time: "11:30",
            duration: 60,
            status: "Requested",
          },
        ]),
      );
    },
    { selectedTheme: theme, attempt: sampleAttempt },
  );
}

async function contrast(page, selector) {
  return page
    .locator(selector)
    .first()
    .evaluate((element) => {
      const rgba = (value) => {
        const parts = value.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 0];
        return [parts[0], parts[1], parts[2], parts[3] ?? 1];
      };
      const blend = (front, back) => {
        const a = front[3] + back[3] * (1 - front[3]);
        return [0, 1, 2]
          .map((index) =>
            a
              ? (front[index] * front[3] +
                  back[index] * back[3] * (1 - front[3])) /
                a
              : 0,
          )
          .concat(a);
      };
      let background = [0, 0, 0, 0];
      let node = element;
      while (node) {
        background = blend(
          rgba(getComputedStyle(node).backgroundColor),
          background,
        );
        if (background[3] >= 0.99) break;
        node = node.parentElement;
      }
      if (background[3] < 0.99)
        background = blend(background, [255, 255, 255, 1]);
      const foreground = rgba(getComputedStyle(element).color);
      const luminance = (color) => {
        const values = color.slice(0, 3).map((part) => {
          const channel = part / 255;
          return channel <= 0.03928
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
      };
      const a = luminance(foreground);
      const b = luminance(background);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
}

for (const theme of ["light", "dark"]) {
  test(`${theme} theme keeps named risk components readable`, async ({
    page,
  }) => {
    const checks = [
      ["/pages/home2.html", ".assessment-card > strong"],
      ["/pages/home2.html", ".editorial-close .button"],
      ["/pages/home2.html", ".showcase-main .gauge-value"],
      ["/pages/home2.html", ".question-preview-light h3"],
      ["/pages/home2.html", ".dashboard-showcase .showcase-top"],
      ["/pages/mock-test.html?count=10", ".test-start-features span"],
      ["/pages/test-results.html?id=contrast-result", ".result-ring strong"],
      ["/pages/test-results.html?id=contrast-result", ".result-counts b"],
      ["/pages/student-dashboard.html", ".dashboard-sidebar .dashboard-nav"],
    ];
    for (const [url, selector] of checks) {
      await page.goto(url);
      await setState(page, theme);
      await page.reload();
      await expect(page.locator(selector).first()).toBeVisible();
      expect(
        await contrast(page, selector),
        `${theme}: ${selector}`,
      ).toBeGreaterThanOrEqual(4.5);
    }

    await page.goto("/pages/home2.html");
    await setState(page, theme);
    await page.reload();
    const portalSurfaces = await page
      .locator(".portal-screen")
      .evaluate((element) => ({
        screen: getComputedStyle(element).backgroundColor,
        page: getComputedStyle(document.body).backgroundColor,
        border: getComputedStyle(element).borderTopColor,
      }));
    expect(portalSurfaces.screen, `${theme}: portal surface`).not.toBe(
      portalSurfaces.page,
    );
    expect(portalSurfaces.border, `${theme}: portal frame`).not.toBe(
      portalSurfaces.screen,
    );

    await page.goto("/pages/student-dashboard.html");
    await setState(page, theme);
    await page.reload();
    await page.locator('[data-view="sessions"]').first().click();
    expect(
      await contrast(page, ".request-status"),
      `${theme}: .request-status`,
    ).toBeGreaterThanOrEqual(4.5);

    await page.goto("/pages/mock-test.html?count=10");
    await setState(page, theme);
    await page.reload();
    await page.locator("#start-test").click();
    expect(
      await contrast(page, ".test-answer b"),
      `${theme}: .test-answer`,
    ).toBeGreaterThanOrEqual(4.5);
  });
}
