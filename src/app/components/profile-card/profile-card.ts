import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { AppTooltipDirective } from '../../shared/directives';

import { GithubService, SocialLink, GithubUser } from '../../services/github.service';
import { SkeletonLoader } from '../skeleton-loader/skeleton-loader';
import {
  SOCIAL_ICON_MAP,
  DEFAULT_SOCIAL_ICON,
  PROFILE_LOADING_COUNT,
} from '../../constants/app.constants';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [SkeletonLoader, AppTooltipDirective],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCard implements OnInit {
  private readonly githubService = inject(GithubService);
  private readonly cdr = inject(ChangeDetectorRef);

  socialLinks: SocialLink[] = [];
  profileData: GithubUser | null = null;
  isLoading = true;
  private loadingCount = 0;

  ngOnInit(): void {
    this.loadingCount = PROFILE_LOADING_COUNT;

    this.githubService.getSocialLinks().subscribe((links) => {
      this.socialLinks = [...this.socialLinks, ...links];
      this.decrementLoadingCount();
    });

    this.githubService.getProfile().subscribe((user) => {
      this.profileData = user;
      const links = user.email
        ? [
            { provider: 'Email', url: `mailto:${user.email}` },
            { provider: 'GitHub', url: user.html_url },
          ]
        : [{ provider: 'GitHub', url: user.html_url }];

      this.socialLinks = [...links, ...this.socialLinks];
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

  protected readonly mainUrl = '';

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

    // Email uses solid icon instead of brand icon
    if (iconKey === 'email') {
      return `fas fa-${iconName}`;
    }

    return `fa fa-brands fa-${iconName}`;
  }
}
