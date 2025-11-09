import { Component, inject } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { Converter } from '../../components/converter/converter';
import { CalendarView } from '../../components/calendar-view';
import { ToastService } from '../../services/toast.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CalendarEvent } from '../../models';

@Component({
  selector: 'app-home',
  imports: [Converter, CalendarView, NgbToastModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public readonly toastService = inject(ToastService);
  public readonly calendarStateService = inject(CalendarStateService);

  /**
   * Handle calendar visibility change
   */
  handleCalendarVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.calendarStateService.hideCalendar();
    }
  }

  /**
   * Handle events change from calendar view (drag & drop, resize)
   */
  handleCalendarEventsChange(updatedEvents: CalendarEvent[]): void {
    this.calendarStateService.updateEvents(updatedEvents);
  }

  /**
   * Handle export from calendar view
   */
  handleCalendarExport(): void {
    this.calendarStateService.requestExport();
  }
}
