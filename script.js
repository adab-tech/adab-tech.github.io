/**
 * Modern Portfolio Website - Interactive Features
 * Adamu Abubakar - adamu.tech
 * Features: Dark Mode, Smooth Scrolling, Animations, Multilingual Greeting
 */

(function() {
  'use strict';

  // ===================================
  // Configuration
  // ===================================
  
  const CONFIG = {
    greetingInterval: 2500,
    greetingTransition: 800,
    scrollThreshold: 100,
    animationThreshold: 0.1
  };

  // Multilingual greetings
  const GREETINGS = [
    { text: 'Welcome', lang: 'en' },           // English
    { text: 'Bienvenue', lang: 'fr' },         // French
    { text: 'Ẹ káàbọ', lang: 'yo' },          // Yoruba
    { text: 'Barka da zuwa', lang: 'ha' },    // Hausa
    { text: 'مرحبا', lang: 'ar' },            // Arabic
    { text: 'Bienvenido', lang: 'es' },       // Spanish
    { text: 'Willkommen', lang: 'de' },       // German
    { text: 'Benvenuto', lang: 'it' },        // Italian
    { text: 'स्वागत है', lang: 'hi' },        // Hindi
    { text: 'ようこそ', lang: 'ja' },           // Japanese
    { text: '欢迎', lang: 'zh' },              // Chinese
    { text: 'Добро пожаловать', lang: 'ru' }, // Russian
    { text: 'Karibu', lang: 'sw' },           // Swahili
    { text: 'Bem-vindo', lang: 'pt' }         // Portuguese
  ];

  // ===================================
  // State Management
  // ===================================
  
  const state = {
    currentGreetingIndex: 0,
    greetingInterval: null,
    isMenuOpen: false
  };

  // ===================================
  // DOM Elements
  // ===================================
  
  const elements = {
    navbar: null,
    themeToggle: null,
    mobileMenuToggle: null,
    navMenu: null,
    greetingElement: null,
    navLinks: null,
    animatedElements: null
  };

  // ===================================
  // Initialize
  // ===================================
  
  function init() {
    // Cache DOM elements
    cacheElements();
    
    // Initialize features
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initGreetingRotation();
    
    console.log('✨ Portfolio website initialized successfully');
  }

  function cacheElements() {
    elements.navbar = document.getElementById('navbar');
    elements.themeToggle = document.getElementById('themeToggle');
    elements.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    elements.navMenu = document.getElementById('navMenu');
    elements.greetingElement = document.getElementById('dynamic-greeting');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.animatedElements = document.querySelectorAll('[data-animate]');
  }

  // ===================================
  // Theme Toggle (Dark/Light Mode)
  // ===================================
  
  function initThemeToggle() {
    if (!elements.themeToggle) return;

    // Ensure role/aria for assistive tech
    elements.themeToggle.setAttribute('role', 'button');
    // Reflect the current theme as aria-pressed (true for dark)
    const currentTheme = document.documentElement.getAttribute('data-theme');
    elements.themeToggle.setAttribute('aria-pressed', currentTheme === 'dark');

    elements.themeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const newTheme = cur === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // Update accessible state
      elements.themeToggle.setAttribute('aria-pressed', newTheme === 'dark');

      // Add animation feedback
      elements.themeToggle.style.transform = 'scale(0.9)';
      setTimeout(() => {
        elements.themeToggle.style.transform = 'scale(1)';
      }, 150);
    });
  }

  // ===================================
  // Mobile Menu
  // ===================================
  
  function initMobileMenu() {
    if (!elements.mobileMenuToggle || !elements.navMenu) return;

    // Ensure initial aria attributes
    elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    elements.mobileMenuToggle.setAttribute('aria-controls', elements.navMenu.id || 'navMenu');
    elements.navMenu.setAttribute('aria-hidden', 'true');

    // Helper: open menu
    function openMenu() {
      state.isMenuOpen = true;
      elements.mobileMenuToggle.classList.add('active');
      elements.navMenu.classList.add('active');
      elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
      elements.navMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Move focus to first link for keyboard users
      const firstLink = elements.navMenu.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
      enableFocusTrap();
    }

    // Helper: close menu
    function closeMenu() {
      state.isMenuOpen = false;
      elements.mobileMenuToggle.classList.remove('active');
      elements.navMenu.classList.remove('active');
      elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
      elements.navMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      disableFocusTrap();
      // Return focus to toggle for accessibility
      elements.mobileMenuToggle.focus();
    }

    // Toggle menu on click
    elements.mobileMenuToggle.addEventListener('click', () => {
      if (state.isMenuOpen) closeMenu(); else openMenu();
    });

    // Close menu when clicking nav links
    elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (state.isMenuOpen) {
          closeMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (state.isMenuOpen && 
          !elements.navMenu.contains(e.target) && 
          !elements.mobileMenuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key and support keyboard handling
    document.addEventListener('keydown', (e) => {
      if (!state.isMenuOpen) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeMenu();
      }
    });

    // Focus trap implementation (simple)
    let focusableElements = [];
    let firstFocusable = null;
    let lastFocusable = null;

    function enableFocusTrap() {
      focusableElements = Array.from(elements.navMenu.querySelectorAll('a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.hasAttribute('disabled'));
      firstFocusable = focusableElements[0] || null;
      lastFocusable = focusableElements[focusableElements.length - 1] || null;

      document.addEventListener('keydown', trapHandler);
    }

    function disableFocusTrap() {
      document.removeEventListener('keydown', trapHandler);
    }

    function trapHandler(e) {
      if (e.key !== 'Tab') return;
      if (!firstFocusable) return;

      if (e.shiftKey) { // shift + tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else { // tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

  // (Duplicate handlers removed — menu open/close handled above)
  }

  // ===================================
  // Smooth Scrolling
  // ===================================
  
  function initSmoothScroll() {
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle internal links
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without jumping
            history.pushState(null, '', href);
          }
        }
      });
    });
  }

  // ===================================
  // Scroll Animations (Intersection Observer)
  // ===================================
  
  function initScrollAnimations() {
    if (!elements.animatedElements.length) return;

    const observerOptions = {
      threshold: CONFIG.animationThreshold,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Optional: stop observing after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // ===================================
  // Navbar Scroll Effect
  // ===================================
  
  function initNavbarScroll() {
    if (!elements.navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
      const scrollY = window.scrollY;

      if (scrollY > CONFIG.scrollThreshold) {
        elements.navbar.classList.add('scrolled');
      } else {
        elements.navbar.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }

  // ===================================
  // Multilingual Greeting Rotation
  // ===================================
  
  function initGreetingRotation() {
    if (!elements.greetingElement) {
      console.warn('Greeting element not found');
      return;
    }

    // Set initial greeting
    updateGreeting();

    // Start rotation
    state.greetingInterval = setInterval(() => {
      state.currentGreetingIndex = (state.currentGreetingIndex + 1) % GREETINGS.length;
      updateGreeting();
    }, CONFIG.greetingInterval);
  }

  function updateGreeting() {
    const greeting = GREETINGS[state.currentGreetingIndex];
    
    // Fade out
    elements.greetingElement.classList.remove('visible');
    
    // Update text and language after fade out
    setTimeout(() => {
      elements.greetingElement.textContent = greeting.text;
      elements.greetingElement.setAttribute('lang', greeting.lang);
      
      // Fade in
      setTimeout(() => {
        elements.greetingElement.classList.add('visible');
      }, 50);
    }, CONFIG.greetingTransition / 2);
  }

  // ===================================
  // Utility Functions
  // ===================================
  
  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ===================================
  // Cleanup on page unload
  // ===================================
  
  function cleanup() {
    if (state.greetingInterval) {
      clearInterval(state.greetingInterval);
    }
  }

  window.addEventListener('beforeunload', cleanup);

  // ===================================
  // Start when DOM is ready
  // ===================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===================================
  // Export for debugging (optional)
  // ===================================
  
  window.portfolioDebug = {
    state,
    elements,
    config: CONFIG,
    greetings: GREETINGS
  };

})();
