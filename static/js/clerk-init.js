// Clerk Authentication Integration
(function() {
  'use strict';
  
  // Load Clerk dynamically if on auth pages or if needed
  function initializeClerk() {
    const clerkPublishableKey = '{{ getenv "CLERK_PUBLISHABLE_KEY" }}' || '';
    
    if (!clerkPublishableKey) {
      console.log('Clerk: No publishable key found. Authentication features disabled.');
      return;
    }
    
    // Check if Clerk SDK is loaded
    if (typeof Clerk === 'undefined') {
      console.log('Clerk SDK not loaded on this page');
      return;
    }
    
    // Initialize Clerk
    const clerk = new Clerk(clerkPublishableKey);
    
    clerk.load().then(() => {
      console.log('Clerk loaded successfully');
      
      // Update UI based on authentication status
      updateAuthUI(clerk);
      
      // Listen for auth state changes
      clerk.addListener((session) => {
        updateAuthUI(clerk);
      });
    }).catch(error => {
      console.error('Failed to load Clerk:', error);
    });
  }
  
  function updateAuthUI(clerk) {
    const userButtonDiv = document.getElementById('clerk-user-button');
    const authLinksDiv = document.getElementById('auth-links');
    
    if (!userButtonDiv || !authLinksDiv) {
      return;
    }
    
    if (clerk.session) {
      // User is signed in
      userButtonDiv.style.display = 'block';
      authLinksDiv.style.display = 'none';
      
      // Mount user button if not already mounted
      if (userButtonDiv.children.length === 0) {
        clerk.mountUserButton(userButtonDiv);
      }
    } else {
      // User is not signed in
      userButtonDiv.style.display = 'none';
      authLinksDiv.style.display = 'block';
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClerk);
  } else {
    initializeClerk();
  }
})();
