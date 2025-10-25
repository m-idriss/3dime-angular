import { Directive, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NotionService } from '../../services/notion.service';
import { LinkItem } from '../../models';

/**
 * Base class for components that fetch data from NotionService.
 * Provides common loading state and data fetching logic.
 *
 * Usage: Extend your component with this class and implement getItems():
 * ```typescript
 * export class MyComponent extends NotionAwareComponent implements OnInit {
 *   ngOnInit(): void {
 *     this.loadNotionData();
 *   }
 *
 *   protected getItems(): LinkItem[] {
 *     return this.notionService.getMyItems();
 *   }
 * }
 * ```
 */
@Directive()
export abstract class NotionAwareComponent implements OnInit {
  protected readonly notionService: NotionService = inject(NotionService);
  protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  isLoading = true;

  ngOnInit(): void {
    this.loadNotionData();
  }

  /**
   * Load data from Notion service
   * Subclasses should call this in ngOnInit or override to customize behavior
   */
  protected loadNotionData(): void {
    this.notionService.fetchAll().subscribe(() => {
      this.onDataLoaded();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  /**
   * Override this method to retrieve specific items from NotionService
   * @returns Array of LinkItems for the specific component
   */
  protected abstract getItems(): LinkItem[];

  /**
   * Override this method to perform additional actions after data is loaded
   * Default implementation does nothing
   */
  protected onDataLoaded(): void {
    // Default implementation - override in subclasses if needed
  }
}
