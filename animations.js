/**
 * Portfolio motion features — adamu.tech
 * Polished portfolio + language/AI identity + maximum flair packs
 */
(function () {
  'use strict';

  const CODE_SNIPPETS = [
    `<span class="comment"># African language NLP</span>\n<span class="keyword">def</span> <span class="function">analyze_hausa</span>(text):\n    <span class="keyword">return</span> tokenize(text)`,
    `<span class="comment"># Hausa → English routing</span>\nresult = <span class="function">translate</span>(\n    text=<span class="string">"Barka da zuwa"</span>,\n    target=<span class="string">"en"</span>\n)`,
    `<span class="comment"># Robinson lexicon lookup</span>\nentry = <span class="function">lookup</span>(<span class="string">"fever"</span>, source=<span class="string">"robinson_1914"</span>)`,
  ];

  const GLYPHS = ['ɓ', 'ɗ', 'ƙ', 'ƴ', 'Sannu', 'Barka', 'Hausa', 'NLP', 'AI'];

  let reducedMotion = false;

  function initReducedMotion() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      reducedMotion = mq.matches;
      document.documentElement.classList.toggle('reduce-motion', reducedMotion);
    };
    apply();
    mq.addEventListener('change', apply);
  }

  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = `${pct}%`;
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  function initNavIndicator() {
    const group = document.getElementById('navLinksGroup');
    const indicator = document.getElementById('navIndicator');
    const links = group ? Array.from(group.querySelectorAll('.nav-link')) : [];
    if (!group || !indicator || !links.length) return;

    const moveTo = (link) => {
      if (!link || window.matchMedia('(max-width: 840px)').matches) return;
      const parentRect = group.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      indicator.style.left = `${rect.left - parentRect.left}px`;
      indicator.style.width = `${rect.width}px`;
    };

    const syncFromCurrent = () => {
      const active = links.find((l) => l.getAttribute('aria-current') === 'page') || links[0];
      moveTo(active);
    };

    links.forEach((link) => {
      link.addEventListener('mouseenter', () => moveTo(link));
      link.addEventListener('focus', () => moveTo(link));
    });
    group.addEventListener('mouseleave', syncFromCurrent);

    const observer = new MutationObserver(syncFromCurrent);
    links.forEach((link) => {
      observer.observe(link, { attributes: true, attributeFilter: ['aria-current'] });
    });

    window.addEventListener('resize', syncFromCurrent);
    syncFromCurrent();
  }

  function initThemeMorph() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (reducedMotion) return;
      btn.classList.add('is-spinning');
      setTimeout(() => btn.classList.remove('is-spinning'), 450);
    });
  }

  function initTypewriter() {
    const el = document.getElementById('heroTitleTyped');
    const cursor = document.getElementById('heroTitleCursor');
    if (!el) return;

    const part1 = 'Designing AI that speaks ';
    const part2 = 'African languages';
    const full = part1 + part2;

    if (reducedMotion) {
      el.innerHTML = `${part1}<span class="highlight">${part2}</span>`;
      cursor?.classList.add('is-done');
      return;
    }

    let i = 0;
    const speed = 42;

    function tick() {
      const slice = full.slice(0, i);
      if (slice.length <= part1.length) {
        el.innerHTML = slice;
      } else {
        el.innerHTML = `${part1}<span class="highlight">${slice.slice(part1.length)}</span>`;
      }
      i += 1;
      if (i <= full.length) {
        setTimeout(tick, speed);
      } else {
        cursor?.classList.add('is-done');
      }
    }

    tick();
  }

  function initParallax() {
    if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    const items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          items.forEach((node) => {
            const speed = parseFloat(node.getAttribute('data-parallax') || '0.1');
            node.style.transform = `translate3d(0, ${y * speed}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initHeroGlyphs() {
    const root = document.getElementById('heroGlyphs');
    if (!root || reducedMotion) return;

    const count = 10;
    for (let i = 0; i < count; i += 1) {
      const span = document.createElement('span');
      span.className = 'hero-glyph';
      span.textContent = GLYPHS[i % GLYPHS.length];
      span.style.left = `${8 + Math.random() * 84}%`;
      span.style.top = `${6 + Math.random() * 78}%`;
      span.style.fontSize = `${0.85 + Math.random() * 1.1}rem`;
      span.style.animationDelay = `${Math.random() * 8}s`;
      span.style.animationDuration = `${12 + Math.random() * 8}s`;
      root.appendChild(span);
    }
  }

  function initCodeRotation() {
    const el = document.getElementById('heroCodeSnippet');
    if (!el) return;

    let idx = 0;
    el.innerHTML = CODE_SNIPPETS[0];

    if (reducedMotion) return;

    setInterval(() => {
      el.classList.add('is-fading');
      setTimeout(() => {
        idx = (idx + 1) % CODE_SNIPPETS.length;
        el.innerHTML = CODE_SNIPPETS[idx];
        el.classList.remove('is-fading');
      }, 320);
    }, 4200);
  }

  function animateCount(el, target, suffix, duration = 1400) {
    const start = performance.now();
    const from = 0;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      el.textContent = `${value}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initCountUps() {
    if (reducedMotion) {
      document.querySelectorAll('[data-count]').forEach((el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = `${target}${suffix}`;
      });
      return;
    }

    const run = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (Number.isNaN(target)) return;
      animateCount(el, target, suffix);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.counted) return;
          el.dataset.counted = 'true';
          run(el);
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    document.querySelectorAll('[data-count]').forEach((el) => observer.observe(el));
  }

  function initTimeline() {
    const timeline = document.getElementById('journeyTimeline');
    if (!timeline) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add('is-visible');
            observer.unobserve(timeline);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(timeline);
    if (reducedMotion) timeline.classList.add('is-visible');
  }

  function initAfricaStroke() {
    const svg = document.querySelector('.africa-map');
    if (!svg) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            svg.classList.add('is-drawn');
            observer.unobserve(svg);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(svg);
    if (reducedMotion) svg.classList.add('is-drawn');
  }

  function initCardTilt() {
    if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = (-y * 7).toFixed(2);
        const tiltY = (x * 7).toFixed(2);
        card.classList.add('is-tilting');
        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  function initFeaturedSpotlight() {
    if (reducedMotion) return;
    document.querySelectorAll('.project-card--featured').forEach((card) => {
      card.addEventListener('mouseenter', () => card.classList.add('is-spotlight'));
      card.addEventListener('mouseleave', () => card.classList.remove('is-spotlight'));
    });
  }

  function init() {
    initReducedMotion();
    initScrollProgress();
    initNavIndicator();
    initThemeMorph();
    initTypewriter();
    initParallax();
    initHeroGlyphs();
    initCodeRotation();
    initCountUps();
    initTimeline();
    initAfricaStroke();
    initCardTilt();
    initFeaturedSpotlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
