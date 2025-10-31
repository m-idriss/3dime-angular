import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [Card],
  templateUrl: './hobbies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hobbies extends NotionAwareComponent {
  hobbies: LinkItem[] = [];

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchHobbiesProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.hobbies.push(item);
  }
}
