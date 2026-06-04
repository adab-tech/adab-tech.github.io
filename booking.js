/**
 * Booking calendar (Cal.com) + link wiring from site-config.js
 */
(function () {
  'use strict';

  const cfg = window.ADAMU_SITE || {};
  const bookingUrl = cfg.bookingUrl || 'https://cal.com/';
  const calLink = cfg.bookingCalLink || '';

  function wireBookingLinks() {
    document.querySelectorAll('[data-booking-url]').forEach((el) => {
      el.setAttribute('href', bookingUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }

  function initCalEmbed() {
    const host = document.getElementById('calEmbedHost');
    if (!host || !calLink) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    script.onload = () => {
      const fallback = host.querySelector('.booking-fallback');
      if (fallback) fallback.remove();

      const inline = document.createElement('cal-inline');
      inline.setAttribute('calLink', calLink);
      inline.style.width = '100%';
      inline.style.minHeight = '520px';
      inline.style.display = 'block';
      host.appendChild(inline);
    };
    script.onerror = () => {
      /* fallback link remains */
    };
    document.body.appendChild(script);
  }

  function init() {
    wireBookingLinks();
    initCalEmbed();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
