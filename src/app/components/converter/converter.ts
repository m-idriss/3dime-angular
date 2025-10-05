import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConverterService, FileData } from '../../services/converter';

@Component({
  selector: 'app-converter',
  imports: [CommonModule],
  templateUrl: './converter.html',
  styleUrl: './converter.scss'
})
export class Converter {
  protected readonly files = signal<File[]>([]);
  protected readonly isDragging = signal(false);
  protected readonly isProcessing = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

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
    this.successMessage.set(null);

    const validFiles = newFiles.filter(file => {
      if (!this.acceptedTypes.includes(file.type)) {
        this.errorMessage.set(`Invalid file type: ${file.name}. Only JPG, PNG, and PDF are accepted.`);
        return false;
      }
      if (file.size > this.maxFileSize) {
        this.errorMessage.set(`File too large: ${file.name}. Maximum size is 10MB.`);
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
    this.successMessage.set(null);
  }

  protected async convertToIcs(): Promise<void> {
    if (this.files().length === 0) {
      this.errorMessage.set('Please add at least one file.');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      // Convert files to base64
      const fileDataPromises = this.files().map(async file => {
        const dataUrl = await this.converterService.fileToDataUrl(file);
        return {
          dataUrl,
          name: file.name,
          type: file.type
        } as FileData;
      });

      const fileData = await Promise.all(fileDataPromises);

      // Call converter service
      this.converterService.convertToIcs(fileData).subscribe({
        next: (response) => {
          if (response.success && response.icsContent) {
            // Download the ICS file
            this.converterService.downloadIcsFile(response.icsContent);
            this.successMessage.set('Calendar file downloaded successfully!');
            
            // Clear files after successful conversion
            setTimeout(() => {
              this.files.set([]);
            }, 2000);
          } else {
            this.errorMessage.set(response.error || 'Failed to convert files.');
          }
          this.isProcessing.set(false);
        },
        error: (err) => {
          console.error('Conversion error:', err);
          this.errorMessage.set(err.error?.message || 'An error occurred during conversion. Please try again.');
          this.isProcessing.set(false);
        }
      });
    } catch (err) {
      console.error('File processing error:', err);
      this.errorMessage.set('Failed to process files. Please try again.');
      this.isProcessing.set(false);
    }
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

