import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

import { ProfileCard } from './components/profile-card/profile-card';
import { About } from './components/about/about';
import { TechStack } from './components/tech-stack/tech-stack';
import { Experience } from './components/experience/experience';
import { Education } from './components/education/education';
import { Converter } from './components/converter/converter';
import { Stuff } from './components/stuff/stuff';
import { Hobbies } from './components/hobbies/hobbies';
import { Contact } from './components/contact/contact';
import { GithubActivity } from './components/github-activity/github-activity';
import { BackToTop } from './components/back-to-top/back-to-top';
import { PwaService } from './services/pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ProfileCard,
    About,
    TechStack,
    Experience,
    Education,
    Converter,
    Stuff,
    Hobbies,
    Contact,
    GithubActivity,
    BackToTop
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('3dime-angular');

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private swUpdate: SwUpdate,
    private pwaService: PwaService
  ) {}

  ngOnInit(): void {
    // Check for service worker updates
    if (isPlatformBrowser(this.platformId) && this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
        )
        .subscribe(() => {
          if (confirm('New version available. Load new version?')) {
            window.location.reload();
          }
        });
    }
  }
}
