import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import * as pdfjsLib from 'pdfjs-dist';

export interface ConversionRequest {
  files: FileData[];
  timeZone?: string;
  currentDate?: string;
}

export interface FileData {
  dataUrl: string;
  name: string;
  type: string;
}

export interface ConversionResponse {
  icsContent: string;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
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
    currentDate?: string
  ): Observable<ConversionResponse> {
    const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = currentDate || new Date().toISOString().split('T')[0];

    const request: ConversionRequest = {
      files,
      timeZone: tz,
      currentDate: today
    };

    return this.http.post<ConversionResponse>(`${this.baseUrl}?target=converter`, request);
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
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;

        // Convert canvas to data URL (PNG format for best quality)
        const imageDataUrl = canvas.toDataURL('image/png');
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
  downloadIcsFile(icsContent: string, filename: string = 'calendar.ics'): void {
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

