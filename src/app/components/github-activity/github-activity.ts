import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Tooltip from 'cal-heatmap/plugins/Tooltip';

import { ProfileService, CommitData } from '../../services/profile.service';
import { Card } from '../card/card';
import { GITHUB_ACTIVITY_CONFIG } from '../../constants/app.constants';

@Component({
  selector: 'app-github-activity',
  standalone: true,
  imports: [Card],
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubActivity implements AfterViewInit, OnDestroy {
  @ViewChild('heatmapContainer', { static: false }) container!: ElementRef;
  data: CommitData[] = [];
  months = GITHUB_ACTIVITY_CONFIG.DEFAULT_MONTHS;
  isLoading = true;
  private cal: any;
  private breakpointSub!: Subscription;

  constructor(
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef,
    private readonly breakpointObserver: BreakpointObserver,
  ) {}

  ngAfterViewInit(): void {
    this.breakpointSub = this.breakpointObserver
      .observe(['(max-width: 1068px)'])
      .subscribe(result => {
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
    this.profileService.getCommits(this.months).subscribe(commits => {
      this.data = commits;
      this.isLoading = false;
      this.cdr.markForCheck();

      setTimeout(() => this.renderHeatmap(), 0);
    });
  }

  renderHeatmap(): void {
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
            baseColor: '#016b26',
            type: 'linear',
            domain: [-1, 20],
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
