import { ROOT, addDays, isoDate, sessionById, sessions } from "./data.js";
import { gauge, icon } from "./components.js";

export function readiness(attempts) {
  if (attempts.length < 3) {
    return {
      value: null,
      display: "—",
      label: "Not Enough Data",
      detail:
        "Complete at least 3 practice tests to generate readiness evidence.",
    };
  }
  const recent = attempts.slice(-5);
  const average =
    recent.reduce((sum, attempt) => sum + attempt.score, 0) / recent.length;
  const topics = new Set(
    recent.flatMap((attempt) => Object.keys(attempt.topics || {})),
  ).size;
  const coverage = Math.min(100, (topics / 7) * 100);
  const value = Math.round(average * 0.7 + coverage * 0.3);
  const label =
    value < 55
      ? "Building Foundations"
      : value < 75
        ? "Developing Consistency"
        : "Strong Practice Performance";
  return {
    value,
    display: `${value}%`,
    label,
    detail: "70% recent score average + 30% topic coverage.",
  };
}

export function renderDashboard(store, escapeHtml) {
  const profile = store.get("profile", { name: "Student" });
  const bookings = store.get("bookings", []);
  const practice = store.get("practice", []);
  const attempts = store.get("attempts", []);
  const hours = practice.reduce((sum, entry) => sum + Number(entry.hours), 0);
  const average = attempts.length
    ? Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
          attempts.length,
      )
    : null;
  const ready = readiness(attempts);
  return `
    <main class="dashboard-app">
      <aside class="dashboard-sidebar">
        <div class="sidebar-header-row">
          <a class="dashboard-logo" href="${ROOT}pages/index.html"><img src="${ROOT}assets/brand/logo-white.svg" alt="DriveLab"></a>
          <div class="sidebar-mobile-controls">
            <button class="icon-button dashboard-menu-toggle" aria-controls="dashboard-navigation-panel" aria-expanded="false" aria-label="Open dashboard navigation"><span class="menu-icon">${icon("menu")}</span><span class="close-icon">${icon("close")}</span></button>
          </div>
        </div>
        <div class="dashboard-drawer" id="dashboard-navigation-panel">
          <nav aria-label="Dashboard navigation">
            ${[
              ["overview", "Overview", "dashboard"],
              ["sessions", "My Sessions", "calendar"],
              ["book", "Book Simulator", "steer"],
              ["tests", "Theory Practice", "quiz"],
              ["history", "Test History", "history"],
              ["progress", "My Progress", "trend"],
              ["settings", "Settings", "settings"],
            ]
              .map(
                ([view, label, iconName], index) =>
                  `<button class="dashboard-nav ${index === 0 ? "active" : ""}" data-view="${view}" title="${label}"><span class="nav-icon">${icon(iconName)}</span><span class="nav-label">${label}</span></button>`,
              )
              .join("")}
          </nav>
          <div class="sidebar-footer">
            <div class="sidebar-preferences">
              <button class="icon-button theme-toggle" aria-label="Switch color theme"><span class="sun-icon">${icon("sun")}</span><span class="moon-icon">${icon("moon")}</span></button>
              <button class="direction-toggle" aria-label="Switch text direction"><span class="direction-label">RTL</span></button>
            </div>
            <a class="dashboard-exit" href="${ROOT}pages/index.html">← Quit</a>
          </div>
        </div>
      </aside>
      <div class="dashboard-main">
        <header class="dashboard-header"><div><span class="overline">Student Dashboard</span><h1>Hello, ${escapeHtml(profile.name || "Student")}</h1><p>Your locally saved preparation activity at a glance.</p></div></header>

        <section class="dashboard-view active" data-view="overview">
          <div class="metric-row"><article><span>Completed simulator practice</span><strong>${hours.toFixed(1)}<small>h</small></strong><i>Self-reported entries</i></article><article><span>Upcoming requests</span><strong>${bookings.filter((item) => item.status === "Requested").length}</strong><i>Pending confirmation</i></article><article><span>Average theory score</span><strong>${average === null ? "—" : `${average}%`}</strong><i>${attempts.length ? `${attempts.length} saved attempt${attempts.length === 1 ? "" : "s"}` : "No attempts yet"}</i></article><article><span>Readiness signal</span><strong class="metric-label">${ready.label}</strong><i>Educational indicator</i></article></div>
          <div class="dashboard-grid"><article class="dashboard-panel chart-panel"><div class="panel-heading"><div><span class="overline">Theory performance</span><h2>Recent mock-test scores</h2></div>${attempts.length ? '<a class="button button-small" href="mock-test.html?count=10">Start practice</a>' : ""}</div>${scoreChart(attempts)}${attempts.length ? historyTable(attempts.slice(-4)) : emptyState("No completed tests yet", "A quick ten-question practice will create your first result and topic breakdown.", "Start Quick Practice", "mock-test.html?count=10")}</article><article class="dashboard-panel next-panel"><span class="overline">Suggested next move</span><h2>${attempts.length ? "Review your lowest-scoring topic." : "Create a theory baseline."}</h2><p>${attempts.length ? "Open the latest result to compare your answer with the correct reasoning." : "Complete a short practice set before interpreting readiness."}</p><a class="button button-small" href="${attempts.length ? `test-results.html?id=${attempts.at(-1).id}` : "mock-test.html?count=10"}">${attempts.length ? "Review Latest Result" : "Begin Practice"}</a><div class="separation-note"><b>Requested ≠ completed</b><span>Booking a simulator time never adds to completed practice hours.</span><button class="text-button dashboard-jump" data-view="progress">Record completed practice ${icon("arrow")}</button></div></article></div>
        </section>

        <section class="dashboard-view" data-view="sessions"><div class="view-heading"><div><span class="overline">Simulator schedule</span><h2>My session requests</h2></div><button class="button button-small dashboard-jump" data-view="book">New Request</button></div><div class="dashboard-panel">${bookings.length ? bookingTable(bookings) : emptyState("No session requests", "Choose a scenario and preferred time to create a local request.", "Request a Session", "#")}</div></section>
        <section class="dashboard-view" data-view="book"><div class="view-heading"><div><span class="overline">Simulator schedule</span><h2>Book Simulator</h2></div><p>Choose a preferred time · center confirmation required</p></div>${bookingForm()}</section>
        <section class="dashboard-view" data-view="tests"><div class="view-heading"><div><span class="overline">Theory assessment</span><h2>Choose a mock-test mode</h2></div><p>Timer is optional in every mode.</p></div><div class="dashboard-test-modes">${[
          ["Quick Practice", 10, "A short baseline across the question bank."],
          [
            "Standard Mock",
            20,
            "Broader coverage with a 30-minute timer option.",
          ],
          ["Full Practice", 30, "An extended practice set across more topics."],
        ]
          .map(
            ([title, count, text], index) =>
              `<article><span>0${index + 1}</span><h3>${title}</h3><strong>${count} questions</strong><p>${text}</p><a class="button button-small ${index ? "button-secondary" : ""}" href="mock-test.html?count=${count}">Start</a></article>`,
          )
          .join("")}</div></section>
        <section class="dashboard-view" data-view="history"><div class="view-heading"><div><span class="overline">Theory assessment</span><h2>Test history</h2></div></div><div class="dashboard-panel">${attempts.length ? historyTable(attempts) : emptyState("No result history", "Completed attempts will appear here with a review link.", "Start Practice", "mock-test.html?count=10")}</div></section>
        <section class="dashboard-view" data-view="progress"><div class="view-heading"><div><span class="overline">Training record</span><h2>My Progress</h2></div></div><div class="progress-layout"><article class="dashboard-panel readiness-panel">${gauge(ready.value, ready.label, ready.detail, { compact: true, display: ready.display })}<p>This is an educational signal, not an official exam decision or pass prediction.</p></article><article class="dashboard-panel"><span class="overline">Topic evidence</span><h2>Performance by topic</h2>${topicBreakdown(attempts)}</article></div><div class="progress-layout practice-entry-layout"><article class="dashboard-panel"><span class="overline">Completed simulator practice</span><h2>Record a self-reported entry</h2><form id="practice-form" class="form-grid"><div class="field"><label for="practice-date">Date</label><input id="practice-date" type="date" max="${isoDate(new Date())}" required></div><div class="field"><label for="practice-hours">Hours completed</label><input id="practice-hours" type="number" min="0.25" max="8" step="0.25" required></div><div class="field field-full"><label for="practice-scenario">Scenario</label><select id="practice-scenario">${sessions.map((session) => `<option>${session.title}</option>`).join("")}</select></div><div class="field field-full"><label for="practice-note">Practice note</label><textarea id="practice-note" rows="3"></textarea></div><button class="button button-small" type="submit">Add Practice Entry</button></form></article><article class="dashboard-panel"><div class="panel-heading"><div><span class="overline">Practice history</span><h2>Completed entries</h2></div><strong>${hours.toFixed(1)} hours total</strong></div>${practice.length ? practiceTable(practice) : "<p>No completed simulator practice recorded yet.</p>"}</article></div></section>
        <section class="dashboard-view" data-view="settings"><div class="view-heading"><div><span class="overline">Preferences</span><h2>Settings</h2></div></div><article class="dashboard-panel settings-panel"><form id="settings-form" class="form-grid"><div class="field"><label for="settings-name">Display name</label><input id="settings-name" value="${escapeHtml(profile.name || "")}"></div><div class="field"><label for="settings-region">Theory region</label><input id="settings-region" value="${escapeHtml(profile.region || "Not set")}"></div><div class="field field-full settings-actions"><button class="button button-small" type="submit">Save Locally</button><button class="button button-secondary button-small" type="button" id="export-data">Export JSON</button><button class="text-button danger" type="button" id="reset-data">Reset local data</button></div></form><p class="settings-disclosure">Your data is stored only in this browser and is not synchronized.</p></article></section>
      </div>
    </main>`;
}

export function bookingForm(selectedId = "urban", plan = "") {
  const selected = sessionById(selectedId);
  return `<article class="dashboard-panel booking-form-panel">${plan ? `<div class="package-note"><span>Package enquiry</span><b>${plan === "pack" ? "Four-Session Practice Path" : "Simulator + Theory"}</b><p>This request records a starting preference only. The center arranges the full sequence during follow-up.</p></div>` : ""}<form id="booking-form" class="form-grid" data-plan="${plan}"><div class="field"><label for="booking-session">Session type</label><select id="booking-session">${sessions.map((session) => `<option value="${session.id}" ${session.id === selected.id ? "selected" : ""}>${session.title}</option>`).join("")}</select></div><div class="field"><label for="booking-date">Preferred date</label><input id="booking-date" type="date" min="${isoDate(addDays(1))}" required></div><div class="field"><label for="booking-time">Preferred time</label><select id="booking-time">${["09:00", "11:30", "14:00", "16:30"].map((time) => `<option>${time}</option>`).join("")}</select></div><div class="field"><label for="booking-duration">Session duration</label><input id="booking-duration" value="${selected.duration} minutes" readonly></div><div class="field field-full"><label for="booking-note">Optional note</label><textarea id="booking-note" rows="4"></textarea></div><div class="booking-note field-full">Request saved locally · center confirmation pending · no live inventory is blocked.</div><button class="button button-small" type="submit">${plan ? "Save Package Enquiry" : "Save Local Request"}</button><p id="booking-status" aria-live="polite"></p></form></article>`;
}

function scoreChart(attempts) {
  const values = attempts.slice(-6);
  if (!values.length) return "";
  return `<div class="score-chart" aria-label="Recent theory scores">${values.map((attempt, index) => `<div><span style="--height:${attempt.score}%"></span><b>${attempt.score}%</b><small>${index + 1}</small></div>`).join("")}</div>`;
}

function topicBreakdown(attempts) {
  const totals = {};
  attempts.slice(-5).forEach((attempt) => {
    Object.entries(attempt.topics || {}).forEach(([topic, value]) => {
      totals[topic] ??= { correct: 0, total: 0 };
      totals[topic].correct += Number(value.correct || 0);
      totals[topic].total += Number(value.total || 0);
    });
  });
  const topics = Object.entries(totals)
    .map(([topic, value]) => ({
      topic,
      percentage: Math.round((value.correct / value.total) * 100),
      evidence: value.total,
    }))
    .sort((a, b) => a.percentage - b.percentage);
  if (!topics.length)
    return '<p class="topic-empty">Complete a theory practice set to reveal topic-level evidence.</p>';
  return `<div class="dashboard-topics">${topics
    .map(
      (item) =>
        `<div><span><b>${item.topic}</b><small>${item.percentage}% · ${item.evidence} question${item.evidence === 1 ? "" : "s"}</small></span><i><em style="width:${item.percentage}%"></em></i></div>`,
    )
    .join("")}</div>`;
}

function historyTable(attempts) {
  return `<div class="responsive-table"><table><thead><tr><th>Date</th><th>Mode</th><th>Score</th><th>Correct</th><th>Incorrect</th><th>Review</th></tr></thead><tbody>${attempts
    .slice()
    .reverse()
    .map(
      (attempt) =>
        `<tr><td data-label="Date">${new Date(attempt.date).toLocaleDateString()}</td><td data-label="Mode">${attempt.count} questions</td><td data-label="Score"><strong>${attempt.score}%</strong></td><td data-label="Correct">${attempt.correct}</td><td data-label="Incorrect">${attempt.incorrect}</td><td data-label="Review"><a href="test-results.html?id=${attempt.id}">View report</a></td></tr>`,
    )
    .join("")}</tbody></table></div>`;
}

function bookingTable(bookings) {
  return `<div class="responsive-table"><table><thead><tr><th>Session</th><th>Date</th><th>Time</th><th>Duration</th><th>Status</th><th>Action</th></tr></thead><tbody>${bookings.map((booking) => `<tr><td data-label="Session">${sessionById(booking.session).title}</td><td data-label="Date">${booking.date}</td><td data-label="Time">${booking.time}</td><td data-label="Duration">${booking.duration} min</td><td data-label="Status"><span class="request-status">${booking.status}</span></td><td data-label="Action">${booking.status === "Requested" ? `<button class="text-button cancel-booking" data-id="${booking.id}">Cancel request</button>` : "—"}</td></tr>`).join("")}</tbody></table></div>`;
}

function practiceTable(entries) {
  return `<div class="responsive-table"><table><thead><tr><th>Date</th><th>Scenario</th><th>Hours</th><th>Source</th><th>Action</th></tr></thead><tbody>${entries.map((entry) => `<tr><td data-label="Date">${entry.date}</td><td data-label="Scenario">${entry.scenario}</td><td data-label="Hours">${entry.hours}</td><td data-label="Source">Self-reported</td><td data-label="Action"><button class="text-button edit-practice" data-id="${entry.id}">Edit</button> <button class="text-button danger delete-practice" data-id="${entry.id}">Delete</button></td></tr>`).join("")}</tbody></table></div>`;
}

function emptyState(title, text, actionLabel, href) {
  const button =
    href === "#"
      ? `<button class="button button-small dashboard-jump" data-view="book">${actionLabel}</button>`
      : `<a class="button button-small" href="${href}">${actionLabel}</a>`;
  const plusIcon = `<svg class="empty-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  return `<div class="empty-state"><span class="empty-icon">${plusIcon}</span><h3>${title}</h3><p>${text}</p>${button}</div>`;
}
