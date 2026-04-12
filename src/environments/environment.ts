import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  screenshotMode: false,
  apiUrl: 'http://localhost:8080',
  // Firebase configuration has been removed from source. If you need to add
  // Firebase for local development, put the config in a local (untracked)
  // environment file and update imports accordingly.
};
