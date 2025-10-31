import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-stuff',
  standalone: true,
  imports: [Card],
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
