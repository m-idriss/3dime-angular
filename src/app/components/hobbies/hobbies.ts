import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [Card, MatChipsModule, MatDividerModule],
  templateUrl: './hobbies.html',
  styleUrl: './hobbies.scss',
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
