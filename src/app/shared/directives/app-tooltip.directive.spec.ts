import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppTooltipDirective } from './app-tooltip.directive';

@Component({
  template: `
    <button appTooltip="Test tooltip" data-testid="default-btn">Default</button>
    <button appTooltip="Left tooltip" appTooltipPlacement="left" data-testid="left-btn">
      Left
    </button>
  `,
  standalone: true,
  imports: [AppTooltipDirective],
})
class TestComponent {}

describe('AppTooltipDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply tooltip to element', () => {
    const button = fixture.debugElement.query(By.css('[data-testid="default-btn"]'));
    expect(button).toBeTruthy();
  });

  it('should have default placement of top', () => {
    const button = fixture.debugElement.query(By.css('[data-testid="default-btn"]'));
    const directive = button.injector.get(AppTooltipDirective);
    expect(directive.appTooltipPlacement).toBe('top');
  });

  it('should allow custom placement', () => {
    const button = fixture.debugElement.query(By.css('[data-testid="left-btn"]'));
    const directive = button.injector.get(AppTooltipDirective);
    expect(directive.appTooltipPlacement).toBe('left');
  });
});
