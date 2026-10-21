import { ROOT, plans, scenarios, sessions } from "./data.js";

const iconPaths = {
  sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  steer: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 14v7M4.9 9.5l6.1 1.7M19.1 9.5l-6.1 1.7"/>',
  quiz: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  history: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>',
  trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
};

export function icon(name, label = "") {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="${label ? "false" : "true"}">${label ? `<title>${label}</title>` : ""}${iconPaths[name]}</svg>`;
}

export function logo() {
  return `<img class="logo-light" src="${ROOT}assets/brand/logo.svg" alt="DriveLab"><img class="logo-dark" src="${ROOT}assets/brand/logo-white.svg" alt="DriveLab">`;
}

export function header(hasProfile) {
  const portal = hasProfile ? "student-dashboard.html" : "login.html";
  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container nav-row">
        <a class="brand" href="${ROOT}index.html" aria-label="DriveLab home">${logo()}</a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          <div class="nav-dropdown">
            <button class="nav-link home-menu-button" aria-expanded="false">Home ${icon("chevron")}</button>
            <div class="home-menu" hidden>
              <a href="${ROOT}index.html">Home 1</a>
              <a href="${ROOT}pages/home2.html">Home 2</a>
            </div>
          </div>
          <a class="nav-link" href="${ROOT}pages/about.html">About</a>
          <a class="nav-link" href="${ROOT}pages/simulator-sessions.html">Simulator Sessions</a>
          <a class="nav-link" href="${ROOT}pages/theory-test-prep.html">Theory Test Prep</a>
          <a class="nav-link" href="${ROOT}pages/schedule.html">Schedule</a>
          <a class="nav-link" href="${ROOT}pages/pricing.html">Pricing</a>
          <a class="nav-link" href="${ROOT}pages/contact.html">Contact</a>
        </nav>
        <div class="nav-actions">
          <button class="icon-button theme-toggle" aria-label="Switch color theme"><span class="sun-icon">${icon("sun")}</span><span class="moon-icon">${icon("moon")}</span></button>
          <button class="direction-toggle" aria-label="Switch text direction"><span class="direction-label">RTL</span></button>
          <a class="button button-small portal-button" href="${ROOT}pages/${portal}">Student Dashboard</a>
          <button class="icon-button menu-toggle" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open navigation"><span class="menu-icon">${icon("menu")}</span><span class="close-icon">${icon("close")}</span></button>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu" hidden>
        <nav aria-label="Mobile navigation">
          <a href="${ROOT}index.html">Home 1</a>
          <a href="${ROOT}pages/home2.html">Home 2</a>
          <a href="${ROOT}pages/about.html">About</a>
          <a href="${ROOT}pages/simulator-sessions.html">Simulator Sessions</a>
          <a href="${ROOT}pages/theory-test-prep.html">Theory Test Prep</a>
          <a href="${ROOT}pages/schedule.html">Schedule</a>
          <a href="${ROOT}pages/pricing.html">Pricing</a>
          <a href="${ROOT}pages/contact.html">Contact</a>
          <a href="${ROOT}pages/${portal}">Student Dashboard</a>
        </nav>
        <div class="mobile-preferences">
          <button class="preference-button theme-toggle">${icon("sun")} <span>Color theme</span></button>
          <button class="preference-button direction-toggle"><strong class="direction-label">RTL</strong><span>Text direction</span></button>
        </div>
      </div>
    </header>`;
}

export function footer(hasProfile = false) {
  const portal = hasProfile ? "student-dashboard.html" : "login.html";
  return `
    <footer class="site-footer">
      <div class="container footer-layout">
        <div class="footer-brand">
          <a class="brand" href="${ROOT}index.html"><img src="${ROOT}assets/brand/logo-white.svg" alt="DriveLab"></a>
          <p>Simulation, theory practice and clear progress tools for deliberate driver preparation.</p>
        </div>
        <div><h3>Train</h3><a href="${ROOT}pages/simulator-sessions.html">Simulator Sessions</a><a href="${ROOT}pages/theory-test-prep.html">Theory Test Prep</a><a href="${ROOT}pages/schedule.html">Schedule</a><a href="${ROOT}pages/pricing.html">Pricing</a></div>
        <div><h3>Explore</h3><a href="${ROOT}index.html">Home 1</a><a href="${ROOT}pages/home2.html">Home 2</a><a href="${ROOT}pages/about.html">About</a><a href="${ROOT}pages/contact.html">Contact</a></div>
        <div><h3>Support</h3><a href="${ROOT}pages/${portal}">Student Dashboard</a><a href="${ROOT}pages/faq.html">FAQ</a><a href="${ROOT}pages/privacy.html">Privacy</a><a href="${ROOT}pages/terms.html">Terms</a></div>
      </div>
      <div class="container footer-base"><span>© 2026 DriveLab</span><span>Driver Simulation & Theory Assessment Center</span></div>
    </footer>
    <button class="icon-button back-to-top" aria-label="Back to top">↑</button>`;
}

export function eyebrow(text) {
  return `<div class="eyebrow"><span></span>${text}</div>`;
}

export function questionPreview(id = "question-preview", className = "") {
  const question = window.DL_QUESTIONS[16];
  return `
    <article class="question-preview ${className}" id="${id}" data-preview-index="16">
      <div class="question-topline"><span>Practice question</span><span data-question-topic>${question.topic}</span></div>
      <div class="question-progress"><span></span><span></span><span></span><span></span></div>
      <h3 data-question-text>${question.question}</h3>
      <div class="question-options" role="radiogroup" aria-label="Answer choices">
        ${question.choices.map((choice, index) => `<button class="question-option" role="radio" aria-checked="false" data-choice="${index}"><span>${String.fromCharCode(65 + index)}</span><b>${choice}</b></button>`).join("")}
      </div>
      <div class="question-feedback" data-question-feedback aria-live="polite">Choose an answer to see the reasoning.</div>
      <div class="question-actions"><button class="text-button next-preview" type="button">Another question ${icon("arrow")}</button><a class="button button-small" href="${ROOT}pages/mock-test.html?count=10">Start Quick Practice</a></div>
    </article>`;
}

export function scenarioStudio() {
  const first = scenarios.city;
  return `
    <div class="scenario-studio reveal" id="scenario-studio">
      <div class="scenario-control" role="tablist" aria-label="Training scenario">
        ${Object.entries(scenarios)
          .map(
            ([key, scenario], index) =>
              `<button class="scenario-tab" role="tab" aria-selected="${index === 0}" data-scenario="${key}"><span>0${index + 1}</span>${scenario.label}</button>`,
          )
          .join("")}
      </div>
      <div class="scenario-stage">
        <div class="scenario-image"><img data-scenario-image src="${ROOT}assets/images/${first.image}" alt="City traffic training environment"><span class="scenario-status"><span class="status-dot"></span> Selected scenario</span></div>
        <div class="scenario-brief">
          <span class="kicker">Selected environment</span><h2 data-field="label">${first.label}</h2><p data-field="description">${first.description}</p>
          <div class="scenario-readout"><div><span>Training focus</span><strong data-field="focus">${first.focus}</strong></div><dl><div><dt>Duration</dt><dd data-field="duration">${first.duration}</dd></div><div><dt>Level</dt><dd data-field="difficulty">${first.difficulty}</dd></div></dl></div>
          <a class="button scenario-book" href="${ROOT}pages/book-session.html?session=${first.session}">Book this scenario ${icon("arrow")}</a>
        </div>
      </div>
    </div>`;
}

export function featuredSession(session) {
  return `
    <article class="featured-session-card">
      <div class="featured-session-media">
        <img src="${ROOT}assets/images/${session.image}" alt="${session.title} training environment">
        <span class="featured-badge">Featured practice</span>
      </div>
      <div class="featured-session-body">
        <div class="featured-session-meta">
          <span>${icon("clock")} ${session.duration} min</span>
          <span class="difficulty-pill">${session.difficulty}</span>
          <span class="pricing-pill">Pricing on enquiry</span>
        </div>
        <h2>${session.title}</h2>
        <p class="featured-session-focus"><strong>Training focus:</strong> ${session.focus}</p>
        <p class="featured-session-desc">${session.description} Rehearse observation routines, pedestrian scanning and measured gap decisions with structured post-run review.</p>
        <div class="featured-session-action">
          <a class="button" href="${ROOT}pages/book-session.html?session=${session.id}">Request this session ${icon("arrow")}</a>
        </div>
      </div>
    </article>`;
}

export function sessionCard(session, featured = false) {
  return `
    <article class="session-product ${featured ? "session-featured" : ""}" data-duration="${session.duration}">
      <a class="session-photo" href="${ROOT}pages/book-session.html?session=${session.id}" aria-label="Book ${session.title}"><img src="${ROOT}assets/images/${session.image}" alt="${session.title} training environment"><span>${session.difficulty}</span></a>
      <div class="session-body"><div class="session-specs"><span>${icon("clock")} ${session.duration} min</span><span>Pricing on enquiry</span></div><h3>${session.title}</h3><p>${session.description}</p><div class="session-focus">${session.focus}</div><a class="text-button" href="${ROOT}pages/book-session.html?session=${session.id}">Request session ${icon("arrow")}</a></div>
    </article>`;
}

export function compactPricing() {
  return `
    <div class="pricing-compact">
      ${Object.entries(plans)
        .map(
          ([key, plan], index) =>
            `<article class="price-path ${index === 1 ? "is-featured" : ""}"><span class="price-index">0${index + 1}</span><div><h3>${plan.title}</h3><p>${plan.note}</p></div><strong>Enquire</strong><a class="text-button" href="${ROOT}pages/book-session.html?plan=${key}">Choose ${icon("arrow")}</a></article>`,
        )
        .join("")}
    </div>`;
}

export function gauge(value, label, note, options = {}) {
  const display = options.display ?? `${value}%`;
  const numMatch = String(display).match(/(\d+(?:\.\d+)?)/);
  const targetNumber = numMatch ? parseFloat(numMatch[1]) : null;
  const decimals = numMatch && numMatch[1].includes(".") ? 1 : 0;
  const parts = numMatch ? String(display).split(numMatch[1]) : ["", ""];
  const prefix = parts[0] || "";
  const suffix = parts[1] || "";
  const progressPercent = typeof value === "number" && !isNaN(value) ? Math.max(0, Math.min(100, value)) : 0;
  const isAvailable = display !== "—" && progressPercent > 0;
  const primaryClass = options.primary ? "instrument-primary" : "";
  const compactClass = options.compact ? "instrument-compact" : "";

  return `<div class="instrument ${primaryClass} ${compactClass}"><div class="instrument-ring gauge" style="--progress: ${progressPercent};" data-progress="${progressPercent}" data-target-number="${targetNumber !== null ? targetNumber : ""}" data-decimals="${decimals}" data-prefix="${prefix}" data-suffix="${suffix}" role="img" aria-label="${label}: ${display}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="gauge-track" cx="50" cy="50" r="42" pathLength="100"></circle><circle class="gauge-active" cx="50" cy="50" r="42" pathLength="100" ${!isAvailable ? 'style="opacity: 0;"' : ""}></circle></svg><span class="gauge-value">${display}</span></div><div class="instrument-meta"><h3>${label}</h3><p>${note}</p></div></div>`;
}

export function photo(path, alt, className = "") {
  return `<figure class="photo-frame ${className}"><img src="${ROOT}assets/images/${path}" alt="${alt}"></figure>`;
}
