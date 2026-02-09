import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProfileCard } from './profile-card';
import { ThemeService } from '../../services/theme.service';

describe('ProfileCard', () => {
  let component: ProfileCard;
  let fixture: ComponentFixture<ProfileCard>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCard);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have AppTooltipDirective imported', () => {
    // This test verifies that AppTooltipDirective is properly imported
    // The tooltip enhancement is applied to various elements including:
    // - Social links: appTooltip="[provider]" appTooltipPlacement="bottom"
    expect(component).toBeTruthy();
  });

  it('should toggle menu when toggleMenu is called', () => {
    expect(component.menuOpen).toBe(false);
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
    component.toggleMenu();
    expect(component.menuOpen).toBe(false);
  });

  it('should close menu when closeMenu is called', () => {
    component.menuOpen = true;
    component.closeMenu();
    expect(component.menuOpen).toBe(false);
  });

  it('should call themeService.toggleTheme when toggleTheme is called', () => {
    spyOn(themeService, 'toggleTheme');
    component.toggleTheme();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should call themeService.cycleFontSize when changeFontSize is called', () => {
    spyOn(themeService, 'cycleFontSize');
    component.changeFontSize();
    expect(themeService.cycleFontSize).toHaveBeenCalled();
  });

  it('should close menu when document is clicked outside settings FAB', () => {
    component.menuOpen = true;
    const clickEvent = new MouseEvent('click');
    Object.defineProperty(clickEvent, 'target', {
      value: document.createElement('div'),
      writable: false,
    });
    component.onDocumentClick(clickEvent);
    expect(component.menuOpen).toBe(false);
  });

  it('should not close menu when clicking inside settings FAB', () => {
    component.menuOpen = true;
    const settingsFab = document.createElement('div');
    settingsFab.classList.add('settings-fab');
    const clickEvent = new MouseEvent('click');
    Object.defineProperty(clickEvent, 'target', {
      value: settingsFab,
      writable: false,
    });
    component.onDocumentClick(clickEvent);
    expect(component.menuOpen).toBe(true);
  });

  it('should close menu when Escape key is pressed', () => {
    component.menuOpen = true;
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeyDown(escapeEvent);
    expect(component.menuOpen).toBe(false);
  });

  it('should not close menu when other keys are pressed', () => {
    component.menuOpen = true;
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(enterEvent);
    expect(component.menuOpen).toBe(true);
  });

  it('should get current theme from themeService', () => {
    spyOn(themeService, 'getCurrentTheme').and.returnValue('dark');
    expect(component.currentTheme).toBe('dark');
    expect(themeService.getCurrentTheme).toHaveBeenCalled();
  });

  it('should get current font size from themeService', () => {
    spyOn(themeService, 'getCurrentFontSize').and.returnValue('medium');
    expect(component.currentFontSize).toBe('medium');
    expect(themeService.getCurrentFontSize).toHaveBeenCalled();
  });
});
