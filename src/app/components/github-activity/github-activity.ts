import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Tooltip from 'cal-heatmap/plugins/Tooltip';

interface CommitWeek {
  week: number;
  total: number;
  days: number[];
}

interface CommitResponse {
  commit_activity: CommitWeek[];
}

@Component({
  selector: 'app-github-activity',
  templateUrl: './github-activity.html',
  styleUrls: ['./github-activity.scss'],
})
export class GithubActivity implements AfterViewInit {
  @ViewChild('heatmapContainer', { static: true }) container!: ElementRef;
  data: CommitWeek[] = [];

  constructor(private readonly http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get<CommitResponse>('https://www.3dime.com/proxy.php?service=github&type=commits_all').subscribe((res) => {
      this.data = res.commit_activity;
      this.renderHeatmap();
    });
  }

  renderHeatmap() {
    const cal: any = new (CalHeatmap as any)();

    const dataObj: { date: number; value: number }[] = [];
    this.data.forEach((week) => {
      week.days.forEach((count, i) => {
        const dayTimestamp = (week.week + i * 86400) * 1000;
        dataObj.push({ date: dayTimestamp, value: count });
      });
    });

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
          source: dataObj,
          x: (d: { date: number; value: number }) => d.date,
          y: (d: { date: number; value: number }) => d.value,
          defaultValue: 0,
        },
      theme: 'dark',
      date: {
            start: new Date(new Date().setMonth(new Date().getMonth() - 5)),
            locale: { weekStart: 1 },
            highlight: [new Date()],
          },
        range: 7,
        scale: {
              color: {
                range: ['rgba(0, 50, 0, 0.1)', 'green'],
                interpolate: 'hsl',
                type: 'linear',
                domain: [0, 15],
              },
            }
      },
      [
[
        CalendarLabel,
        {
          position: 'left',
          key: 'left',
          text: () => ['Mon', '', '', 'Thu', '', '', 'Sun'],
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
