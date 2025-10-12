/**
 * PWA installation configuration
 */
export const PWA_CONFIG = {
  /**
   * Message shown when a new version of the app is available
   */
  UPDATE_MESSAGE: 'New version available. Load new version?',

  /**
   * Delay in milliseconds before service worker registration after app is stable
   */
  SW_REGISTRATION_DELAY: 30000,
} as const;
