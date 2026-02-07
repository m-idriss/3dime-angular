import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

import { GithubService, CommitData } from '../../services/github.service';
import { Card } from '../card/card';
import { SkeletonLoader } from '../skeleton-loader/skeleton-loader';
import { GITHUB_ACTIVITY_CONFIG } from '../../constants/app.constants';

@Component({
  selector: 'app-github-activity',
  standalone: true,
  imports: [Card, LayoutModule, SkeletonLoader],
  templateUrl: './github-activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubActivity implements AfterViewInit, OnDestroy {
  private readonly githubService = inject(GithubService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly breakpointObserver = inject(BreakpointObserver);

  @ViewChild('heatmapContainer', { static: false }) container!: ElementRef;

  /**
   * Whether to show collapse button in the card header
   */
  @Input() showCollapseButton = false;

  /**
   * Event emitted when collapse button is clicked
   */
  @Output() collapseClicked = new EventEmitter<void>();

  data: CommitData[] = [];
  months = GITHUB_ACTIVITY_CONFIG.DEFAULT_MONTHS;
  isLoading = true;
  // CalHeatmap doesn't provide TypeScript types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cal: any;
  private breakpointSub!: Subscription;

  ngAfterViewInit(): void {
    this.breakpointSub = this.breakpointObserver
      .observe(['(max-width: 450px)'])
      .subscribe((result: { matches: boolean }) => {
        this.months = result.matches
          ? Math.max(1, GITHUB_ACTIVITY_CONFIG.DEFAULT_MONTHS - 1)
          : GITHUB_ACTIVITY_CONFIG.DEFAULT_MONTHS;

        this.loadCommits();
      });
  }

  ngOnDestroy(): void {
    this.breakpointSub?.unsubscribe();
  }

  private previousMonths?: number;

  private loadCommits(): void {
    if (this.data.length && this.months === this.previousMonths) {
      return;
    }

    this.previousMonths = this.months;

    this.isLoading = true;
    this.githubService.getCommits(this.months).subscribe((commits) => {
      this.data = commits;
      this.isLoading = false;
      this.cdr.markForCheck();

      setTimeout(() => this.renderHeatmap(), 0);
    });
  }

  async renderHeatmap(): Promise<void> {
    if (this.container?.nativeElement) {
      this.container.nativeElement.innerHTML = '';
    }

    if (this.cal) {
      try {
        this.cal.destroy();
      } catch (e) {
        // cal.destroy() may throw an error if called too early
        console.warn('Error destroying previous CalHeatmap instance:', e);
      }
    }

    try {
      // Dynamically import cal-heatmap and its plugins only when needed (lazy loading)
      const CalHeatmapModule = await import('cal-heatmap');
      const CalHeatmap = CalHeatmapModule.default;

      const [CalendarLabelModule, TooltipModule] = await Promise.all([
        import('cal-heatmap/plugins/CalendarLabel'),
        import('cal-heatmap/plugins/Tooltip'),
      ]);

      const CalendarLabel = CalendarLabelModule.default;
      const Tooltip = TooltipModule.default;

      this.cal = new CalHeatmap();

      this.cal.paint(
        {
          itemSelector: this.container.nativeElement,
          domain: {
            type: 'month',
            label: { text: 'MMM', textAlign: 'start', position: 'top' },
          },
          subDomain: {
            type: 'ghDay',
            radius: 2,
            width: 9,
            height: 9,
            gutter: 1,
          },
          data: {
            source: this.data,
            x: (d: { date: number; value: number }) => d.date,
            y: (d: { date: number; value: number }) => d.value,
            defaultValue: -1,
          },
          theme: 'dark',
          date: {
            start: new Date(new Date().setMonth(new Date().getMonth() - (this.months - 1))),
            locale: { weekStart: 7 },
            highlight: [new Date()],
          },
          range: this.months,
          scale: {
            opacity: {
              baseColor: '#764ba2',
              type: 'linear',
              domain: [-1, 15],
            },
          },
        },
        [
          [
            CalendarLabel,
            {
              position: 'left',
              key: 'left',
              text: () => ['', 'Mon', '', 'Wed', '', 'Fri', ''],
              textAlign: 'end',
              width: 20,
              padding: [25, 5, 0, 0],
            },
          ],
          [
            Tooltip,
            {
              // dayjsDate is from cal-heatmap library without proper types
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              text: (_timestamp: number, value: number, dayjsDate: any) => {
                if (value === 0) {
                  return `No contributions on ${dayjsDate.format('LL')}`;
                } else if (value === 1) {
                  return `1 contribution on ${dayjsDate.format('LL')}`;
                } else if (value > 1) {
                  return `${value} contributions on ${dayjsDate.format('LL')}`;
                } else {
                  return '';
                }
              },
            },
          ],
        ],
      );
    } catch (error) {
      console.error('Error loading or rendering cal-heatmap:', error);
      // Optionally, display a fallback UI or message to the user
      if (this.container?.nativeElement) {
        this.container.nativeElement.innerHTML =
          '<div style="padding: 1rem; text-align: center; color: #888;">Failed to load activity heatmap</div>';
      }
    }
  }

  /**
   * Handle collapse button click from Card component
   */
  onCardCollapseClick(): void {
    this.collapseClicked.emit();
  }
}
