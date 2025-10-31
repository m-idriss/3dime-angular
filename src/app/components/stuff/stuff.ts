import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../card/card';
import { SkeletonLoader } from '../skeleton-loader/skeleton-loader';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-stuff',
  standalone: true,
  imports: [Card, SkeletonLoader],
  templateUrl: './stuff.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stuff extends NotionAwareComponent {
  stuffs: LinkItem[] = [];

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchStuffsProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.stuffs.push(item);
  }
}
