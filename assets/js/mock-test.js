import { ROOT } from "./data.js";
import { icon, logo } from "./components.js";

export function renderMockTest() {
  const count = Math.min(
    30,
    Math.max(
      10,
      Number(new URLSearchParams(location.search).get("count")) || 10,
    ),
  );
  const minutes = count === 10 ? 15 : count === 20 ? 30 : 45;
  return `
    <main class="test-app" id="main" data-test-count="${count}">
      <header class="test-app-header test-timer-bar" id="test-timer-bar" hidden><span id="test-timer"></span></header>
      <section class="test-start" id="test-start"><div class="test-start-copy"><a class="brand test-start-brand" href="student-dashboard.html">${logo()}</a><span class="overline">${count} original practice questions</span><h1>Build a clearer picture of what to revise.</h1><p>Move freely between questions, change answers before submission and receive an instant topic-level report.</p><div class="test-start-features"><span>Unique question IDs</span><span>Full answer review</span><span>Refresh-safe progress</span></div><label class="timer-option"><input type="checkbox" id="timer-enabled"><span><b>Enable a ${minutes}-minute timer</b><small>Untimed practice is always available.</small></span></label><button class="button" id="start-test">Start Assessment ${icon("arrow")}</button><p class="fine-print">Original educational content · not an official exam</p></div><div class="test-start-visual"><img src="${ROOT}assets/images/road-signs.jpg" alt="Road signs supporting theory practice"><div><span>Practice mode</span><b>${count === 10 ? "Quick Practice" : count === 20 ? "Standard Mock" : "Full Practice"}</b><i>${count} questions</i></div></div></section>
      <section class="test-active" id="test-active" hidden><aside class="test-sidebar"><div><span class="overline">Question map</span><strong><span data-answered-count>0</span> / ${count} answered</strong></div><div class="question-navigator" aria-label="Question navigation"></div><button class="text-button" id="submit-test">Submit Test ${icon("arrow")}</button></aside><article class="test-question-panel"><div class="test-progress" aria-label="Question progress"><span></span></div><div id="question-area"></div><div class="test-controls"><button class="button button-secondary" id="prev-question">Previous</button><span id="question-position">1 / ${count}</span><button class="button" id="next-question">Next</button></div></article></section>
    </main>`;
}

export function renderResults(store) {
  const id = new URLSearchParams(location.search).get("id");
  const attempts = store.get("attempts", []);
  const attempt = attempts.find((item) => item.id === id) || attempts.at(-1);
  if (!attempt)
    return `<main class="result-app"><a class="brand" href="student-dashboard.html">${logo()}</a><section class="empty-result"><h1>No saved result yet.</h1><p>Complete a mock test to create an answer review.</p><a class="button" href="mock-test.html?count=10">Start Practice</a></section></main>`;
  const lowestTopic = Object.entries(attempt.topics).sort(
    (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total,
  )[0]?.[0];
  return `
    <main class="result-app" id="main">
      <header class="result-header"><a class="brand" href="student-dashboard.html">${logo()}</a><a class="text-button" href="student-dashboard.html">Back to Dashboard</a></header>
      <section class="result-summary"><div class="result-score"><div class="result-ring" style="--score:${attempt.score}" role="img" aria-label="Overall score ${attempt.score} percent"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="result-track" cx="50" cy="50" r="42" pathLength="100"></circle><circle class="result-active" cx="50" cy="50" r="42" pathLength="100"></circle></svg><strong>${attempt.score}%</strong><span>overall score</span></div></div><div class="result-copy"><span class="overline">Practice report</span><h1>${attempt.score >= 75 ? "Strong practice performance." : attempt.score >= 55 ? "A useful foundation to build on." : "Your revision priorities are clear."}</h1><p>${attempt.count} questions completed in ${Math.max(1, Math.round(attempt.duration / 60))} minutes on ${new Date(attempt.date).toLocaleString()}.</p><div class="result-counts"><span class="correct"><b>${attempt.correct}</b>Correct</span><span class="incorrect"><b>${attempt.incorrect}</b>Incorrect</span><span class="unanswered"><b>${attempt.unanswered}</b>Unanswered</span></div><div class="button-row"><a class="button" href="mock-test.html?count=${attempt.count}">Start Another Test</a><a class="button button-secondary" href="#answer-review">Review Answers</a></div></div></section>
      <section class="result-insights"><div><span class="overline">Topic breakdown</span><h2>Where the score came from.</h2></div><div class="topic-results">${Object.entries(
        attempt.topics,
      )
        .map(([topic, value]) => {
          const percentage = Math.round((value.correct / value.total) * 100);
          return `<article><div><b>${topic}</b><span>${value.correct} / ${value.total}</span></div><div class="topic-meter"><span style="width:${percentage}%"></span></div><small>${percentage}%</small></article>`;
        })
        .join(
          "",
        )}</div><aside><span>Suggested revision focus</span><strong>${lowestTopic || "Broaden topic coverage"}</strong><p>Review missed explanations, then revisit this topic in another mixed practice set.</p></aside></section>
      <section class="answer-review" id="answer-review"><div class="review-heading"><span class="overline">Answer review</span><h2>Compare every decision with the reasoning.</h2></div>${attempt.review.map((item, index) => `<article class="review-row ${item.correct ? "is-correct" : "is-incorrect"}"><div class="review-number">${String(index + 1).padStart(2, "0")}</div><div class="review-content"><span class="review-label">${item.correct ? "Correct" : item.answer === null ? "Unanswered" : "Needs review"}</span><h3>${item.question}</h3><div class="review-answers"><p><span>Your answer</span><b>${item.answer === null ? "No answer selected" : item.choices[item.answer]}</b></p><p><span>Correct answer</span><b>${item.choices[item.correctIndex]}</b></p></div><p class="review-explanation">${item.explanation}</p></div></article>`).join("")}</section>
    </main>`;
}

export function bindMockTest(store) {
  const startButton = document.querySelector("#start-test");
  if (!startButton) return;
  const count = Number(document.querySelector(".test-app").dataset.testCount);
  let state = store.get("active-test", null);
  let interval;

  function shouldResume() {
    return (
      state &&
      !state.completed &&
      state.questions?.length === count &&
      window.confirm("Resume your saved in-progress attempt?")
    );
  }

  function begin() {
    if (!shouldResume()) {
      const questions = [...window.DL_QUESTIONS]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
      state = {
        id: crypto.randomUUID(),
        questions: questions.map((item) => item.id),
        answers: {},
        index: 0,
        started: Date.now(),
        timed: document.querySelector("#timer-enabled").checked,
        remaining: (count === 10 ? 15 : count === 20 ? 30 : 45) * 60,
        completed: false,
      };
      store.set("active-test", state);
    }
    document.querySelector("#test-start").hidden = true;
    document.querySelector("#test-active").hidden = false;
    const timerBar = document.querySelector("#test-timer-bar");
    if (timerBar) timerBar.hidden = !state.timed;
    showQuestion();
    if (state.timed) interval = window.setInterval(tick, 1000);
  }

  const currentQuestions = () =>
    state.questions.map((id) =>
      window.DL_QUESTIONS.find((item) => item.id === id),
    );

  function showQuestion() {
    const questions = currentQuestions();
    const question = questions[state.index];
    const answeredCount = Object.keys(state.answers).length;
    document.querySelector("[data-answered-count]").textContent = answeredCount;
    document.querySelector("#question-position").textContent =
      `${state.index + 1} / ${questions.length}`;
    document.querySelector(".test-progress span").style.width =
      `${((state.index + 1) / questions.length) * 100}%`;
    document.querySelector(".question-navigator").innerHTML = state.questions
      .map(
        (id, index) =>
          `<button class="${state.answers[id] !== undefined ? "answered" : ""} ${index === state.index ? "current" : ""}" data-index="${index}" aria-label="Question ${index + 1}">${index + 1}</button>`,
      )
      .join("");
    document.querySelector("#question-area").innerHTML =
      `<div class="question-meta"><span>Question ${state.index + 1}</span><span>${question.topic}</span></div><h2>${question.question}</h2><fieldset><legend class="sr-only">Choose one answer</legend>${question.choices.map((choice, index) => `<label class="test-answer"><input type="radio" name="answer" value="${index}" ${state.answers[question.id] === index ? "checked" : ""}><span>${String.fromCharCode(65 + index)}</span><b>${choice}</b></label>`).join("")}</fieldset>`;
    document.querySelectorAll(".question-navigator button").forEach((button) =>
      button.addEventListener("click", () => {
        state.index = Number(button.dataset.index);
        persist();
        showQuestion();
      }),
    );
    document.querySelectorAll('input[name="answer"]').forEach((input) =>
      input.addEventListener("change", () => {
        state.answers[question.id] = Number(input.value);
        persist();
        showQuestion();
      }),
    );
    document.querySelector("#prev-question").disabled = state.index === 0;
    document.querySelector("#next-question").textContent =
      state.index === questions.length - 1 ? "Review" : "Next";
    updateTimer();
  }

  function persist() {
    store.set("active-test", state);
  }
  function tick() {
    state.remaining -= 1;
    persist();
    updateTimer();
    if (state.remaining <= 0) submit(true);
  }
  function updateTimer() {
    const element = document.querySelector("#test-timer");
    const bar = document.querySelector("#test-timer-bar");
    if (!element) return;
    if (!state?.timed) {
      element.textContent = "";
      if (bar) bar.hidden = true;
      return;
    }
    if (bar) bar.hidden = false;
    element.textContent = `${Math.floor(state.remaining / 60)}:${String(state.remaining % 60).padStart(2, "0")}`;
  }

  function submit(force = false) {
    const unanswered = state.questions.filter(
      (id) => state.answers[id] === undefined,
    ).length;
    if (
      !force &&
      unanswered &&
      !window.confirm(`${unanswered} questions are unanswered. Submit anyway?`)
    )
      return;
    clearInterval(interval);
    const review = currentQuestions().map((question) => ({
      question: question.question,
      choices: question.choices,
      answer: state.answers[question.id] ?? null,
      correctIndex: question.correct,
      correct: state.answers[question.id] === question.correct,
      explanation: question.explanation,
      topic: question.topic,
    }));
    const correct = review.filter((item) => item.correct).length;
    const topics = {};
    review.forEach((item) => {
      topics[item.topic] ??= { correct: 0, total: 0 };
      topics[item.topic].total += 1;
      if (item.correct) topics[item.topic].correct += 1;
    });
    const attempt = {
      id: state.id,
      date: new Date().toISOString(),
      count: review.length,
      score: Math.round((correct / review.length) * 100),
      correct,
      incorrect: review.length - correct - unanswered,
      unanswered,
      duration: Math.max(1, Math.round((Date.now() - state.started) / 1000)),
      topics,
      review,
    };
    const attempts = store.get("attempts", []);
    attempts.push(attempt);
    store.set("attempts", attempts);
    state.completed = true;
    persist();
    location.href = `test-results.html?id=${attempt.id}`;
  }

  startButton.addEventListener("click", begin);
  document.querySelector("#prev-question").addEventListener("click", () => {
    if (state.index > 0) state.index -= 1;
    showQuestion();
  });
  document.querySelector("#next-question").addEventListener("click", () => {
    if (state.index < state.questions.length - 1) state.index += 1;
    showQuestion();
  });
  document
    .querySelector("#submit-test")
    .addEventListener("click", () => submit());
}
