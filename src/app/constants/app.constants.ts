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
 * Social media provider icon mappings for Font Awesome
 */
export const SOCIAL_ICON_MAP: Record<string, string> = {
  twitter: 'x-twitter',
  facebook: 'facebook-square',
  github: 'github',
  linkedin: 'linkedin',
  instagram: 'instagram',
  youtube: 'youtube',
} as const;

/**
 * Default Font Awesome icon class for unknown providers
 */
export const DEFAULT_SOCIAL_ICON = 'fa fa-brands fa-link';

/**
 * Number of data sources to load in profile card
 */
export const PROFILE_LOADING_COUNT = 2;

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
export const GITHUB_ACTIVITY_CONFIG: { DEFAULT_MONTHS: number } = {
  /**
   * Number of months to display in the activity heatmap
   */
  DEFAULT_MONTHS: 7,
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
