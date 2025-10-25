import { Component, ChangeDetectionStrategy } from '@angular/core';

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

  protected override onDataLoaded(): void {
    this.education = this.getItems();
  }

  protected getItems(): LinkItem[] {
    return this.notionService.getEducations();
  }
}
