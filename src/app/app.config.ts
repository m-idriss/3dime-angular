import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

/**
 * Check if Firebase configuration is valid.
 * Prevents app crashes in CI/test environments with placeholder credentials.
 */
function hasValidFirebaseConfig(): boolean {
  const config = environment.firebase;
  return !!(
    config.apiKey &&
    config.projectId &&
    config.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
    config.apiKey !== ''
  );
}

/**
 * Get Firebase providers only if configuration is valid.
 * This prevents the app from crashing during screenshot workflows or CI builds
 * where Firebase credentials may not be available.
 */
function getFirebaseProviders() {
  if (hasValidFirebaseConfig()) {
    try {
      return [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
      ];
    } catch (error) {
      console.warn('Firebase initialization failed, continuing without Firebase:', error);
      return [];
    }
  } else {
    console.info('Firebase not configured, running without authentication features');
    return [];
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    ...getFirebaseProviders(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
