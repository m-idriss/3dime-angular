import { Component, ChangeDetectionStrategy } from '@angular/core';

import { LinkItem } from '../../models/link-item.model';
import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [Card],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience extends NotionAwareComponent {
  experiences: LinkItem[] = [];

  protected override onDataLoaded(): void {
    this.experiences = this.getItems();
  }

  protected getItems(): LinkItem[] {
    return this.notionService.getExperiences();
  }
}
