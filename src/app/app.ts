import { Component, signal, OnInit, PLATFORM_ID, inject, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { About } from './components/about/about';
import { BackToTop } from './components/back-to-top/back-to-top';
import { CalendarView } from './components/calendar-view';
import { Converter } from './components/converter/converter';
import { Education } from './components/education/education';
import { ExpandableCard } from './components/expandable-card/expandable-card';
import { Experience } from './components/experience/experience';
import { Footer } from './components/footer/footer';
import { GithubActivity } from './components/github-activity/github-activity';
import { Hobbies } from './components/hobbies/hobbies';
import { ProfileCard } from './components/profile-card/profile-card';
import { Stuff } from './components/stuff/stuff';
import { TechStack } from './components/tech-stack/tech-stack';
import { PWA_CONFIG } from './constants/pwa.constants';
import { LayoutModule } from '@angular/cdk/layout';
import { ToastService } from './services/toast.service';
import { CalendarStateService } from './services/calendar-state.service';
import { AppTooltipDirective } from './shared/directives';
import { CalendarEvent } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    About,
    BackToTop,
    CalendarView,
    Converter,
    Education,
    ExpandableCard,
    Experience,
    Footer,
    GithubActivity,
    Hobbies,
    ProfileCard,
    Stuff,
    TechStack,
    LayoutModule,
    NgbToastModule,
    AppTooltipDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swUpdate = inject(SwUpdate);
  public readonly toastService = inject(ToastService);
  public readonly calendarStateService = inject(CalendarStateService);

  protected readonly title = signal('3dime-angular');
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  // ViewChild references to all expandable cards
  @ViewChild('techStackCard', { read: ExpandableCard }) techStackCard!: ExpandableCard;
  @ViewChild('experienceCard', { read: ExpandableCard }) experienceCard!: ExpandableCard;
  @ViewChild('educationCard', { read: ExpandableCard }) educationCard!: ExpandableCard;
  @ViewChild('githubCard', { read: ExpandableCard }) githubCard!: ExpandableCard;
  @ViewChild('hobbiesCard', { read: ExpandableCard }) hobbiesCard!: ExpandableCard;
  @ViewChild('stuffCard', { read: ExpandableCard }) stuffCard!: ExpandableCard;

  /**
   * Check if all cards are currently expanded
   */
  allExpanded(): boolean {
    return (
      this.techStackCard?.isExpanded() &&
      this.experienceCard?.isExpanded() &&
      this.educationCard?.isExpanded() &&
      this.githubCard?.isExpanded() &&
      this.hobbiesCard?.isExpanded() &&
      this.stuffCard?.isExpanded()
    );
  }

  ngOnInit(): void {
    // Check for service worker updates
    if (isPlatformBrowser(this.platformId) && this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm(PWA_CONFIG.UPDATE_MESSAGE)) {
            window.location.reload();
          }
        });
    }

    // Handle PWA install prompt
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event so it can be triggered later
        this.deferredPrompt = e;
        console.log('PWA install prompt available');
      });

      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        this.deferredPrompt = null;
      });
    }
  }

  /**
   * Toggle all expandable cards between expanded and collapsed states
   */
  toggleAllCards(): void {
    const shouldExpand = !this.allExpanded();
    const cards = [
      this.techStackCard,
      this.experienceCard,
      this.educationCard,
      this.githubCard,
      this.hobbiesCard,
      this.stuffCard
    ];
    cards.forEach(card => {
      if (shouldExpand) {
        card?.expand();
      } else {
        card?.collapse();
      }
    });
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
    // Request export from converter via the shared service
    this.calendarStateService.requestExport();
  }
}
