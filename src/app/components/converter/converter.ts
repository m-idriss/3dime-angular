import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConverterService, FileData } from '../../services/converter';
import { AuthService } from '../../services/auth.service';
import { Card } from '../card/card';

interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

@Component({
  selector: 'app-converter',
  imports: [Card],
  templateUrl: './converter.html',
  styleUrl: './converter.scss',
})
export class Converter implements OnInit {
  protected readonly files = signal<File[]>([]);
  protected readonly isDragging = signal(false);
  protected readonly isProcessing = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly extractedEvents = signal<CalendarEvent[]>([]);
  protected readonly icsContent = signal<string | null>(null);

  private readonly acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(
    private readonly converterService: ConverterService,
    private readonly authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    // Handle shared files from PWA share target
    if (isPlatformBrowser(this.platformId)) {
      this.handleSharedFiles();
    }
  }

  private async handleSharedFiles(): Promise<void> {
    // Check if the page was loaded with shared files (PWA share target)
    const urlParams = new URLSearchParams(window.location.search);

    // For POST share target, files will be in FormData
    if (window.location.pathname === '/' && urlParams.toString() === '') {
      // Check for shared files in the request body (if any)
      // This will be handled by the service worker
      console.log('Checking for shared files via PWA share target');
    }
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

    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    this.addFiles(droppedFiles);
  }

  protected onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files || []);
    this.addFiles(selectedFiles);
    input.value = ''; // Reset input
  }

  private addFiles(newFiles: File[]): void {
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);

    const validFiles = newFiles.filter((file) => {
      if (!this.acceptedTypes.includes(file.type)) {
        this.errorMessage.set(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > this.maxFileSize) {
        this.errorMessage.set(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      this.files.update((current) => [...current, ...validFiles]);
    }
  }

  protected removeFile(index: number): void {
    this.files.update((current) => current.filter((_, i) => i !== index));
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);
  }

  protected async convertToIcs(): Promise<void> {
    if (this.files().length === 0) {
      this.errorMessage.set('Please add at least one file.');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);

    try {
      const fileDataPromises = this.files().map(async (file) => {
        // Check if file is a PDF
        if (file.type === 'application/pdf') {
          // Convert PDF to images (one per page)
          try {
            const imageDataUrls = await this.converterService.pdfToImages(file);

            // Return multiple FileData objects, one for each page
            return imageDataUrls.map(
              (dataUrl, index) =>
                ({
                  dataUrl,
                  name: `${file.name} (Page ${index + 1})`,
                  type: 'image/jpeg',
                }) as FileData,
            );
          } catch (err) {
            throw new Error(`Failed to process PDF: ${file.name}`);
          }
        } else {
          // For images, use the existing method
          const dataUrl = await this.converterService.fileToDataUrl(file);
          return [
            {
              dataUrl,
              name: file.name,
              type: file.type,
            } as FileData,
          ];
        }
      });

      // Flatten the array since PDFs return multiple pages
      const fileDataArrays = await Promise.all(fileDataPromises);
      const fileData = fileDataArrays.flat();

      this.converterService.convertToIcs(fileData).subscribe({
        next: (response) => {
          if (response.success && response.icsContent) {
            this.icsContent.set(response.icsContent);
            this.parseIcsContent(response.icsContent);
          } else {
            this.errorMessage.set(response.error || 'Failed to convert files.');
          }
          this.isProcessing.set(false);
        },
        error: (err) => {
          this.errorMessage.set(
            err.error?.message || err.message || 'An error occurred during conversion.',
          );
          this.isProcessing.set(false);
        },
      });
    } catch (err) {
      this.errorMessage.set((err as Error).message || 'Failed to process files. Please try again.');
      this.isProcessing.set(false);
    }
  }

  private parseIcsContent(icsContent: string): void {
    const events: CalendarEvent[] = [];
    const lines = icsContent.split('\n');
    let currentEvent: Partial<CalendarEvent> = {};

    for (const element of lines) {
      const line = element.trim();

      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent.summary && currentEvent.start) {
          events.push(currentEvent as CalendarEvent);
        }
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8);
      } else if (line.startsWith('DTSTART')) {
        const dateStr = line.split(':')[1];
        currentEvent.start = this.formatDate(dateStr);
      } else if (line.startsWith('DTEND')) {
        const dateStr = line.split(':')[1];
        currentEvent.end = this.formatDate(dateStr);
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring(9);
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12);
      }
    }

    this.extractedEvents.set(events);
  }

  private formatDate(icsDate: string): string {
    // Handles formats: YYYYMMDD, YYYYMMDDTHHMMSS, YYYYMMDDTHHMM, with optional trailing 'Z' or timezone offsets
    if (!icsDate) return '';

    // Remove any trailing Z or timezone offset
    const cleaned = icsDate.replace(/Z$|[+-]\d{4}$/, '');

    // All-day event: YYYYMMDD
    const allDayMatch = /^(\d{4})(\d{2})(\d{2})$/.exec(cleaned);
    if (allDayMatch) {
      const [, year, month, day] = allDayMatch;
      return `${day}/${month}/${year}`;
    }

    // Timed event: YYYYMMDDTHHMMSS or YYYYMMDDTHHMM
    const timeMatch = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?$/.exec(cleaned);
    if (timeMatch) {
      const [, year, month, day, hour, minute] = timeMatch;
      return `${day}/${month}/${year} ${hour}:${minute}`;
    }

    // Fallback: try to parse with Date constructor
    const dateObj = new Date(icsDate);
    if (!isNaN(dateObj.getTime())) {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hour = String(dateObj.getHours()).padStart(2, '0');
      const minute = String(dateObj.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year}` + (icsDate.includes('T') ? ` ${hour}:${minute}` : '');
    }

    // If all else fails, return the original string
    return icsDate;
  }

  protected downloadIcs(): void {
    if (this.icsContent()) {
      this.converterService.downloadIcsFile(this.icsContent()!);
    }
  }

  protected getMonthDay(dateStr: string): string {
    // Extract day and month from formatted date (DD/MM/YYYY HH:MM)
    const parts = dateStr.split(' ')[0].split('/');
    if (parts.length >= 3) {
      const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ];
      const day = parts[0];
      const monthIndex = parseInt(parts[1]) - 1;
      return `${months[monthIndex]}\n${day}`;
    }
    return dateStr;
  }

  protected getTime(dateStr: string): string {
    // Extract time from formatted date (DD/MM/YYYY HH:MM)
    const parts = dateStr.split(' ');
    return parts.length > 1 ? parts[1] : '';
  }

  protected resetState(): void {
    this.files.set([]);
    this.isDragging.set(false);
    this.isProcessing.set(false);
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);
  }

  // Auth-related getters (delegating to service signals)
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get isAuthLoading(): boolean {
    return this.authService.isLoading();
  }

  async signIn(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      let message = 'Failed to sign in. Please try again.';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as any).message === 'string'
      ) {
        message += ` (${(error as any).message})`;
      }
      this.errorMessage.set(message);
      console.error('Sign in error:', error);
    }
  }
}
