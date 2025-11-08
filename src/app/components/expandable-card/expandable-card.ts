import { Component, Input, signal, HostBinding, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AppTooltipDirective } from '../../shared/directives';

/**
 * Expandable card component that can display in compact icon mode or full expanded mode.
 * Used for secondary content that can be toggled on demand.
 */
@Component({
  selector: 'app-expandable-card',
  standalone: true,
  imports: [NgIf, AppTooltipDirective],
  templateUrl: './expandable-card.html',
  styleUrl: './expandable-card.scss',
})
export class ExpandableCard implements OnInit {
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
   * Whether card should always stay expanded and not allow collapsing
   */
  @Input() alwaysExpanded = false;

  /**
   * Whether the child content provides its own collapse button
   */
  @Input() childHasCollapseButton = false;

  /**
   * Whether card is currently expanded
   */
  isExpanded = signal(false);

  ngOnInit(): void {
    if (this.alwaysExpanded) {
      this.isExpanded.set(true);
    }
  }

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
    // Don't allow toggle if alwaysExpanded is true
    if (this.alwaysExpanded) {
      return;
    }
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
    // Don't allow collapse if alwaysExpanded is true
    if (this.alwaysExpanded) {
      return;
    }
    this.isExpanded.set(false);
  }
}
