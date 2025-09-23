import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.html',
  styleUrls: ['./profile-card.scss']
})
export class ProfileCard {
  menuOpen = false;

  constructor(private themeService: ThemeService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const burgerMenu = target.closest('.burger-menu');
    
    // If click is outside burger menu, close it
    if (!burgerMenu && this.menuOpen) {
      this.closeMenu();
    }
  }

  // Close menu on ESC key
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.menuOpen) {
      this.closeMenu();
    }
  }

  cycleTheme() {
    this.themeService.cycleTheme();
    // Menu stays open to see immediate feedback
  }

  toggleVideoBg() {
    this.themeService.toggleBackground();
    // Menu stays open to see immediate feedback
  }

  changeFontSize() {
    this.themeService.cycleFontSize();
    // Menu stays open to see immediate feedback
  }

  // Helper methods for template
  get currentTheme(): string {
    return this.themeService.getCurrentTheme();
  }

  get currentBackground(): string {
    return this.themeService.getCurrentBackground();
  }

  get currentFontSize(): string {
    return this.themeService.getCurrentFontSize();
  }

  get themeDisplayName(): string {
    return this.themeService.getThemeDisplayName(this.currentTheme);
  }

  get backgroundDisplayName(): string {
    return this.themeService.getBackgroundDisplayName(this.currentBackground);
  }

  get fontSizeDisplayName(): string {
    return this.themeService.getFontSizeDisplayName(this.currentFontSize);
  }
}
