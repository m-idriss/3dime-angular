import { Component, signal, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { PWA_CONFIG } from './constants/pwa.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swUpdate = inject(SwUpdate);

  protected readonly title = signal('3dime-angular');
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  ngOnInit(): void {
    // Check for service worker updates
    if (isPlatformBrowser(this.platformId) && this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm(PWA_CONFIG.UPDATE_MESSAGE)) {
            window.location.reload();
          }
        });
    }

    // Handle PWA install prompt
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event so it can be triggered later
        this.deferredPrompt = e;
        console.log('PWA install prompt available');
      });

      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        this.deferredPrompt = null;
      });
    }
  }
}
