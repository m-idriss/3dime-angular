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
 * GitHub activity configuration
 */
export const GITHUB_ACTIVITY_CONFIG = {
  /**
   * Number of months to display in the activity heatmap
   */
  DEFAULT_MONTHS: 6,
} as const;
