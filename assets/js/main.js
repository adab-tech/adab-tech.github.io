/**
 * Main JavaScript for adamu.tech website
 * Handles theme toggle, smooth scrolling, animations, and interactive features
 */

(function() {
  'use strict';

  // Theme Toggle Functionality
  const initThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    updateThemeToggleIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      const theme = isDark ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      updateThemeToggleIcon(theme);
    });
  };

  const updateThemeToggleIcon = (theme) => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('svg');
    if (theme === 'dark') {
      icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    } else {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    }
  };

  // Sticky Header on Scroll
  const initStickyHeader = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  };

  // Smooth Scroll for Anchor Links
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
  };

  // Scroll-triggered Animations using Intersection Observer
  const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.home-section').forEach(section => {
      section.classList.add('fade-in-section');
      observer.observe(section);
    });

    // Observe service cards if they exist
    document.querySelectorAll('.service-card').forEach(card => {
      card.classList.add('fade-in-section');
      observer.observe(card);
    });
  };

  // Button Ripple Effect Enhancement
  const initButtonEffects = () => {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-3px)';
      });

      button.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0)';
      });
    });
  };

  // Project Card Tilt Effect (subtle)
  const initCardEffects = () => {
    const cards = document.querySelectorAll('.project-card, .service-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
    });
  };

  // Loading Animation
  const initLoadingAnimation = () => {
    document.body.classList.add('loaded');
  };

  // Initialize all features when DOM is ready
  const init = () => {
    initThemeToggle();
    initStickyHeader();
    initSmoothScroll();
    initScrollAnimations();
    initButtonEffects();
    initCardEffects();
    initLoadingAnimation();
  };

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Keyboard accessibility improvements
  document.addEventListener('keydown', (e) => {
    // Allow Escape key to close modals (if implemented in the future)
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal.is-active');
      if (modal) {
        modal.classList.remove('is-active');
      }
    }
  });

  // Add visual feedback for focus (accessibility)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });

})();
