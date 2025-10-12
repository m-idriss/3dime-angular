import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

import { About } from './components/about/about';
import { BackToTop } from './components/back-to-top/back-to-top';
import { Contact } from './components/contact/contact';
import { Converter } from './components/converter/converter';
import { Education } from './components/education/education';
import { Experience } from './components/experience/experience';
import { GithubActivity } from './components/github-activity/github-activity';
import { Hobbies } from './components/hobbies/hobbies';
import { ProfileCard } from './components/profile-card/profile-card';
import { Stuff } from './components/stuff/stuff';
import { TechStack } from './components/tech-stack/tech-stack';
import { PWA_CONFIG } from './constants/pwa.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    About,
    BackToTop,
    Contact,
    Converter,
    Education,
    Experience,
    GithubActivity,
    Hobbies,
    ProfileCard,
    Stuff,
    TechStack,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('3dime-angular');
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly swUpdate: SwUpdate,
  ) {}

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
