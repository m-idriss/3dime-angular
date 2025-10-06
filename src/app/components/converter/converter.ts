import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConverterService, FileData } from '../../services/converter';
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
  imports: [CommonModule, Card],
  templateUrl: './converter.html',
  styleUrl: './converter.scss'
})
export class Converter {
  protected readonly files = signal<File[]>([]);
  protected readonly isDragging = signal(false);
  protected readonly isProcessing = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly extractedEvents = signal<CalendarEvent[]>([]);
  protected readonly icsContent = signal<string | null>(null);

  private readonly acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(private readonly converterService: ConverterService) {}

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

    const validFiles = newFiles.filter(file => {
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
      this.files.update(current => [...current, ...validFiles]);
    }
  }

  protected removeFile(index: number): void {
    this.files.update(current => current.filter((_, i) => i !== index));
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
      const fileDataPromises = this.files().map(async file => {
        const dataUrl = await this.converterService.fileToDataUrl(file);
        return {
          dataUrl,
          name: file.name,
          type: file.type
        } as FileData;
      });

      const fileData = await Promise.all(fileDataPromises);

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
          console.error('Conversion error:', err);
          this.errorMessage.set(err.error?.message || 'An error occurred during conversion.');
          this.isProcessing.set(false);
        }
      });
    } catch (err) {
      console.error('File processing error:', err);
      this.errorMessage.set('Failed to process files. Please try again.');
      this.isProcessing.set(false);
    }
  }

  private parseIcsContent(icsContent: string): void {
    const events: CalendarEvent[] = [];
    const lines = icsContent.split('\n');
    let currentEvent: Partial<CalendarEvent> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

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
    // Parse YYYYMMDDTHHMMSS or YYYYMMDD format
    if (!icsDate) return '';
    
    const year = icsDate.substring(0, 4);
    const month = icsDate.substring(4, 6);
    const day = icsDate.substring(6, 8);
    
    if (icsDate.includes('T')) {
      const hour = icsDate.substring(9, 11);
      const minute = icsDate.substring(11, 13);
      return `${day}/${month}/${year} ${hour}:${minute}`;
    }
    
    return `${day}/${month}/${year}`;
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
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
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
}

