import { Component, signal, input, output, OnInit, ViewChild, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
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
  imports: [CommonModule, FullCalendarModule],
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

  // Local state
  protected readonly calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      prev: '◄',
      next: '►',
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day'
    },
    buttonIcons: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventClick: this.handleEventClick.bind(this),
    height: '100%',
    contentHeight: 'auto',
    expandRows: true,
    scrollTime: '06:00:00', // Start day view at 6am (daylight hours)
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  });

  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    // Watch for events changes and update calendar
    effect(() => {
      this.updateCalendarEvents();
    });
  }

  ngOnInit(): void {
    // Initial load
    this.updateCalendarEvents();
  }

  /**
   * Update calendar events when input changes
   */
  private updateCalendarEvents(): void {
    const fullCalendarEvents: EventInput[] = this.events().map((event, index) => ({
      id: index.toString(),
      title: event.summary,
      start: typeof event.start === 'string' ? event.start : event.start.toISOString(),
      end: typeof event.end === 'string' ? event.end : event.end.toISOString(),
      extendedProps: {
        description: event.description,
        location: event.location
      }
    }));

    this.calendarOptions.update(options => ({
      ...options,
      events: fullCalendarEvents
    }));
  }

  /**
   * Handle event drop (drag & drop)
   */
  private handleEventDrop(info: EventDropArg): void {
    const eventIndex = parseInt(info.event.id, 10);
    const updatedEvents = [...this.events()];
    
    if (updatedEvents[eventIndex]) {
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        start: info.event.start || updatedEvents[eventIndex].start,
        end: info.event.end || updatedEvents[eventIndex].end
      };
      
      this.eventsChange.emit(updatedEvents);
    }
  }

  /**
   * Handle event resize
   */
  private handleEventResize(info: EventResizeDoneArg): void {
    const eventIndex = parseInt(info.event.id, 10);
    const updatedEvents = [...this.events()];
    
    if (updatedEvents[eventIndex]) {
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        start: info.event.start || updatedEvents[eventIndex].start,
        end: info.event.end || updatedEvents[eventIndex].end
      };
      
      this.eventsChange.emit(updatedEvents);
    }
  }

  /**
   * Handle event click
   */
  private handleEventClick(info: any): void {
    // Optional: Could open an edit modal or show event details
    console.log('Event clicked:', info.event);
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

  /**
   * Change calendar view
   */
  protected changeView(viewType: string): void {
    if (isPlatformBrowser(this.platformId) && this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.changeView(viewType);
    }
  }
}
