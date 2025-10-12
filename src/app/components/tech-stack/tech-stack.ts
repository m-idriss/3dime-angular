import { Component, ChangeDetectionStrategy } from '@angular/core';

import { LinkItem } from '../../models/link-item.model';
import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [Card],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStack extends NotionAwareComponent {
  techStack: LinkItem[] = [];

  protected override onDataLoaded(): void {
    this.techStack = this.getItems();
  }

  protected getItems(): LinkItem[] {
    return this.notionService.getTechStacks();
  }
}
