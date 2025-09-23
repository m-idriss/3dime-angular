import { Injectable } from '@angular/core';

export interface ThemeConfig {
  THEME_MODES: string[];
  DEFAULT_THEME: string;
  BACKGROUND_MODES: string[];
  DEFAULT_BACKGROUND: string;
  FONT_SIZES: string[];
  DEFAULT_FONT_SIZE: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly config: ThemeConfig = {
    THEME_MODES: ['dark', 'white', 'glass'],
    DEFAULT_THEME: 'glass',
    BACKGROUND_MODES: ['black', 'white', 'video'],
    DEFAULT_BACKGROUND: 'video',
    FONT_SIZES: ['normal', 'large', 'small'],
    DEFAULT_FONT_SIZE: 'normal'
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
    this.config.THEME_MODES.forEach(mode => {
      body.classList.remove(`${mode}-theme`);
    });
    
    // Add new theme class
    body.classList.add(`${theme}-theme`);
    
    // Update meta theme color
    this.updateThemeColor(theme);
  }

  private applyBackground(background: string): void {
    const body = document.body;
    const bgElement = document.querySelector('.bg') as HTMLElement;
    
    // Remove existing background classes
    this.config.BACKGROUND_MODES.forEach(mode => {
      body.classList.remove(`bg-${mode}`);
    });
    
    // If bg element doesn't exist, just add the class and return
    if (!bgElement) {
      body.classList.add(`bg-${background}`);
      return;
    }
    
    // Apply background-specific DOM changes
    switch(background) {
      case 'black':
        bgElement.innerHTML = '';
        bgElement.style.background = '#000000';
        body.classList.add('bg-black');
        break;
        
      case 'white':
        bgElement.innerHTML = '';
        bgElement.style.background = '#ffffff';
        body.classList.add('bg-white');
        break;
        
      case 'video':
        bgElement.innerHTML = `
          <video autoplay muted loop playsinline 
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;"
                 aria-hidden="true">
            <source src="assets/background.mp4" type="video/mp4">
          </video>
        `;
        bgElement.style.background = 'transparent';
        body.classList.add('bg-video');
        break;
        
      default:
        bgElement.innerHTML = '';
        bgElement.style.background = '#000000';
        body.classList.add('bg-black');
    }
  }

  private applyFontSize(fontSize: string): void {
    const body = document.body;
    
    // Remove existing font size classes
    this.config.FONT_SIZES.forEach(size => {
      body.classList.remove(`font-${size}`);
    });
    
    // Add new font size class
    body.classList.add(`font-${fontSize}`);
  }

  private updateThemeColor(theme: string): void {
    let themeColorMeta = document.querySelector('#theme-color-meta') as HTMLMetaElement;
    if (!themeColorMeta) {
      // Create the meta element if it doesn't exist
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      themeColorMeta.id = 'theme-color-meta';
      document.head.appendChild(themeColorMeta);
    }
    const themeColors: { [key: string]: string } = {
      'dark': '#000000',
      'white': '#ffffff',
      'glass': '#1a1a1a'
    };
    themeColorMeta.content = themeColors[theme] || themeColors['glass'];
  }

  getThemeDisplayName(theme: string): string {
    const displayNames: { [key: string]: string } = {
      'dark': 'Dark Theme',
      'white': 'Light Theme',
      'glass': 'Glass Theme'
    };
    return displayNames[theme] || theme;
  }

  getBackgroundDisplayName(background: string): string {
    const displayNames: { [key: string]: string } = {
      'black': 'Black Background',
      'white': 'White Background',
      'video': 'Video Background'
    };
    return displayNames[background] || background;
  }

  getFontSizeDisplayName(fontSize: string): string {
    const displayNames: { [key: string]: string } = {
      'normal': 'Normal',
      'large': 'Large',
      'small': 'Small'
    };
    return displayNames[fontSize] || fontSize;
  }
}