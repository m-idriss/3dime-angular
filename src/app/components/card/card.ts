import { Component, Input } from '@angular/core';

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
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  /**
   * Optional title to display in the card header
   */
  @Input() title?: string;
}
