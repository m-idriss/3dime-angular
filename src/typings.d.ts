// Type definitions for browser APIs not included in standard TypeScript types

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
}

declare module 'ical.js' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ICAL: any;
  export = ICAL;
}
