import { Directive, inject } from '@angular/core';
import { AuthService, AuthUser } from '../../services/auth.service';

/**
 * Base class for components that need authentication functionality.
 * Provides common auth-related getters to avoid code duplication.
 *
 * Usage: Extend your component with this class:
 * ```typescript
 * export class MyComponent extends AuthAwareComponent {
 *   constructor() {
 *     super();
 *     // your constructor code
 *   }
 * }
 * ```
 */
@Directive()
export abstract class AuthAwareComponent {
  protected readonly authService: AuthService = inject(AuthService);

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Get current authenticated user
   */
  get currentUser(): AuthUser | null {
    return this.authService.currentUser();
  }

  /**
   * Check if auth is currently loading
   */
  get isAuthLoading(): boolean {
    return this.authService.isLoading();
  }
}
