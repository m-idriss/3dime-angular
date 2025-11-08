import { Component, signal, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { About } from './components/about/about';
import { BackToTop } from './components/back-to-top/back-to-top';
import { Converter } from './components/converter/converter';
import { Education } from './components/education/education';
import { ExpandableCard } from './components/expandable-card/expandable-card';
import { Experience } from './components/experience/experience';
import { Footer } from './components/footer/footer';
import { GithubActivity } from './components/github-activity/github-activity';
import { Hobbies } from './components/hobbies/hobbies';
import { ProfileCard } from './components/profile-card/profile-card';
import { Stuff } from './components/stuff/stuff';
import { TechStack } from './components/tech-stack/tech-stack';
import { PWA_CONFIG } from './constants/pwa.constants';
import { LayoutModule } from '@angular/cdk/layout';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    About,
    BackToTop,
    Converter,
    Education,
    ExpandableCard,
    Experience,
    Footer,
    GithubActivity,
    Hobbies,
    ProfileCard,
    Stuff,
    TechStack,
    LayoutModule,
    NgbToastModule,
  ],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swUpdate = inject(SwUpdate);
  public readonly toastService = inject(ToastService);

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
