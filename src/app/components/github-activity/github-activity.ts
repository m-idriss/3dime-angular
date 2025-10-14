import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Tooltip from 'cal-heatmap/plugins/Tooltip';

import { ProfileService, CommitData } from '../../services/profile.service';
import { Card } from '../card/card';
import { GITHUB_ACTIVITY_CONFIG } from '../../constants/app.constants';

/**
 * Component displaying GitHub commit activity as a heatmap calendar.
 * Uses CalHeatmap library to visualize commit frequency over time.
 * Implements OnPush change detection for optimal performance.
 */
@Component({
  selector: 'app-github-activity',
  standalone: true,
  imports: [Card],
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubActivity implements AfterViewInit {
  @ViewChild('heatmapContainer', { static: false }) container!: ElementRef;
  data: CommitData[] = [];
  months = GITHUB_ACTIVITY_CONFIG.DEFAULT_MONTHS;
  isLoading = true;

  constructor(
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.profileService.getCommits(this.months).subscribe((commits: CommitData[]) => {
      this.data = commits;
      this.isLoading = false;
      this.cdr.markForCheck();

      // Wait for next tick to ensure the view has been updated
      setTimeout(() => {
        if (this.container) {
          this.renderHeatmap();
        }
      }, 0);
    });
  }

  /**
   * Render the commit activity heatmap using CalHeatmap library.
   * Configures color scale, date range, and interactive tooltips.
   */
  renderHeatmap(): void {
    const cal: any = new CalHeatmap();

    cal.paint(
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
            baseColor: '#276302',
            type: 'linear',
            domain: [-1, 30],
          },
        },
      },
      [
        [
          CalendarLabel,
          {
            position: 'left',
            key: 'left',
            text: () => ['', 'Mon', '', 'Wen', '', 'Fri', ''],
            textAlign: 'end',
            width: 20,
            padding: [25, 5, 0, 0],
          },
        ],
        [
          Tooltip,
          {
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
  }
}
