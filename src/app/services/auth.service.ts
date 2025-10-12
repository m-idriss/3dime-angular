import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';

/**
 * Authenticated user information
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Service for managing Firebase authentication.
 * Provides Google sign-in/sign-out and reactive auth state via signals.
 *
 * @example
 * ```typescript
 * constructor(private authService: AuthService) {}
 *
 * async signIn() {
 *   await this.authService.signInWithGoogle();
 * }
 *
 * isUserLoggedIn() {
 *   return this.authService.isAuthenticated();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly googleProvider = new GoogleAuthProvider();

  // Signal for current user state
  public readonly currentUser = signal<AuthUser | null>(null);
  public readonly isAuthenticated = signal<boolean>(false);
  public readonly isLoading = signal<boolean>(true);

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.currentUser.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        this.isAuthenticated.set(true);
      } else {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
      this.isLoading.set(false);
    });
  }

  /**
   * Sign in with Google popup
   */
  async signInWithGoogle(): Promise<void> {
    try {
      await signInWithPopup(this.auth, this.googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOutUser(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}
