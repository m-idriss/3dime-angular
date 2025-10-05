import { Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThemeService } from '../../services/theme.service';
import { ProfileService, SocialLink, GithubUser } from '../../services/profile.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile-card.html',
  styleUrls: ['./profile-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCard implements OnInit {
  socialLinks: SocialLink[] = [];
  profileData: GithubUser | null = null;
  isLoading = true;
  private loadingCount = 0;

  constructor(
    private readonly themeService: ThemeService,
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadingCount = 2; // We're loading 2 resources

    this.profileService.getSocialLinks().subscribe(links => {
      this.socialLinks = [...this.socialLinks, ...links];
      this.loadingCount--;
      if (this.loadingCount === 0) this.isLoading = false;
      this.cdr.markForCheck();
    });

    this.profileService.getProfile().subscribe(user => {
      this.profileData = user;
      this.socialLinks = [{ provider: 'GitHub', url: user.html_url}, ...this.socialLinks];
      this.loadingCount--;
      if (this.loadingCount === 0) this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  get name(): string {
    return this.profileData?.name || this.profileData?.login || '';
  }

  get avatar(): string {
    return this.profileData?.avatar_url || '';
  }

  getFontAwesomeLinks(provider: string): string {
    if (!provider) return 'fa fa-brands fa-link';

    let icon = provider.toLowerCase();
    if (icon === 'twitter') icon = 'x-twitter';
    if (icon === 'facebook') icon = 'facebook-square';

    return 'fa fa-brands fa-' + icon;
  }

  cycleTheme() {
    this.themeService.cycleTheme();
  }

  toggleVideoBg() {
    this.themeService.toggleBackground();
  }

  changeFontSize() {
    this.themeService.cycleFontSize();
  }

  get currentTheme(): string {
    return this.themeService.getCurrentTheme();
  }

  get currentBackground(): string {
    return this.themeService.getCurrentBackground();
  }

  get currentFontSize(): string {
    return this.themeService.getCurrentFontSize();
  }

  get themeDisplayName(): string {
    return this.themeService.getThemeDisplayName(this.currentTheme);
  }

  get backgroundDisplayName(): string {
    return this.themeService.getBackgroundDisplayName(this.currentBackground);
  }

  get fontSizeDisplayName(): string {
    return this.themeService.getFontSizeDisplayName(this.currentFontSize);
  }
}
