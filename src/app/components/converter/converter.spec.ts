import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Converter } from './converter';
import { CalendarEvent } from '../../models';

describe('Converter', () => {
  let component: Converter;
  let fixture: ComponentFixture<Converter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Converter],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Converter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Event Editing', () => {
    beforeEach(() => {
      // Setup test events
      const testEvents: CalendarEvent[] = [
        {
          summary: 'Test Event 1',
          start: new Date('2025-01-15T10:00:00'),
          end: new Date('2025-01-15T11:00:00'),
          location: 'Test Location',
          description: 'Test Description',
          isEditing: false,
        },
        {
          summary: 'Test Event 2',
          start: new Date('2025-01-16T14:00:00'),
          end: new Date('2025-01-16T15:00:00'),
          isEditing: false,
        },
      ];
      component['extractedEvents'].set(testEvents);
    });

    it('should enable edit mode for an event', () => {
      component['editEvent'](0);
      const events = component['extractedEvents']();
      expect(events[0].isEditing).toBe(true);
      expect(events[1].isEditing).toBe(false);
    });

    it('should disable edit mode when saving', () => {
      component['editEvent'](0);
      component['saveEvent'](0);
      const events = component['extractedEvents']();
      expect(events[0].isEditing).toBe(false);
    });

    it('should disable edit mode when canceling', () => {
      component['editEvent'](0);
      component['cancelEdit'](0);
      const events = component['extractedEvents']();
      expect(events[0].isEditing).toBe(false);
    });

    it('should delete an event', () => {
      const initialCount = component['extractedEvents']().length;
      component['deleteEvent'](0);
      const events = component['extractedEvents']();
      expect(events.length).toBe(initialCount - 1);
      expect(events[0].summary).toBe('Test Event 2');
    });

    it('should update event field', () => {
      component['updateEventField'](0, 'summary', 'Updated Summary');
      const events = component['extractedEvents']();
      expect(events[0].summary).toBe('Updated Summary');
    });

    it('should format date for input correctly', () => {
      const date = new Date('2025-01-15T10:30:00');
      const formatted = component['formatDateForInput'](date);
      expect(formatted).toBe('2025-01-15T10:30');
    });

    it('should parse date from input correctly', () => {
      const dateStr = '2025-01-15T10:30';
      const parsed = component['parseDateFromInput'](dateStr);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2025);
      expect(parsed.getMonth()).toBe(0); // January
      expect(parsed.getDate()).toBe(15);
    });

    it('should regenerate ICS content after editing', () => {
      component['editEvent'](0);
      component['updateEventField'](0, 'summary', 'Updated Event');
      component['saveEvent'](0);
      const icsContent = component['icsContent']();
      expect(icsContent).toContain('BEGIN:VCALENDAR');
      expect(icsContent).toContain('Updated Event');
      expect(icsContent).toContain('END:VCALENDAR');
    });

    it('should clear ICS content when all events are deleted', () => {
      component['deleteEvent'](0);
      component['deleteEvent'](0);
      const icsContent = component['icsContent']();
      expect(icsContent).toBeNull();
    });
  });
});
