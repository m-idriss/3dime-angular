import { Component, signal, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '@schedule-x/angular';
import { createCalendar, createViewDay, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { CalendarEvent } from '../../models';

/**
 * Interactive calendar view component for visualizing and editing events
 * 
 * Features:
 * - Monthly and weekly grid views
 * - Drag & drop to move events
 * - Resize to adjust event duration
 * - Export updated events to ICS
 */
@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule, CalendarComponent],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss',
})
export class CalendarView implements OnInit {
  // Inputs
  readonly events = input.required<CalendarEvent[]>();
  readonly visible = input.required<boolean>();

  // Outputs
  readonly visibleChange = output<boolean>();
  readonly eventsChange = output<CalendarEvent[]>();
  readonly exportIcs = output<void>();

  // Schedule-X calendar instance
  calendarApp: any;

  constructor() {
    // Watch for events changes and update calendar
    effect(() => {
      this.updateCalendarEvents();
    });
  }

  ngOnInit(): void {
    // Create calendar instance on init (allows testing with mocks)
    if (!this.calendarApp) {
      this.calendarApp = createCalendar({
        views: [createViewMonthGrid(), createViewWeek(), createViewDay()],
        events: [],
        plugins: [createDragAndDropPlugin(15)], // 15-minute interval snapping
        callbacks: {
          onEventUpdate: (updatedEvent) => {
            this.handleEventUpdate(updatedEvent);
          },
        },
      });
    }
    
    // Initial calendar events update
    this.updateCalendarEvents();
  }

  /**
   * Update calendar events when input changes
   */
  private updateCalendarEvents(): void {
    if (!this.calendarApp) return;

    const scheduleXEvents = this.events().map((event, index) => {
      const startDate = typeof event.start === 'string' ? new Date(event.start) : event.start;
      const endDate = typeof event.end === 'string' ? new Date(event.end) : event.end;
      
      return {
        id: index.toString(),
        title: event.summary,
        start: this.formatDateTimeForScheduleX(startDate),
        end: this.formatDateTimeForScheduleX(endDate),
        description: event.description,
        location: event.location,
      };
    });

    // Update calendar events
    this.calendarApp.events.set(scheduleXEvents);
  }

  /**
   * Format date/time for Schedule-X using Temporal API
   * Returns ISO string format: YYYY-MM-DD HH:mm for timed events
   */
  private formatDateTimeForScheduleX(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  /**
   * Handle event update (drag & drop or resize)
   */
  private handleEventUpdate(updatedEvent: any): void {
    const eventIndex = parseInt(updatedEvent.id, 10);
    const updatedEvents = [...this.events()];
    
    if (updatedEvents[eventIndex]) {
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        start: new Date(updatedEvent.start),
        end: new Date(updatedEvent.end),
      };
      
      this.eventsChange.emit(updatedEvents);
    }
  }

  /**
   * Close the calendar view
   */
  protected close(): void {
    this.visibleChange.emit(false);
  }

  /**
   * Export events to ICS
   */
  protected handleExport(): void {
    this.exportIcs.emit();
  }
}
