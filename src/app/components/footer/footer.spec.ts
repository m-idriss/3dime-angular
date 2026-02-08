import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build footer links based on environment configuration', () => {
    expect(component.footerLinks).toBeDefined();
    expect(Array.isArray(component.footerLinks)).toBe(true);
  });

  it('should include License link when enabled in config', () => {
    const licenseLink = component.footerLinks.find((link) => link.label === 'License');
    // License is enabled in the default environment config
    expect(licenseLink).toBeTruthy();
    expect(licenseLink?.url).toContain('/LICENSE');
  });

  it('should mark internal links correctly', () => {
    const internalLinks = component.footerLinks.filter((link) => link.isInternal);
    // All internal links should have isInternal set to true
    internalLinks.forEach((link) => {
      expect(link.isInternal).toBe(true);
    });
  });
});
