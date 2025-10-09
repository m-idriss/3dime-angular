import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import { ProfileService, CommitData } from '../../services/profile.service';
import { Card } from '../card/card';

@Component({
  selector: 'app-github-activity',
    standalone: true,
      imports: [Card],
  templateUrl: './github-activity.html',
  styleUrls: ['./github-activity.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubActivity implements AfterViewInit {
  @ViewChild('heatmapContainer', { static: false }) container!: ElementRef;
  data: CommitData[] = [];
  months = 6;
  isLoading = true;

  constructor(
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef
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

  renderHeatmap() {
    const cal: any = new CalHeatmap();

    cal.paint(
      {
        itemSelector: this.container.nativeElement,
        domain: {
          type: 'month',
          label: { text: 'MMM', textAlign: 'start', position: 'top'}
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
          color: {
            range: ['rgba(0, 50, 0, 0)', 'rgba(0, 20, 0, 0.05)', 'rgba(0, 100, 0, 0.25)', 'rgba(0, 100, 0, 0.5)', 'rgba(0, 100, 0, 0.75)', 'rgba(0, 100, 0, 1)'],
            interpolate: 'hsl',
            type: 'linear',
            domain: [-1, 0, 3, 5, 10, 20],
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
            text: (timestamp: number, value: number, dayjsDate: any) =>
              `${value ?? 0} commits on ${dayjsDate.format('LL')}`,
          },
        ],
      ]
    );
  }
}
