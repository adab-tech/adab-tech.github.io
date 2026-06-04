/**
 * Cal.com inline booking (official embed) + external link wiring
 */
(function () {
  'use strict';

  const cfg = window.ADAMU_SITE || {};
  const bookingUrl = cfg.bookingUrl || 'https://cal.com/adamu-abubakar/intro';
  const calLink = cfg.bookingCalLink || 'adamu-abubakar/intro';
  const calNamespace = cfg.calNamespace || 'intro';
  const calMountId = cfg.calMountId || 'my-cal-inline-intro';

  function wireBookingLinks() {
    document.querySelectorAll('[data-booking-url]').forEach((el) => {
      el.setAttribute('href', bookingUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }

  function loadCalEmbed() {
    const mount = document.getElementById(calMountId);
    if (!mount) return;

    (function (C, A, L) {
      const p = function (a, ar) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    Cal('init', calNamespace, { origin: 'https://app.cal.com' });

    Cal.ns[calNamespace]('inline', {
      elementOrSelector: `#${calMountId}`,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
      calLink,
    });

    Cal.ns[calNamespace]('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
    });

    const fallback = document.querySelector('.booking-fallback');
    if (fallback) fallback.classList.add('is-hidden');
  }

  function initCalEmbed() {
    if (!calLink) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (window.Cal && window.Cal.loaded) {
      loadCalEmbed();
      return;
    }

    loadCalEmbed();
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
