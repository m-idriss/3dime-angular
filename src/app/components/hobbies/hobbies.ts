import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [Card],
  templateUrl: './hobbies.html',
  styleUrl: './hobbies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hobbies extends NotionAwareComponent {
  hobbies: LinkItem[] = [];

  protected override onDataLoaded(): void {
    this.hobbies = this.getItems();
  }

  protected getItems(): LinkItem[] {
    return this.notionService.getHobbies();
  }
}
