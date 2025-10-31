import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton loader component for showing placeholder content while data is loading.
 * Provides immediate visual feedback to improve perceived performance.
 *
 * @example
 * ```html
 * <!-- Text skeleton -->
 * <app-skeleton-loader type="text" [width]="'200px'" />
 *
 * <!-- Chip skeleton -->
 * <app-skeleton-loader type="chip" [count]="5" />
 *
 * <!-- Link list skeleton -->
 * <app-skeleton-loader type="link" [count]="3" />
 *
 * <!-- Avatar skeleton -->
 * <app-skeleton-loader type="avatar" />
 * ```
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoader {
  /**
   * Type of skeleton to display
   * - text: Single line of text
   * - chip: Pill-shaped chip (like tech stack tags)
   * - link: Link item
   * - avatar: Circular avatar
   * - card: Full card skeleton
   */
  @Input() type: 'text' | 'chip' | 'link' | 'avatar' | 'card' = 'text';

  /**
   * Number of skeleton items to show
   */
  @Input() count: number = 1;

  /**
   * Width of skeleton (for text type)
   */
  @Input() width: string = '100%';

  /**
   * Height of skeleton (for text type)
   */
  @Input() height: string = '1rem';

  get items(): number[] {
    return Array(this.count).fill(0);
  }
}
