/**
 * Screenshot environment configuration
 * Used for CI/GitHub Actions automated screenshot generation
 * Enables screenshotMode to return mock data when external APIs are unavailable
 */
import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  screenshotMode: true,
  showGithubActivity: true,
  apiUrl: 'https://api.3dime.com',
};
