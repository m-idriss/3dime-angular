import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [Card],
  templateUrl: './education.html',
  styleUrl: './education.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Education extends NotionAwareComponent {
  education: LinkItem[] = [];

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchEducationsProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.education.push(item);
  }
}
