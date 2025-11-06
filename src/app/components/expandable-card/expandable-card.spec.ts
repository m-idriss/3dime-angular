import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpandableCard } from './expandable-card';

describe('ExpandableCard', () => {
  let component: ExpandableCard;
  let fixture: ComponentFixture<ExpandableCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandableCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in collapsed state', () => {
    expect(component.isExpanded()).toBe(false);
  });

  it('should toggle expanded state', () => {
    expect(component.isExpanded()).toBe(false);
    component.toggleExpanded();
    expect(component.isExpanded()).toBe(true);
    component.toggleExpanded();
    expect(component.isExpanded()).toBe(false);
  });

  it('should expand when expand() is called', () => {
    component.expand();
    expect(component.isExpanded()).toBe(true);
  });

  it('should collapse when collapse() is called', () => {
    component.expand();
    expect(component.isExpanded()).toBe(true);
    component.collapse();
    expect(component.isExpanded()).toBe(false);
  });

  it('should have default icon', () => {
    expect(component.icon).toBe('fa-circle');
  });

  it('should accept custom icon', () => {
    component.icon = 'fa-code';
    expect(component.icon).toBe('fa-code');
  });

  it('should have default title', () => {
    expect(component.title).toBe('');
  });

  it('should accept custom title', () => {
    component.title = 'Test Title';
    expect(component.title).toBe('Test Title');
  });

  it('should apply expanded class when expanded', () => {
    component.expand();
    expect(component.expanded).toBe(true);
  });

  it('should apply compact class when collapsed', () => {
    component.collapse();
    expect(component.compact).toBe(true);
  });
});
