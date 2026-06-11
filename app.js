(function () {
  "use strict";

  const STORE_KEY = "cca-exam-forge-state-v1";
  const IMPORT_KEY = "cca-exam-forge-imported-sources-v1";
  const THEME_KEY = "cca-exam-forge-theme-v1";
  const ROUND_SIZE = 8;

  const viewTitles = {
    guide: "Guide",
    study: "Flashcards",
    game: "Mobile Game Mode",
    progress: "Progress",
    sources: "Sources"
  };

  const app = document.getElementById("app");
  const viewTitle = document.getElementById("viewTitle");
  const domainFilter = document.getElementById("domainFilter");
  const sidebarCoverage = document.getElementById("sidebarCoverage");
  const themeColor = document.getElementById("themeColor");

  let currentView = "guide";
  let selectedDomain = "all";
  let currentCardId = null;
  let cardRevealed = false;
  let game = null;

  function safeJsonParse(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function loadState() {
    return {
      cards: {},
      questions: {},
      stats: { xp: 0, rounds: 0, wins: 0, bestStreak: 0, correct: 0, attempts: 0 },
      ...safeJsonParse(localStorage.getItem(STORE_KEY), {})
    };
  }

  function saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    updateCoverage();
  }

  function loadImportedSources() {
    return safeJsonParse(localStorage.getItem(IMPORT_KEY), []);
  }

  function saveImportedSources(sources) {
    localStorage.setItem(IMPORT_KEY, JSON.stringify(sources));
  }

  function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(THEME_KEY, nextTheme);
    document.querySelectorAll('[data-action="toggle-theme"]').forEach((toggle) => {
      toggle.setAttribute("aria-label", nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      toggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
    });
    document.querySelectorAll(".theme-toggle-label").forEach((label) => {
      label.textContent = nextTheme === "dark" ? "Light mode" : "Dark mode";
    });
    if (themeColor) {
      themeColor.setAttribute("content", nextTheme === "dark" ? "#101417" : "#f7f2e8");
    }
  }

  let state = loadState();
  let importedSources = loadImportedSources();

  function sources() {
    return [...(window.CCA_SOURCES || []), ...importedSources];
  }

  function sourceById(sourceId) {
    return sources().find((source) => source.id === sourceId) || null;
  }

  function domains() {
    const byId = new Map();
    for (const source of sources()) {
      for (const domain of source.domains || []) {
        if (!byId.has(domain.id)) byId.set(domain.id, domain);
      }
    }
    return [...byId.values()];
  }

  function cards() {
    return sources().flatMap((source) =>
      (source.cards || []).map((card) => ({ ...card, sourceId: source.id, sourceTitle: source.label || source.title }))
    );
  }

  function questions() {
    return sources().flatMap((source) =>
      (source.questions || []).map((question) => ({
        ...question,
        sourceId: source.id,
        sourceTitle: source.label || source.title
      }))
    );
  }

  function scenarios() {
    return sources().flatMap((source) =>
      (source.scenarios || []).map((scenario) => ({ ...scenario, sourceId: source.id }))
    );
  }

  function domainById(id) {
    return domains().find((domain) => domain.id === id) || { id, title: id, short: id, weight: 0, color: "#687074" };
  }

  function filteredCards() {
    return cards().filter((card) => selectedDomain === "all" || card.domain === selectedDomain);
  }

  function filteredQuestions() {
    return questions().filter((question) => selectedDomain === "all" || question.domain === selectedDomain);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function pct(done, total) {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  }

  function cardProgress(cardId) {
    return state.cards[cardId] || { level: 0, due: 0, seen: 0, misses: 0 };
  }

  function questionProgress(questionId) {
    return state.questions[questionId] || { attempts: 0, correct: 0, wrong: 0 };
  }

  function questionSupport(question) {
    const source = sourceById(question.sourceId);
    const support = (source && source.questionSupport && source.questionSupport[question.id]) || {};
    return {
      hint: support.hint || "Look for the design tradeoff the exam is testing.",
      explain: support.explain || question.explanation || "Review the linked source section and compare the answer choices.",
      citations: support.citations || []
    };
  }

  function citationProofHref(question, citation) {
    const source = sourceById(question.sourceId);
    if (!source || !source.sourcePath || !citation.page) return "";
    return `${source.sourcePath}#page=${encodeURIComponent(citation.page)}`;
  }

  function isMastered(card) {
    return (cardProgress(card.id).level || 0) >= 4;
  }

  function coverageForDomain(domainId) {
    const items = cards().filter((card) => card.domain === domainId);
    return pct(items.filter(isMastered).length, items.length);
  }

  function weightedCoverage() {
    const ds = domains();
    const totalWeight = ds.reduce((sum, domain) => sum + Number(domain.weight || 0), 0) || ds.length || 1;
    const weighted = ds.reduce((sum, domain) => {
      const weight = Number(domain.weight || 0) || 1;
      return sum + coverageForDomain(domain.id) * weight;
    }, 0);
    return Math.round(weighted / totalWeight);
  }

  function updateCoverage() {
    sidebarCoverage.textContent = `${weightedCoverage()}%`;
  }

  function setView(view) {
    currentView = view;
    viewTitle.textContent = viewTitles[view] || "Guide";
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });
    render();
  }

  function renderDomainOptions() {
    const existing = domainFilter.value || selectedDomain;
    domainFilter.innerHTML =
      '<option value="all">All domains</option>' +
      domains()
        .map((domain) => `<option value="${escapeHtml(domain.id)}">${escapeHtml(domain.short || domain.title)}</option>`)
        .join("");
    domainFilter.value = domains().some((domain) => domain.id === existing) ? existing : "all";
    selectedDomain = domainFilter.value;
  }

  function domainPill(domainId) {
    const domain = domainById(domainId);
    return `<span class="pill" style="border-color:${domain.color}55;color:${domain.color}">${escapeHtml(domain.short || domain.title)}</span>`;
  }

  function renderGuide() {
    const ds = domains();
    const sourceCards = sources()
      .map(
        (source) => `
          <div class="source-item">
            <div>
              <strong>${escapeHtml(source.label || source.title)}</strong>
              <div class="small-muted">${escapeHtml(source.summary || "")}</div>
              <div class="tag-row" style="margin-top:8px">
                <span class="pill">${(source.cards || []).length} cards</span>
                <span class="pill">${(source.questions || []).length} questions</span>
                <span class="pill">${escapeHtml(source.sourceType || "source")}</span>
              </div>
            </div>
            ${
              source.sourcePath
                ? `<a class="btn secondary" href="${escapeHtml(source.sourcePath)}" target="_blank" rel="noreferrer">Open source</a>`
                : ""
            }
          </div>
        `
      )
      .join("");

    const domainCards = ds
      .map((domain) => {
        const domainCards = cards().filter((card) => card.domain === domain.id);
        const domainQuestions = questions().filter((question) => question.domain === domain.id);
        const coverage = coverageForDomain(domain.id);
        return `
          <article class="panel domain-card">
            <div class="domain-head">
              <div class="domain-title-line">
                <span class="domain-dot" style="background:${domain.color}"></span>
                <h3>${escapeHtml(domain.title)}</h3>
              </div>
              <span class="pill">${domain.weight}%</span>
            </div>
            <p class="small-muted">${escapeHtml(domain.focus || "")}</p>
            <div class="meter" aria-label="${coverage}% mastered"><span style="width:${coverage}%;background:${domain.color}"></span></div>
            <div class="tag-row">
              <span class="pill">${domainCards.length} cards</span>
              <span class="pill">${domainQuestions.length} game questions</span>
              <span class="pill">${coverage}% mastered</span>
            </div>
          </article>
        `;
      })
      .join("");

    const scenarioItems = scenarios()
      .map(
        (scenario) => `
          <li>
            <strong>${escapeHtml(scenario.title)}</strong>
            <div class="small-muted" style="margin:4px 0 8px">${escapeHtml(scenario.brief)}</div>
            <div class="tag-row">${(scenario.domains || []).map(domainPill).join("")}</div>
          </li>
        `
      )
      .join("");

    const firstSource = sources()[0] || {};
    const prepItems = (firstSource.prep || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const inScope = (firstSource.inScope || []).map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("");
    const outScope = (firstSource.outOfScope || []).map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("");

    app.innerHTML = `
      <div class="grid two">
        <section class="panel">
          <div class="section-title">
            <h3>Study Sources</h3>
            <button class="btn secondary" data-view-jump="sources">Add source</button>
          </div>
          <div class="stack">${sourceCards || '<div class="empty">No sources loaded.</div>'}</div>
        </section>
        <section class="panel">
          <div class="section-title">
            <h3>Quick Start</h3>
            <span class="pill">${weightedCoverage()}% coverage</span>
          </div>
          <p class="small-muted">Start with cards to learn, then switch to game mode for recall under pressure.</p>
          <div class="button-row">
            <button class="btn primary" data-view-jump="game">Play round</button>
            <button class="btn secondary" data-view-jump="study">Study due cards</button>
            <button class="btn" data-view-jump="progress">View progress</button>
          </div>
        </section>
      </div>

      <section class="grid three" style="margin-top:14px">${domainCards}</section>

      <div class="grid two" style="margin-top:14px">
        <section class="panel">
          <div class="section-title"><h3>Exam Scenarios</h3></div>
          <ul class="scenario-list">${scenarioItems}</ul>
        </section>
        <section class="panel">
          <div class="section-title"><h3>Prep Checklist</h3></div>
          <ul class="check-list">${prepItems}</ul>
        </section>
      </div>

      <div class="grid two" style="margin-top:14px">
        <section class="panel">
          <div class="section-title"><h3>In Scope</h3></div>
          <div class="tag-row">${inScope}</div>
        </section>
        <section class="panel">
          <div class="section-title"><h3>Out of Scope</h3></div>
          <div class="tag-row">${outScope}</div>
        </section>
      </div>
    `;
  }

  function pickNextCard() {
    const now = Date.now();
    const deck = filteredCards();
    const due = deck.filter((card) => !cardProgress(card.id).due || cardProgress(card.id).due <= now);
    const pool = due.length ? due : deck;
    if (!pool.length) return null;
    pool.sort((a, b) => {
      const pa = cardProgress(a.id);
      const pb = cardProgress(b.id);
      if ((pa.level || 0) !== (pb.level || 0)) return (pa.level || 0) - (pb.level || 0);
      return (pa.due || 0) - (pb.due || 0);
    });
    return pool[0];
  }

  function renderStudy() {
    const deck = filteredCards();
    if (!deck.length) {
      app.innerHTML = `<div class="empty">No cards match this domain. Add a source or change the filter.</div>`;
      return;
    }
    if (!currentCardId || !deck.some((card) => card.id === currentCardId)) {
      const next = pickNextCard();
      currentCardId = next && next.id;
      cardRevealed = false;
    }
    const card = deck.find((item) => item.id === currentCardId) || deck[0];
    const progress = cardProgress(card.id);
    const mastered = isMastered(card);
    const dueCount = deck.filter((item) => {
      const progress = cardProgress(item.id);
      return !progress.due || progress.due <= Date.now();
    }).length;

    app.innerHTML = `
      <section class="study-card">
        <div class="section-title">
          <div>
            ${domainPill(card.domain)}
            <span class="pill">${escapeHtml(card.sourceTitle)}</span>
            <span class="pill">Level ${progress.level || 0}</span>
          </div>
          <span class="pill">${dueCount} due</span>
        </div>
        <div class="card-face">
          <h3>${escapeHtml(card.front)}</h3>
          ${
            cardRevealed
              ? `<div class="card-back">${escapeHtml(card.back)}</div>`
              : `<button class="btn primary" data-action="reveal-card">Reveal answer</button>`
          }
          <div class="tag-row">${(card.tags || []).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
        </div>
        <div class="button-row">
          ${
            cardRevealed
              ? `
                <button class="btn danger" data-action="rate-card" data-rating="again">Again</button>
                <button class="btn good" data-action="rate-card" data-rating="good">Got it</button>
                <button class="btn primary" data-action="rate-card" data-rating="mastered">Mastered</button>
              `
              : ""
          }
          <button class="btn secondary" data-action="skip-card">Skip</button>
          <button class="btn" data-action="shuffle-card">Shuffle</button>
        </div>
        <div class="small-muted">
          ${mastered ? "This card is mastered. Keep it warm with occasional review." : "Rate honestly. Again brings it back soon; Mastered schedules it farther out."}
        </div>
      </section>
    `;
  }

  function rateCard(cardId, rating) {
    const now = Date.now();
    const progress = cardProgress(cardId);
    let level = progress.level || 0;
    let dueMs = 5 * 60 * 1000;
    if (rating === "again") {
      level = Math.max(0, level - 1);
      dueMs = 5 * 60 * 1000;
      progress.misses = (progress.misses || 0) + 1;
    } else if (rating === "good") {
      level = Math.min(5, level + 1);
      dueMs = [0, 12, 36, 72, 168, 336][level] * 60 * 60 * 1000;
    } else {
      level = Math.min(5, level + 2);
      dueMs = [0, 24, 72, 168, 336, 720][level] * 60 * 60 * 1000;
    }
    state.cards[cardId] = {
      ...progress,
      level,
      due: now + dueMs,
      seen: (progress.seen || 0) + 1,
      last: now
    };
    saveState();
    const next = pickNextCard();
    currentCardId = next && next.id;
    cardRevealed = false;
    renderStudy();
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function weightedQuestions() {
    const pool = filteredQuestions();
    return shuffle(pool).sort((a, b) => {
      const pa = questionProgress(a.id);
      const pb = questionProgress(b.id);
      const scoreA = (pa.correct || 0) - (pa.wrong || 0) - (pa.attempts ? 0 : 2);
      const scoreB = (pb.correct || 0) - (pb.wrong || 0) - (pb.attempts ? 0 : 2);
      return scoreA - scoreB;
    });
  }

  function startRound() {
    const picked = weightedQuestions().slice(0, ROUND_SIZE);
    game = {
      status: "active",
      index: 0,
      hp: 3,
      score: 0,
      streak: 0,
      answered: false,
      selected: null,
      supportPanel: null,
      round: picked.map((question) => {
        const order = shuffle(question.choices.map((_, index) => index));
        return {
          id: question.id,
          order,
          correctChoice: order.indexOf(question.answer)
        };
      })
    };
    renderGame();
  }

  function currentRoundQuestion() {
    if (!game || !game.round.length) return null;
    const ref = game.round[game.index];
    const question = questions().find((item) => item.id === ref.id);
    return question ? { ...question, ...ref } : null;
  }

  function answerQuestion(choiceIndex) {
    if (!game || game.answered) return;
    const question = currentRoundQuestion();
    if (!question) return;
    const correct = choiceIndex === question.correctChoice;
    game.answered = true;
    game.selected = choiceIndex;
    if (correct) {
      game.streak += 1;
      game.score += 100 + game.streak * 25;
      state.stats.correct += 1;
    } else {
      game.hp -= 1;
      game.streak = 0;
      game.supportPanel = "explain";
    }
    state.stats.attempts += 1;
    state.stats.bestStreak = Math.max(state.stats.bestStreak || 0, game.streak || 0);
    const progress = questionProgress(question.id);
    state.questions[question.id] = {
      attempts: (progress.attempts || 0) + 1,
      correct: (progress.correct || 0) + (correct ? 1 : 0),
      wrong: (progress.wrong || 0) + (correct ? 0 : 1),
      last: Date.now()
    };
    if (navigator.vibrate) navigator.vibrate(correct ? 35 : [45, 30, 45]);
    saveState();
    renderGame();
  }

  function nextQuestion() {
    if (!game) return;
    if (game.hp <= 0) {
      finishRound(false);
      return;
    }
    if (game.index >= game.round.length - 1) {
      finishRound(true);
      return;
    }
    game.index += 1;
    game.answered = false;
    game.selected = null;
    game.supportPanel = null;
    renderGame();
  }

  function finishRound(won) {
    state.stats.rounds += 1;
    state.stats.wins += won ? 1 : 0;
    state.stats.xp += Math.max(0, game.score);
    game.status = won ? "won" : "lost";
    saveState();
    renderGame();
  }

  function renderGame() {
    const pool = filteredQuestions();
    if (!pool.length) {
      app.innerHTML = `<div class="empty">No game questions match this domain. Add a source or change the filter.</div>`;
      return;
    }
    if (!game) {
      app.innerHTML = `
        <section class="game-board">
          <div class="game-question">
            <div class="section-title">
              <h3>Quest Round</h3>
              <span class="pill">${pool.length} questions available</span>
            </div>
            <p class="small-muted">Answer ${ROUND_SIZE} scenario questions. You have 3 HP. Streaks earn bonus XP.</p>
            <div class="button-row">
              <button class="btn primary" data-action="start-round">Start round</button>
              <button class="btn secondary" data-view-jump="study">Warm up with cards</button>
            </div>
          </div>
        </section>
      `;
      return;
    }

    if (game.status !== "active") {
      const won = game.status === "won";
      app.innerHTML = `
        <section class="game-board">
          <div class="game-question">
            <div class="section-title">
              <h3>${won ? "Round won" : "Round ended"}</h3>
              <span class="pill">${game.score} XP this round</span>
            </div>
            <p class="small-muted">${won ? "You cleared the set. Review the weak domains and run it again." : "HP hit zero. Study the missed topics and try again."}</p>
            <div class="grid three">
              <div class="panel"><div class="stat-label">Score</div><div class="big-number">${game.score}</div></div>
              <div class="panel"><div class="stat-label">HP left</div><div class="big-number">${game.hp}</div></div>
              <div class="panel"><div class="stat-label">Total XP</div><div class="big-number">${state.stats.xp}</div></div>
            </div>
            <div class="button-row" style="margin-top:14px">
              <button class="btn primary" data-action="start-round">Play again</button>
              <button class="btn secondary" data-view-jump="study">Study cards</button>
            </div>
          </div>
        </section>
      `;
      return;
    }

    const question = currentRoundQuestion();
    const domain = domainById(question.domain);
    const support = questionSupport(question);
    const proofLinks = support.citations
      .map((citation) => citationProofHref(question, citation))
      .filter(Boolean);
    const choices = question.order.map((originalIndex, displayIndex) => {
      const classes = ["choice"];
      if (game.answered && displayIndex === question.correctChoice) classes.push("correct");
      if (game.answered && displayIndex === game.selected && displayIndex !== question.correctChoice) classes.push("wrong");
      return `
        <button class="${classes.join(" ")}" data-action="answer-question" data-choice="${displayIndex}" ${game.answered ? "disabled" : ""}>
          ${escapeHtml(question.choices[originalIndex])}
        </button>
      `;
    });
    const supportPanel = renderQuestionSupport(question, support, proofLinks);

    app.innerHTML = `
      <section class="game-board">
        <div class="game-header">
          <div class="game-stat"><span class="small-muted">HP</span><strong>${game.hp}</strong></div>
          <div class="game-stat"><span class="small-muted">Score</span><strong>${game.score}</strong></div>
          <div class="game-stat"><span class="small-muted">Streak</span><strong>${game.streak}</strong></div>
          <div class="game-stat"><span class="small-muted">Question</span><strong>${game.index + 1}/${game.round.length}</strong></div>
        </div>
        <div class="game-question">
          <div class="section-title">
            <div class="tag-row">
              <span class="pill" style="border-color:${domain.color}55;color:${domain.color}">${escapeHtml(domain.short || domain.title)}</span>
              <span class="pill">${escapeHtml(question.sourceTitle)}</span>
            </div>
          </div>
          <h3>${escapeHtml(question.prompt)}</h3>
          <div class="button-row support-tools">
            <button class="btn secondary" data-action="show-question-support" data-panel="explain">Explain it</button>
            <button class="btn secondary" data-action="show-question-support" data-panel="cite">Cite it</button>
            ${
              proofLinks.length
                ? `<a class="btn secondary" href="${escapeHtml(proofLinks[0])}" target="_blank" rel="noreferrer">Prove it</a>`
                : `<button class="btn" data-action="show-question-support" data-panel="prove">Prove it</button>`
            }
          </div>
          ${supportPanel}
          <div class="choice-grid">${choices.join("")}</div>
          ${
            game.answered
              ? `
                <div class="explanation">
                  <strong>${game.selected === question.correctChoice ? "Correct." : "Not quite."}</strong>
                  ${escapeHtml(question.explanation)}
                </div>
                <div class="button-row" style="margin-top:14px">
                  <button class="btn primary" data-action="next-question">${game.index >= game.round.length - 1 || game.hp <= 0 ? "Finish round" : "Next question"}</button>
                </div>
              `
              : ""
          }
        </div>
      </section>
    `;
  }

  function renderQuestionSupport(question, support, proofLinks) {
    if (!game || !game.supportPanel) return "";
    if (game.supportPanel === "explain") {
      return `
        <div class="support-panel">
          <div class="section-title">
            <h3>Explain it</h3>
            <span class="pill">Study aid</span>
          </div>
          <p><strong>Hint:</strong> ${escapeHtml(support.hint)}</p>
          <p>${escapeHtml(support.explain)}</p>
        </div>
      `;
    }
    if (game.supportPanel === "cite") {
      const citations = support.citations.length
        ? support.citations
            .map((citation) => {
              const href = citationProofHref(question, citation);
              return `
                <li>
                  <strong>Page ${escapeHtml(citation.page)}, ${escapeHtml(citation.section)}</strong>
                  <div class="small-muted">${escapeHtml(citation.locator || "")}</div>
                  <div>${escapeHtml(citation.support || "")}</div>
                  ${
                    href
                      ? `<a class="source-link" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">Open PDF at page ${escapeHtml(citation.page)}</a>`
                      : ""
                  }
                </li>
              `;
            })
            .join("")
        : "<li>No citation metadata is available for this question yet.</li>";
      return `
        <div class="support-panel">
          <div class="section-title">
            <h3>Cite it</h3>
            <span class="pill">Source-backed</span>
          </div>
          <ul class="citation-list">${citations}</ul>
        </div>
      `;
    }
    if (game.supportPanel === "prove") {
      const source = sourceById(question.sourceId);
      return `
        <div class="support-panel">
          <div class="section-title">
            <h3>Prove it</h3>
            <span class="pill">PDF link</span>
          </div>
          ${
            proofLinks.length
              ? `<p><a class="source-link" href="${escapeHtml(proofLinks[0])}" target="_blank" rel="noreferrer">Open the source PDF citation.</a></p>`
              : `
                <p>The app has page-level citations, but this deployed copy does not publicly host the PDF.</p>
                <p class="small-muted">Local source path: ${escapeHtml((source && source.localSourcePath) || "not configured")}</p>
                <p class="small-muted">To enable this button later, host the PDF in an access-controlled location and set <code>sourcePath</code> for this source.</p>
              `
          }
        </div>
      `;
    }
    return "";
  }

  function renderProgress() {
    const totalCards = cards().length;
    const mastered = cards().filter(isMastered).length;
    const totalQuestions = questions().length;
    const accuracy = pct(state.stats.correct || 0, state.stats.attempts || 0);
    const domainRows = domains()
      .map((domain) => {
        const qs = questions().filter((question) => question.domain === domain.id);
        const attempts = qs.reduce((sum, question) => sum + (questionProgress(question.id).attempts || 0), 0);
        const correct = qs.reduce((sum, question) => sum + (questionProgress(question.id).correct || 0), 0);
        const qAcc = pct(correct, attempts);
        const coverage = coverageForDomain(domain.id);
        return `
          <div class="panel">
            <div class="domain-title-line">
              <span class="domain-dot" style="background:${domain.color}"></span>
              <h3>${escapeHtml(domain.short || domain.title)}</h3>
            </div>
            <div class="meter" style="margin-top:12px"><span style="width:${coverage}%;background:${domain.color}"></span></div>
            <div class="tag-row" style="margin-top:10px">
              <span class="pill">${coverage}% cards mastered</span>
              <span class="pill">${qAcc}% game accuracy</span>
              <span class="pill">${attempts} attempts</span>
            </div>
          </div>
        `;
      })
      .join("");

    app.innerHTML = `
      <div class="grid four"></div>
      <section class="grid three">
        <div class="panel"><div class="stat-label">Mastered cards</div><div class="big-number">${mastered}/${totalCards}</div></div>
        <div class="panel"><div class="stat-label">Game accuracy</div><div class="big-number">${accuracy}%</div></div>
        <div class="panel"><div class="stat-label">Total XP</div><div class="big-number">${state.stats.xp || 0}</div></div>
      </section>
      <section class="grid three" style="margin-top:14px">
        <div class="panel"><div class="stat-label">Rounds won</div><div class="big-number">${state.stats.wins || 0}/${state.stats.rounds || 0}</div></div>
        <div class="panel"><div class="stat-label">Best streak</div><div class="big-number">${state.stats.bestStreak || 0}</div></div>
        <div class="panel"><div class="stat-label">Question bank</div><div class="big-number">${totalQuestions}</div></div>
      </section>
      <section class="grid two" style="margin-top:14px">${domainRows}</section>
      <section class="panel" style="margin-top:14px">
        <div class="section-title"><h3>Maintenance</h3></div>
        <div class="button-row">
          <button class="btn danger" data-action="reset-progress">Reset progress on this device</button>
        </div>
      </section>
    `;
  }

  function sourceTemplate() {
    return {
      id: "my-new-source-v1",
      title: "My New Exam Source",
      label: "New Source",
      sourceType: "notes",
      sourcePath: "",
      version: "1.0",
      updated: new Date().toISOString().slice(0, 10),
      summary: "Short description of where these cards/questions came from.",
      domains: [
        { id: "custom", title: "Custom Domain", weight: 100, short: "Custom", color: "#2f6fa3", focus: "What this domain covers." }
      ],
      scenarios: [
        { id: "custom-scenario", title: "Custom Scenario", domains: ["custom"], brief: "Short scenario description." }
      ],
      prep: ["Practice this source daily."],
      inScope: ["topic one"],
      outOfScope: ["topic not tested"],
      questionSupport: {
        "custom-q-1": {
          hint: "What concept is this testing?",
          explain: "Write a short teaching explanation here.",
          citations: [
            {
              page: 1,
              section: "Section name",
              locator: "Heading or paragraph location",
              support: "Short paraphrased reason from the source."
            }
          ]
        }
      },
      cards: [
        {
          id: "custom-card-1",
          domain: "custom",
          front: "Question side of the card?",
          back: "Answer side of the card.",
          tags: ["tag"]
        }
      ],
      questions: [
        {
          id: "custom-q-1",
          domain: "custom",
          scenario: "custom-scenario",
          prompt: "Multiple choice question?",
          choices: ["Correct answer", "Distractor", "Distractor", "Distractor"],
          answer: 0,
          explanation: "Why the correct answer is right."
        }
      ]
    };
  }

  function renderSources() {
    const sourceRows = sources()
      .map((source) => {
        const imported = importedSources.some((item) => item.id === source.id);
        return `
          <div class="source-item">
            <div>
              <strong>${escapeHtml(source.label || source.title)}</strong>
              <div class="small-muted">${escapeHtml(source.id)} ${imported ? "(imported on this device)" : "(built in)"}</div>
              <div class="tag-row" style="margin-top:8px">
                <span class="pill">${(source.cards || []).length} cards</span>
                <span class="pill">${(source.questions || []).length} questions</span>
                <span class="pill">${(source.domains || []).length} domains</span>
              </div>
            </div>
            ${imported ? `<button class="btn danger" data-action="remove-source" data-source-id="${escapeHtml(source.id)}">Remove</button>` : ""}
          </div>
        `;
      })
      .join("");

    app.innerHTML = `
      <section class="grid two">
        <div class="panel">
          <div class="section-title"><h3>Loaded Sources</h3></div>
          <div class="stack">${sourceRows}</div>
        </div>
        <div class="panel">
          <div class="section-title"><h3>Add New Source Later</h3></div>
          <p class="small-muted">Paste a source JSON object here. It will be saved in this browser's local storage. To make it part of the hosted app for every device, add it to <code>data/sources.js</code> and redeploy.</p>
          <textarea id="sourceImport" spellcheck="false" placeholder="Paste source JSON here"></textarea>
          <div class="button-row" style="margin-top:10px">
            <button class="btn primary" data-action="import-source">Import source JSON</button>
            <button class="btn secondary" data-action="fill-template">Show template</button>
            <button class="btn" data-action="export-imported">Show imported JSON</button>
          </div>
        </div>
      </section>
      <section class="panel" style="margin-top:14px">
        <div class="section-title"><h3>Source Contract</h3></div>
        <div class="notice">
          Required fields are <code>id</code>, <code>title</code>, <code>domains</code>, <code>cards</code>, and <code>questions</code>.
          Card IDs and question IDs should be stable. Use unique domain IDs if the new source has different exam categories.
        </div>
      </section>
    `;
  }

  function validateSource(source) {
    if (!source || typeof source !== "object") throw new Error("Source must be a JSON object.");
    if (!source.id || !source.title) throw new Error("Source needs id and title.");
    if (!Array.isArray(source.domains) || !source.domains.length) throw new Error("Source needs at least one domain.");
    if (!Array.isArray(source.cards)) throw new Error("Source cards must be an array.");
    if (!Array.isArray(source.questions)) throw new Error("Source questions must be an array.");
    const existingIds = new Set(sources().map((item) => item.id));
    if (existingIds.has(source.id)) throw new Error("A source with that id is already loaded.");
    for (const question of source.questions) {
      if (!Array.isArray(question.choices) || question.choices.length < 2) {
        throw new Error(`Question ${question.id || "(missing id)"} needs at least two choices.`);
      }
      if (typeof question.answer !== "number") {
        throw new Error(`Question ${question.id || "(missing id)"} needs a numeric answer index.`);
      }
    }
    return true;
  }

  function importSourceFromText() {
    const textarea = document.getElementById("sourceImport");
    try {
      const source = JSON.parse(textarea.value);
      validateSource(source);
      importedSources = [...importedSources, source];
      saveImportedSources(importedSources);
      renderDomainOptions();
      alert("Source imported on this device.");
      renderSources();
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  }

  function render() {
    updateCoverage();
    if (currentView === "guide") renderGuide();
    if (currentView === "study") renderStudy();
    if (currentView === "game") renderGame();
    if (currentView === "progress") renderProgress();
    if (currentView === "sources") renderSources();
  }

  function handleAction(target) {
    const action = target.dataset.action;
    if (!action) return false;
    if (action === "reveal-card") {
      cardRevealed = true;
      renderStudy();
    }
    if (action === "rate-card") {
      rateCard(currentCardId, target.dataset.rating);
    }
    if (action === "skip-card") {
      const deck = filteredCards();
      if (deck.length) {
        const index = Math.max(0, deck.findIndex((card) => card.id === currentCardId));
        currentCardId = deck[(index + 1) % deck.length].id;
      }
      cardRevealed = false;
      renderStudy();
    }
    if (action === "shuffle-card") {
      const deck = filteredCards();
      const next = shuffle(deck.filter((card) => card.id !== currentCardId))[0] || deck[0];
      currentCardId = next && next.id;
      cardRevealed = false;
      renderStudy();
    }
    if (action === "start-round") startRound();
    if (action === "answer-question") answerQuestion(Number(target.dataset.choice));
    if (action === "next-question") nextQuestion();
    if (action === "show-question-support") {
      if (game) {
        game.supportPanel = target.dataset.panel;
        renderGame();
      }
    }
    if (action === "reset-progress") {
      if (confirm("Reset cards, game stats, and question progress on this device?")) {
        state = { cards: {}, questions: {}, stats: { xp: 0, rounds: 0, wins: 0, bestStreak: 0, correct: 0, attempts: 0 } };
        saveState();
        renderProgress();
      }
    }
    if (action === "fill-template") {
      document.getElementById("sourceImport").value = JSON.stringify(sourceTemplate(), null, 2);
    }
    if (action === "export-imported") {
      document.getElementById("sourceImport").value = JSON.stringify(importedSources, null, 2);
    }
    if (action === "import-source") importSourceFromText();
    if (action === "remove-source") {
      const id = target.dataset.sourceId;
      importedSources = importedSources.filter((source) => source.id !== id);
      saveImportedSources(importedSources);
      renderDomainOptions();
      renderSources();
    }
    if (action === "toggle-theme") {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    }
    return true;
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.dataset.view) {
      setView(target.dataset.view);
      return;
    }
    if (target.dataset.viewJump) {
      setView(target.dataset.viewJump);
      return;
    }
    handleAction(target);
  });

  domainFilter.addEventListener("change", () => {
    selectedDomain = domainFilter.value;
    currentCardId = null;
    cardRevealed = false;
    game = null;
    render();
  });

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  renderDomainOptions();
  applyTheme(currentTheme());
  updateCoverage();
  renderGuide();
  registerServiceWorker();
})();
