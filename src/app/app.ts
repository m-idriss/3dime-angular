import { Component, signal, OnInit, PLATFORM_ID, inject, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject as injectAnalytics } from '@vercel/analytics';

import { Footer } from './components/footer/footer';
import { PWA_CONFIG } from './constants/pwa.constants';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer],
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
    const isBrowser = isPlatformBrowser(this.platformId);

    // Initialize Vercel Speed Insights & Analytics (production browser only)
    if (isBrowser && !isDevMode()) {
      injectSpeedInsights();
      injectAnalytics();
    }

    // Track current route
    this.currentRoute.set(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.urlAfterRedirects);
      });

    // Check for service worker updates
    if (isBrowser && this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm(PWA_CONFIG.UPDATE_MESSAGE)) {
            window.location.reload();
          }
        });
    }

    // Handle PWA install prompt
    if (isBrowser) {
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
