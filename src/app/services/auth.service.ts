import { Injectable, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to track authentication state
  private readonly isAuthenticatedSignal = signal<boolean>(false);
  
  // Expose as readonly
  public readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if user was previously authenticated (from localStorage)
    if (isPlatformBrowser(this.platformId)) {
      const storedAuth = localStorage.getItem('isAuthenticated');
      if (storedAuth === 'true') {
        this.isAuthenticatedSignal.set(true);
      }
    }
  }

  /**
   * Simple login with username and password
   * For demonstration purposes, using hardcoded credentials
   * In production, this should validate against a real backend
   */
  login(username: string, password: string): boolean {
    // Simple validation - in production this should call a backend API
    if (username && password && password.length >= 4) {
      this.isAuthenticatedSignal.set(true);
      
      // Persist authentication state
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return true;
    }
    return false;
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.isAuthenticatedSignal.set(false);
    
    // Clear authentication state
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isAuthenticated');
    }
  }
}
