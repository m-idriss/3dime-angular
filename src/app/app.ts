import { Component, signal, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { PWA_CONFIG } from './constants/pwa.constants';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swUpdate = inject(SwUpdate);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  protected readonly title = signal('3dime-angular');
  protected readonly currentRoute = signal<string>('');
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  ngOnInit(): void {
    // Track current route
    this.currentRoute.set(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.urlAfterRedirects);
      });

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
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
      });
    }
  }
}
