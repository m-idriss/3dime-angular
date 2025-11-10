import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarView } from './calendar-view';
import { CalendarEvent } from '../../models';

describe('CalendarView', () => {
  let component: CalendarView;
  let fixture: ComponentFixture<CalendarView>;

  const mockEvents: CalendarEvent[] = [
    {
      summary: 'Test Event 1',
      start: new Date('2025-01-15T10:00:00'),
      end: new Date('2025-01-15T11:00:00'),
      location: 'Test Location',
      description: 'Test Description'
    },
    {
      summary: 'Test Event 2',
      start: new Date('2025-01-16T14:00:00'),
      end: new Date('2025-01-16T15:00:00'),
      location: 'Another Location',
      description: 'Another Description'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarView]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarView);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('events', mockEvents);
    fixture.componentRef.setInput('visible', true);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display calendar when visible is true', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    
    const modalOverlay = fixture.nativeElement.querySelector('.calendar-modal-overlay');
    expect(modalOverlay).toBeTruthy();
  });

  it('should not display calendar when visible is false', () => {
    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();
    
    const modalOverlay = fixture.nativeElement.querySelector('.calendar-modal-overlay');
    expect(modalOverlay).toBeFalsy();
  });

  it('should emit visibleChange when close button is clicked', () => {
    let emittedValue: boolean | undefined;
    component.visibleChange.subscribe((value: boolean) => {
      emittedValue = value;
    });

    const closeButton = fixture.nativeElement.querySelector('.close-button');
    closeButton?.click();
    
    expect(emittedValue).toBe(false);
  });

  it('should emit exportIcs when export button is clicked', () => {
    let exportCalled = false;
    component.exportIcs.subscribe(() => {
      exportCalled = true;
    });

    const exportButton = fixture.nativeElement.querySelector('.export-btn');
    exportButton?.click();
    
    expect(exportCalled).toBe(true);
  });

  it('should have calendar options configured', () => {
    const options = component['calendarOptions']();
    
    expect(options.editable).toBe(true);
    expect(options.selectable).toBe(true);
    expect(options.initialView).toBe('dayGridMonth');
  });
});
