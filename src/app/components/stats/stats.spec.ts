import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Stats } from './stats';
import { StatsService, Statistics } from '../../services/stats.service';

describe('Stats', () => {
  let component: Stats;
  let fixture: ComponentFixture<Stats>;
  let statsService: jasmine.SpyObj<StatsService>;

  beforeEach(async () => {
    const statsServiceSpy = jasmine.createSpyObj('StatsService', ['getStatistics']);

    await TestBed.configureTestingModule({
      imports: [Stats],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StatsService, useValue: statsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Stats);
    component = fixture.componentInstance;
    statsService = TestBed.inject(StatsService) as jasmine.SpyObj<StatsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state initially', () => {
    const mockStats: Statistics = { fileCount: 100, eventCount: 200 };
    statsService.getStatistics.and.returnValue(of(mockStats));

    expect(component.loading()).toBe(true);
  });

  it('should load statistics on init', () => {
    const mockStats: Statistics = { fileCount: 1500, eventCount: 3000 };
    statsService.getStatistics.and.returnValue(of(mockStats));

    fixture.detectChanges(); // ngOnInit

    expect(statsService.getStatistics).toHaveBeenCalled();
    expect(component.fileCount()).toBe(1500);
    expect(component.eventCount()).toBe(3000);
    expect(component.loading()).toBe(false);
  });

  it('should handle API errors gracefully', () => {
    statsService.getStatistics.and.returnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges(); // ngOnInit

    expect(component.hasError()).toBe(true);
    expect(component.loading()).toBe(false);
  });

  it('should format numbers with thousand separators', () => {
    expect(component.formatNumber(1000)).toBe('1,000');
    expect(component.formatNumber(1000000)).toBe('1,000,000');
    expect(component.formatNumber(42)).toBe('42');
  });

  it('should display stats content when loaded', () => {
    const mockStats: Statistics = { fileCount: 500, eventCount: 1000 };
    statsService.getStatistics.and.returnValue(of(mockStats));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.stats-content')).toBeTruthy();
    expect(compiled.querySelector('.stats-title')).toBeTruthy();
    expect(compiled.querySelector('.stats-tagline')).toBeTruthy();
  });

  it('should display error state when error occurs', () => {
    statsService.getStatistics.and.returnValue(throwError(() => new Error('Test error')));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.stats-error')).toBeTruthy();
  });

  it('should have proper accessibility attributes', () => {
    const mockStats: Statistics = { fileCount: 100, eventCount: 200 };
    statsService.getStatistics.and.returnValue(of(mockStats));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('.stats-section');
    expect(section.getAttribute('aria-label')).toBe('Platform Statistics');
  });
});
