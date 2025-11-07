import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../card/card';
import { SkeletonLoader } from '../skeleton-loader/skeleton-loader';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [Card, SkeletonLoader],
  templateUrl: './hobbies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hobbies extends NotionAwareComponent {
  hobbies: LinkItem[] = [];

  /**
   * Whether to show collapse button in the card header
   */
  @Input() showCollapseButton = false;

  /**
   * Event emitted when collapse button is clicked
   */
  @Output() collapseClicked = new EventEmitter<void>();

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchHobbiesProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.hobbies.push(item);
  }

  /**
   * Handle collapse button click from Card component
   */
  onCardCollapseClick(): void {
    this.collapseClicked.emit();
  }
}
