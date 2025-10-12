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
