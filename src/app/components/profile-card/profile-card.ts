import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ThemeService } from '../../services/theme.service';
import { ProfileService, SocialLink, GithubUser } from '../../services/profile.service';
import { AuthAwareComponent } from '../base/auth-aware.component';
import { SkeletonLoader } from '../skeleton-loader/skeleton-loader';
import {
  SOCIAL_ICON_MAP,
  DEFAULT_SOCIAL_ICON,
  PROFILE_LOADING_COUNT,
} from '../../constants/app.constants';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [SkeletonLoader, NgbTooltipModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCard extends AuthAwareComponent implements OnInit {
  menuOpen = false;
  socialLinks: SocialLink[] = [];
  profileData: GithubUser | null = null;
  isLoading = true;
  private loadingCount = 0;

  constructor(
    private readonly themeService: ThemeService,
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingCount = PROFILE_LOADING_COUNT;

    this.profileService.getSocialLinks().subscribe((links) => {
      this.socialLinks = [...this.socialLinks, ...links];
      this.decrementLoadingCount();
    });

    this.profileService.getProfile().subscribe((user) => {
      this.profileData = user;
      this.socialLinks = [{ provider: 'GitHub', url: user.html_url }, ...this.socialLinks];
      this.decrementLoadingCount();
    });
  }

  /**
   * Decrement loading counter and update loading state
   */
  private decrementLoadingCount(): void {
    this.loadingCount--;
    if (this.loadingCount === 0) {
      this.isLoading = false;
    }
    this.cdr.markForCheck();
  }

  get name(): string {
    return this.profileData?.name || this.profileData?.login || '';
  }

  get avatar(): string {
    return this.profileData?.avatar_url || '';
  }

  /**
   * Get Font Awesome icon class for social media provider.
   *
   * @param provider - Social media provider name (e.g., 'Twitter', 'GitHub')
   * @returns Font Awesome icon class string
   */
  getFontAwesomeLinks(provider: string): string {
    if (!provider) return DEFAULT_SOCIAL_ICON;

    const iconKey = provider.toLowerCase();
    const iconName = SOCIAL_ICON_MAP[iconKey] || iconKey;

    return `fa fa-brands fa-${iconName}`;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const burgerMenu = target.closest('.burger-menu');
    if (!burgerMenu && this.menuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.menuOpen) {
      this.closeMenu();
    }
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

  async signOut(): Promise<void> {
    try {
      await this.authService.signOutUser();
      this.menuOpen = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
