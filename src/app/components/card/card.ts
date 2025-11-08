import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AppTooltipDirective } from '../../shared/directives';

/**
 * Reusable card component providing consistent styling for content sections.
 * Accepts an optional title to display in the card header.
 *
 * @example
 * ```html
 * <app-card title="My Section">
 *   <p>Card content goes here</p>
 * </app-card>
 * ```
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [AppTooltipDirective],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  /**
   * Optional title to display in the card header
   */
  @Input() title?: string;

  /**
   * Whether to show a collapse button in the header
   */
  @Input() showCollapseButton = false;

  /**
   * Event emitted when collapse button is clicked
   */
  @Output() collapseClicked = new EventEmitter<void>();

  /**
   * Handle collapse button click
   */
  onCollapseClick(): void {
    this.collapseClicked.emit();
  }
}
