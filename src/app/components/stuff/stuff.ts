import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-stuff',
  standalone: true,
  imports: [Card],
  templateUrl: './stuff.html',
  styleUrl: './stuff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stuff extends NotionAwareComponent {
  stuffs: LinkItem[] = [];

  protected override onDataLoaded(): void {
    this.stuffs = this.getItems();
  }

  protected getItems(): LinkItem[] {
    return this.notionService.getStuffs();
  }
}
