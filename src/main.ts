/// <reference types="@angular/localize" />

// Import Temporal polyfill for Schedule-X calendar support
import { Temporal } from '@js-temporal/polyfill';

// Make Temporal available globally
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Temporal = Temporal;
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
