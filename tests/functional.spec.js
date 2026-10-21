import { expect, test } from "@playwright/test";

test.describe("public interactions", () => {
  test("theory preview loads a different question and scores the new answer", async ({
    page,
  }) => {
    await page.goto("/pages/theory-test-prep.html");
    const preview = page.locator("#theory-hero-question");
    const firstQuestion = await preview
      .locator("[data-question-text]")
      .textContent();
    await preview.locator(".question-option").first().click();
    await expect(preview.locator("[data-question-feedback]")).not.toContainText(
      "Choose an answer",
    );
    await preview.locator(".next-preview").click();
    await expect(preview.locator("[data-question-text]")).not.toHaveText(
      firstQuestion,
    );
    await expect(preview.locator("[data-question-feedback]")).toContainText(
      "Choose an answer",
    );
    await preview.locator(".question-option").nth(1).click();
    await expect(preview.locator("[data-question-feedback]")).not.toContainText(
      "Choose an answer",
    );
  });

  test("schedule month navigation, selection, summary and submission work", async ({
    page,
  }) => {
    await page.goto("/pages/schedule.html");
    const initialMonth = await page.locator("#calendar-month").textContent();
    await page.locator("#month-next").click();
    await expect(page.locator("#calendar-month")).not.toHaveText(initialMonth);
    await page.locator("#month-prev").click();
    await expect(page.locator("#calendar-month")).toHaveText(initialMonth);
    await expect(
      page.locator("#calendar-grid button:disabled").first(),
    ).toBeDisabled();
    await page.locator("#calendar-grid button:not(:disabled)").last().click();
    await page.locator("#time-slots button").first().click();
    await expect(page.locator("[data-summary-date]")).not.toContainText(
      "Choose",
    );
    await expect(page.locator("[data-summary-time]")).toHaveText("09:00");
    await page.locator("#save-schedule-request").click();
    await expect(page.locator("#schedule-status")).toContainText(
      "confirmation pending",
    );
  });

  test("pricing package carries into an honest package enquiry", async ({
    page,
  }) => {
    await page.goto("/pages/pricing.html");
    await page.locator('a[href="book-session.html?plan=pack"]').click();
    await expect(page).toHaveURL(/plan=pack/);
    await expect(page.locator(".package-note")).toContainText(
      "Four-Session Practice Path",
    );
    await expect(page.locator(".package-note")).toContainText(
      "starting preference",
    );
    const future = new Date(Date.now() + 4 * 86_400_000)
      .toISOString()
      .slice(0, 10);
    await page.locator("#booking-date").fill(future);
    await page.locator('#booking-form button[type="submit"]').click();
    await expect(page.locator("#booking-status")).toContainText(
      "Package enquiry saved locally",
    );
    const bookings = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("dl-bookings")),
    );
    expect(bookings).toHaveLength(1);
    expect(bookings[0].plan).toBe("pack");
  });

  test("desktop dropdown, theme and direction controls work", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(".home-menu-button").click();
    await expect(page.locator(".home-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".home-menu")).toBeHidden();
    await page.locator(".nav-actions .theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.locator(".nav-actions .direction-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("mobile drawer manages open, focus and escape close", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator(".menu-toggle").click();
    await expect(page.locator(".mobile-menu")).toBeVisible();
    await expect(page.locator("body")).toHaveClass(/menu-open/);
    await expect(page.locator(".mobile-menu a").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator(".mobile-menu")).toBeHidden();
    await expect(page.locator(".menu-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

test.describe("student dashboard and test engine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pages/login.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator("#display-name").fill("Test Student");
    await page.locator('#auth-form button[type="submit"]').click();
  });

  test("book, cancel and log completed practice without mixing hours", async ({
    page,
  }) => {
    await page.locator('[data-view="book"]').first().click();
    const future = new Date(Date.now() + 5 * 86_400_000)
      .toISOString()
      .slice(0, 10);
    await page.locator("#booking-date").fill(future);
    await page.locator('#booking-form button[type="submit"]').click();
    await expect(page.locator("#booking-status")).toContainText(
      "confirmation pending",
    );
    await page.reload();
    await expect(page.locator(".metric-row article").first()).toContainText(
      "0.0h",
    );
    await page.locator('[data-view="sessions"]').first().click();
    await expect(page.locator(".request-status")).toHaveText("Requested");
    await page.locator(".cancel-booking").click();
    await page.locator('[data-view="progress"]').first().click();
    await page
      .locator("#practice-date")
      .fill(new Date().toISOString().slice(0, 10));
    await page.locator("#practice-hours").fill("1.5");
    await page.locator('#practice-form button[type="submit"]').click();
    await expect(page.locator(".metric-row article").first()).toContainText(
      "1.5h",
    );
  });

  test("mock test produces reconciled result and answer review", async ({
    page,
  }) => {
    await page.goto("/pages/mock-test.html?count=10");
    await page.locator("#start-test").click();
    for (let index = 0; index < 10; index += 1) {
      await page.locator(".test-answer").first().click();
      if (index < 9) await page.locator("#next-question").click();
    }
    await page.locator("#submit-test").click();
    await expect(page).toHaveURL(/test-results\.html\?id=/);
    const values = await page.locator(".result-counts b").allTextContents();
    expect(values.map(Number).reduce((sum, value) => sum + value, 0)).toBe(10);
    await expect(page.locator(".review-row")).toHaveCount(10);
    const attempts = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("dl-attempts")),
    );
    expect(attempts).toHaveLength(1);
    expect(
      attempts[0].correct + attempts[0].incorrect + attempts[0].unanswered,
    ).toBe(10);
  });

  test("readiness updates after sufficient saved attempts", async ({
    page,
  }) => {
    await page.evaluate(() => {
      const topics = {
        "Road Signs": { correct: 4, total: 5 },
        "Hazard Perception": { correct: 4, total: 5 },
        "Traffic Awareness": { correct: 4, total: 5 },
        "Vehicle Basics": { correct: 4, total: 5 },
        "Parking Rules": { correct: 4, total: 5 },
        "Right of Way": { correct: 4, total: 5 },
        "Safe Driving Decisions": { correct: 4, total: 5 },
      };
      localStorage.setItem(
        "dl-attempts",
        JSON.stringify(
          [70, 78, 84].map((score, index) => ({
            id: `seed-${index}`,
            date: new Date().toISOString(),
            count: 20,
            score,
            correct: Math.round(score / 5),
            incorrect: 20 - Math.round(score / 5),
            unanswered: 0,
            duration: 600,
            topics,
            review: [],
          })),
        ),
      );
    });
    await page.reload();
    await expect(page.locator(".metric-row article").nth(3)).not.toContainText(
      "Not Enough Data",
    );
    await page.locator('[data-view="progress"]').first().click();
    await expect(page.locator(".readiness-panel")).toContainText(
      "70% recent score average",
    );
    await expect(page.locator(".dashboard-topics > div")).toHaveCount(7);
  });

  test("standard and full practice modes use the requested question count", async ({
    page,
  }) => {
    for (const count of [20, 30]) {
      await page.goto(`/pages/mock-test.html?count=${count}`);
      await expect(page.locator(".test-app")).toHaveAttribute(
        "data-test-count",
        String(count),
      );
      await page.locator("#start-test").click();
      await expect(page.locator(".question-navigator button")).toHaveCount(
        count,
      );
      await page.evaluate(() => localStorage.removeItem("dl-active-test"));
    }
  });

  test("settings export and reset preserve their honest local-only behavior", async ({
    page,
  }) => {
    await page.locator('[data-view="settings"]').first().click();
    const download = page.waitForEvent("download");
    await page.locator("#export-data").click();
    expect((await download).suggestedFilename()).toBe("drivelab-progress.json");
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#reset-data").click();
    await expect(page).toHaveURL(/login\.html/);
    expect(
      await page.evaluate(() => localStorage.getItem("dl-profile")),
    ).toBeNull();
  });
});
