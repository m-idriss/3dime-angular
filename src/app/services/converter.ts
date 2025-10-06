import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  constructor(private readonly http: HttpClient) {}

  /**
   * Convert image files to ICS calendar format
   * Note: PDF files are not supported by the AI vision API. Convert PDFs to images first.
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

