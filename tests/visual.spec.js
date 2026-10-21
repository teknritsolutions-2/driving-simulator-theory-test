import { expect, test } from "@playwright/test";
import fs from "node:fs";

const pages = [
  ["home-1", "/"],
  ["home-2", "/pages/home2.html"],
  ["sessions", "/pages/simulator-sessions.html"],
  ["theory", "/pages/theory-test-prep.html"],
  ["schedule", "/pages/schedule.html"],
  ["pricing", "/pages/pricing.html"],
  ["about", "/pages/about.html"],
  ["contact", "/pages/contact.html"],
  ["login", "/pages/login.html"],
  ["register", "/pages/register.html"],
  ["dashboard", "/pages/student-dashboard.html"],
  ["mock-start", "/pages/mock-test.html?count=10"],
];

const viewports = [
  ["desktop-1440", 1440, 1000],
  ["tablet-1024", 1024, 900],
  ["tablet-768", 768, 1024],
  ["mobile-390", 390, 844],
  ["mobile-320", 320, 760],
];

test.beforeAll(() => fs.mkdirSync("tests/screenshots", { recursive: true }));

async function revealWholePage(page) {
  await page.evaluate(async () => {
    const step = Math.max(320, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    document.querySelectorAll(".reveal").forEach((element) => {
      element.style.transition = "none";
      element.classList.add("visible");
    });
    document.querySelectorAll(".gauge").forEach((element) => {
      element.style.setProperty("--progress", element.dataset.progress || "0");
    });
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(80);
}

for (const [viewportName, width, height] of viewports) {
  test(`capture key pages at ${viewportName}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const theme of ["light", "dark"]) {
      for (const [name, url] of pages) {
        await page.goto(url);
        await page.evaluate((selectedTheme) => {
          localStorage.setItem("dl-theme", selectedTheme);
          localStorage.setItem(
            "dl-profile",
            JSON.stringify({ name: "Visual QA", region: "General practice" }),
          );
        }, theme);
        await page.reload();
        await expect(page.locator("#app")).not.toBeEmpty();
        const scrollWidth = await page.evaluate(
          () => document.documentElement.scrollWidth,
        );
        expect(scrollWidth).toBeLessThanOrEqual(width);
        await revealWholePage(page);
        await page.screenshot({
          path: `tests/screenshots/${name}-${theme}-${viewportName}.png`,
          fullPage: true,
        });
      }
    }
  });
}

test("capture RTL in both themes", async ({ page }) => {
  for (const [name, width, height] of [
    ["desktop-1440", 1440, 1000],
    ["mobile-390", 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    for (const theme of ["light", "dark"]) {
      await page.goto("/pages/home2.html");
      await page.evaluate((selectedTheme) => {
        localStorage.setItem("dl-theme", selectedTheme);
        localStorage.setItem("dl-dir", "rtl");
      }, theme);
      await page.reload();
      await revealWholePage(page);
      await page.screenshot({
        path: `tests/screenshots/home-2-${theme}-rtl-${name}.png`,
        fullPage: true,
      });
    }
  }
});

test("capture active mock and result views", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const theme of ["light", "dark"]) {
    await page.goto("/pages/mock-test.html?count=10");
    await page.evaluate((selectedTheme) => {
      localStorage.clear();
      localStorage.setItem("dl-theme", selectedTheme);
    }, theme);
    await page.reload();
    await page.locator("#start-test").click();
    await revealWholePage(page);
    await page.screenshot({
      path: `tests/screenshots/mock-active-${theme}-desktop-1440.png`,
      fullPage: true,
    });
    await page.evaluate(() => {
      const question = {
        question: "Sample review question",
        choices: ["First", "Second", "Third", "Fourth"],
        answer: 0,
        correctIndex: 1,
        correct: false,
        explanation: "A clear explanation appears here.",
        topic: "Road Signs",
      };
      const attempt = {
        id: "visual-result",
        date: new Date().toISOString(),
        count: 10,
        score: 70,
        correct: 7,
        incorrect: 2,
        unanswered: 1,
        duration: 540,
        topics: {
          "Road Signs": { correct: 3, total: 5 },
          "Hazard Perception": { correct: 4, total: 5 },
        },
        review: Array.from({ length: 10 }, () => question),
      };
      localStorage.setItem("dl-attempts", JSON.stringify([attempt]));
    });
    await page.goto("/pages/test-results.html?id=visual-result");
    await revealWholePage(page);
    await page.screenshot({
      path: `tests/screenshots/results-${theme}-desktop-1440.png`,
      fullPage: true,
    });
  }
});
