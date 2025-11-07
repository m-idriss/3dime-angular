import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as pdfjsLib from 'pdfjs-dist';

import { environment } from '../../environments/environment';
import { PDF_CONVERSION_CONFIG, CALENDAR_CONFIG } from '../constants';

/**
 * Request payload for ICS conversion
 */
export interface ConversionRequest {
  files: FileData[];
  timeZone?: string;
  currentDate?: string;
}

/**
 * File data with base64 encoded content
 */
export interface FileData {
  dataUrl: string;
  name: string;
  type: string;
}

/**
 * Response from ICS conversion API
 */
export interface ConversionResponse {
  icsContent: string;
  success: boolean;
  error?: string;
}

/**
 * Service for converting images and PDFs to ICS calendar format.
 * Handles file processing, PDF to image conversion, and ICS file downloads.
 *
 * @example
 * ```typescript
 * constructor(private converterService: ConverterService) {}
 *
 * async convert() {
 *   const dataUrl = await this.converterService.fileToDataUrl(file);
 *   this.converterService.convertToIcs([{ dataUrl, name: file.name, type: file.type }])
 *     .subscribe(response => console.log(response.icsContent));
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  constructor() {
    // Configure PDF.js worker - using unpkg.com which has better version availability
    // unpkg.com automatically resolves to the closest matching version
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  /**
   * Convert image/PDF files to ICS calendar format
   * @param files Array of file data (base64 encoded)
   * @param timeZone Optional timezone (defaults to browser timezone)
   * @param currentDate Optional current date (defaults to today)
   */
  convertToIcs(
    files: FileData[],
    timeZone?: string,
    currentDate?: string,
  ): Observable<ConversionResponse> {
    const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = currentDate || new Date().toISOString().split('T')[0];

    const request: ConversionRequest = {
      files,
      timeZone: tz,
      currentDate: today,
    };

    return this.http.post<ConversionResponse>(`${this.baseUrl}?target=converter`, request);
  }

  /**
   * Convert a single file to ICS calendar format (for batch processing)
   * @param file Single file data (base64 encoded)
   * @param timeZone Optional timezone (defaults to browser timezone)
   * @param currentDate Optional current date (defaults to today)
   */
  convertSingleFile(
    file: FileData,
    timeZone?: string,
    currentDate?: string,
  ): Observable<ConversionResponse> {
    return this.convertToIcs([file], timeZone, currentDate);
  }

  /**
   * Convert a File object to base64 data URL
   */
  fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert PDF file to array of image data URLs (one per page)
   * @param file PDF file to convert
   * @returns Promise resolving to array of base64 image data URLs
   */
  async pdfToImages(file: File): Promise<string[]> {
    try {
      // Read the PDF file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const images: string[] = [];

      // Convert each page to an image
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // Set up canvas with appropriate scale for good quality
        const viewport = page.getViewport({ scale: PDF_CONVERSION_CONFIG.VIEWPORT_SCALE });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas with white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        // Convert canvas to JPEG with quality setting for smaller file size
        const imageDataUrl = canvas.toDataURL('image/jpeg', PDF_CONVERSION_CONFIG.JPEG_QUALITY);

        images.push(imageDataUrl);
      }

      return images;
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      throw new Error('Failed to convert PDF to images. Please ensure the PDF is valid.');
    }
  }

  /**
   * Download ICS content as a file
   */
  downloadIcsFile(
    icsContent: string,
    filename: string = CALENDAR_CONFIG.DEFAULT_ICS_FILENAME,
  ): void {
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
