import { Component, signal, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '@schedule-x/angular';
import { createCalendar, createViewDay, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import '@schedule-x/theme-default/dist/index.css';
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

  // Local state - Schedule-X calendar instance
  protected calendarApp = signal<any>(null);

  constructor() {
    // Watch for events changes and update calendar
    effect(() => {
      this.updateCalendarEvents();
    });
  }

  ngOnInit(): void {
    // Skip calendar creation if already initialized (for testing)
    if (this.calendarApp()) {
      return;
    }

    // Create Schedule-X calendar instance
    const calendar = createCalendar({
      views: [createViewMonthGrid(), createViewWeek(), createViewDay()],
      events: [],
      plugins: [createDragAndDropPlugin(15)], // 15-minute interval snapping
      callbacks: {
        onEventUpdate: (updatedEvent) => {
          this.handleEventUpdate(updatedEvent);
        },
      },
    });

    this.calendarApp.set(calendar);
    this.updateCalendarEvents();
  }

  /**
   * Update calendar events when input changes
   */
  private updateCalendarEvents(): void {
    const calendar = this.calendarApp();
    if (!calendar) return;

    const scheduleXEvents = this.events().map((event, index) => ({
      id: index.toString(),
      title: event.summary,
      start: this.formatDateForScheduleX(event.start),
      end: this.formatDateForScheduleX(event.end),
      description: event.description,
      location: event.location,
    }));

    // Update calendar events
    calendar.events.set(scheduleXEvents);
  }

  /**
   * Format date for Schedule-X (YYYY-MM-DD HH:mm format)
   */
  private formatDateForScheduleX(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
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
