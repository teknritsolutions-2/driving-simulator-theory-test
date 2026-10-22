import {
  ROOT,
  addDays,
  plans,
  scenarios,
  sessions,
  topicDetails,
} from "./data.js";
import {
  compactPricing,
  eyebrow,
  featuredSession,
  gauge,
  icon,
  logo,
  photo,
  questionPreview,
  scenarioStudio,
  sessionCard,
} from "./components.js";

const action = (href, label, secondary = false) =>
  `<a class="button ${secondary ? "button-secondary" : ""}" href="${href}">${label}${icon("arrow")}</a>`;

function hasStoredProfile() {
  try {
    return Boolean(JSON.parse(localStorage.getItem("dl-profile") || "null"));
  } catch {
    return false;
  }
}

function portalLink() {
  return `${ROOT}pages/${hasStoredProfile() ? "student-dashboard.html" : "login.html"}`;
}

function publicProgress() {
  try {
    const practice = JSON.parse(localStorage.getItem("dl-practice") || "[]");
    const attempts = JSON.parse(localStorage.getItem("dl-attempts") || "[]");
    if (!practice.length && !attempts.length) return null;
    const hours = practice.reduce(
      (sum, entry) => sum + Number(entry.hours || 0),
      0,
    );
    const average = attempts.length
      ? Math.round(
          attempts.reduce(
            (sum, attempt) => sum + Number(attempt.score || 0),
            0,
          ) / attempts.length,
        )
      : 0;
    const topics = new Set(
      attempts
        .slice(-5)
        .flatMap((attempt) => Object.keys(attempt.topics || {})),
    ).size;
    const readiness =
      attempts.length >= 3
        ? Math.round(average * 0.7 + Math.min(100, (topics / 7) * 100) * 0.3)
        : 0;
    return { hours, average, readiness, attempts: attempts.length };
  } catch {
    return null;
  }
}

export function homePage() {
  const progress = publicProgress();
  const progressInstruments = progress
    ? `${gauge(progress.readiness, "Readiness signal", progress.attempts >= 3 ? "Based on recent saved activity" : "Available after 3 attempts", { primary: true, display: progress.attempts >= 3 ? `${progress.readiness}%` : "—" })}${gauge(Math.min(100, Math.round((progress.hours / 10) * 100)), "Practice-hours target", `${progress.hours.toFixed(1)} of 10 hours recorded`, { display: `${progress.hours.toFixed(1)}h`, compact: true })}${gauge(progress.average, "Theory average", progress.attempts ? `Across ${progress.attempts} saved attempt${progress.attempts === 1 ? "" : "s"}` : "No saved attempts yet", { compact: true })}`
    : `${gauge(74, "Readiness signal", "Composite of theory consistency and topic coverage", { primary: true })}${gauge(68, "Practice-hours target", "6.8 of 10 example hours", { display: "6.8h", compact: true })}${gauge(82, "Theory average", "Example saved-attempt average across 6 topics", { compact: true })}`;
  return `
    <main id="main">
      <section class="home-hero">
        <img class="home-hero-image" src="${ROOT}assets/images/hero-sim.jpg" alt="Driving simulator steering wheel and illuminated instrument display">
        <div class="home-hero-overlay"></div>
        <div class="container home-hero-layout">
          <div class="home-hero-copy reveal">
            ${eyebrow("Driver readiness lab")}
            <h1>Train the decisions <em>before the real road.</em></h1>
            <p>Practice demanding situations in a controlled simulator, strengthen theory judgment and turn every review into a clearer next step.</p>
            <div class="button-row">${action(`${ROOT}pages/simulator-sessions.html`, "Explore Simulator Sessions")}${action(`${ROOT}pages/theory-test-prep.html`, "Try Theory Practice", true)}</div>
            <dl class="hero-spec-line"><div><dt>Method</dt><dd>Controlled repetition</dd></div><div><dt>Review</dt><dd>After every run</dd></div><div><dt>Purpose</dt><dd>Safer decisions</dd></div></dl>
          </div>
        </div>
      </section>

      <section class="section section-major"><div class="container"><div class="section-heading split-heading"><div>${eyebrow("Interactive scenario studio")}<h2>Choose the environment. Focus the practice.</h2></div><p>Explore four training contexts, then carry the selected session directly into a booking request.</p></div>${scenarioStudio()}</div></section>

      <section class="section section-major simulator-benefits">
        <div class="container benefit-editorial">
          <div class="benefit-media reveal"><img src="${ROOT}assets/images/driver-view.jpg" alt="Driver view of a road and vehicle controls"><div class="media-caption"><span>Controlled repetition</span><strong>Practice → feedback → repeat</strong></div></div>
          <div class="benefit-copy reveal">${eyebrow("Why simulator practice")}<h2>Repeat the moment, not the mistake.</h2><p class="lede">Simulation creates space to slow down the learning process, revisit decisions and build a dependable routine before applying it on the road.</p><div class="skill-list"><div><span>01</span><h3>Controlled scenarios</h3><p>Return to the same junction, hazard or maneuver with a clear purpose.</p></div><div><span>02</span><h3>Earlier recognition</h3><p>Strengthen the scan that reveals developing hazards sooner.</p></div><div><span>03</span><h3>Measured feedback</h3><p>Review what happened and choose one practical adjustment.</p></div><div><span>04</span><h3>Calm familiarity</h3><p>Reduce novelty through deliberate, repeated exposure.</p></div></div><p class="fine-print">Simulator practice supports preparation; it does not replace required supervised road experience.</p></div>
        </div>
      </section>

      <section class="section section-major session-discovery"><div class="container"><div class="section-heading split-heading"><div>${eyebrow("Session discovery")}<h2>Practice formats built around a specific skill.</h2></div><a class="text-button" href="${ROOT}pages/simulator-sessions.html">Compare every session ${icon("arrow")}</a></div><div class="home-session-rail">${sessions
        .slice(0, 4)
        .map((item) => sessionCard(item, false))
        .join("")}</div></div></section>

      <section class="section section-major theory-editorial"><div class="container theory-split"><div class="theory-photo reveal"><img src="${ROOT}assets/images/study-desk.jpg" alt="Student preparing with a laptop and study materials"><div class="photo-note"><b>Original practice content</b><span>Explanation after every answer</span></div></div><div class="theory-content reveal">${eyebrow("Theory challenge")}<h2>Practice the reasoning—not only the answer.</h2><p>Try a question, review the explanation and switch to another without leaving the page.</p>${questionPreview("home-question")}</div></div></section>

      <section class="section section-major progress-section"><div class="container"><div class="progress-intro">${eyebrow("Progress measurement")}<h2>See practice become a pattern.</h2><p>${progress ? "These instruments use activity saved in this browser." : "A clear combination of completed hours, theory scores and topic coverage."}</p></div><div class="instrument-cluster reveal">${progressInstruments}</div>${progress ? "" : '<p class="component-caption muted-caption">Example progress display. Your Student Dashboard begins with no recorded activity.</p>'}</div></section>

      <section class="section section-major route-section"><div class="container"><div class="section-heading split-heading"><div>${eyebrow("Training route")}<h2>A deliberate loop from discovery to review.</h2></div><p>Each stage adds evidence for the next decision.</p></div><div class="route-map">${[
        "Discover|Choose a skill to focus.",
        "Book|Request a suitable practice time.",
        "Practice|Complete and record the session.",
        "Test|Check theory under pressure.",
        "Review|Target the next weak area.",
      ]
        .map((step, index) => {
          const [title, text] = step.split("|");
          return `<article><span>0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`;
        })
        .join("")}</div></div></section>

      <section class="section section-compact"><div class="container schedule-teaser"><div>${eyebrow("Plan your practice")}<h2>Choose a day while the week is still in view.</h2><p>Times shown are request options and remain pending until the center confirms them.</p>${action(`${ROOT}pages/schedule.html`, "Open Full Schedule")}</div><div class="week-strip">${Array.from(
        { length: 6 },
        (_, index) => addDays(index + 1),
      )
        .map(
          (date, index) =>
            `<a href="${ROOT}pages/schedule.html?date=${date.toISOString().slice(0, 10)}"><span>${date.toLocaleDateString(undefined, { weekday: "short" })}</span><strong>${date.getDate()}</strong><small>${index % 2 ? "3" : "4"} slots</small></a>`,
        )
        .join("")}</div></div></section>

      <section class="section section-major portal-close"><div class="container portal-close-layout"><div><span class="overline">Student Dashboard</span><h2>One place for session requests, practice history and answer review.</h2><p>Start with an empty record, then build a view from activity saved in this browser.</p><div class="button-row">${action(portalLink(), "Open Student Dashboard")}${action(`${ROOT}pages/pricing.html`, "Compare Training Options", true)}</div></div><div class="portal-mini"><div><span>Organize</span><b>Session requests</b></div><div><span>Review</span><b>Theory test history</b></div><div class="mini-progress"><span style="width:72%"></span></div></div></div></section>
    </main>`;
}

export function homeTwoPage() {
  return `
    <main id="main" class="readiness-home">
      <section class="readiness-hero">
        <div class="container readiness-hero-grid">
          <div class="readiness-copy reveal">${eyebrow("Assessment & readiness studio")}<h1>Know what to revise <em>before test day.</em></h1><p>Build topic coverage, review every wrong answer and use recent results to choose your next practice move.</p><div class="button-row">${action("mock-test.html?count=10", "Start Mock Test")}${action("#readiness-showcase", "Explore Readiness", true)}</div><div class="hero-proof"><span>Original practice questions</span><span>Clear answer review</span><span>Local progress history</span></div></div>
          <div class="assessment-visual reveal"><img src="${ROOT}assets/images/exam-desk.jpg" alt="Laptop and exam materials in a learning environment"><div class="assessment-panel"><div class="assessment-card"><span>Practice set · 07 / 10</span><strong>Which response creates the safest margin?</strong><div><i class="is-complete"></i><i class="is-complete"></i><i class="is-active"></i><i></i></div></div><div class="assessment-score"><b>82%</b><span>Example score analysis</span></div></div></div>
        </div>
      </section>

      <section class="section section-compact path-selector-section"><div class="container"><div class="path-selector" role="tablist" aria-label="Preparation path">${[
        [
          "theory",
          "Theory Practice",
          "Questions, explanations and topic review",
          "theory-test-prep.html",
        ],
        [
          "simulator",
          "Simulator Training",
          "Scenarios, controls and observation",
          "simulator-sessions.html",
        ],
        [
          "combined",
          "Combined Preparation",
          "Connect practical and theory progress",
          "pricing.html",
        ],
      ]
        .map(
          (item, index) =>
            `<a class="path-choice ${index === 0 ? "active" : ""}" href="${item[3]}" data-path="${item[0]}"><span>0${index + 1}</span><div><h3>${item[1]}</h3><p>${item[2]}</p></div>${icon("arrow")}</a>`,
        )
        .join("")}</div></div></section>

      <section class="section section-major challenge-section"><div class="container challenge-grid"><div>${eyebrow("Interactive theory challenge")}<h2>One question can reveal the next topic to study.</h2><p class="lede">Choose an answer, read the reasoning and move to a genuinely different question.</p><div class="question-photo-stack"><img src="${ROOT}assets/images/warning-sign.jpg" alt="Road signs used to support theory learning"><img src="${ROOT}assets/images/revision-notes.jpg" alt="Student taking notes beside a laptop"></div></div>${questionPreview("home-two-question", "question-preview-light")}</div></section>

      <section class="section section-major readiness-process"><div class="container"><div class="section-heading split-heading"><div>${eyebrow("How readiness develops")}<h2>Confidence follows evidence—not the other way around.</h2></div><p>Move through a repeatable loop that grows both score consistency and topic coverage.</p></div><ol class="process-track">${[
        ["Practice", "Build an initial score baseline."],
        ["Review", "Understand every missed answer."],
        ["Cover topics", "Close the gaps in your coverage."],
        ["Repeat", "Check whether the change holds."],
        ["Analyse", "Choose the next useful focus."],
      ]
        .map(
          ([title, description], index) =>
            `<li><span>${index + 1}</span><div><b>${title}</b><p>${description}</p></div></li>`,
        )
        .join("")}</ol></div></section>

      <section class="section section-major showcase-section" id="readiness-showcase"><div class="container showcase-grid"><div class="showcase-copy">${eyebrow("Track your preparation")}<h2>A progress view designed for the next decision.</h2><p>Recent scores, topic coverage and revision priorities appear together. A new Student Dashboard begins empty and uses only saved learner activity.</p><div class="revision-list"><div><span>Priority</span><b>Road Signs</b><i>Revise</i></div><div><span>Steady</span><b>Hazard Perception</b><i>Maintain</i></div><div><span>Strong</span><b>Traffic Awareness</b><i>Extend</i></div></div></div><div><div class="dashboard-showcase reveal"><div class="showcase-top"><span>Readiness signal</span><b>Developing consistency</b></div><div class="showcase-main">${gauge(74, "Practice readiness", "Example educational indicator", { compact: true })}<div class="score-bars" aria-label="Example score trend">${[58, 68, 64, 76, 82].map((value, index) => `<span style="--h:${value}%"><i>${index + 1}</i></span>`).join("")}</div></div><div class="showcase-bottom"><span>Recent average <b>76%</b></span><span>Topics covered <b>6 / 7</b></span></div></div><p class="component-caption">Example progress display</p></div></div></section>

      <section class="section section-major skills-gallery"><div class="container"><div class="section-heading split-heading"><div>${eyebrow("Explore simulator skills")}<h2>Turn theory knowledge into observable decisions.</h2></div><a class="text-button" href="simulator-sessions.html">See all sessions ${icon("arrow")}</a></div><div class="skill-mosaic">${Object.values(
        scenarios,
      )
        .map(
          (item, index) =>
            `<a href="book-session.html?session=${item.session}" class="skill-tile tile-${index + 1}"><img src="${ROOT}assets/images/${item.image}" alt="${item.label} environment"><div><span>${item.duration}</span><h3>${item.label}</h3><p>${item.focus}</p></div></a>`,
        )
        .join("")}</div></div></section>

      <section class="section section-compact formats-band"><div class="container"><div class="formats-copy"><span>Training formats</span><h2>Start focused. Combine when it helps.</h2></div>${compactPricing()}</div></section>

      <section class="section section-major portal-feature"><div class="container portal-feature-grid"><div class="portal-screen reveal" aria-label="Example Student Dashboard preview"><div class="portal-screen-nav"><span class="portal-nav-dots"><i></i><i></i><i></i></span><span class="portal-nav-title">DriveLab · Student Overview</span><span class="portal-nav-tag">Example Preview</span></div><div class="portal-screen-body"><div class="screen-metrics-grid"><div class="screen-metric-card"><small>Practice Hours</small><b>6.8h</b><span>Recorded</span></div><div class="screen-metric-card"><small>Requests</small><b>1 slot</b><span>Pending</span></div><div class="screen-metric-card"><small>Theory Avg</small><b>82%</b><span>6 topics</span></div><div class="screen-metric-card highlight"><small>Readiness</small><b>74%</b><span>Developing</span></div></div><div class="screen-visuals-grid"><div class="screen-chart-card"><div class="screen-card-header"><b>Score trend</b><small>Recent mock attempts</small></div><div class="screen-bar-chart" aria-label="Mock scores: 68%, 72%, 78%, 80%, 84%">${[68, 72, 78, 80, 84].map((v, i) => `<div class="bar-col"><span style="--h:${v}%"></span><small>T${i + 1}</small></div>`).join("")}</div></div><div class="screen-topic-card"><div class="screen-card-header"><b>Priority focus</b><small>Coverage 6/7</small></div><div class="screen-focus-item"><span>Next revision target</span><strong>Road Signs · 65%</strong><p>12 questions reviewed · 4 to master</p></div><div class="screen-focus-action"><span>Suggested action</span><b>Take 10-question drill</b></div></div></div></div></div><div>${eyebrow("Student Dashboard")}<h2>Keep the whole preparation story in view.</h2><p class="lede">Manage requests, record completed simulator practice, revisit test reports and see when the readiness indicator has enough evidence to become meaningful.</p><ul class="tick-list"><li>Requested sessions stay separate from completed hours</li><li>Every test preserves a full answer review</li><li>Progress is stored in this browser</li></ul>${action(portalLink(), "Explore Student Dashboard")}</div></div></section>

      <section class="section section-compact editorial-close"><div class="container"><span>Ready for a baseline?</span><h2>Begin with ten questions. Leave with a clearer revision plan.</h2>${action("mock-test.html?count=10", "Start Quick Practice")}</div></section>
    </main>`;
}

export function sessionsPage() {
  return `
    <main id="main">
      <section class="catalog-header"><div class="container catalog-header-grid"><div>${eyebrow("Simulator sessions")}<h1>Choose the skill you want to rehearse.</h1><p>Compare session focus, duration and level before sending a local request.</p><div class="catalog-quick-filters" role="group" aria-label="Quick duration filter"><button class="active" data-catalog-filter="all">All sessions</button><button data-catalog-filter="45">45 min</button><button data-catalog-filter="60">60 min</button><button data-catalog-filter="75">75 min</button></div></div><div class="catalog-header-media"><img src="${ROOT}assets/images/instrument-panel.jpg" alt="Illuminated vehicle instrument panel"><span>Precision practice · structured review</span></div></div></section>
      <section class="section section-compact"><div class="container">${featuredSession(sessions[1])}</div></section>
      <section class="section section-major catalog-section"><div class="container"><div class="section-heading"><span class="overline">Complete catalog</span><h2>Six ways to focus a simulator session.</h2></div><div class="session-catalog" id="session-catalog">${sessions.map((item) => sessionCard(item)).join("")}</div><p class="catalog-empty" hidden>No sessions match this duration.</p></div></section>
      <section class="section section-major compare-section">
        <div class="container">
          <div class="section-heading split-heading compare-heading">
            <div>
              ${eyebrow("Compare at a glance")}
              <h2>Match the session to the learning task.</h2>
            </div>
            <p>Compare durations, difficulty levels and target skills to find the right practice session.</p>
          </div>
          <div class="comparison-table" role="table">
            <div class="table-header" role="row">
              <span role="columnheader">Session</span>
              <span role="columnheader">Duration</span>
              <span role="columnheader">Level</span>
              <span role="columnheader">Focus</span>
              <span role="columnheader">Action</span>
            </div>
            ${sessions.map((item) => `<div role="row" class="comparison-row"><b role="cell" class="cell-title" data-label="Session">${item.title}</b><span role="cell" class="cell-duration" data-label="Duration">${item.duration} min</span><span role="cell" class="cell-level" data-label="Level">${item.difficulty}</span><span role="cell" class="cell-focus" data-label="Focus">${item.focus}</span><a role="cell" class="cell-action button button-small" href="book-session.html?session=${item.id}" data-label="Action">Choose</a></div>`).join("")}
          </div>
        </div>
      </section>
      <section class="section section-major session-anatomy"><div class="container anatomy-grid"><div class="anatomy-photo"><img src="${ROOT}assets/images/sim-anatomy.jpg" alt="Simulator steering wheel and instrument display"></div><div>${eyebrow("What happens in a session")}<h2>A focused sequence from orientation to review.</h2><ol class="number-list"><li><span>01</span><div><b>Set the focus</b><p>Choose the skill and become familiar with the controls.</p></div></li><li><span>02</span><div><b>Run the scenario</b><p>Practice the observation and decision sequence.</p></div></li><li><span>03</span><div><b>Review the attempt</b><p>Identify one clear adjustment before repeating.</p></div></li></ol><p class="fine-print">Equipment and session format are confirmed during booking.</p></div></div></section>
      ${faqStrip([
        [
          "Can simulator time replace required road training?",
          "No. It is a preparation tool and should not be presented as a legal substitute for required road experience.",
        ],
        [
          "Are requests immediately confirmed?",
          "No. A request remains pending until the center confirms it.",
        ],
        [
          "Can I mix scenarios?",
          "Choose the closest starting session; the center can discuss an appropriate sequence during follow-up.",
        ],
      ])}
    </main>`;
}

export function theoryPage() {
  const firstTopic = Object.entries(topicDetails)[0];
  return `
    <main id="main">
      <section class="theory-hero"><div class="container theory-hero-grid"><div>${eyebrow("Theory test preparation")}<h1>Build a stronger answer—and understand why.</h1><p>Original practice questions, instant scoring and topic-level review help turn mistakes into a focused revision plan.</p><div class="button-row">${action("mock-test.html?count=10", "Start Quick Practice")}${action("#topic-explorer", "Explore Topics", true)}</div><p class="fine-print">Practice content is educational and not an official examination.</p></div>${questionPreview("theory-hero-question", "")}</div></section>
      <section class="section section-major practice-modes"><div class="container"><div class="section-heading split-heading"><div>${eyebrow("Choose a practice mode")}<h2>Start short or build broader coverage.</h2></div><p>All modes preserve answers while you navigate and create an instant result report.</p></div><div class="mode-layout">${[
        ["Quick Practice", 10, "Short baseline", "Untimed option"],
        ["Standard Mock", 20, "Wider topic mix", "Optional 30 min timer"],
        ["Full Practice", 30, "Extended coverage", "Optional 45 min timer"],
      ]
        .map(
          (item, index) =>
            `<article class="practice-mode mode-${index + 1}"><span>${String(item[1]).padStart(2, "0")}</span><div><h3>${item[0]}</h3><p>${item[2]} · ${item[3]}</p></div><a class="button button-small ${index ? "button-secondary" : ""}" href="mock-test.html?count=${item[1]}">Start</a></article>`,
        )
        .join("")}</div></div></section>
      <section class="section section-major topic-section" id="topic-explorer"><div class="container topic-layout"><div class="topic-controls" role="tablist" aria-label="Theory topics">${Object.keys(
        topicDetails,
      )
        .map(
          (topic, index) =>
            `<button class="topic-button ${index === 0 ? "active" : ""}" role="tab" aria-selected="${index === 0}" data-topic="${topic}"><span>0${index + 1}</span>${topic}</button>`,
        )
        .join(
          "",
        )}</div><div class="topic-display"><img data-topic-image src="${ROOT}assets/images/${firstTopic[1][0]}" alt="${firstTopic[0]}"><div><span class="overline">Topic focus</span><h2 data-topic-title>${firstTopic[0]}</h2><p data-topic-description>${firstTopic[1][1]}</p><div class="topic-question" data-topic-question>${window.DL_QUESTIONS.find((item) => item.topic === firstTopic[0]).question}</div><a class="text-button" href="mock-test.html?count=10">Practice this topic mix ${icon("arrow")}</a></div></div></div></section>
      <section class="section section-major review-story"><div class="container review-story-grid"><div>${eyebrow("After submission")}<h2>A result should tell you what to do next.</h2><p class="lede">Every report separates correct, incorrect and unanswered items, then keeps the original choice beside the correct answer and explanation.</p><div class="result-equation"><span><b>14</b> Correct</span><i>+</i><span><b>4</b> Incorrect</span><i>+</i><span><b>2</b> Unanswered</span><i>=</i><strong>70%</strong></div></div><div class="answer-review-mock"><span class="review-status">Needs review</span><h3>What should you anticipate near a stopped bus?</h3><p><b>Your answer</b> Only the bus moving</p><p class="correct-line"><b>Correct answer</b> Passengers crossing near the bus</p><small>The vehicle can conceal pedestrians moving into the road.</small></div></div></section>
      <section class="section section-major theory-progress"><div class="container showcase-grid"><div><div class="dashboard-showcase">${gauge(72, "Practice readiness", "Example educational indicator", { compact: true })}<div class="showcase-bottom"><span>Coverage <b>5 / 7 topics</b></span><span>Next focus <b>Road Signs</b></span></div></div><p class="component-caption">Example progress display</p></div><div>${eyebrow("Progress monitoring")}<h2>Look for consistency across attempts.</h2><p class="lede">The readiness indicator waits for sufficient practice, then combines recent score average with topic coverage. It never claims an official pass prediction.</p>${action(portalLink(), "View Student Dashboard")}</div></div></section>
      ${faqStrip([
        [
          "Are these official exam questions?",
          "No. They are original educational practice items.",
        ],
        [
          "Can I take an untimed test?",
          "Yes. Timers are optional in every practice mode.",
        ],
        [
          "How is the score calculated?",
          "Correct answers are divided by total questions; unanswered items remain visible as their own count.",
        ],
      ])}
    </main>`;
}

export function schedulePage() {
  return `
    <main id="main" class="schedule-page">
      <section class="schedule-header"><div class="container"><div>${eyebrow("Plan your practice")}<h1>Choose a session, date and preferred time.</h1><p>Build a request in four clear steps. The center confirms availability after it is submitted.</p></div><div class="schedule-stepper"><span class="active"><b>1</b><i>Session</i></span><span><b>2</b><i>Date</i></span><span><b>3</b><i>Time</i></span><span><b>4</b><i>Review</i></span></div></div></section>
      <section class="section section-compact"><div class="container schedule-shell">
        <div class="schedule-main">
          <div class="schedule-session-picker"><h2>1. Choose a Session</h2><div class="session-pills">${sessions.map((session, index) => `<button class="session-pill ${index === 1 ? "active" : ""}" data-session="${session.id}"><b>${session.title}</b><span>${session.duration} min · pricing on enquiry</span></button>`).join("")}</div></div>
          <div class="calendar-panel"><div class="calendar-toolbar"><div><span class="overline">2. Select a date</span><h2 id="calendar-month"></h2></div><div><button class="icon-button" id="month-prev" aria-label="Previous month">←</button><button class="today-button" id="calendar-today">Today</button><button class="icon-button" id="month-next" aria-label="Next month">→</button></div></div><div class="calendar-weekdays" aria-hidden="true">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}</div><div class="calendar-grid" id="calendar-grid" role="grid" aria-label="Choose a future date"></div></div>
          <div class="time-panel"><div><span class="overline">3. Select a time</span><h2>Preferred Time</h2><p>Choose the time that suits you best.</p></div><div class="time-slots" id="time-slots" role="radiogroup" aria-label="Request time"><div class="time-empty-notice"><p>Select a date to view available request times.</p></div></div></div>
        </div>
        <aside class="booking-summary"><span class="overline">4. Review request</span><h2>Your practice request</h2><div class="summary-photo"><img src="${ROOT}assets/images/booking-desk.jpg" alt="Selected session environment" data-summary-image></div><dl><div><dt>Session</dt><dd data-summary-session>Urban Traffic Practice</dd></div><div><dt>Date</dt><dd data-summary-date>Choose a future date</dd></div><div><dt>Time</dt><dd data-summary-time>Choose a request time</dd></div><div><dt>Duration</dt><dd data-summary-duration>60 minutes</dd></div></dl><label for="schedule-note">Optional note</label><textarea id="schedule-note" rows="2" placeholder="Anything the center should know?"></textarea><button class="button" id="save-schedule-request" disabled>Save Local Request</button><button class="text-button reset-schedule" type="button">Reset selection</button><p class="booking-disclosure">This does not reserve live inventory. Center confirmation is still required.</p><div id="schedule-status" aria-live="polite"></div></aside>
      </div></section>
      ${faqStrip([
        [
          "Are these live available times?",
          "No. These are preferred request times. The center confirms availability after submission.",
        ],
        [
          "What happens after I save?",
          "The request appears in My Sessions with a Requested status.",
        ],
        [
          "Which time zone is used?",
          "Times are shown in the center’s configured local time; this must be confirmed for production.",
        ],
      ])}
    </main>`;
}

export function pricingPage() {
  return `
    <main id="main" class="pricing-page">
      <section class="pricing-header"><div class="container pricing-header-grid"><div>${eyebrow("Training options")}<h1>Choose the amount of structure you need.</h1><p>Start with one focused simulator session or ask the center to shape a broader practice path.</p><p class="fine-print">Current prices are provided by the center during follow-up.</p></div><div class="pricing-header-photo"><img src="${ROOT}assets/images/night-cockpit.jpg" alt="Vehicle controls during a night driving environment"><span>Practical scenarios + theory review</span></div></div></section>
      <section class="section section-compact"><div class="container pricing-table">${Object.entries(
        plans,
      )
        .map(
          ([key, plan], index) =>
            `<article class="pricing-plan ${index === 1 ? "featured" : ""}"><div class="plan-title"><span>${index === 1 ? "Structured path" : "Training option"}</span><h2>${plan.title}</h2><p>${plan.note}</p></div><div class="plan-price"><strong>${plan.price}</strong><small>${plan.note}</small></div><ul>${plan.features.map((feature) => `<li>${feature}</li>`).join("")}</ul><a class="button ${index === 1 ? "" : "button-secondary"}" href="book-session.html?plan=${key}">${key === "single" ? "Choose a Session" : "Request Package Follow-up"}</a></article>`,
        )
        .join("")}</div></section>
      <section class="section section-major goal-decision-section">
        <div class="container">
          <div class="section-heading split-heading">
            <div>
              ${eyebrow("Decision support")}
              <h2>Which option fits your goal?</h2>
            </div>
            <p>Compare common learner needs to find the structure that matches your current stage of practice.</p>
          </div>
          <div class="goal-decision-matrix">
            <div class="goal-row">
              <div class="goal-need">
                <span class="goal-tag">First simulator experience</span>
                <h3>Orientation & Basic Feel</h3>
                <p>Get familiar with simulator physics, steering feel and control feedback without ongoing commitment.</p>
              </div>
              <div class="goal-match">
                <span class="match-label">Recommended starting option</span>
                <strong>Single Session Practice</strong>
                <span class="match-desc">45 or 60 min session with structured instructor feedback</span>
              </div>
              <div class="goal-action">
                <a class="button button-small button-secondary" href="book-session.html?plan=single">Select Single</a>
              </div>
            </div>
            <div class="goal-row">
              <div class="goal-need">
                <span class="goal-tag">One specific skill</span>
                <h3>Targeted Maneuver Rehearsal</h3>
                <p>Overcome a persistent sticking point—such as parallel parking, hill starts, or busy roundabout entry.</p>
              </div>
              <div class="goal-match">
                <span class="match-label">Recommended starting option</span>
                <strong>Single Focused Session</strong>
                <span class="match-desc">Concentrate full duration on your chosen road challenge</span>
              </div>
              <div class="goal-action">
                <a class="button button-small button-secondary" href="book-session.html?plan=single">Select Single</a>
              </div>
            </div>
            <div class="goal-row goal-row-featured">
              <div class="goal-need">
                <span class="goal-tag">Repeated practical development</span>
                <h3>Four-Session Progression</h3>
                <p>Build muscle memory and calm routines across urban, highway, adverse weather and parking environments.</p>
              </div>
              <div class="goal-match">
                <span class="match-label">Recommended structured path</span>
                <strong>Multi-Session Pack</strong>
                <span class="match-desc">Four scheduled sessions with cumulative progress tracking</span>
              </div>
              <div class="goal-action">
                <a class="button button-small" href="book-session.html?plan=multi">Request Pack</a>
              </div>
            </div>
            <div class="goal-row">
              <div class="goal-need">
                <span class="goal-tag">Combined preparation</span>
                <h3>Simulator + Theory Integration</h3>
                <p>Simultaneously build practical road judgment in the simulator while mastering theory reasoning and mock tests.</p>
              </div>
              <div class="goal-match">
                <span class="match-label">Comprehensive preparation</span>
                <strong>Comprehensive Prep</strong>
                <span class="match-desc">Six simulator sessions combined with full theory test access</span>
              </div>
              <div class="goal-action">
                <a class="button button-small button-secondary" href="book-session.html?plan=comprehensive">Request Prep</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-major package-explainer"><div class="container package-grid"><div>${eyebrow("How package requests work")}<h2>A practice path begins with one clear enquiry.</h2><p class="lede">One package enquiry records your preferred starting session. The remaining dates are arranged during center follow-up.</p></div><ol class="number-list"><li><span>01</span><div><b>Select a training path</b><p>Choose focused, multi-session or combined preparation.</p></div></li><li><span>02</span><div><b>Share a starting preference</b><p>Pick the first scenario and a useful date window.</p></div></li><li><span>03</span><div><b>Arrange the sequence</b><p>The center confirms availability and remaining sessions.</p></div></li></ol></div></section>
      ${faqStrip([
        [
          "Does choosing a plan take payment?",
          "No. This frontend records a local request or package enquiry only.",
        ],
        [
          "Does a four-session plan create four bookings?",
          "No. One package enquiry records your preferred starting session, and remaining dates are arranged during center follow-up.",
        ],
        [
          "Can I combine simulator and theory work?",
          "The combined option is designed to connect both preparation routes.",
        ],
      ])}
    </main>`;
}

export function aboutPage() {
  return `
    <main id="main">
      <section class="about-header"><div class="container about-header-grid"><div>${eyebrow("About DriveLab")}<h1>Practice built around decisions you can revisit.</h1><p>DriveLab brings simulator scenarios, theory revision and progress review into one deliberate preparation journey.</p></div><div class="about-collage"><img src="${ROOT}assets/images/training-center.jpg" alt="Modern multi-simulator driver training studio"><img src="${ROOT}assets/images/theory-study.jpg" alt="Student engaged in structured theory study"></div></div></section>
      <section class="section section-major"><div class="container story-grid"><div class="story-number">01</div><div>${eyebrow("Controlled practice")}<h2>Slow the learning moment down.</h2><p class="lede">A simulator creates room to repeat a junction, parking maneuver or hazard sequence with a single clear focus. The value comes from what the learner notices, changes and tries again.</p></div><div class="story-image"><img src="${ROOT}assets/images/instructor-coaching.jpg" alt="Hands on steering wheel with open scenic road view"></div></div></section>
      <section class="section section-major dark-story"><div class="container dark-story-grid"><div><span class="overline">Theory + practical judgment</span><h2>Connect what you know with what you notice.</h2><p>Theory practice explains the reasoning. Simulator practice turns that reasoning into observation, timing and control. Reviewing both can reveal where preparation should go next.</p></div><div class="principles"><div><span>01</span><b>Repeatable scenarios</b><p>Return to the same challenge with purpose.</p></div><div><span>02</span><b>Immediate review</b><p>Keep the decision and explanation together.</p></div><div><span>03</span><b>Visible progress</b><p>Track completed practice and theory history separately.</p></div></div></div></section>
      <section class="section section-major session-walkthrough-section">
        <div class="container walkthrough-layout">
          <div class="walkthrough-media reveal">
            <img src="${ROOT}assets/images/sim-walkthrough.jpg" alt="Professional instructor coaching learner in driving simulator">
            <div class="walkthrough-media-caption">
              <span>Authentic preparation</span>
              <strong>Structured 4-step training cycle</strong>
            </div>
          </div>
          <div class="walkthrough-copy reveal">
            ${eyebrow("Session sequence")}
            <h2>What a simulator session includes.</h2>
            <p class="lede">Every visit follows a repeatable structure so your practice time is focused on deliberate skill improvement rather than trial and error.</p>
            <div class="walkthrough-steps">
              <div class="walkthrough-step">
                <span class="step-num">01</span>
                <div>
                  <h3>Briefing and focus</h3>
                  <p>Establish the single scenario or maneuver to rehearse before touching the controls.</p>
                </div>
              </div>
              <div class="walkthrough-step">
                <span class="step-num">02</span>
                <div>
                  <h3>Guided scenario</h3>
                  <p>Drive the interactive environment under varied traffic, visibility and weather conditions.</p>
                </div>
              </div>
              <div class="walkthrough-step">
                <span class="step-num">03</span>
                <div>
                  <h3>Review and repeat</h3>
                  <p>Analyze key decision points and immediately re-attempt the situation with adjusted timing.</p>
                </div>
              </div>
              <div class="walkthrough-step">
                <span class="step-num">04</span>
                <div>
                  <h3>Progress record</h3>
                  <p>Session completion and core observations are recorded into your local profile for next time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-major progress-transparency-section">
        <div class="container">
          <div class="section-heading split-heading">
            <div>
              ${eyebrow("Transparent measurement")}
              <h2>What progress can show.</h2>
            </div>
            <p>DriveLab connects practical simulator time with theory test preparation so you know exactly where revision is needed.</p>
          </div>
          <div class="progress-editorial-grid">
            <div class="progress-editorial-item">
              <div class="progress-editorial-icon">${icon("steer")}</div>
              <h3>Completed simulator practice</h3>
              <p>Total hours spent behind simulator controls, session-by-session history and specific scenario categories completed.</p>
            </div>
            <div class="progress-editorial-item">
              <div class="progress-editorial-icon">${icon("quiz")}</div>
              <h3>Theory-test history</h3>
              <p>Detailed log of recent mock attempts with scores, timestamps, test mode and breakdown of correct vs incorrect answers.</p>
            </div>
            <div class="progress-editorial-item">
              <div class="progress-editorial-icon">${icon("chart")}</div>
              <h3>Topic strengths</h3>
              <p>Visual identification of mastered highway code categories where accuracy consistently exceeds the benchmark threshold.</p>
            </div>
            <div class="progress-editorial-item">
              <div class="progress-editorial-icon">${icon("history")}</div>
              <h3>Areas requiring revision</h3>
              <p>Direct highlight of road sign types, hazard recognition or speed regulation areas where errors recur.</p>
            </div>
            <div class="progress-editorial-item progress-readiness-highlight">
              <div class="progress-editorial-icon">${icon("trend")}</div>
              <h3>Readiness calculated from evidence</h3>
              <p>Readiness status remains unavailable until sufficient attempts are recorded. Once unlocked, it weights 70% recent score average with 30% topic coverage.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-major"><div class="container start-journey"><div class="journey-photo"><img src="${ROOT}assets/images/study-notes.jpg" alt="Learner taking structured study notes"></div><div>${eyebrow("How to begin")}<h2>Choose the next useful step—not every step at once.</h2><ol class="number-list"><li><span>01</span><div><b>Explore the sessions</b><p>Identify a practical skill to rehearse.</p></div></li><li><span>02</span><div><b>Try a theory baseline</b><p>Use ten questions to reveal revision priorities.</p></div></li><li><span>03</span><div><b>Review progress</b><p>Let evidence shape the next practice choice.</p></div></li></ol><div class="button-row">${action("simulator-sessions.html", "Explore Sessions")}${action("mock-test.html?count=10", "Start Theory Practice", true)}</div></div></div></section>
      <section class="section section-compact about-closing-cta">
        <div class="container about-cta-card">
          <div>
            <span class="overline">Start your preparation</span>
            <h2>Begin with practical simulator time or a theory baseline.</h2>
            <p>Choose a session to rehearse a specific driving skill or test your highway code reasoning right now.</p>
          </div>
          <div class="button-row">
            ${action("simulator-sessions.html", "Explore Simulator Sessions")}
            ${action("theory-test-prep.html", "Theory Test Prep", true)}
          </div>
        </div>
      </section>
    </main>`;
}

export function contactPage() {
  return `
    <main id="main">
      <section class="contact-header"><div class="container contact-header-grid"><div>${eyebrow("Contact DriveLab")}<h1>Start with the question that matters to your practice.</h1><p>Ask about a session, booking support, center access or the Student Dashboard.</p></div><div class="contact-paths"><a href="#contact-form"><span>01</span><b>General enquiry</b>${icon("arrow")}</a><a href="#contact-form"><span>02</span><b>Session support</b>${icon("arrow")}</a><a href="#contact-form"><span>03</span><b>Center arrival details</b>${icon("arrow")}</a></div></div></section>
      <section class="section section-major"><div class="container contact-main"><form class="contact-form" id="contact-form"><div class="form-heading"><span class="overline">Send an enquiry</span><h2>Tell us how we can help.</h2></div><div class="form-grid"><div class="field"><label for="contact-name">Name</label><input id="contact-name" required autocomplete="name"></div><div class="field"><label for="contact-email">Email</label><input id="contact-email" type="email" required autocomplete="email"></div><div class="field field-full"><label for="contact-topic">Enquiry type</label><select id="contact-topic"><option>General enquiry</option><option>Session or booking support</option><option>Center location</option><option>Student Dashboard support</option></select></div><div class="field field-full"><label for="contact-message">Message</label><textarea id="contact-message" required rows="6"></textarea></div><div class="field field-full"><button class="button" type="submit">Review Enquiry</button><p id="contact-status" aria-live="polite"></p></div></div></form><aside class="support-panel"><div class="support-card-main"><span class="overline">Center support & arrival</span><h3>Need help with a session or arrival details?</h3><p>Our team is available to assist with training questions, accessibility needs, and location directions.</p><div class="support-points"><div class="support-point"><div class="support-point-icon">${icon("calendar")}</div><div><strong>Existing requests</strong><p>Review or cancel pending simulator requests from this browser.</p><a class="text-button" href="${portalLink()}">Open My Sessions ${icon("arrow")}</a></div></div><div class="support-point"><div class="support-point-icon">${icon("steer")}</div><div><strong>Arrival & equipment</strong><p>Center briefing begins 10 minutes prior to your scheduled simulator slot.</p></div></div><div class="support-point"><div class="support-point-icon">${icon("quiz")}</div><div><strong>Theory assistance</strong><p>Questions regarding mock tests or revision methods are answered by certified instructors.</p></div></div></div></div></aside></div></section>
      <section class="section section-compact enquiry-process-section">
        <div class="container">
          <div class="section-heading split-heading">
            <div>
              ${eyebrow("Client follow-up")}
              <h2>What happens after an enquiry.</h2>
            </div>
            <p>Here is how our center team handles your question and session requests.</p>
          </div>
          <div class="enquiry-process-grid">
            <div class="process-card">
              <span class="process-step">01</span>
              <h3>Choose the enquiry type</h3>
              <p>Select whether you need general information, booking support, center directions, or dashboard assistance.</p>
            </div>
            <div class="process-card">
              <span class="process-step">02</span>
              <h3>Share the relevant question</h3>
              <p>Provide your contact details and message so our team understands your exact requirements.</p>
            </div>
            <div class="process-card">
              <span class="process-step">03</span>
              <h3>Center follows up with details</h3>
              <p>A center instructor or advisor contacts you directly to answer questions and clarify preparation plans.</p>
            </div>
            <div class="process-card">
              <span class="process-step">04</span>
              <h3>Requests confirmed directly</h3>
              <p>Any preferred practice session times remain pending until our team confirms scheduling and equipment availability.</p>
            </div>
          </div>
        </div>
      </section>
      ${faqStrip([
        [
          "Can I change a request?",
          "Cancel the current local request in My Sessions, then submit a new preferred time.",
        ],
        [
          "Is support live?",
          "No live-support claim is made. Use the enquiry form for follow-up.",
        ],
        [
          "Why is there no map?",
          "Contact the center directly for the most current access, arrival and parking instructions.",
        ],
      ])}
    </main>`;
}

export function faqPage() {
  return `<main id="main"><section class="simple-header"><div class="container">${eyebrow("Questions & answers")}<h1>Clear expectations before practice.</h1><p>Understand how simulator sessions, theory practice and local portal data work.</p></div></section>${faqStrip(
    [
      [
        "Does simulator practice replace on-road training?",
        "No. It supports preparation and does not replace legal road-training requirements.",
      ],
      [
        "Are schedule times live?",
        "No. They are preferred request times until the center confirms availability.",
      ],
      [
        "Are the theory questions official?",
        "No. They are original educational practice items.",
      ],
      [
        "How is readiness calculated?",
        "After at least three attempts, it uses 70% recent score average and 30% topic coverage.",
      ],
      [
        "Where is my data stored?",
        "It remains in localStorage on this browser and is not synchronized between devices.",
      ],
    ],
  )}</main>`;
}

export function legalPage(title) {
  return `<main id="main"><section class="simple-header"><div class="container">${eyebrow(title)}<h1>${title === "Privacy" ? "How DriveLab handles browser data." : "Terms for using DriveLab."}</h1><p>Important information about this website’s current local-only features.</p></div></section><section class="section section-compact"><div class="container legal-copy"><h2>Browser storage and service limitations</h2><p>The Student Dashboard stores profile settings, booking requests, self-reported practice and mock-test attempts in browser localStorage. It does not create a secure account or synchronize between devices.</p><p>Do not enter sensitive personal data. Secure authentication, live scheduling, payments and final legal terms require the appropriate connected services and client review.</p></div></section></main>`;
}

export function loginPage(register = false) {
  return `<main class="auth-page"><section class="auth-visual"><img src="${ROOT}assets/images/${register ? "student-learner.jpg" : "dashboard-night.jpg"}" alt="${register ? "Learner preparing with study materials" : "Illuminated vehicle instrument display at night"}"><div class="auth-shade"></div><a class="brand" href="${ROOT}index.html"><img src="${ROOT}assets/brand/logo-white.svg" alt="DriveLab"></a><div><span class="overline">${register ? "Create Student Account" : "Student Login"}</span><h1>${register ? "Create your practice profile." : "Return to your Student Dashboard."}</h1><p>Session requests, completed practice and theory results stay organized in one place.</p></div></section><section class="auth-form-wrap"><div class="auth-form-box"><a class="back-link" href="${ROOT}index.html">← Back to site</a><span class="overline">${register ? "Create Student Account" : "Student Login"}</span><h2>${register ? "Begin your DriveLab record" : "Welcome back"}</h2><p>Your profile and progress are stored only in this browser. No password is stored.</p><form id="auth-form" class="form-grid"><div class="field field-full"><label for="display-name">Display name</label><input id="display-name" required autocomplete="name"></div><div class="field field-full"><label for="email">Email <small>not stored</small></label><input id="email" type="email" autocomplete="email"></div>${register ? '<div class="field field-full"><label for="region">Preferred theory region</label><input id="region" placeholder="Not set"></div>' : ""}<button class="button field-full" type="submit">${register ? "Create Student Account" : "Continue to Dashboard"}</button></form><div class="auth-disclosure">This creates a browser-local profile, not a secure online account.</div><p>${register ? 'Already have a local profile? <a href="login.html">Student Login</a>' : 'New here? <a href="register.html">Create Student Account</a>'}</p><button class="text-button" id="sample-profile" type="button">Explore Student Dashboard ${icon("arrow")}</button></div></section></main>`;
}

export function bookingPage() {
  const params = new URLSearchParams(location.search);
  const session = params.get("session") || "urban";
  const plan = params.get("plan");
  return `<main id="main"><section class="booking-header"><div class="container">${eyebrow(plan ? "Package enquiry" : "Session request")}<h1>${plan ? "Choose a starting preference for your training path." : "Request a simulator practice time."}</h1><p>${plan ? "The center will follow up to arrange the full sequence; this form does not create multiple appointments." : "Choose a future date and preferred request time."}</p></div></section><section class="section section-compact"><div class="container booking-page-grid"><div class="booking-context"><img src="${ROOT}assets/images/${sessions.find((item) => item.id === session)?.image || "session-booking.jpg"}" alt="Selected training environment"><div>${plan && plans[plan] ? `<span class="overline">Selected training path</span><h2>${plans[plan].title}</h2><p>${plans[plan].note}</p>` : '<span class="overline">Local request</span><h2>Choose the starting session.</h2>'}</div></div><div id="standalone-booking-form" data-selected-session="${session}" data-plan="${plan || ""}"></div></div></section></main>`;
}

function faqStrip(items) {
  return `<section class="section section-compact faq-strip"><div class="container"><div class="faq-heading"><span class="overline">Useful questions</span><h2>Before you continue</h2></div><div class="faq-list">${items.map((item) => `<details><summary>${item[0]}<span>+</span></summary><p>${item[1]}</p></details>`).join("")}</div></div></section>`;
}
