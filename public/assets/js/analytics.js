/* =========================
   3DIME - Privacy-Focused Analytics Module
   
   Lightweight, privacy-respecting analytics implementation.
   Tracks essential metrics without cookies or personal data collection.
   Fully GDPR compliant and respects user privacy preferences.
   
   @module analytics
   @version 1.0
   @author Idriss Mohamady
   @since 2024
   ========================= */

/**
 * Privacy-focused analytics class
 * Collects anonymous usage data while respecting user privacy
 */
class PrivacyAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.events = [];
    
    // Respect user privacy preferences
    this.enabled = this.shouldEnableAnalytics();
    
    if (this.enabled) {
      this.init();
    }
  }

  /**
   * Check if analytics should be enabled based on user preferences and compliance
   * @returns {boolean}
   */
  shouldEnableAnalytics() {
    // Respect Do Not Track header
    if (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes') {
      return false;
    }
    
    // Only enable in production environment
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      return false;
    }
    
    // Check if user has opted out
    if (localStorage.getItem('analytics-opt-out') === 'true') {
      return false;
    }
    
    return true;
  }

  /**
   * Generate a session-based ID (not persistent across sessions)
   * Uses cryptographically secure random values when available
   * @returns {string} Anonymous session identifier
   */
  generateSessionId() {
    // Use cryptographically secure random number generation when available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(10);
      crypto.getRandomValues(array);
      return 'session_' + Array.from(array, byte => byte.toString(36)).join('');
    }
    
    // Fallback to Math.random() for older browsers (less secure)
    return 'session_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Initialize analytics tracking
   */
  init() {
    this.trackPageView();
    this.setupEventListeners();
    
    // Track session end when user leaves
    window.addEventListener('beforeunload', () => this.trackSessionEnd());
    
    console.log('📊 Privacy-focused analytics initialized (respects DNT and privacy preferences)');
  }

  /**
   * Track page view with minimal data
   */
  trackPageView() {
    const pageView = {
      timestamp: Date.now(),
      path: location.pathname,
      referrer: this.getCleanReferrer(),
      userAgent: this.getUserAgentInfo(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    this.pageViews.push(pageView);
    this.logEvent('pageview', pageView);
  }

  /**
   * Get clean referrer information (without sensitive data)
   * @returns {string} Clean referrer domain
   */
  getCleanReferrer() {
    try {
      const referrer = document.referrer;
      if (!referrer) return 'direct';
      
      const url = new URL(referrer);
      return url.hostname;
    } catch (e) {
      return 'unknown';
    }
  }

  /**
   * Get essential user agent information (browser/OS only)
   * @returns {Object} Anonymous user agent info
   */
  getUserAgentInfo() {
    const ua = navigator.userAgent;
    
    // Extract only essential browser information, no fingerprinting
    return {
      browser: this.getBrowserName(ua),
      mobile: /Mobile|Android|iPhone|iPad/.test(ua),
      touchDevice: 'ontouchstart' in window
    };
  }

  /**
   * Get browser name without version details
   * @param {string} userAgent - User agent string
   * @returns {string} Browser name
   */
  getBrowserName(userAgent) {
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    return 'other';
  }

  /**
   * Set up event listeners for user interactions
   */
  setupEventListeners() {
    // Track social link clicks (important for engagement metrics)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        const url = new URL(link.href);
        
        // Track external link clicks
        if (url.hostname !== location.hostname) {
          this.trackEvent('external_link_click', {
            domain: url.hostname,
            section: this.findParentSection(link)
          });
        }
      }
    });

    // Track technology interest (tech stack clicks)
    document.addEventListener('click', (e) => {
      const techItem = e.target.closest('.tech-item');
      if (techItem) {
        this.trackEvent('tech_interest', {
          technology: techItem.textContent.trim()
        });
      }
    });
  }

  /**
   * Find the parent section of an element for context
   * @param {HTMLElement} element - Target element
   * @returns {string} Section name
   */
  findParentSection(element) {
    const section = element.closest('[role="region"]');
    if (section) {
      const heading = section.querySelector('h2');
      return heading ? heading.textContent.trim().toLowerCase() : 'unknown';
    }
    return 'unknown';
  }

  /**
   * Track custom events
   * @param {string} eventType - Type of event
   * @param {Object} data - Event data
   */
  trackEvent(eventType, data = {}) {
    if (!this.enabled) return;
    
    const event = {
      type: eventType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      data: data
    };
    
    this.events.push(event);
    this.logEvent(eventType, data);
  }

  /**
   * Track session end with engagement metrics
   */
  trackSessionEnd() {
    if (!this.enabled) return;
    
    const sessionDuration = Date.now() - this.startTime;
    const engagementData = {
      duration: sessionDuration,
      pageViews: this.pageViews.length,
      events: this.events.length,
      scrollDepth: this.calculateScrollDepth()
    };
    
    this.trackEvent('session_end', engagementData);
  }

  /**
   * Calculate maximum scroll depth reached
   * @returns {number} Scroll depth percentage
   */
  calculateScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round((scrollTop / scrollHeight) * 100) || 0;
  }

  /**
   * Log analytics events (development/debug mode only)
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  logEvent(event, data) {
    if (sessionStorage.getItem('debug-analytics') === 'true') {
      console.log(`📊 Analytics: ${event}`, data);
    }
  }

  /**
   * Allow users to opt out of analytics
   */
  static optOut() {
    localStorage.setItem('analytics-opt-out', 'true');
    console.log('✅ You have successfully opted out of analytics tracking.');
  }

  /**
   * Allow users to opt back in to analytics
   */
  static optIn() {
    localStorage.removeItem('analytics-opt-out');
    console.log('✅ You have opted back in to privacy-focused analytics.');
  }

  /**
   * Get current analytics status
   * @returns {Object} Analytics status information
   */
  static getStatus() {
    return {
      enabled: !localStorage.getItem('analytics-opt-out'),
      respectsDNT: navigator.doNotTrack === '1',
      domain: location.hostname
    };
  }
}

/**
 * Initialize privacy-focused analytics
 * @returns {PrivacyAnalytics|null} Analytics instance or null if disabled
 */
export function initAnalytics() {
  try {
    return new PrivacyAnalytics();
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
    return null;
  }
}

// Expose privacy controls to users via console
window.analyticsOptOut = PrivacyAnalytics.optOut;
window.analyticsOptIn = PrivacyAnalytics.optIn;
window.analyticsStatus = PrivacyAnalytics.getStatus;

// Enable debug mode for analytics
window.enableAnalyticsDebug = function() {
  sessionStorage.setItem('debug-analytics', 'true');
  console.log('📊 Analytics debugging enabled. Interactions will be logged.');
};