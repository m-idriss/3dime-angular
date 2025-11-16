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

  it('should render footer links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerLinks = compiled.querySelectorAll('.footer-link');
    expect(footerLinks.length).toBeGreaterThan(0);
  });

  it('should include About Me link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const aboutMeLink = Array.from(compiled.querySelectorAll('.footer-link')).find(
      (link) => link.textContent?.trim() === 'About Me',
    );
    expect(aboutMeLink).toBeTruthy();
  });

  it('should have About Me as internal link', () => {
    const aboutMeLink = component.footerLinks.find((link) => link.label === 'About Me');
    expect(aboutMeLink).toBeTruthy();
    expect(aboutMeLink?.isInternal).toBe(true);
    expect(aboutMeLink?.url).toBe('/me');
  });
});
