import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../card/card';
import { SkeletonLoader } from '../skeleton-loader/skeleton-loader';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [Card, SkeletonLoader],
  templateUrl: './tech-stack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStack extends NotionAwareComponent {
  techStack: LinkItem[] = [];

  /**
   * Whether to show collapse button in the card header
   */
  @Input() showCollapseButton = false;

  /**
   * Event emitted when collapse button is clicked
   */
  @Output() collapseClicked = new EventEmitter<void>();

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchTechStacksProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.techStack.push(item);
  }

  /**
   * Handle collapse button click from Card component
   */
  onCardCollapseClick(): void {
    this.collapseClicked.emit();
  }
}
