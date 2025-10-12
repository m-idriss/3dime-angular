import { MONTH_ABBREVIATIONS } from '../constants/app.constants';

/**
 * Formats an ICS date string to a human-readable format
 * Handles formats: YYYYMMDD, YYYYMMDDTHHMMSS, YYYYMMDDTHHMM, with optional trailing 'Z' or timezone offsets
 *
 * @param icsDate - The ICS format date string
 * @returns Formatted date string (DD/MM/YYYY or DD/MM/YYYY HH:MM)
 */
export function formatIcsDate(icsDate: string): string {
  if (!icsDate) return '';

  // Remove any trailing Z or timezone offset
  const cleaned = icsDate.replace(/Z$|[+-]\d{4}$/, '');

  // All-day event: YYYYMMDD
  const allDayMatch = /^(\d{4})(\d{2})(\d{2})$/.exec(cleaned);
  if (allDayMatch) {
    const [, year, month, day] = allDayMatch;
    return `${day}/${month}/${year}`;
  }

  // Timed event: YYYYMMDDTHHMMSS or YYYYMMDDTHHMM
  const timeMatch = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?$/.exec(cleaned);
  if (timeMatch) {
    const [, year, month, day, hour, minute] = timeMatch;
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  // Fallback: try to parse with Date constructor
  const dateObj = new Date(icsDate);
  if (!isNaN(dateObj.getTime())) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hour = String(dateObj.getHours()).padStart(2, '0');
    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}` + (icsDate.includes('T') ? ` ${hour}:${minute}` : '');
  }

  // If all else fails, return the original string
  return icsDate;
}

/**
 * Extracts the month abbreviation and day from a formatted date string
 * @param dateStr - Formatted date string (DD/MM/YYYY HH:MM)
 * @returns Month abbreviation and day in format "MMM\nDD"
 */
export function getMonthDay(dateStr: string): string {
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length >= 3) {
    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    if (monthIndex >= 0 && monthIndex < MONTH_ABBREVIATIONS.length) {
      return `${MONTH_ABBREVIATIONS[monthIndex]}\n${day}`;
    }
  }
  return dateStr;
}

/**
 * Extracts the time portion from a formatted date string
 * @param dateStr - Formatted date string (DD/MM/YYYY HH:MM)
 * @returns Time string (HH:MM) or empty string if no time present
 */
export function getTime(dateStr: string): string {
  const parts = dateStr.split(' ');
  return parts.length > 1 ? parts[1] : '';
}
