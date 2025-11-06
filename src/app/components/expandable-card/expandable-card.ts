import { Component, Input, signal, HostBinding } from '@angular/core';
import { NgIf } from '@angular/common';

/**
 * Expandable card component that can display in compact icon mode or full expanded mode.
 * Used for secondary content that can be toggled on demand.
 */
@Component({
  selector: 'app-expandable-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './expandable-card.html',
  styleUrl: './expandable-card.scss',
})
export class ExpandableCard {
  /**
   * Icon class for the card (e.g., 'fa-code', 'fa-briefcase')
   */
  @Input() icon = 'fa-circle';

  /**
   * Title/label for the card
   */
  @Input() title = '';

  /**
   * Optional aria label for accessibility
   */
  @Input() ariaLabel = '';

  /**
   * Whether card is currently expanded
   */
  isExpanded = signal(false);

  /**
   * Apply expanded class to host element for styling
   */
  @HostBinding('class.expanded') get expanded() {
    return this.isExpanded();
  }

  /**
   * Apply compact class to host element for styling
   */
  @HostBinding('class.compact') get compact() {
    return !this.isExpanded();
  }

  /**
   * Toggle between compact and expanded states
   */
  toggleExpanded(): void {
    this.isExpanded.update((v) => !v);
  }

  /**
   * Expand the card
   */
  expand(): void {
    this.isExpanded.set(true);
  }

  /**
   * Collapse the card
   */
  collapse(): void {
    this.isExpanded.set(false);
  }
}
