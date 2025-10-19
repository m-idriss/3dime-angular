import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import ICAL from '../../libs/ical-wrapper'; // ⚡ Wrapper to ensure parse() exists

import { ConverterService, FileData } from '../../services/converter';
import { Card } from '../card/card';
import { AuthAwareComponent } from '../base/auth-aware.component';
import { CalendarEvent } from '../../models';
import { FILE_UPLOAD_CONSTRAINTS } from '../../constants';
import { formatIcsDate, getMonthDay, getTime } from '../../utils';

@Component({
  selector: 'app-converter',
  imports: [Card, FormsModule],
  templateUrl: './converter.html',
  styleUrl: './converter.scss',
})
export class Converter extends AuthAwareComponent implements OnInit {
  protected readonly files = signal<File[]>([]);
  protected readonly isDragging = signal(false);
  protected readonly isProcessing = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly extractedEvents = signal<CalendarEvent[]>([]);
  protected readonly icsContent = signal<string | null>(null);

  private readonly acceptedTypes = FILE_UPLOAD_CONSTRAINTS.ACCEPTED_TYPES;
  private readonly maxFileSize = FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE;

  constructor(
    private readonly converterService: ConverterService,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {
    super();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this.handleSharedFiles();
  }

  private async handleSharedFiles(): Promise<void> {
    if ('launchQueue' in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (!launchParams.files?.length) return;

        try {
          const sharedFiles: File[] = [];
          for (const fileHandle of launchParams.files) {
            const file = await fileHandle.getFile();
            sharedFiles.push(file);
          }

          if (sharedFiles.length) {
            this.addFiles(sharedFiles);
            this.scrollToConverter();
            console.log(`Received ${sharedFiles.length} file(s) via PWA share target`);
          }
        } catch (error) {
          console.error('Error handling shared files:', error);
          this.errorMessage.set('Failed to load shared files. Please try again.');
        }
      });
    }
  }

  private scrollToConverter(): void {
    setTimeout(() => {
      const converterElement = document.getElementById('converter');
      if (converterElement) converterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    this.addFiles(Array.from(event.dataTransfer?.files || []));
  }

  protected onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files || []);
    this.addFiles(selectedFiles);
    input.value = '';
  }

  private addFiles(newFiles: File[]): void {
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);

    const validFiles = newFiles.filter((file) => {
      if (this.files().some((f) => f.name === file.name && f.size === file.size)) {
        this.errorMessage.set(`Duplicate file skipped: ${file.name}`);
        return false;
      }
      if (!(this.acceptedTypes as readonly string[]).includes(file.type)) {
        this.errorMessage.set(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size === 0) {
        this.errorMessage.set(`Empty file: ${file.name}`);
        return false;
      }
      if (file.size > this.maxFileSize) {
        this.errorMessage.set(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length) this.files.update((current) => [...current, ...validFiles]);
  }

  protected async convertToIcs(): Promise<void> {
    if (!this.files().length) {
      this.errorMessage.set('Please add at least one file.');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);

    try {
      const fileDataArrays = await Promise.all(
        this.files().map(async (file) => {
          if (file.type === 'application/pdf') {
            const imageDataUrls = await this.converterService.pdfToImages(file);
            return imageDataUrls.map(
              (dataUrl, index) =>
                ({
                  dataUrl,
                  name: `${file.name} (Page ${index + 1})`,
                  type: 'image/jpeg',
                } as FileData)
            );
          } else {
            const dataUrl = await this.converterService.fileToDataUrl(file);
            return [{ dataUrl, name: file.name, type: file.type } as FileData];
          }
        })
      );

      const fileData = fileDataArrays.flat();

      this.converterService.convertToIcs(fileData).subscribe({
        next: (response) => {
          if (response.success && response.icsContent) {
            this.icsContent.set(response.icsContent);
            this.parseIcsContent(response.icsContent); // ⚡ Using ical.js wrapper
          } else {
            this.errorMessage.set(response.error || 'Failed to convert files.');
          }
          this.isProcessing.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || err.message || 'Conversion error.');
          this.isProcessing.set(false);
        },
      });
    } catch (err) {
      this.errorMessage.set((err as Error).message || 'Failed to process files.');
      this.isProcessing.set(false);
    }
  }

  // ⚡ Parse ICS content using ical.js wrapper (works dev + prod)
  private parseIcsContent(icsContent: string): void {
    try {
      const jcalData = ICAL.parse(icsContent);
      const calendar = new ICAL.Component(jcalData);
      const vevents: any[] = calendar.getAllSubcomponents('vevent');

      const events: CalendarEvent[] = vevents.map((vevent: any) => {
        const eventComp = new ICAL.Event(vevent);
        return {
          summary: eventComp.summary,
          description: eventComp.description,
          location: eventComp.location,
          start: eventComp.startDate.toJSDate(),
          end: eventComp.endDate.toJSDate(),
        };
      });

      this.extractedEvents.set(events);
    } catch (error) {
      console.error('Failed to parse ICS with ical.js:', error);
      this.extractedEvents.set([]);
      this.errorMessage.set('Failed to parse generated ICS file.');
    }
  }

  protected downloadIcs(): void {
    if (this.icsContent()) this.converterService.downloadIcsFile(this.icsContent()!);
  }

  protected resetState(): void {
    this.files.set([]);
    this.isDragging.set(false);
    this.isProcessing.set(false);
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);
  }

  // ⚡ Restore methods required by template
  async signIn(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
    } catch (error: any) {
      let message = 'Failed to sign in. Please try again.';
      if (error?.message) message += ` (${error.message})`;
      this.errorMessage.set(message);
      console.error('Sign in error:', error);
    }
  }

  protected removeFile(index: number): void {
    this.files.update((current) => current.filter((_, i) => i !== index));
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);
  }

  protected getMonthDay(dateStr: string | Date): string {
    if (typeof dateStr === 'string') {
      return getMonthDay(dateStr);
    } else {
      // Convert Date object to "DD/MM/YYYY HH:MM" format expected by utility
      const day = dateStr.getDate().toString().padStart(2, '0');
      const month = (dateStr.getMonth() + 1).toString().padStart(2, '0');
      const year = dateStr.getFullYear();
      const hours = dateStr.getHours().toString().padStart(2, '0');
      const minutes = dateStr.getMinutes().toString().padStart(2, '0');
      const formattedStr = `${day}/${month}/${year} ${hours}:${minutes}`;
      return getMonthDay(formattedStr);
    }
  }

  protected getTime(dateStr: string | Date): string {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // ⚡ Event editing methods
  protected toggleEventActions(index: number): void {
    this.extractedEvents.update((events) =>
      events.map((event, i) => ({
        ...event,
        showActions: i === index ? !event.showActions : false,
      }))
    );
  }

  protected editEvent(index: number): void {
    this.extractedEvents.update((events) =>
      events.map((event, i) => ({
        ...event,
        isEditing: i === index,
        showActions: false, // Hide actions menu when editing
      }))
    );
  }

  protected saveEvent(index: number): void {
    this.extractedEvents.update((events) =>
      events.map((event, i) => ({
        ...event,
        isEditing: i === index ? false : event.isEditing,
        showActions: false,
      }))
    );
    // Regenerate ICS content with edited events
    this.regenerateIcsContent();
  }

  protected cancelEdit(index: number): void {
    this.extractedEvents.update((events) =>
      events.map((event, i) => ({
        ...event,
        isEditing: i === index ? false : event.isEditing,
        showActions: false,
      }))
    );
  }

  protected deleteEvent(index: number): void {
    this.extractedEvents.update((events) => events.filter((_, i) => i !== index));
    // Regenerate ICS content with remaining events
    this.regenerateIcsContent();
  }

  protected updateEventField(index: number, field: keyof CalendarEvent, value: any): void {
    this.extractedEvents.update((events) =>
      events.map((event, i) =>
        i === index
          ? {
              ...event,
              [field]: value,
            }
          : event
      )
    );
  }

  // ⚡ Regenerate ICS content from edited events
  private regenerateIcsContent(): void {
    const events = this.extractedEvents();
    if (events.length === 0) {
      this.icsContent.set(null);
      return;
    }

    // Generate ICS content manually
    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//3dime Calendar Converter//EN\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';

    events.forEach((event) => {
      icsContent += 'BEGIN:VEVENT\r\n';
      icsContent += `UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@3dime.com\r\n`;
      icsContent += `DTSTAMP:${this.dateToIcsFormat(new Date())}\r\n`;
      icsContent += `DTSTART:${this.dateToIcsFormat(event.start)}\r\n`;
      icsContent += `DTEND:${this.dateToIcsFormat(event.end)}\r\n`;
      icsContent += `SUMMARY:${event.summary}\r\n`;
      if (event.description) {
        icsContent += `DESCRIPTION:${event.description}\r\n`;
      }
      if (event.location) {
        icsContent += `LOCATION:${event.location}\r\n`;
      }
      icsContent += 'END:VEVENT\r\n';
    });

    icsContent += 'END:VCALENDAR\r\n';
    this.icsContent.set(icsContent);
  }

  // ⚡ Convert Date object or string to ICS format (YYYYMMDDTHHMMSSZ)
  private dateToIcsFormat(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hour = String(d.getUTCHours()).padStart(2, '0');
    const minute = String(d.getUTCMinutes()).padStart(2, '0');
    const second = String(d.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hour}${minute}${second}Z`;
  }

  protected formatDateForInput(dateStr: string | Date): string {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  protected parseDateFromInput(dateStr: string): Date {
    return new Date(dateStr);
  }
}
