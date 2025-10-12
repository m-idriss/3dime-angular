/**
 * Calendar event model for converter functionality
 */
export interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}
