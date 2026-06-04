/**
 * Ranked lookup over Robinson (1914) English–Hausa dictionary index.
 * Loads static/data/robinson-en-ha-index.json (see ATTRIBUTION.md).
 */
(function (global) {
  const INDEX_URL = 'data/robinson-en-ha-index.json';
  let index = null;
  let loadPromise = null;

  function tokenize(text) {
    return String(text || '')
      .toLowerCase()
      .split(/[^a-z0-9'ɓɗƙʼ]+/i)
      .filter((t) => t.length > 1);
  }

  function scoreEntry(entry, query, tokens) {
    const q = query.trim().toLowerCase();
    if (!q) return 0;
    const en = entry.en || '';
    const gloss = (entry.g || '').toLowerCase();
    let score = 0;
    if (en === q) score += 120;
    else if (en.startsWith(q)) score += 70;
    else if (en.includes(q)) score += 35;
    for (const t of tokens) {
      if (en === t) score += 25;
      else if (en.startsWith(t)) score += 12;
      else if (gloss.includes(t)) score += 4;
    }
    return score;
  }

  function ensureLoaded() {
    if (index) return Promise.resolve(index);
    if (!loadPromise) {
      loadPromise = fetch(INDEX_URL)
        .then((r) => {
          if (!r.ok) throw new Error('Robinson index failed to load');
          return r.json();
        })
        .then((data) => {
          index = data;
          return data;
        });
    }
    return loadPromise;
  }

  function search(query, limit = 50) {
    return ensureLoaded().then((data) => {
      const q = String(query || '').trim();
      if (!q) return data.slice(0, limit);
      const tokens = tokenize(q);
      return data
        .map((entry) => ({ entry, score: scoreEntry(entry, q, tokens) }))
        .filter((row) => row.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((row) => row.entry);
    });
  }

  global.RobinsonLookup = {
    ensureLoaded,
    search,
    getCount: () => (index ? index.length : 0),
  };
})(typeof window !== 'undefined' ? window : globalThis);
