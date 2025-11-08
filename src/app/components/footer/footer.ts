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

  footerLinks = [
    { label: 'Security', url: `${this.githubRepo}/blob/main/SECURITY.md` },
    { label: 'License', url: `${this.githubRepo}/blob/main/LICENSE` },
    { label: 'Community', url: `${this.githubRepo}/blob/main/CONTRIBUTING.md` },
    { label: 'Discussions', url: `${this.githubRepo}/discussions` },
    { label: 'Docs', url: `${this.githubRepo}/blob/main/README.md` },
    { label: 'Issues', url: `${this.githubRepo}/issues` },
    { label: 'Repository', url: this.githubRepo },
  ];
}
