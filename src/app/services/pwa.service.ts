import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;
  public readonly showInstallButton = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeInstallPrompt();
  }

  private initializeInstallPrompt(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event so it can be triggered later
        this.deferredPrompt = e;
        this.showInstallButton.set(true);
        console.log('PWA install prompt available');
      });

      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        this.deferredPrompt = null;
        this.showInstallButton.set(false);
      });
    }
  }

  public async installApp(): Promise<void> {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      // Clear the deferred prompt
      this.deferredPrompt = null;
      this.showInstallButton.set(false);
    } catch (error) {
      console.error('Error during app installation:', error);
    }
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }
}
