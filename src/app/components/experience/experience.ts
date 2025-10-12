import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

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
