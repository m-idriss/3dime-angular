import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoader } from './skeleton-loader';

describe('SkeletonLoader', () => {
  let component: SkeletonLoader;
  let fixture: ComponentFixture<SkeletonLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoader);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render text skeleton by default', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('.skeleton-text');
    expect(skeleton).toBeTruthy();
  });

  it('should render multiple items based on count', () => {
    component.count = 3;
    component.type = 'text';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeletons = compiled.querySelectorAll('.skeleton-text');
    expect(skeletons.length).toBe(3);
  });

  it('should render chip skeleton when type is chip', () => {
    fixture = TestBed.createComponent(SkeletonLoader);
    component = fixture.componentInstance;
    component.type = 'chip';
    component.count = 5;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeletons = compiled.querySelectorAll('.skeleton-chip');
    expect(skeletons.length).toBe(5);
  });

  it('should render link skeleton when type is link', () => {
    fixture = TestBed.createComponent(SkeletonLoader);
    component = fixture.componentInstance;
    component.type = 'link';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('.skeleton-link');
    expect(skeleton).toBeTruthy();
  });

  it('should render avatar skeleton when type is avatar', () => {
    fixture = TestBed.createComponent(SkeletonLoader);
    component = fixture.componentInstance;
    component.type = 'avatar';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('.skeleton-avatar');
    expect(skeleton).toBeTruthy();
  });

  it('should render card skeleton when type is card', () => {
    fixture = TestBed.createComponent(SkeletonLoader);
    component = fixture.componentInstance;
    component.type = 'card';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('.skeleton-card');
    expect(skeleton).toBeTruthy();
  });

  it('should have proper ARIA labels for accessibility', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('[role="status"]');
    expect(skeleton).toBeTruthy();
    expect(skeleton?.getAttribute('aria-label')).toContain('Loading');
  });

  it('should return correct items array', () => {
    component.count = 5;
    expect(component.items.length).toBe(5);
  });
});
