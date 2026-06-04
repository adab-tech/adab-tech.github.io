(function () {
  const DATA = window.HAUSA_EXPLORER_DATA || {};
  const LESSONS = window.HAUSA_LESSONS || [];
  const vocabList = DATA.vocabularyList || [];
  const STORAGE_KEY = 'hausa_explorer_progress_v2';

  const state = {
    view: 'home',
    dictQuery: '',
    dictSource: 'learner',
    robinsonResults: [],
    robinsonReady: false,
    robinsonCount: 0,
    lessonId: null,
    quiz: { index: 0, score: 0, items: [], answered: false },
    theme: localStorage.getItem('hx_theme') || 'light',
  };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => {
    const d = document.createElement('div');
    d.textContent = s ?? '';
    return d.innerHTML;
  };

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveProgress(patch) {
    const next = { ...loadProgress(), ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function lessonProgress(id) {
    const p = loadProgress();
    return p.lessons?.[id] || 0;
  }

  function markLesson(id, pct) {
    const p = loadProgress();
    const lessons = { ...(p.lessons || {}), [id]: Math.max(p.lessons?.[id] || 0, pct) };
    saveProgress({ lessons, streak: (p.streak || 0) + 1, lastVisit: new Date().toISOString() });
  }

  function setView(view) {
    state.view = view;
    document.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.nav === view);
    });
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildQuiz() {
    const pool = [...vocabList].sort(() => Math.random() - 0.5).slice(0, 5);
    state.quiz = {
      index: 0,
      score: 0,
      answered: false,
      items: pool.map((entry) => {
        const others = vocabList
          .filter((v) => v.word !== entry.word)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => v.translation);
        const options = [...others, entry.translation].sort(() => Math.random() - 0.5);
        return { word: entry.word, answer: entry.translation, options };
      }),
    };
  }

  function renderHome() {
    const p = loadProgress();
    const streak = p.streak || 0;
    const mastered = Object.values(p.lessons || {}).filter((v) => v >= 100).length;

    return `
      <section class="hx-panel hx-hero">
        <div>
          <p class="hx-tag">Hausa · PWA · 2026 workflow</p>
          <h2 style="font-family:var(--hx-heading);font-size:clamp(1.6rem,4vw,2.4rem);margin:0 0 0.5rem;">
            Learn Hausa with guided paths, smart review, and culture context
          </h2>
          <p style="color:var(--hx-muted);max-width:52ch;">
            Dictionary, lessons, quizzes, and exercises — all offline in your browser. Progress saves automatically.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1rem;">
            <button class="hx-btn primary" data-action="lessons">Start a lesson</button>
            <button class="hx-btn" data-action="dictionary">Open dictionary</button>
            <button class="hx-btn ghost" data-action="quiz">Quick quiz</button>
          </div>
        </div>
        <div class="hx-stat-grid">
          <div class="hx-stat"><strong>${vocabList.length}</strong><span>Learner entries</span></div>
          <div class="hx-stat"><strong>${state.robinsonCount || '8k+'}</strong><span>Robinson (1914) EN→HA</span></div>
          <div class="hx-stat"><strong>${streak}</strong><span>Study sessions</span></div>
          <div class="hx-stat"><strong>${mastered}</strong><span>Paths completed</span></div>
          <div class="hx-stat"><strong>${(DATA.culturalFacts || []).length}</strong><span>Culture notes</span></div>
        </div>
      </section>
      <section class="hx-panel" style="margin-top:1rem;">
        <h3 style="margin:0 0 0.75rem;font-family:var(--hx-heading);">Learning paths</h3>
        <div class="hx-lesson-grid">${renderLessonCards()}</div>
      </section>`;
  }

  function renderLessonCards() {
    return LESSONS.map((lesson) => {
      const pct = lessonProgress(lesson.id);
      return `
        <article class="hx-lesson-card">
          <span class="hx-tag">${lesson.level}</span>
          <h3>${esc(lesson.title)}</h3>
          <p style="margin:0;color:var(--hx-muted);font-size:0.9rem;">${lesson.duration} · ${lesson.words.length} focus words</p>
          <div class="hx-progress"><span style="width:${pct}%"></span></div>
          <button class="hx-btn primary" data-lesson="${lesson.id}">${pct >= 100 ? 'Review' : 'Continue'}</button>
        </article>`;
    }).join('');
  }

  function renderLessonDetail() {
    const lesson = LESSONS.find((l) => l.id === state.lessonId);
    if (!lesson) return '<p>Lesson not found.</p>';
    const cards = lesson.words.map((w) => {
      const entry = vocabList.find((v) => v.word === w) || { word: w, translation: '—', example: '' };
      return `
        <div class="hx-dict-item">
          <strong>${esc(entry.word)}</strong>
          <div>${esc(entry.translation)}</div>
          <small style="color:var(--hx-muted);">${esc(entry.example)}</small>
        </div>`;
    }).join('');

    return `
      <section class="hx-panel">
        <button class="hx-btn ghost" data-action="home">← Back</button>
        <h2 style="font-family:var(--hx-heading);">${esc(lesson.title)}</h2>
        <p style="color:var(--hx-muted);">Study the cards, then mark complete.</p>
        <div class="hx-dict-list" style="max-height:none;">${cards}</div>
        <button class="hx-btn primary" data-complete-lesson="${lesson.id}" style="margin-top:1rem;">Mark lesson complete</button>
      </section>`;
  }

  function renderDictionary() {
    const tabs = `
      <div class="hx-dict-tabs" role="tablist">
        <button type="button" class="hx-btn ${state.dictSource === 'learner' ? 'primary' : 'ghost'}" data-dict-source="learner">Learner</button>
        <button type="button" class="hx-btn ${state.dictSource === 'robinson' ? 'primary' : 'ghost'}" data-dict-source="robinson">Robinson 1914</button>
      </div>`;

    if (state.dictSource === 'robinson') {
      const loading = !state.robinsonReady;
      const items = state.robinsonResults;
      return `
        <section class="hx-panel">
          <h2 style="font-family:var(--hx-heading);margin-top:0;">Dictionary</h2>
          ${tabs}
          <p style="color:var(--hx-muted);font-size:0.9rem;">
            English–Hausa volume by <strong>Charles H. Robinson</strong> (Cambridge, 1914).
            Ranked lexical search over ${state.robinsonCount || '8,000+'} OCR-parsed headwords.
          </p>
          <input class="hx-search" id="dict-search" placeholder="Search English headword or gloss…" value="${esc(state.dictQuery)}" />
          <div class="hx-dict-list">
            ${loading ? '<p>Loading Robinson index…</p>' : items.map((v) => `
              <div class="hx-dict-item">
                <strong>${esc(v.en)}</strong>${v.p ? ` <span class="hx-tag">${esc(v.p)}</span>` : ''}
                <div style="margin-top:0.35rem;">${esc(v.g)}</div>
              </div>`).join('') || '<p>No matches. Try a shorter English word.</p>'}
          </div>
          <p class="hx-credit" style="margin-top:1rem;font-size:0.8rem;color:var(--hx-muted);">
            Source: Robinson, <em>Dictionary of the Hausa Language</em>, Vol. II (1914), via
            <a href="https://archive.org/details/dictionaryofhaus02robiuoft" target="_blank" rel="noopener">Internet Archive</a> ·
            <a href="https://ia600607.us.archive.org/18/items/dictionaryofhaus02robiuoft/dictionaryofhaus02robiuoft.pdf" target="_blank" rel="noopener">PDF</a>
          </p>
        </section>`;
    }

    const q = state.dictQuery.trim().toLowerCase();
    const items = vocabList.filter((v) => {
      if (!q) return true;
      return v.word.toLowerCase().includes(q) || (v.translation || '').toLowerCase().includes(q);
    }).slice(0, 80);

    return `
      <section class="hx-panel">
        <h2 style="font-family:var(--hx-heading);margin-top:0;">Dictionary</h2>
        ${tabs}
        <input class="hx-search" id="dict-search" placeholder="Search Hausa or English…" value="${esc(state.dictQuery)}" />
        <div class="hx-dict-list">
          ${items.map((v) => `
            <div class="hx-dict-item">
              <strong>${esc(v.word)}</strong> — ${esc(v.translation)}
              <div style="font-size:0.85rem;color:var(--hx-muted);margin-top:0.25rem;">${esc(v.example)}</div>
            </div>`).join('') || '<p>No matches.</p>'}
        </div>
      </section>`;
  }

  function refreshRobinsonSearch() {
    if (!global.RobinsonLookup) return;
    RobinsonLookup.search(state.dictQuery, 50).then((results) => {
      state.robinsonResults = results;
      state.robinsonReady = true;
      if (state.view === 'dictionary' && state.dictSource === 'robinson') render();
    });
  }

  function renderCulture() {
    const facts = (DATA.culturalFacts || []).map((f) => `<li>${esc(f)}</li>`).join('');
    const proverbs = (DATA.proverbs || []).map((p) => `
      <blockquote class="hx-dict-item">
        <strong>${esc(p.proverb)}</strong>
        <div>${esc(p.meaning)}</div>
        <small style="color:var(--hx-muted);">${esc(p.literal_translation)}</small>
      </blockquote>`).join('');

    return `
      <section class="hx-panel">
        <h2 style="font-family:var(--hx-heading);margin-top:0;">Culture & proverbs</h2>
        <ul>${facts}</ul>
        <h3 style="font-family:var(--hx-heading);">Proverbs</h3>
        ${proverbs}
      </section>`;
  }

  function renderQuiz() {
    if (!state.quiz.items.length) buildQuiz();
    const item = state.quiz.items[state.quiz.index];
    if (!item) {
      return `<section class="hx-panel"><h2>Quiz complete</h2><p>Score: ${state.quiz.score} / ${state.quiz.items.length}</p><button class="hx-btn primary" data-action="quiz">Play again</button></section>`;
    }

    return `
      <section class="hx-panel">
        <h2 style="font-family:var(--hx-heading);margin-top:0;">Quiz</h2>
        <p>Question ${state.quiz.index + 1} of ${state.quiz.items.length} · Score ${state.quiz.score}</p>
        <p style="font-size:1.25rem;font-weight:700;">What does <span style="color:var(--hx-teal);">${esc(item.word)}</span> mean?</p>
        <div class="hx-quiz-options">
          ${item.options.map((opt) => `<button type="button" data-quiz-opt="${esc(opt)}">${esc(opt)}</button>`).join('')}
        </div>
      </section>`;
  }

  function renderPractice() {
    const sentences = DATA.everydaySentences || [];
    return `
      <section class="hx-panel">
        <h2 style="font-family:var(--hx-heading);margin-top:0;">Daily practice</h2>
        <p style="color:var(--hx-muted);">Read aloud and translate these common sentences.</p>
        <div class="hx-dict-list" style="max-height:none;">
          ${sentences.map((s) => `
            <div class="hx-dict-item">
              <strong>${esc(s.hausa)}</strong>
              <div>${esc(s.english)}</div>
            </div>`).join('')}
        </div>
      </section>`;
  }

  function render() {
    const root = $('hx-app');
    if (!root) return;
    let html = '';
    if (state.view === 'home') html = renderHome();
    else if (state.view === 'lessons') html = state.lessonId ? renderLessonDetail() : `<section class="hx-panel"><h2>Lessons</h2><div class="hx-lesson-grid">${renderLessonCards()}</div></section>`;
    else if (state.view === 'dictionary') html = renderDictionary();
    else if (state.view === 'culture') html = renderCulture();
    else if (state.view === 'quiz') html = renderQuiz();
    else if (state.view === 'practice') html = renderPractice();
    root.innerHTML = html;
    bindRootEvents();
  }

  function bindRootEvents() {
    document.querySelectorAll('[data-action]').forEach((el) => {
      el.addEventListener('click', () => {
        const action = el.dataset.action;
        if (action === 'quiz') buildQuiz();
        if (action === 'lessons') state.lessonId = null;
        setView(action);
      });
    });
    document.querySelectorAll('[data-lesson]').forEach((el) => {
      el.addEventListener('click', () => {
        state.lessonId = el.dataset.lesson;
        setView('lessons');
      });
    });
    document.querySelectorAll('[data-complete-lesson]').forEach((el) => {
      el.addEventListener('click', () => {
        markLesson(el.dataset.completeLesson, 100);
        state.lessonId = null;
        setView('lessons');
      });
    });
    document.querySelectorAll('[data-quiz-opt]').forEach((el) => {
      el.addEventListener('click', () => {
        if (state.quiz.answered) return;
        const item = state.quiz.items[state.quiz.index];
        const correct = el.dataset.quizOpt === item.answer;
        if (correct) state.quiz.score += 1;
        state.quiz.answered = true;
        el.classList.add(correct ? 'correct' : 'wrong');
        setTimeout(() => {
          state.quiz.index += 1;
          state.quiz.answered = false;
          render();
        }, 700);
      });
    });
    document.querySelectorAll('[data-dict-source]').forEach((el) => {
      el.addEventListener('click', () => {
        state.dictSource = el.dataset.dictSource;
        if (state.dictSource === 'robinson') refreshRobinsonSearch();
        render();
      });
    });

    const search = $('dict-search');
    if (search) {
      search.addEventListener('input', (e) => {
        state.dictQuery = e.target.value;
        if (state.dictSource === 'robinson') {
          refreshRobinsonSearch();
        } else {
          render();
        }
        const again = $('dict-search');
        if (again) {
          again.focus();
          again.selectionStart = again.selectionEnd = again.value.length;
        }
      });
    }
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const toggle = $('hx-theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('hx_theme', state.theme);
      });
    }
  }

  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.nav === 'quiz') buildQuiz();
      state.lessonId = null;
      setView(btn.dataset.nav);
    });
  });

  initTheme();
  if (global.RobinsonLookup) {
    RobinsonLookup.ensureLoaded().then(() => {
      state.robinsonCount = RobinsonLookup.getCount();
      refreshRobinsonSearch();
      if (state.view === 'home') render();
    });
  }
  render();
})();
