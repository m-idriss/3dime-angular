# Environment Configuration with .env Files

This guide explains how to configure the 3dime-angular application using `.env` files.

## Overview

The application uses `.env` files to manage environment configuration. These files are automatically converted into TypeScript environment files at build time, keeping secrets out of version control while maintaining the Angular environment file pattern.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your configuration:**
   ```bash
   nano .env
   # or use your preferred editor
   ```

3. **Configure your values:**
   ```bash
   # Firebase Configuration
   NG_FIREBASE_API_KEY=your_actual_api_key_here
   NG_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NG_FIREBASE_PROJECT_ID=your-project-id
   NG_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   NG_FIREBASE_MESSAGING_SENDER_ID=123456789
   NG_FIREBASE_APP_ID=1:123456789:web:abc123def456
   ```

4. **Start developing:**
   ```bash
   npm start    # Automatically generates environment.ts from .env
   ```

## Environment Variables

### Angular Application Variables

All Angular application environment variables are prefixed with `NG_`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NG_API_URL` | API endpoint URL | `https://api.3dime.com` |
| `NG_FIREBASE_API_KEY` | Firebase API key | _(empty)_ |
| `NG_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | _(empty)_ |
| `NG_FIREBASE_PROJECT_ID` | Firebase project ID | _(empty)_ |
| `NG_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | _(empty)_ |
| `NG_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | _(empty)_ |
| `NG_FIREBASE_APP_ID` | Firebase app ID | _(empty)_ |

### Firebase Functions Variables

Firebase Functions use unprefixed variables (in `functions/.env`):

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for calendar extraction |

## File Structure

```
.
├── .env                          # Your local config (gitignored)
├── .env.local                    # Local overrides (gitignored)
├── .env.example                  # Template with examples (committed)
├── src/environments/
│   ├── environment.ts            # Auto-generated dev config
│   ├── environment.prod.ts       # Auto-generated prod config
│   ├── environment.example.ts    # Example template (reference)
│   └── environment.prod.example.ts
└── scripts/
    └── generate-env.js           # Script that generates environment files
```

## How It Works

### Build-Time Generation

When you run `npm start` or `npm run build`, the `generate-env.js` script:

1. Reads environment variables from:
   - `.env` file (if exists)
   - `.env.local` file (if exists, overrides `.env`)
   - `process.env` (overrides file-based variables)

2. Generates TypeScript environment files:
   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production with `--production` flag)

3. These files are then used by Angular during the build process

### Priority Order

Environment variables are loaded in this priority order (highest to lowest):

1. **Process environment variables** (`process.env`)
2. **`.env.local`** - Local overrides (gitignored)
3. **`.env`** - Your main config (gitignored)
4. **Default values** - Built into the script

## Usage Examples

### Local Development

```bash
# Create your local .env file
cp .env.example .env

# Edit with your values
nano .env

# Start development server (auto-generates environment.ts)
npm start
```

### Production Build

```bash
# Build for production (uses .env if present)
npm run build:prod

# Or set environment variables directly
NG_FIREBASE_API_KEY=prod_key npm run build:prod
```

### CI/CD Deployment

**GitHub Actions:**
```yaml
  - name: Build for production
    env:
      NG_API_URL: https://api.3dime.com
      NG_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
      NG_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      NG_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
      NG_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
      NG_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
      NG_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
    run: npm run build:prod
```

**Netlify / Vercel:**

Add environment variables in your hosting dashboard:
- Go to Site Settings → Build & Deploy → Environment Variables
- Add each `NG_*` variable with your production values

### Using .env.local for Overrides

Create a `.env.local` file to override specific values without modifying `.env`:

```bash
# .env.local - personal overrides (gitignored)
NG_FIREBASE_API_KEY=my_dev_key_override
```

This is useful when:
- Working in a team with different local setups
- Testing with different API keys
- Switching between development environments

## npm Scripts

The following npm scripts automatically run `generate-env.js`:

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `ng serve` | Generates dev environment, then starts server |
| `npm run build` | `ng build` | Generates dev environment, then builds |
| `npm run build:prod` | `ng build --configuration=production` | Generates prod environment, then builds |

## Security Best Practices

### ✅ DO

- **Copy `.env.example` to `.env`** and configure locally
- **Use `.env.local`** for personal overrides
- **Set environment variables** in CI/CD platforms
- **Restrict Firebase API keys** in Google Cloud Console
- **Keep `.env` files out of version control** (already in `.gitignore`)

### ❌ DON'T

- **Don't commit `.env` or `.env.local` files** to git
- **Don't edit `environment.ts` or `environment.prod.ts` manually** - they're auto-generated
- **Don't share `.env` files** - use secure channels for secrets
- **Don't use production credentials** in development

## Troubleshooting

### Environment file not updating

**Problem:** Changes to `.env` not reflected in the app

**Solution:** The environment files are cached. Stop and restart the dev server:
```bash
# Stop the server (Ctrl+C)
npm start  # Regenerates environment files
```

### No .env file warning

**Problem:** See warning: "No .env or .env.local file found"

**Solution:** This is normal if you haven't created a `.env` file yet. Default values will be used:
```bash
cp .env.example .env
```

### Firebase initialization fails

**Problem:** Firebase initialization errors in the console

**Solution:** 
1. Check that all `NG_FIREBASE_*` variables are set in `.env`
2. Verify the values match your Firebase Console configuration
3. Check that Firebase API key restrictions allow your domain

### Production build uses wrong environment

**Problem:** Production build uses development values

**Solution:** Use the correct build command:
```bash
npm run build:prod  # NOT just 'npm run build'
```

## Testing

Run the test suite to verify the configuration system:

```bash
node scripts/test-generate-env.js
```

This tests:
- Generation without `.env` file (defaults)
- Loading values from `.env`
- Overriding with `.env.local`
- Production flag behavior
- npm script integration

## Reference

### Manual Generation

You can manually generate environment files:

```bash
# Generate development environment
node scripts/generate-env.js

# Generate production environment
node scripts/generate-env.js --production
```

### Checking Generated Files

View the generated environment configuration:

```bash
# Development
cat src/environments/environment.ts

# Production
cat src/environments/environment.prod.ts
```

### Resetting to Defaults

To reset to default empty configuration:

```bash
rm .env .env.local
node scripts/generate-env.js
node scripts/generate-env.js --production
```

## Additional Resources

- [../.env.example](../.env.example) - Template with all available variables
- [../scripts/README.md](../scripts/README.md) - Technical documentation for generate-env.js
- [../SECURITY.md](../SECURITY.md) - Security best practices
- [FIREBASE_AUTH_SETUP.md](FIREBASE_AUTH_SETUP.md) - Firebase setup guide
