/**
 * Screenshot environment configuration
 * Used for CI/GitHub Actions automated screenshot generation
 * Enables screenshotMode to return mock data when external APIs are unavailable
 */
export const environment = {
  production: true,
  screenshotMode: true, // Enable mock data for screenshots
  showGithubActivity: true,
  apiUrl: 'https://api.3dime.com',
  firebase: {
    apiKey: 'AIzaSyDvQ4aCcWtSxGmTXefINTcsdb0O5zheYzE',
    authDomain: 'image-to-ics.firebaseapp.com',
    projectId: 'image-to-ics',
    storageBucket: 'image-to-ics.firebasestorage.app',
    messagingSenderId: '345022501803',
    appId: '1:345022501803:web:3515e39c6c5962806678ee',
    measurementId: 'G-LEY4E6R8Q5',
  },
};
