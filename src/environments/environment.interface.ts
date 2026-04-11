/**
 * Environment configuration interface
 * Ensures all environment files have consistent typing
 */
export interface Environment {
  production: boolean;
  screenshotMode: boolean;
  apiUrl: string;
  showGithubActivity?: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}
