import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.scss'
})
export class BackToTop {
  protected readonly isVisible = signal(false);
  private readonly scrollThreshold = 300; // Show button after scrolling 300px

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isVisible.set(scrollPosition > this.scrollThreshold);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.scrollToTop();
    }
  }
}
