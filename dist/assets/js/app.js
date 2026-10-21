import {
  ROOT,
  addDays,
  isoDate,
  scenarios,
  sessionById,
  sessions,
  topicDetails,
} from "./data.js";
import { footer, header } from "./components.js";
import {
  bookingPage,
  contactPage,
  faqPage,
  homePage,
  homeTwoPage,
  legalPage,
  loginPage,
  pricingPage,
  schedulePage,
  sessionsPage,
  theoryPage,
  aboutPage,
} from "./public-pages.js";
import { bookingForm, renderDashboard } from "./dashboard.js";
import { bindMockTest, renderMockTest, renderResults } from "./mock-test.js";

const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(`dl-${key}`)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(`dl-${key}`, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(`dl-${key}`);
  },
};

const pageName =
  document.body.dataset.page ||
  location.pathname.split("/").pop().replace(".html", "") ||
  "index";
const plainPages = new Set([
  "login",
  "register",
  "student-dashboard",
  "mock-test",
  "test-results",
]);
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ],
  );

function renderPage() {
  const pages = {
    index: homePage,
    home2: homeTwoPage,
    about: aboutPage,
    "simulator-sessions": sessionsPage,
    "theory-test-prep": theoryPage,
    schedule: schedulePage,
    pricing: pricingPage,
    contact: contactPage,
    faq: faqPage,
    privacy: () => legalPage("Privacy"),
    terms: () => legalPage("Terms"),
    login: () => loginPage(false),
    register: () => loginPage(true),
    "student-dashboard": () => renderDashboard(store, escapeHtml),
    "book-session": bookingPage,
    "mock-test": renderMockTest,
    "test-results": () => renderResults(store),
  };
  const content = (pages[pageName] || notFoundPage)();
  const hasProfile = Boolean(store.get("profile", null));
  document.querySelector("#app").innerHTML =
    `${plainPages.has(pageName) ? "" : header(hasProfile)}${content}${plainPages.has(pageName) ? "" : footer(hasProfile)}`;
  bindInteractions();
}

function notFoundPage() {
  return `<main id="main"><section class="simple-header"><div class="container"><span class="overline">404</span><h1>That route is outside the training map.</h1><p>Return to the simulator lab or explore the session catalog.</p><div class="button-row"><a class="button" href="${ROOT}index.html">Go Home</a><a class="button button-secondary" href="${ROOT}pages/simulator-sessions.html">View Sessions</a></div></div></section></main>`;
}

function bindInteractions() {
  bindThemeAndDirection();
  bindNavigation();
  bindReveals();
  bindScenarioStudio();
  bindQuestionPreviews();
  bindCatalog();
  bindTopicExplorer();
  bindSchedule();
  bindAuth();
  bindBookingForms();
  bindDashboard();
  bindMockTest(store);
  bindContact();
}

function bindThemeAndDirection() {
  document.querySelectorAll(".theme-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      const theme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("dl-theme", theme);
    }),
  );
  const updateDirectionLabels = () =>
    document.querySelectorAll(".direction-label").forEach((label) => {
      label.textContent =
        document.documentElement.dir === "rtl" ? "LTR" : "RTL";
    });
  updateDirectionLabels();
  document.querySelectorAll(".direction-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      const direction = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
      document.documentElement.dir = direction;
      localStorage.setItem("dl-dir", direction);
      updateDirectionLabels();
    }),
  );
}

function bindNavigation() {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  let previousFocus;
  const closeMobileMenu = (restoreFocus = true) => {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    if (restoreFocus && previousFocus) previousFocus.focus();
  };
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const opening = mobileMenu.hidden;
      if (!opening) return closeMobileMenu();
      previousFocus = document.activeElement;
      mobileMenu.hidden = false;
      document.body.classList.add("menu-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation");
      mobileMenu.querySelector("a")?.focus();
    });
    mobileMenu.addEventListener("click", (event) => {
      if (event.target === mobileMenu) closeMobileMenu();
    });
    document.addEventListener("pointerdown", (event) => {
      if (
        !mobileMenu.hidden &&
        !mobileMenu.contains(event.target) &&
        !menuButton.contains(event.target)
      )
        closeMobileMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
      if (event.key === "Tab" && !mobileMenu.hidden) {
        const focusable = [...mobileMenu.querySelectorAll("a, button")];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
  const homeButton = document.querySelector(".home-menu-button");
  const homeMenu = document.querySelector(".home-menu");
  if (homeButton && homeMenu) {
    const close = () => {
      homeMenu.hidden = true;
      homeButton.setAttribute("aria-expanded", "false");
    };
    homeButton.addEventListener("click", () => {
      const opening = homeMenu.hidden;
      homeMenu.hidden = !opening;
      homeButton.setAttribute("aria-expanded", String(opening));
    });
    document.addEventListener("pointerdown", (event) => {
      if (!homeButton.closest(".nav-dropdown").contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        homeButton.focus();
      }
    });
  }
  const current = location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll(".desktop-nav a, .mobile-menu a")
    .forEach((link) => {
      if (link.getAttribute("href")?.endsWith(current))
        link.setAttribute("aria-current", "page");
    });
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => backToTop.classList.toggle("visible", window.scrollY > 650),
      { passive: true },
    );
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
}

function bindReveals() {
  if (
    !("IntersectionObserver" in window) ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document
      .querySelectorAll(".reveal")
      .forEach((element) => element.classList.add("visible"));
    document
      .querySelectorAll(".gauge")
      .forEach((element) => {
        const prog = Number(element.dataset.progress || 0);
        element.style.setProperty("--progress", prog);
        const active = element.querySelector(".gauge-active");
        if (active) active.style.opacity = prog > 0 ? "1" : "0";
      });
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("gauge"))
          animateGauge(entry.target);
        observer.unobserve(entry.target);
      }),
    { threshold: 0.15 },
  );
  document
    .querySelectorAll(".reveal, .gauge")
    .forEach((element) => observer.observe(element));
}

function animateGauge(element) {
  const targetProgress = Number(element.dataset.progress || 0);
  element.style.setProperty("--progress", targetProgress);
  const activeCircle = element.querySelector(".gauge-active");
  if (activeCircle) {
    activeCircle.style.opacity = targetProgress > 0 ? "1" : "0";
  }
  const valueEl = element.querySelector(".gauge-value");
  if (!valueEl) return;
  const targetNumAttr = element.dataset.targetNumber;
  if (!targetNumAttr || targetNumAttr === "") return;
  const targetNum = Number(targetNumAttr);
  const decimals = element.dataset.decimals === "1";
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  const started = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - started) / 750);
    const ease = 1 - Math.pow(1 - p, 3);
    const current = targetNum * ease;
    valueEl.textContent = `${prefix}${decimals ? current.toFixed(1) : Math.round(current)}${suffix}`;
    element.style.setProperty("--progress", (targetProgress * ease).toFixed(1));
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      valueEl.textContent = `${prefix}${decimals ? targetNum.toFixed(1) : Math.round(targetNum)}${suffix}`;
      element.style.setProperty("--progress", targetProgress);
    }
  };
  requestAnimationFrame(step);
}

function bindScenarioStudio() {
  const studio = document.querySelector("#scenario-studio");
  if (!studio) return;
  studio.querySelectorAll(".scenario-tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      const scenario = scenarios[tab.dataset.scenario];
      studio
        .querySelectorAll(".scenario-tab")
        .forEach((item) => item.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      const image = studio.querySelector("[data-scenario-image]");
      image.classList.add("switching");
      window.setTimeout(() => {
        image.src = `${ROOT}assets/images/${scenario.image}`;
        image.alt = `${scenario.label} training environment`;
        image.classList.remove("switching");
      }, 160);
      ["focus", "duration", "difficulty", "label", "description"].forEach(
        (field) => {
          studio.querySelector(`[data-field="${field}"]`).textContent =
            scenario[field];
        },
      );
      studio.querySelector(".scenario-book").href =
        `${ROOT}pages/book-session.html?session=${scenario.session}`;
    }),
  );
  const stage = studio.querySelector(".scenario-stage");
  if (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    matchMedia("(pointer:fine)").matches
  ) {
    stage.addEventListener("pointermove", (event) => {
      const box = stage.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      stage.style.transform = `perspective(1200px) rotateY(${x * 1.8}deg) rotateX(${-y * 1.8}deg)`;
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.transform = "";
    });
  }
}

function bindQuestionPreviews() {
  const previewPool = [0, 8, 16, 20, 32, 40, 48, 58];
  document.querySelectorAll(".question-preview").forEach((preview) => {
    const render = (index) => {
      const question = window.DL_QUESTIONS[index];
      preview.dataset.previewIndex = String(index);
      preview.querySelector("[data-question-topic]").textContent =
        question.topic;
      preview.querySelector("[data-question-text]").textContent =
        question.question;
      preview.querySelector(".question-options").innerHTML = question.choices
        .map(
          (choice, choiceIndex) =>
            `<button class="question-option" role="radio" aria-checked="false" data-choice="${choiceIndex}"><span>${String.fromCharCode(65 + choiceIndex)}</span><b>${choice}</b></button>`,
        )
        .join("");
      preview.querySelector("[data-question-feedback]").textContent =
        "Choose an answer to see the reasoning.";
      preview
        .querySelectorAll(".question-option")
        .forEach((option) =>
          option.addEventListener("click", () => answer(option, question)),
        );
    };
    const answer = (option, question) => {
      if (
        preview.querySelector(
          ".question-option.correct, .question-option.incorrect",
        )
      )
        return;
      const selected = Number(option.dataset.choice);
      preview.querySelectorAll(".question-option").forEach((item) => {
        item.disabled = true;
        item.setAttribute("aria-checked", String(item === option));
      });
      option.classList.add(
        selected === question.correct ? "correct" : "incorrect",
      );
      if (selected !== question.correct)
        preview
          .querySelector(`[data-choice="${question.correct}"]`)
          .classList.add("correct");
      preview.querySelector("[data-question-feedback]").innerHTML =
        `<strong>${selected === question.correct ? "Correct." : "Review this one."}</strong> ${question.explanation}`;
    };
    preview
      .querySelectorAll(".question-option")
      .forEach((option) =>
        option.addEventListener("click", () =>
          answer(
            option,
            window.DL_QUESTIONS[Number(preview.dataset.previewIndex)],
          ),
        ),
      );
    preview.querySelector(".next-preview").addEventListener("click", () => {
      const current = Number(preview.dataset.previewIndex);
      const currentPosition = previewPool.indexOf(current);
      const nextIndex =
        previewPool[
          (currentPosition + 1 + previewPool.length) % previewPool.length
        ];
      render(
        nextIndex === current
          ? previewPool[(currentPosition + 2) % previewPool.length]
          : nextIndex,
      );
    });
  });
}

function bindCatalog() {
  const buttons = document.querySelectorAll("[data-catalog-filter]");
  if (!buttons.length) return;
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const value = button.dataset.catalogFilter;
      let visible = 0;
      document
        .querySelectorAll("#session-catalog .session-product")
        .forEach((card) => {
          card.hidden = value !== "all" && card.dataset.duration !== value;
          if (!card.hidden) visible += 1;
        });
      document.querySelector(".catalog-empty").hidden = visible !== 0;
    }),
  );
}

function bindTopicExplorer() {
  const buttons = document.querySelectorAll(".topic-button");
  if (!buttons.length) return;
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const topic = button.dataset.topic;
      const [image, description] = topicDetails[topic];
      buttons.forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-selected", String(item === button));
      });
      document.querySelector("[data-topic-image]").src =
        `${ROOT}assets/images/${image}`;
      document.querySelector("[data-topic-image]").alt = topic;
      document.querySelector("[data-topic-title]").textContent = topic;
      document.querySelector("[data-topic-description]").textContent =
        description;
      document.querySelector("[data-topic-question]").textContent =
        window.DL_QUESTIONS.find((item) => item.topic === topic).question;
    }),
  );
}

function bindSchedule() {
  const grid = document.querySelector("#calendar-grid");
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  let viewDate = new Date();
  viewDate.setDate(1);
  viewDate.setHours(12, 0, 0, 0);
  let selectedDate = params.get("date") || "";
  let selectedTime = "";
  let selectedSession = "urban";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const slots = ["09:00", "11:30", "14:00", "16:30"];

  function renderCalendar() {
    document.querySelector("#calendar-month").textContent =
      viewDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    const firstDay = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1,
      12,
    );
    const lastDay = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0,
      12,
    );
    const cells = [];
    for (let index = 0; index < firstDay.getDay(); index += 1)
      cells.push('<span class="calendar-blank"></span>');
    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const date = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        day,
        12,
      );
      const value = isoDate(date);
      const past = date < today;
      const isToday = value === isoDate(new Date());
      const active = value === selectedDate;
      cells.push(
        `<button role="gridcell" data-date="${value}" ${past ? "disabled" : ""} class="${isToday ? "is-today" : ""} ${active ? "selected" : ""}"><span>${day}</span>${past ? "<small>Past</small>" : `<small>${2 + (day % 3)} slots</small>`}</button>`,
      );
    }
    grid.innerHTML = cells.join("");
    grid.querySelectorAll("button:not(:disabled)").forEach((button) =>
      button.addEventListener("click", () => {
        selectedDate = button.dataset.date;
        selectedTime = "";
        renderCalendar();
        renderSlots();
        updateScheduleSummary();
      }),
    );
  }

  function renderSlots() {
    const target = document.querySelector("#time-slots");
    target.innerHTML = selectedDate
      ? slots
          .map(
            (time) =>
              `<button role="radio" aria-checked="${time === selectedTime}" class="${time === selectedTime ? "selected" : ""}" data-time="${time}"><span>${time}</span><small>Request</small></button>`,
          )
          .join("")
      : "<p>Choose a future date to view request times.</p>";
    target.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", () => {
        selectedTime = button.dataset.time;
        renderSlots();
        updateScheduleSummary();
      }),
    );
  }

  function updateScheduleSummary() {
    const session = sessionById(selectedSession);
    document.querySelector("[data-summary-session]").textContent =
      session.title;
    document.querySelector("[data-summary-date]").textContent = selectedDate
      ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      : "Choose a future date";
    document.querySelector("[data-summary-time]").textContent =
      selectedTime || "Choose a request time";
    document.querySelector("[data-summary-duration]").textContent =
      `${session.duration} minutes`;
    document.querySelector("[data-summary-image]").src =
      `${ROOT}assets/images/${session.image}`;
    document.querySelector("#save-schedule-request").disabled = !(
      selectedDate && selectedTime
    );
    document
      .querySelectorAll(".schedule-stepper span")
      .forEach((step, index) =>
        step.classList.toggle(
          "active",
          index === 0 ||
            (index === 1 && selectedSession) ||
            (index === 2 && selectedDate) ||
            (index === 3 && selectedTime),
        ),
      );
  }

  document.querySelectorAll(".session-pill").forEach((button) =>
    button.addEventListener("click", () => {
      selectedSession = button.dataset.session;
      document
        .querySelectorAll(".session-pill")
        .forEach((item) => item.classList.toggle("active", item === button));
      updateScheduleSummary();
    }),
  );
  document.querySelector("#month-prev").addEventListener("click", () => {
    const previous = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() - 1,
      1,
      12,
    );
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    if (previous >= currentMonth) {
      viewDate = previous;
      renderCalendar();
    }
  });
  document.querySelector("#month-next").addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1, 12);
    renderCalendar();
  });
  document.querySelector("#calendar-today").addEventListener("click", () => {
    viewDate = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    selectedDate = isoDate(new Date());
    selectedTime = "";
    renderCalendar();
    renderSlots();
    updateScheduleSummary();
  });
  document.querySelector(".reset-schedule").addEventListener("click", () => {
    selectedDate = "";
    selectedTime = "";
    viewDate = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    renderCalendar();
    renderSlots();
    updateScheduleSummary();
    document.querySelector("#schedule-status").textContent = "";
  });
  document
    .querySelector("#save-schedule-request")
    .addEventListener("click", () =>
      saveBooking(
        {
          session: selectedSession,
          date: selectedDate,
          time: selectedTime,
          duration: sessionById(selectedSession).duration,
          note: document.querySelector("#schedule-note").value,
        },
        document.querySelector("#schedule-status"),
      ),
    );
  renderCalendar();
  renderSlots();
  updateScheduleSummary();
}

function bindAuth() {
  const form = document.querySelector("#auth-form");
  if (form)
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      store.set("profile", {
        name: document.querySelector("#display-name").value.trim(),
        region: document.querySelector("#region")?.value || "Not set",
        sample: false,
      });
      location.href = "student-dashboard.html";
    });
  const sample = document.querySelector("#sample-profile");
  if (sample)
    sample.addEventListener("click", () => {
      store.set("profile", {
        name: "Sample Student",
        region: "General practice",
        sample: true,
      });
      location.href = "student-dashboard.html";
    });
}

function bindBookingForms() {
  const holder = document.querySelector("#standalone-booking-form");
  if (holder)
    holder.innerHTML = bookingForm(
      holder.dataset.selectedSession,
      holder.dataset.plan,
    );
  const form = document.querySelector("#booking-form");
  if (!form) return;
  const sessionSelect = document.querySelector("#booking-session");
  sessionSelect.addEventListener("change", () => {
    document.querySelector("#booking-duration").value =
      `${sessionById(sessionSelect.value).duration} minutes`;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const session = sessionById(sessionSelect.value);
    saveBooking(
      {
        session: session.id,
        date: document.querySelector("#booking-date").value,
        time: document.querySelector("#booking-time").value,
        duration: session.duration,
        note: document.querySelector("#booking-note").value,
        plan: form.dataset.plan || null,
      },
      document.querySelector("#booking-status"),
    );
  });
}

function saveBooking(data, statusElement) {
  if (!data.date || new Date(`${data.date}T23:59`) < new Date()) {
    statusElement.textContent = "Please select a future date.";
    return;
  }
  const bookings = store.get("bookings", []);
  const start = new Date(`${data.date}T${data.time}:00`).getTime();
  const end = start + data.duration * 60_000;
  const conflict = bookings.some(
    (booking) =>
      booking.status === "Requested" &&
      booking.date === data.date &&
      start <
        new Date(`${booking.date}T${booking.time}:00`).getTime() +
          booking.duration * 60_000 &&
      end > new Date(`${booking.date}T${booking.time}:00`).getTime(),
  );
  if (conflict) {
    statusElement.textContent =
      "This overlaps one of your existing local requests.";
    return;
  }
  bookings.push({
    ...data,
    id: crypto.randomUUID(),
    status: "Requested",
    created: new Date().toISOString(),
  });
  store.set("bookings", bookings);
  statusElement.textContent = data.plan
    ? "Package enquiry saved locally. The center still needs to arrange each session."
    : "Request saved locally—center confirmation pending.";
}

function bindDashboard() {
  const navigation = document.querySelectorAll(
    ".dashboard-nav, .dashboard-jump",
  );
  navigation.forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".dashboard-nav")
        .forEach((item) =>
          item.classList.toggle(
            "active",
            item.dataset.view === button.dataset.view,
          ),
        );
      document
        .querySelectorAll(".dashboard-view")
        .forEach((view) =>
          view.classList.toggle(
            "active",
            view.dataset.view === button.dataset.view,
          ),
        );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }),
  );
  document.querySelectorAll(".cancel-booking").forEach((button) =>
    button.addEventListener("click", () => {
      const bookings = store.get("bookings", []);
      const booking = bookings.find((item) => item.id === button.dataset.id);
      if (booking) booking.status = "Cancelled";
      store.set("bookings", bookings);
      renderPage();
    }),
  );
  const practiceForm = document.querySelector("#practice-form");
  if (practiceForm)
    practiceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const entries = store.get("practice", []);
      entries.push({
        id: crypto.randomUUID(),
        date: document.querySelector("#practice-date").value,
        hours: Number(document.querySelector("#practice-hours").value),
        scenario: document.querySelector("#practice-scenario").value,
        note: document.querySelector("#practice-note").value,
      });
      store.set("practice", entries);
      renderPage();
    });
  document.querySelectorAll(".edit-practice").forEach((button) =>
    button.addEventListener("click", () => {
      const entries = store.get("practice", []);
      const entry = entries.find((item) => item.id === button.dataset.id);
      const hours = Number(
        window.prompt("Completed hours (0.25–8)", entry.hours),
      );
      if (hours >= 0.25 && hours <= 8) {
        entry.hours = hours;
        store.set("practice", entries);
        renderPage();
      }
    }),
  );
  document.querySelectorAll(".delete-practice").forEach((button) =>
    button.addEventListener("click", () => {
      if (window.confirm("Delete this self-reported entry?")) {
        store.set(
          "practice",
          store
            .get("practice", [])
            .filter((item) => item.id !== button.dataset.id),
        );
        renderPage();
      }
    }),
  );
  const settingsForm = document.querySelector("#settings-form");
  if (settingsForm)
    settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      store.set("profile", {
        ...store.get("profile", {}),
        name: document.querySelector("#settings-name").value,
        region: document.querySelector("#settings-region").value,
      });
      renderPage();
    });
  const exportButton = document.querySelector("#export-data");
  if (exportButton)
    exportButton.addEventListener("click", () => {
      const data = {
        profile: store.get("profile", {}),
        bookings: store.get("bookings", []),
        practice: store.get("practice", []),
        attempts: store.get("attempts", []),
      };
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "drivelab-progress.json";
      link.click();
      URL.revokeObjectURL(url);
    });
  const resetButton = document.querySelector("#reset-data");
  if (resetButton)
    resetButton.addEventListener("click", () => {
      if (window.confirm("Reset all DriveLab local data in this browser?")) {
        ["profile", "bookings", "practice", "attempts", "active-test"].forEach(
          (key) => store.remove(key),
        );
        location.href = "login.html";
      }
    });
}

function bindContact() {
  const form = document.querySelector("#contact-form");
  if (form)
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      document.querySelector("#contact-status").textContent =
        "Your enquiry is ready. Connect the center’s enquiry service to send it.";
    });
}

renderPage();
