/**
 * Multilingual Welcome Greeting Script
 * Rotates through "Welcome" in multiple languages with fade-in/fade-out transitions
 */

(function() {
  'use strict';

  // Array of greetings in different languages
  const greetings = [
    { text: 'Welcome', lang: 'en' },           // English
    { text: 'Bienvenu', lang: 'fr' },          // French
    { text: 'Ẹ káàbọ', lang: 'yo' },          // Yoruba
    { text: 'Barka da zuwa', lang: 'ha' },    // Hausa
    { text: 'مرحبا', lang: 'ar' },            // Arabic (Marhaba)
    { text: 'Bienvenido', lang: 'es' },       // Spanish
    { text: 'Willkommen', lang: 'de' },       // German
    { text: 'Benvenuto', lang: 'it' },        // Italian
    { text: 'स्वागत है', lang: 'hi' },        // Hindi (Swagat hai)
    { text: 'ようこそ', lang: 'ja' },           // Japanese (Yōkoso)
    { text: '欢迎', lang: 'zh' },              // Chinese (Huānyíng)
    { text: 'Добро пожаловать', lang: 'ru' }, // Russian (Dobro pozhalovat)
    { text: 'Karibu', lang: 'sw' },           // Swahili
    { text: 'Bem-vindo', lang: 'pt' }         // Portuguese
  ];

  let currentIndex = 0;
  let greetingElement = null;
  let rotationInterval = null;

  /**
   * Initialize the greeting rotation
   */
  function init() {
    // Find the greeting element
    greetingElement = document.getElementById('dynamic-greeting');
    
    if (!greetingElement) {
      console.warn('Greeting element not found');
      return;
    }

    // Set initial greeting
    updateGreeting();

    // Start rotation with 2.5 seconds interval
    rotationInterval = setInterval(rotateGreeting, 2500);
  }

  /**
   * Update the greeting text and language attribute
   */
  function updateGreeting() {
    if (!greetingElement) return;

    const greeting = greetings[currentIndex];
    
    // Remove visible class for fade-out
    greetingElement.classList.remove('visible');

    // Wait for fade-out, then update content
    setTimeout(() => {
      greetingElement.textContent = greeting.text;
      greetingElement.setAttribute('lang', greeting.lang);
      
      // Add visible class for fade-in
      // Use requestAnimationFrame to ensure the DOM has updated
      requestAnimationFrame(() => {
        greetingElement.classList.add('visible');
      });
    }, 400); // Half of the transition duration
  }

  /**
   * Rotate to the next greeting
   */
  function rotateGreeting() {
    currentIndex = (currentIndex + 1) % greetings.length;
    updateGreeting();
  }

  /**
   * Clean up on page unload
   */
  function cleanup() {
    if (rotationInterval) {
      clearInterval(rotationInterval);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

})();
