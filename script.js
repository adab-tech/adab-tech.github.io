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

    // sync pressed state on load
    try {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      elements.themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
    } catch (_) {
      // ignore
    }

    elements.themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

  elements.themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
      
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

    function closeMenu() {
      if (!state.isMenuOpen) return;
      state.isMenuOpen = false;
      elements.mobileMenuToggle.classList.remove('active');
      elements.navMenu.classList.remove('active');
      elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      elements.mobileMenuToggle.focus();
    }

    // Toggle menu
    elements.mobileMenuToggle.addEventListener('click', () => {
      state.isMenuOpen = !state.isMenuOpen;
      elements.mobileMenuToggle.classList.toggle('active');
      elements.navMenu.classList.toggle('active');
      elements.mobileMenuToggle.setAttribute('aria-expanded', state.isMenuOpen);
      
      // Prevent body scroll when menu is open
      if (state.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking nav links
    elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (state.isMenuOpen) {
          elements.mobileMenuToggle.click();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (state.isMenuOpen && 
          !elements.navMenu.contains(e.target) && 
          !elements.mobileMenuToggle.contains(e.target)) {
        elements.mobileMenuToggle.click();
      }
    });

    // Escape closes menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
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
