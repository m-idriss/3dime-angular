/* =========================
   3DIME - CDN Fallback Manager
   
   Comprehensive fallback system for external dependencies (CDNs).
   Ensures the application continues to function even when external
   resources are unavailable (blocked CDNs, offline mode, etc.).
   
   Features:
   - Automatic detection of failed CDN loads
   - Graceful degradation with local alternatives
   - User-friendly error messages
   - Configurable timeout and retry logic
   
   @module fallbacks
   @version 2.0
   @author Idriss Mohamady
   @since 2024
   ========================= */

import { CONFIG } from './config.js';

/* =========================
   CDN Fallback Configuration
   
   Defines check functions and fallback strategies for each external dependency.
   Each entry contains:
   - cdn: The CDN URL being monitored
   - check: Function to verify if the resource loaded successfully
   - fallback: Function to implement alternative when CDN fails
   
   @constant {Object} CDN_FALLBACKS
   ========================= */
const CDN_FALLBACKS = {
  
  /**
   * Font Awesome Icons Fallback
   * Provides emoji-based icon alternatives when Font Awesome CDN fails
   */
  fontAwesome: {
    /** @type {string} CDN URL for Font Awesome */
    cdn: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
    
    /**
     * Check if Font Awesome CSS has loaded properly
     * @returns {boolean} True if Font Awesome is available
     */
    check: () => {
      // Test by creating a hidden element with Font Awesome class
      const testElement = document.createElement('i');
      testElement.className = 'fas fa-check';
      testElement.style.display = 'none';
      document.body.appendChild(testElement);
      
      // Check if CSS content property is applied (indicates FA is loaded)
      const isLoaded = window.getComputedStyle(testElement, ':before').content !== 'none';
      document.body.removeChild(testElement);
      return isLoaded;
    },
    
    /**
     * Apply emoji-based icon fallbacks when Font Awesome fails
     * @returns {void}
     */
    fallback: () => {
      console.log('CDN Fallback: Font Awesome failed, using local icons');
      
      // Create CSS with emoji alternatives for common icons
      const fallbackCSS = `
        /* Minimal icon fallbacks using emojis */
        .fa-github:before, .fa-brands.fa-github:before { content: "⚙"; }
        .fa-linkedin:before, .fa-brands.fa-linkedin:before { content: "🔗"; }
        .fa-x-twitter:before, .fa-brands.fa-x-twitter:before { content: "🐦"; }
        .fa-facebook-square:before, .fa-brands.fa-facebook-square:before { content: "📘"; }
        .fa-instagram:before, .fa-brands.fa-instagram:before { content: "📷"; }
        .fa-photo-film:before, .fa-solid.fa-photo-film:before { content: "🎬"; }
        .fa-bell:before { content: "🔔"; }
        .fa-globe:before { content: "🌐"; }
        .fa-chevron-right:before { content: "▶"; }
        .fa-chevron-down:before { content: "▼"; }
        .fa-bars:before { content: "☰"; }
        .fa-times:before { content: "✕"; }
        .fa, .fas, .fa-brands, .fa-solid { 
          font-family: inherit;
          font-style: normal;
          font-weight: normal;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = fallbackCSS;
      document.head.appendChild(style);
    }
  },

  /**
   * D3.js Library Fallback
   * Handles visualization library failure by disabling dependent features
   */
  d3: {
    /** @type {string} CDN URL for D3.js visualization library */
    cdn: 'https://d3js.org/d3.v7.min.js',
    
    /**
     * Check if D3.js library is available globally
     * @returns {boolean} True if D3 object exists
     */
    check: () => typeof window.d3 !== 'undefined',
    
    /**
     * Disable D3-dependent features when library fails to load
     * @returns {void}
     */
    fallback: () => {
      console.log('CDN Fallback: D3.js failed, disabling heatmap');
      
      // Gracefully disable heatmap functionality
      const heatmapContainer = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
      if (heatmapContainer) {
        heatmapContainer.innerHTML = '<p>GitHub Activity heatmap unavailable offline</p>';
      }
    }
  },

  /**
   * Cal-heatmap Library Fallback
   * Provides user-friendly message when GitHub activity visualization fails
   */
  calHeatmap: {
    /** @type {string} CDN URL for calendar heatmap library */
    cdn: 'https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js',
    
    /**
     * Check if CalHeatmap constructor is available
     * @returns {boolean} True if CalHeatmap is loaded
     */
    check: () => typeof window.CalHeatmap !== 'undefined',
    
    /**
     * Display informative placeholder when heatmap library fails
     * @returns {void}
     */
    fallback: () => {
      console.log('CDN Fallback: Cal-heatmap failed, using placeholder');
      const heatmapContainer = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
      if (heatmapContainer) {
        heatmapContainer.innerHTML = `
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; text-align: center;">
            <p>📊 GitHub Activity visualization requires internet connection</p>
            <p><small>Visit <a href="https://github.com/m-idriss" target="_blank" rel="noopener noreferrer">github.com/m-idriss</a> to see activity</small></p>
          </div>
        `;
      }
    }
  },

  /**
   * Google Fonts Fallback
   * Switches to system fonts when Google Fonts CDN is unavailable
   */
  googleFonts: {
    /** @type {string} CDN URL for Google Fonts (Inter font family) */
    cdn: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
    
    /**
     * Check if Inter font from Google Fonts has loaded
     * @returns {boolean} True if Inter font is available
     */
    check: () => {
      // Test font availability by checking computed font family
      const testElement = document.createElement('div');
      testElement.style.fontFamily = 'Inter, sans-serif';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.textContent = 'Test';
      document.body.appendChild(testElement);
      
      const computedFont = window.getComputedStyle(testElement).fontFamily;
      document.body.removeChild(testElement);
      return computedFont.includes('Inter');
    },
    
    /**
     * Apply system font stack when Google Fonts fails
     * @returns {void}
     */
    fallback: () => {
      console.log('CDN Fallback: Google Fonts failed, using system fonts');
      
      // Apply comprehensive system font stack
      const fallbackCSS = `
        body, * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = fallbackCSS;
      document.head.appendChild(style);
    }
  }
};

/* =========================
   Fallback Manager Class
   
   Main class responsible for monitoring and managing CDN fallbacks.
   Provides automatic detection, timeout handling, and recovery mechanisms.
   
   @class FallbackManager
   ========================= */
class FallbackManager {
  /**
   * Initialize the fallback manager
   * @constructor
   */
  constructor() {
    /** @type {number} Timeout for CDN availability checks (milliseconds) */
    this.checkTimeout = 3000;
    
    /** @type {Set<string>} Track which fallbacks have been checked to prevent duplicates */
    this.checkedFallbacks = new Set();
  }

  /**
   * Initialize fallback monitoring system
   * Waits for DOM ready state before beginning checks
   * @returns {void}
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.checkAllFallbacks());
    } else {
      this.checkAllFallbacks();
    }
  }

  /**
   * Check all registered CDN fallbacks sequentially
   * Includes delay to allow CDN resources time to load
   * @async
   * @returns {Promise<void>}
   */
  async checkAllFallbacks() {
    console.log('Fallback Manager: Checking CDN dependencies...');
    
    // Allow time for CDN resources to load before checking
    await this.delay(1000);
    
    // Check each registered fallback
    for (const [name, config] of Object.entries(CDN_FALLBACKS)) {
      if (!this.checkedFallbacks.has(name)) {
        this.checkFallback(name, config);
      }
    }
  }

  /**
   * Check individual CDN fallback and apply alternative if needed
   * @param {string} name - Identifier for the CDN resource
   * @param {Object} config - Configuration object with check and fallback functions
   * @returns {void}
   */
  checkFallback(name, config) {
    // Mark as checked to prevent duplicate checks
    this.checkedFallbacks.add(name);
    
    try {
      if (!config.check()) {
        console.warn(`CDN Fallback: ${name} not available, applying fallback`);
        config.fallback();
      } else {
        console.log(`CDN Fallback: ${name} loaded successfully`);
      }
    } catch (error) {
      console.error(`CDN Fallback: Error checking ${name}:`, error);
      // Apply fallback on any error to ensure graceful degradation
      config.fallback();
    }
  }

  /**
   * Promise-based delay utility for timing control
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>} Promise that resolves after specified delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Manually trigger fallback for specific dependency
   * Useful for testing or forced offline modes
   * @param {string} name - Name of the CDN resource
   * @returns {void}
   */
  forceFallback(name) {
    const config = CDN_FALLBACKS[name];
    if (config) {
      console.log(`CDN Fallback: Forcing fallback for ${name}`);
      config.fallback();
    }
  }

  /**
   * Re-check specific dependency (useful for recovery scenarios)
   * @param {string} name - Name of the CDN resource to re-check
   * @returns {void}
   */
  recheckFallback(name) {
    const config = CDN_FALLBACKS[name];
    if (config) {
      this.checkedFallbacks.delete(name);
      this.checkFallback(name, config);
    }
  }
}

/* =========================
   Global Instance
   
   Create global fallback manager instance for debugging and manual control
   ========================= */
window.fallbackManager = new FallbackManager();

/* =========================
   Module Exports
   ========================= */
export { FallbackManager, CDN_FALLBACKS };