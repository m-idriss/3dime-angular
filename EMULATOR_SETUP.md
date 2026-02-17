# Firebase Emulator Setup Guide

> **Note:** Firebase Functions have been relocated to the separate [`m-idriss/3dime-api`](https://github.com/m-idriss/3dime-api) repository.
> 
> This guide provides a brief overview for frontend developers. For complete emulator setup, build instructions, and function development, see the **[3dime-api repository](https://github.com/m-idriss/3dime-api)**.

## Overview

This Angular frontend application consumes backend APIs from the `3dime-api` Firebase Functions. During local development, you can test against either:
- **Production API** - The deployed functions at `https://api.3dime.com`
- **Local Emulator** - Functions running locally via Firebase Emulator

## Quick Setup for Local Development

### Prerequisites
- The [`3dime-api`](https://github.com/m-idriss/3dime-api) repository cloned and set up
- Firebase CLI installed (`npm install -g firebase-tools`)

### Starting the Backend Emulator

From the `3dime-api` repository:

```bash
# Clone the backend repository (if not already done)
git clone https://github.com/m-idriss/3dime-api.git
cd 3dime-api

# Install dependencies and build
npm install
npm run build

# Start the emulator
npm run serve
# Or: firebase emulators:start --only functions
```

The emulator will start at `http://localhost:5001`

### Starting the Frontend

From this repository (in a separate terminal):

```bash
npm start
```

The Angular app will run at `http://localhost:4200`

### Configure Environment

Update `src/environments/environment.ts` to point to your local emulator:

```typescript
export const environment = {
  production: false,
  // Replace 'your-project-id' with your Firebase project ID from firebase.json or Firebase Console
  apiUrl: 'http://localhost:5001/your-project-id/us-central1',
  // ... other config
};
```

## Available Function Endpoints

When running the emulator locally, functions are available at:
```
http://localhost:5001/{projectId}/{region}/{functionName}
```

Example endpoints:
- `githubSocial` - GitHub profile data
- `githubCommits` - Commit activity
- `notionFunction` - Notion integration
- `converterFunction` - Calendar converter

See the [`3dime-api` README](https://github.com/m-idriss/3dime-api) for the complete list of available functions and their APIs.

## Troubleshooting

### CORS Errors
Ensure `http://localhost:4200` is in the allowed origins list in the function CORS configuration (configured in `3dime-api`).

### Function Not Found (404)
- Verify the function is built: Check `3dime-api/lib/` directory
- Check emulator logs for registered functions
- Verify URL pattern: `http://localhost:5001/{projectId}/{region}/{functionName}`

### Backend Issues
For function development, deployment, and backend-specific issues, refer to:
- **[3dime-api Repository](https://github.com/m-idriss/3dime-api)** - Backend functions source code
- **[3dime-api README](https://github.com/m-idriss/3dime-api/blob/main/README.md)** - Complete backend documentation

## Additional Resources

- [Firebase Emulator Documentation](https://firebase.google.com/docs/emulator-suite)
- [3dime-api Repository](https://github.com/m-idriss/3dime-api) - **Backend functions source**
- [Angular Environment Configuration](https://angular.dev/tools/cli/environments)
