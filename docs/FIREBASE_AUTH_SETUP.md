# Firebase Authentication Setup

This guide explains how to set up Firebase Authentication with Google provider for the Calendar Converter feature.

## Prerequisites

- Firebase account ([console.firebase.google.com](https://console.firebase.google.com))
- Google Cloud project (created automatically with Firebase)

## Firebase Console Setup

### 1. Create/Select Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select your existing project (e.g., `your-project-name`)
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Click on **Google** provider
5. Toggle to **Enable**
6. Set support email (your email)
7. Click **Save**

### 3. Configure Authorized Domains

1. In Authentication → Settings → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - `3dime.com` (for production)
   - Any other domains you'll deploy to

### 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web** icon `</>`
4. Register your app (e.g., "3dime-angular")
5. Copy the `firebaseConfig` object

Example config:

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyC...', // Your API key
  authDomain: 'your-project-id.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.firebasestorage.app',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123def456',
};
```

## Application Configuration

### Configure Environment Variables

The application uses `.env` files for configuration. Follow these steps:

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your Firebase configuration:**

   ```bash
   # Firebase Configuration (from Firebase Console)
   NG_FIREBASE_API_KEY=AIzaSyC...
   NG_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NG_FIREBASE_PROJECT_ID=your-project-id
   NG_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
   NG_FIREBASE_MESSAGING_SENDER_ID=123456789
   NG_FIREBASE_APP_ID=1:123456789:web:abc123def456
   ```

3. **Build or start the application:**
   ```bash
   npm start              # Auto-generates environment files from .env
   npm run build          # Builds with development config
   npm run build:prod     # Builds with production config
   ```

The environment TypeScript files (`src/environments/environment.ts` and `environment.prod.ts`) are automatically generated from your `.env` file. **Do not edit them manually** - your changes will be overwritten.

### Production Deployment

For production environments, set environment variables in your hosting platform:

**Netlify / Vercel:**
- Go to Site Settings → Build & Deploy → Environment Variables
- Add `NG_FIREBASE_*` variables with your production values

**GitHub Actions:**
```yaml
env:
  NG_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  NG_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
  # ... other variables
```

**Firebase Hosting:**
- Environment variables are automatically available in the build process
- Configure them in your Firebase project settings

### Security Notes

⚠️ **Important Security Considerations:**

1. **Never Commit `.env` Files**
   - The `.env` file is gitignored and should never be committed
   - Use `.env.example` as a template (committed to git)
   - Share secrets securely outside of version control

2. **Firebase API Keys are Safe for Client-Side Use**
   - Firebase API keys for web apps are not secret
   - They identify your Firebase project to Google servers
   - Security is enforced by Firebase Security Rules and authorized domains

3. **Restrict API Keys (Recommended)**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Find your API key
   - Click "Edit API key"
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domains (e.g., `3dime.com`, `*.3dime.com`, `localhost:4200`)
   - Under "API restrictions", select "Restrict key" and enable only required APIs:
     - Identity Toolkit API
     - Token Service API

4. **Configure Authorized Domains**
   - Only whitelisted domains in Firebase Console can use authentication
   - This prevents unauthorized domains from using your Firebase project

## Testing Authentication

### Development

1. Start the development server:

   ```bash
   npm start
   ```

2. Navigate to `http://localhost:4200/`

3. Scroll to the Calendar Converter section

4. Click "🔐 Sign in with Google"

5. Sign in with your Google account

6. After authentication:
   - User avatar and menu appear in top-right of converter card
   - Upload zone becomes available
   - You can upload and convert files

### Sign Out

1. Click the user avatar/menu button
2. Click "Sign Out" in the dropdown

## Authentication Flow

```
User clicks "Sign in with Google"
         ↓
Firebase opens Google Sign-In popup
         ↓
User selects Google account
         ↓
Google authenticates user
         ↓
Firebase returns user credentials
         ↓
AuthService updates user state (signals)
         ↓
UI updates automatically (Angular signals)
         ↓
Converter shows upload interface
```

## Troubleshooting

### "auth/unauthorized-domain"

**Problem:** Domain not authorized in Firebase Console

**Solution:**

1. Go to Firebase Console → Authentication → Settings
2. Add your domain to "Authorized domains"
3. Wait a few minutes for changes to propagate

### "auth/popup-blocked"

**Problem:** Browser blocked the authentication popup

**Solution:**

1. Allow popups for your domain
2. Try again
3. Consider implementing redirect-based auth as fallback

### "auth/cancelled-popup-request"

**Problem:** User closed popup or multiple sign-in attempts

**Solution:**

1. Wait for previous popup to close
2. Try signing in again
3. Clear browser cache if persistent

### API Key Errors

**Problem:** Invalid API key or project configuration

**Solution:**

1. Verify Firebase config matches Firebase Console
2. Check API key restrictions in Google Cloud Console
3. Ensure required APIs are enabled:
   - Identity Toolkit API
   - Token Service API

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In Documentation](https://firebase.google.com/docs/auth/web/google-signin)
- [AngularFire Documentation](https://github.com/angular/angularfire)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
