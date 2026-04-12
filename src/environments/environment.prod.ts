import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  showGithubActivity: false,
  apiUrl: 'https://api.3dime.com',
  screenshotMode: false,
  // Firebase configuration removed from repository. Add local config only if
  // required for development; do not commit secrets to the repo.
};
