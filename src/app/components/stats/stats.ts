import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, Statistics } from '../../services/stats.service';

/**
 * Stats component displaying platform statistics (file and event counts).
 * Shows engaging metrics with animated counters and glassmorphism design.
 * Includes loading state and responsive layout.
 */
@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  private readonly statsService = inject(StatsService);

  // Signals for reactive state
  readonly loading = signal(true);
  readonly fileCount = signal(0);
  readonly eventCount = signal(0);
  readonly displayFileCount = signal(0);
  readonly displayEventCount = signal(0);
  readonly hasError = signal(false);

  ngOnInit(): void {
    this.loadStatistics();
  }

  /**
   * Load statistics from the backend API
   */
  private loadStatistics(): void {
    this.statsService.getStatistics().subscribe({
      next: (stats: Statistics) => {
        this.fileCount.set(stats.fileCount);
        this.eventCount.set(stats.eventCount);
        this.loading.set(false);

        // Animate the counters
        this.animateCounter(stats.fileCount, this.displayFileCount);
        this.animateCounter(stats.eventCount, this.displayEventCount);
      },
      error: (err) => {
        console.error('Failed to load statistics:', err);
        this.hasError.set(true);
        this.loading.set(false);
      }
    });
  }

  /**
   * Animate counter from 0 to target value
   */
  private animateCounter(target: number, signal: any): void {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        signal.set(target);
        clearInterval(interval);
      } else {
        signal.set(Math.floor(current));
      }
    }, stepDuration);
  }

  /**
   * Format number with thousand separators
   */
  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
