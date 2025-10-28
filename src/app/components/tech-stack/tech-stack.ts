import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [Card, MatChipsModule, MatDividerModule],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStack extends NotionAwareComponent {
  techStack: LinkItem[] = [];

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchTechStacksProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.techStack.push(item);
  }
}
