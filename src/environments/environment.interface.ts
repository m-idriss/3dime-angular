/**
 * Environment configuration interface
 * Ensures all environment files have consistent typing
 */
export interface Environment {
  production: boolean;
  screenshotMode: boolean;
  apiUrl: string;
  showGithubActivity?: boolean;
  // Additional optional flags can be added here. Firebase was removed from
  // the repository to avoid committing secrets; downstream code should not
  // rely on a `firebase` property being present in the environment files.
}
