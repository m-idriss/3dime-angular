import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ProfileService, SocialLink, GithubUser } from '../../services/profile.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.html',
  styleUrls: ['./profile-card.scss']
})
export class ProfileCard implements OnInit {
  menuOpen = false;
  socialLinks: SocialLink[] = [];
  profileData: GithubUser | null = null;

  constructor(
    private readonly themeService: ThemeService,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {

    this.profileService.getSocialLinks().subscribe(links => {
      this.socialLinks = [...this.socialLinks, ...links];
    });

    this.profileService.getProfile().subscribe(user => {
      this.profileData = user;
      this.socialLinks.unshift({ provider: 'GitHub', url: user.html_url});
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
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
}
