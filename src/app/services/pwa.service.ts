import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;
  public readonly showInstallButton = signal(false);
  public readonly isSafari = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeInstallPrompt();
  }

  private initializeInstallPrompt(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Detect Safari browser
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isSafariBrowser = /safari/.test(userAgent) && !/chrome/.test(userAgent) && !/crios/.test(userAgent) && !/fxios/.test(userAgent);
      this.isSafari.set(isSafariBrowser);

      // Check if app is already installed (running in standalone mode)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;

      // For Safari, show install button if not already installed
      if (isSafariBrowser && !isStandalone) {
        this.showInstallButton.set(true);
        console.log('Safari detected - showing install instructions');
      }

      // For Chromium-based browsers (Chrome, Edge, etc.)
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
    // For Safari, show instructions instead
    if (this.isSafari()) {
      this.showSafariInstructions();
      return;
    }

    // For Chromium-based browsers
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

  private showSafariInstructions(): void {
    // Show instructions for Safari users
    const message = 'To install this app on Safari:\n\n' +
                   '1. Tap the Share button (square with arrow)\n' +
                   '2. Scroll down and tap "Add to Home Screen"\n' +
                   '3. Tap "Add" to confirm';
    alert(message);
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null || this.isSafari();
  }
}
