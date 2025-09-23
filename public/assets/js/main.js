/* =========================
   3DIME - Main Application Entry Point
   
   This is the primary initialization module for the 3dime personal social hub website.
   It handles app startup, service worker registration, and error handling.
   
   @module main
   @version 2.0
   @author Idriss Mohamady
   @since 2024
   ========================= */

import { loadContent } from './content.js';
import { FallbackManager } from './fallbacks.js';
import { initPerformanceMonitoring } from './performance.js';
import { initAnalytics } from './analytics.js';
import { initPrivacyNotice } from './privacy-notice.js';



/* =========================
   Application Initialization
   
   Main application initialization function that sets up:
   - CDN fallback management for external dependencies
   - Language configuration  
   - Content loading and rendering
   - Error handling with user-friendly messages
   
   @async
   @function initializeApp
   @returns {Promise<void>} Resolves when app initialization is complete
   @throws {Error} If critical initialization steps fail
   ========================= */
async function initializeApp() {
  try {
    // Initialize performance monitoring for Core Web Vitals tracking
    initPerformanceMonitoring();
    
    // Initialize privacy-focused analytics (respects DNT and user preferences)
    initAnalytics();
    
    // Initialize privacy notice for transparency
    initPrivacyNotice();
    
    // Initialize CDN fallback manager to handle external dependency failures
    // This ensures the app continues to function even if CDNs are blocked/unavailable
    const fallbackManager = new FallbackManager();
    fallbackManager.init();
    
    // Set English as the default language for accessibility and SEO
    // This can be extended to support internationalization in the future
    document.documentElement.lang = 'en';

    // Add loaded class to trigger CSS fade-in animations
    document.body.classList.add('loaded');
    
    // Load and render all content from structured data
    // This populates the entire page with dynamic content
    await loadContent();
    
    // Delay fallback checks to allow initial page load to complete
    // This prevents blocking the main thread during startup
    setTimeout(() => {
      fallbackManager.checkAllFallbacks();
    }, 2000);
    
  } catch (error) {
    // Log detailed error for debugging
    console.error('Application initialization failed:', error);
    
    // Show user-friendly error message with proper ARIA attributes for accessibility
    const main = document.querySelector('.cards-container');
    if (main) {
      main.innerHTML = '<div class="error-message" role="alert">Unable to load the application. Please refresh the page or try again later.</div>';
    }
  }
}

/* =========================
   Application Bootstrap
   
   Waits for DOM to be fully loaded before initializing the application.
   This ensures all HTML elements are available for manipulation.
   
   @event DOMContentLoaded
   ========================= */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the main application
  await initializeApp();
});