# Scripts

This directory contains utility scripts for the 3dime-angular project.

## generate-env.js

Generates TypeScript environment files from `.env` configuration.

### Usage

```bash
# Generate development environment
node scripts/generate-env.js

# Generate production environment
node scripts/generate-env.js --production
```

### How it works

1. Reads environment variables from:
   - `.env` file (if exists)
   - `.env.local` file (if exists, overrides `.env`)
   - `process.env` (overrides file-based variables)

2. Generates `src/environments/environment.ts` or `src/environments/environment.prod.ts`

3. Environment files are auto-generated - **DO NOT EDIT MANUALLY**

### Environment Variables

Configure these variables in your `.env` file:

- `NG_API_URL` - API endpoint URL
- `NG_FIREBASE_API_KEY` - Firebase API key
- `NG_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NG_FIREBASE_PROJECT_ID` - Firebase project ID
- `NG_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NG_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NG_FIREBASE_APP_ID` - Firebase app ID

See `.env.example` for a complete template.

### Integration with npm scripts

The script is automatically run before builds:

- `npm start` - Runs `generate-env.js` before starting dev server
- `npm run build` - Runs `generate-env.js` before building
- `npm run build:prod` - Runs `generate-env.js --production` before production build
