import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
  appVersion = '0.0.0'; // This will match package.json version
  githubRepo = 'https://github.com/m-idriss/3dime-angular';

  footerLinks = {
    legal: [
      {
        label: 'Security',
        url: `${this.githubRepo}/blob/main/SECURITY.md`,
        icon: 'fa-shield-alt',
      },
      {
        label: 'License',
        url: `${this.githubRepo}/blob/main/LICENSE`,
        icon: 'fa-balance-scale',
      },
    ],
    community: [
      {
        label: 'Community',
        url: `${this.githubRepo}/blob/main/CONTRIBUTING.md`,
        icon: 'fa-users',
      },
      {
        label: 'Discussions',
        url: `${this.githubRepo}/discussions`,
        icon: 'fa-comments',
      },
    ],
    docs: [
      {
        label: 'Documentation',
        url: `${this.githubRepo}/blob/main/README.md`,
        icon: 'fa-book',
      },
      {
        label: 'API Docs',
        url: `${this.githubRepo}/blob/main/docs/API.md`,
        icon: 'fa-code',
      },
      {
        label: 'Components',
        url: `${this.githubRepo}/blob/main/docs/COMPONENTS.md`,
        icon: 'fa-puzzle-piece',
      },
    ],
    project: [
      {
        label: 'Roadmap',
        url: `${this.githubRepo}/blob/main/ROADMAP.md`,
        icon: 'fa-map',
      },
      {
        label: 'Issues',
        url: `${this.githubRepo}/issues`,
        icon: 'fa-bug',
      },
      {
        label: 'Repository',
        url: this.githubRepo,
        icon: 'fa-brands fa-github',
      },
    ],
  };
}
