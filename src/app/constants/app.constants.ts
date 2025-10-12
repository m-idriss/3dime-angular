/**
 * Application-wide constants
 */

/**
 * Month abbreviations (uppercase)
 */
export const MONTH_ABBREVIATIONS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const;

/**
 * File upload constraints for converter
 */
export const FILE_UPLOAD_CONSTRAINTS = {
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * PDF to image conversion configuration
 */
export const PDF_CONVERSION_CONFIG = {
  /**
   * Scale factor for rendering PDF pages (1.5 = 150% of original size)
   * Higher values produce better quality but larger files
   */
  VIEWPORT_SCALE: 1.5,

  /**
   * JPEG quality setting (0.0 to 1.0)
   * Higher values produce better quality but larger files
   */
  JPEG_QUALITY: 0.92,
} as const;

/**
 * Calendar and ICS file configuration
 */
export const CALENDAR_CONFIG = {
  /**
   * Default filename for downloaded ICS files
   */
  DEFAULT_ICS_FILENAME: 'calendar.ics',
} as const;

/**
 * GitHub activity configuration
 */
export const GITHUB_ACTIVITY_CONFIG = {
  /**
   * Number of months to display in the activity heatmap
   */
  DEFAULT_MONTHS: 6,
} as const;

/**
 * Scroll behavior configuration
 */
export const SCROLL_CONFIG = {
  /**
   * Scroll position threshold (in pixels) to show the back-to-top button
   */
  BACK_TO_TOP_THRESHOLD: 300,
} as const;
