import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Signals for toast messages
  public readonly successMessage = signal<string | null>(null);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Show a success toast message
   */
  showSuccess(message: string): void {
    this.successMessage.set(message);
  }

  /**
   * Show an error toast message
   */
  showError(message: string): void {
    this.errorMessage.set(message);
  }

  /**
   * Clear success message
   */
  clearSuccess(): void {
    this.successMessage.set(null);
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage.set(null);
  }

  /**
   * Clear all messages
   */
  clearAll(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
