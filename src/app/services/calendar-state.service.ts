import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEvent } from '../models';

/**
 * Service to manage calendar view state globally
 * This allows the calendar view to be rendered at app level while being controlled from converter
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarStateService {
  // Calendar visibility state
  readonly isVisible = signal(false);
  
  // Calendar events
  readonly events = signal<CalendarEvent[]>([]);
  
  // Export request subject
  readonly exportRequested$ = new Subject<void>();
  
  /**
   * Show the calendar view with given events
   */
  showCalendar(events: CalendarEvent[]): void {
    this.events.set(events);
    this.isVisible.set(true);
  }
  
  /**
   * Hide the calendar view
   */
  hideCalendar(): void {
    this.isVisible.set(false);
  }
  
  /**
   * Update calendar events
   */
  updateEvents(events: CalendarEvent[]): void {
    this.events.set(events);
  }
  
  /**
   * Request export of calendar events
   */
  requestExport(): void {
    this.exportRequested$.next();
  }
}
