import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ConverterService, FileData } from '../../services/converter';
import { Card } from '../card/card';
import { AuthAwareComponent } from '../base/auth-aware.component';
import { CalendarEvent } from '../../models';
import { FILE_UPLOAD_CONSTRAINTS } from '../../constants';
import { formatIcsDate, getMonthDay, getTime } from '../../utils';

@Component({
  selector: 'app-converter',
  imports: [Card],
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
    // Handle shared files from PWA share target
    if (isPlatformBrowser(this.platformId)) {
      this.handleSharedFiles();
    }
  }

  private async handleSharedFiles(): Promise<void> {
    // Handle files shared via PWA share target using launchQueue API
    if ('launchQueue' in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (!launchParams.files || launchParams.files.length === 0) {
          return;
        }

        try {
          const sharedFiles: File[] = [];
          
          // Process each shared file
          for (const fileHandle of launchParams.files) {
            const file = await fileHandle.getFile();
            sharedFiles.push(file);
          }

          if (sharedFiles.length > 0) {
            // Add the shared files to the converter
            this.addFiles(sharedFiles);
            
            // Scroll to converter section
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
    // Scroll to the converter component after a short delay to ensure rendering
    setTimeout(() => {
      const converterElement = document.getElementById('converter');
      if (converterElement) {
        converterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
      if (!(this.acceptedTypes as readonly string[]).includes(file.type)) {
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
        currentEvent.start = formatIcsDate(dateStr);
      } else if (line.startsWith('DTEND')) {
        const dateStr = line.split(':')[1];
        currentEvent.end = formatIcsDate(dateStr);
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring(9);
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12);
      }
    }

    this.extractedEvents.set(events);
  }

  protected downloadIcs(): void {
    if (this.icsContent()) {
      this.converterService.downloadIcsFile(this.icsContent()!);
    }
  }

  protected getMonthDay(dateStr: string): string {
    return getMonthDay(dateStr);
  }

  protected getTime(dateStr: string): string {
    return getTime(dateStr);
  }

  protected resetState(): void {
    this.files.set([]);
    this.isDragging.set(false);
    this.isProcessing.set(false);
    this.errorMessage.set(null);
    this.extractedEvents.set([]);
    this.icsContent.set(null);
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
