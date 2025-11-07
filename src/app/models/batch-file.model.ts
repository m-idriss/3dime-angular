import { CalendarEvent } from './calendar-event.model';

/**
 * Status of a file in the batch processing queue
 */
export enum BatchFileStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Model for tracking individual file processing in batch operations
 */
export interface BatchFile {
  file: File;
  status: BatchFileStatus;
  progress?: number; // 0-100
  error?: string;
  events?: CalendarEvent[]; // Extracted events for this file
  icsContent?: string; // Generated ICS content for this file
}
