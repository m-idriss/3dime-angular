import { Injectable } from '@angular/core';

/**
 * Theme configuration interface defining all theme-related options
 */
export interface ThemeConfig {
  THEME_MODES: string[];
  DEFAULT_THEME: string;
  BACKGROUND_MODES: string[];
  DEFAULT_BACKGROUND: string;
  FONT_SIZES: string[];
  DEFAULT_FONT_SIZE: string;
  THEME_DISPLAY_NAMES: Record<string, string>;
  BACKGROUND_DISPLAY_NAMES: Record<string, string>;
  FONT_SIZE_DISPLAY_NAMES: Record<string, string>;
}

/**
 * Service for managing application theme, background, and font size preferences.
 * Persists settings to localStorage and applies them to the DOM.
 *
 * @example
 * ```typescript
 * constructor(private themeService: ThemeService) {}
 *
 * // Cycle through themes
 * this.themeService.cycleTheme();
 *
 * // Get current theme
 * const theme = this.themeService.getCurrentTheme();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly config: ThemeConfig = {
    THEME_MODES: ['dark', 'white', 'glass'],
    DEFAULT_THEME: 'white',
    BACKGROUND_MODES: ['black', 'white'],
    DEFAULT_BACKGROUND: 'white',
    FONT_SIZES: ['normal', 'large', 'small'],
    DEFAULT_FONT_SIZE: 'small',
    THEME_DISPLAY_NAMES: {
      dark: 'Dark Theme',
      white: 'Light Theme',
      glass: 'Glass Theme',
    },
    BACKGROUND_DISPLAY_NAMES: {
      black: 'Black Background',
      white: 'White Background',
    },
    FONT_SIZE_DISPLAY_NAMES: {
      normal: 'Normal',
      large: 'Large',
      small: 'Small',
    },
  };

  private currentTheme: string;
  private currentBackground: string;
  private currentFontSize: string;

  constructor() {
    // Initialize from localStorage or use defaults
    this.currentTheme = localStorage.getItem('theme') || this.config.DEFAULT_THEME;
    this.currentBackground = localStorage.getItem('background') || this.config.DEFAULT_BACKGROUND;
    this.currentFontSize = localStorage.getItem('fontSize') || this.config.DEFAULT_FONT_SIZE;

    // Apply initial theme
    this.applyTheme(this.currentTheme);
    this.applyBackground(this.currentBackground);
    this.applyFontSize(this.currentFontSize);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  getCurrentBackground(): string {
    return this.currentBackground;
  }

  getCurrentFontSize(): string {
    return this.currentFontSize;
  }

  cycleTheme(): string {
    const currentIndex = this.config.THEME_MODES.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.config.THEME_MODES.length;
    const nextTheme = this.config.THEME_MODES[nextIndex];

    this.setTheme(nextTheme);
    return nextTheme;
  }

  toggleBackground(): string {
    const currentIndex = this.config.BACKGROUND_MODES.indexOf(this.currentBackground);
    const nextIndex = (currentIndex + 1) % this.config.BACKGROUND_MODES.length;
    const nextBackground = this.config.BACKGROUND_MODES[nextIndex];

    this.setBackground(nextBackground);
    return nextBackground;
  }

  cycleFontSize(): string {
    const currentIndex = this.config.FONT_SIZES.indexOf(this.currentFontSize);
    const nextIndex = (currentIndex + 1) % this.config.FONT_SIZES.length;
    const nextFontSize = this.config.FONT_SIZES[nextIndex];

    this.setFontSize(nextFontSize);
    return nextFontSize;
  }

  private setTheme(theme: string): void {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  private setBackground(background: string): void {
    this.currentBackground = background;
    localStorage.setItem('background', background);
    this.applyBackground(background);
  }

  private setFontSize(fontSize: string): void {
    this.currentFontSize = fontSize;
    localStorage.setItem('fontSize', fontSize);
    this.applyFontSize(fontSize);
  }

  private applyTheme(theme: string): void {
    const body = document.body;

    // Remove existing theme classes
    this.config.THEME_MODES.forEach((mode) => {
      body.classList.remove(`${mode}-theme`);
    });

    // Add new theme class
    body.classList.add(`${theme}-theme`);
  }

  private applyBackground(background: string): void {
    const body = document.body;
    const bgElement = document.querySelector('.bg') as HTMLElement;

    // Remove existing background classes
    this.config.BACKGROUND_MODES.forEach((mode) => {
      body.classList.remove(`bg-${mode}`);
    });

    // If bg element doesn't exist, just add the class and update theme color
    if (!bgElement) {
      body.classList.add(`bg-${background}`);
      // Still update theme color based on background mode
      switch (background) {
        case 'black':
          this.updateThemeColor('#000000');
          break;
        case 'white':
          this.updateThemeColor('#ffffff');
          break;
        default:
          this.updateThemeColor('#000000');
      }
      return;
    }

    // Apply background-specific DOM changes
    switch (background) {
      case 'white':
        bgElement.innerHTML = '';
        bgElement.style.background = '#ffffff';
        body.classList.add('bg-white');
        this.updateThemeColor('#ffffff');
        break;

      default: // 'black' and any other cases
        bgElement.innerHTML = '';
        bgElement.style.background = '#000000';
        body.classList.add('bg-black');
        this.updateThemeColor('#000000');
        break;
    }
  }

  private applyFontSize(fontSize: string): void {
    const body = document.body;

    // Remove existing font size classes
    this.config.FONT_SIZES.forEach((size) => {
      body.classList.remove(`font-${size}`);
    });

    // Add new font size class
    body.classList.add(`font-${fontSize}`);
  }

  private updateThemeColor(color: string): void {
    let themeColorMeta = document.querySelector('#theme-color-meta') as HTMLMetaElement;
    if (!themeColorMeta) {
      // Create the meta element if it doesn't exist
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      themeColorMeta.id = 'theme-color-meta';
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.content = color;
    document.body.style.setProperty('--body-bg', color);
  }

  getThemeDisplayName(theme: string): string {
    return this.config.THEME_DISPLAY_NAMES[theme] || theme;
  }

  getBackgroundDisplayName(background: string): string {
    return this.config.BACKGROUND_DISPLAY_NAMES[background] || background;
  }

  getFontSizeDisplayName(fontSize: string): string {
    return this.config.FONT_SIZE_DISPLAY_NAMES[fontSize] || fontSize;
  }
}
