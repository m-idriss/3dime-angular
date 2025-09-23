/* =========================
   3DIME - Application Configuration
   
   Central configuration module containing all application constants,
   settings, and configuration values. This module provides a single
   source of truth for app-wide settings.
   
   @module config
   @version 2.0
   @author Idriss Mohamady
   @since 2024
   ========================= */

/**
 * Main configuration object containing all app settings
 * @constant {Object} CONFIG
 */
export const CONFIG = {
  
  // ===== INTERNATIONALIZATION =====
  
  /** @type {string[]} Supported language codes (ISO 639-1) */
  SUPPORTED_LANGUAGES: ['en'],
  
  /** @type {string} Default language code used on app initialization */
  DEFAULT_LANGUAGE: 'en',
  
  // ===== UI PREFERENCES =====
  
  /** @type {string[]} Available font size options for accessibility */
  FONT_SIZES: ['normal', 'large', 'small'],
  
  /** @type {string} Default font size setting */
  DEFAULT_FONT_SIZE: 'normal',
  
  /** @type {string[]} Available theme modes for containers */
  THEME_MODES: ['dark', 'white', 'glass'],
  
  /** @type {string} Default theme setting */
  DEFAULT_THEME: 'glass',
  
  /** @type {string[]} Available background modes */
  BACKGROUND_MODES: ['black', 'white', 'video'],
  
  /** @type {string} Default background setting */
  DEFAULT_BACKGROUND: 'video',
  
  // ===== ANIMATION SETTINGS =====
  
  /** @type {number} Duration in milliseconds for CSS fade transitions */
  FADE_TIMEOUT: 400,
  
  /** @type {number} Scroll threshold in pixels to show back-to-top button */
  BACK_TO_TOP_THRESHOLD: 200,
  
  // ===== API CONFIGURATION =====
  
  /**
   * External API endpoints and proxy settings
   * @namespace ENDPOINTS
   */
  ENDPOINTS: {
    /** @type {string} PHP proxy endpoint for GitHub API calls */
    PROXY: 'proxy.php'
  },
  
  // ===== DOM SELECTORS =====
  
  /**
   * CSS selectors for major page elements
   * @namespace SELECTORS
   */
  SELECTORS: {
    /** @type {string} Main content container selector */
    CARDS_CONTAINER: '.cards-container',
    
    /** @type {string} GitHub activity heatmap container selector */
    HEATMAP_CONTAINER: '#heatmap-container'
  },
  
  // ===== ELEMENT IDS =====
  
  /**
   * HTML element IDs (without # prefix) for direct element access
   * @namespace IDS
   */
  IDS: {
    /** @type {string} Mobile menu burger button ID */
    BURGER_BTN: 'burger-btn',
    
    /** @type {string} Profile dropdown menu ID */
    PROFILE_DROPDOWN: 'profile-dropdown',
    
    /** @type {string} Dark/light theme toggle button ID */
    THEME_TOGGLE: 'theme-toggle',
    
    /** @type {string} Font size adjustment toggle button ID */
    FONT_SIZE_TOGGLE: 'font-size-toggle',
    
    /** @type {string} Video background toggle button ID */
    VIDEO_BG_TOGGLE: 'video-bg-toggle',
    
    /** @type {string} Back to top button ID */
    BACK_TO_TOP_BTN: 'back-to-top-btn',
    
    /** @type {string} GitHub heatmap visualization container ID */
    HEATMAP_CONTAINER: 'heatmap-container'
  }
};