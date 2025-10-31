import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../card/card';
import { SkeletonLoader } from '../skeleton-loader/skeleton-loader';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [Card, SkeletonLoader],
  templateUrl: './experience.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience extends NotionAwareComponent {
  experiences: LinkItem[] = [];

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchExperiencesProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.experiences.push(item);
  }
}
