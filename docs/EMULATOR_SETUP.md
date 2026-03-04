# Firebase Emulator Setup Guide

> **Note:** The backend has been relocated to the separate [`m-idriss/3dime-api`](https://github.com/m-idriss/3dime-api) repository.
> 
> The backend is built with **Quarkus**, a modern cloud-native Java framework.
> 
> This guide provides a brief overview for frontend developers. For complete backend setup, build instructions, and development, see the **[3dime-api repository](https://github.com/m-idriss/3dime-api)**.

## Overview

This Angular frontend application consumes backend APIs from the `3dime-api` Quarkus application. During local development, you can test against either:
- **Production API** - The deployed API at `https://api.3dime.com`
- **Local Backend** - Quarkus application running locally in dev mode

## Quick Setup for Local Development

### Prerequisites
- The [`3dime-api`](https://github.com/m-idriss/3dime-api) repository cloned and set up
- Java Development Kit (JDK) 17 or later
- Maven (included via Maven wrapper in the repository)

### Starting the Backend

From the `3dime-api` repository:

```bash
# Clone the backend repository (if not already done)
git clone https://github.com/m-idriss/3dime-api.git
cd 3dime-api

# Start Quarkus in development mode (with hot reload)
./mvnw quarkus:dev
```

The API will start at `http://localhost:8080` with live reload enabled.

### Starting the Frontend

From this repository (in a separate terminal):

```bash
npm start
```

The Angular app will run at `http://localhost:4200`

### Configure Environment

Update `src/environments/environment.ts` to point to your local backend:

```typescript
export const environment = {
  production: false,
  // Point to local Quarkus dev server
  apiUrl: 'http://localhost:8080/api',
  // ... other config
};
```

## Available API Endpoints

When running the Quarkus backend locally, API endpoints are available at:
```
http://localhost:8080/api/{endpoint}
```

Example endpoints:
- `githubSocial` - GitHub profile data
- `githubCommits` - Commit activity
- `notionFunction` - Notion integration
- `converterFunction` - Calendar converter

See the [`3dime-api` README](https://github.com/m-idriss/3dime-api) for the complete list of available endpoints and their APIs.

## Troubleshooting

### CORS Errors
Ensure `http://localhost:4200` is in the allowed origins list in the Quarkus application configuration (configured in `3dime-api`).

### Endpoint Not Found (404)
- Verify the Quarkus application is running: Check console output
- Check available endpoints in Quarkus Dev UI at `http://localhost:8080/q/dev`
- Verify URL pattern: `http://localhost:8080/api/{endpoint}`

### Backend Issues
For backend development, deployment, and troubleshooting, refer to:
- **[3dime-api Repository](https://github.com/m-idriss/3dime-api)** - Quarkus backend source code
- **[3dime-api README](https://github.com/m-idriss/3dime-api/blob/main/README.md)** - Complete backend documentation

## Additional Resources

- [Quarkus Documentation](https://quarkus.io/guides/)
- [3dime-api Repository](https://github.com/m-idriss/3dime-api) - **Backend source**
- [Angular Environment Configuration](https://angular.dev/tools/cli/environments)
