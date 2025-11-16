import { Directive, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NotionService } from '../../services/notion.service';
import { LinkItem } from '../../models';

/**
 * Base class for components that fetch data from NotionService.
 * Provides common loading state and data fetching logic.
 * Supports progressive loading where items appear one by one.
 *
 * Usage: Extend your component with this class and implement getProgressiveItems():
 * ```typescript
 * export class MyComponent extends NotionAwareComponent implements OnInit {
 *   items: LinkItem[] = [];
 *
 *   ngOnInit(): void {
 *     this.loadNotionData();
 *   }
 *
 *   protected getProgressiveItems(): Observable<LinkItem> {
 *     return this.notionService.fetchMyItemsProgressively();
 *   }
 *
 *   protected onItemLoaded(item: LinkItem): void {
 *     this.items.push(item);
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
   * Load data from Notion service progressively.
   * Items are emitted one by one, creating a progressive loading effect.
   * The spinner is hidden after the first item is loaded.
   */
  protected loadNotionData(): void {
    let firstItemLoaded = false;

    this.getProgressiveItems().subscribe({
      next: (item) => {
        this.onItemLoaded(item);

        // Hide loading spinner after first item appears
        if (!firstItemLoaded) {
          this.isLoading = false;
          firstItemLoaded = true;
        }

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading items progressively:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        // Ensure loading is false even if no items were loaded
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Override this method to return an Observable that emits items progressively.
   * @returns Observable that emits LinkItems one by one
   */
  protected abstract getProgressiveItems(): Observable<LinkItem>;

  /**
   * Override this method to handle each item as it is loaded.
   * Typically, you'll push the item to your component's array.
   * @param item The item that was just loaded
   */
  protected abstract onItemLoaded(item: LinkItem): void;
}
