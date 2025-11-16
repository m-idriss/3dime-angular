import { Component, inject, signal, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
export class Home implements OnInit, OnDestroy {
  public readonly toastService = inject(ToastService);
  public readonly calendarStateService = inject(CalendarStateService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isDesktop = signal(false);
  private resizeSubscription?: Subscription;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize desktop detection
      this.updateDesktopStatus();

      // Listen to window resize with debounce
      this.resizeSubscription = fromEvent(window, 'resize')
        .pipe(debounceTime(200))
        .subscribe(() => {
          this.updateDesktopStatus();
        });
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
  }

  private updateDesktopStatus(): void {
    this.isDesktop.set(window.innerWidth >= 1200);
  }

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
