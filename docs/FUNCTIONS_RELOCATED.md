# Backend API: `3dime-api` (Quarkus)

The backend that powers this frontend has always lived in a separate repository: [`m-idriss/3dime-api`](https://github.com/m-idriss/3dime-api).

This repository (`3dime-angular`) is a pure Angular frontend. It has no backend code. All API endpoints are provided by the Quarkus REST API deployed at `https://api.3dime.com`.

## Quick Start for Local Development

```bash
# Clone the backend repository
git clone https://github.com/m-idriss/3dime-api.git
cd 3dime-api

# Start in development mode (with hot reload)
./mvnw quarkus:dev
```

The API starts at `http://localhost:8080`.

Update `src/environments/environment.ts` in this repo to point to the local backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

## Available Endpoints

When running locally, API endpoints are available at:
```
http://localhost:8080/api/{endpoint}
```

In production:
```
https://api.3dime.com/api/{endpoint}
```

See the [3dime-api README](https://github.com/m-idriss/3dime-api) for the full list of endpoints, environment variable configuration, and deployment instructions.

## Related Documentation

- [API Documentation](./API.md) - Frontend API reference
- [3dime-api Repository](https://github.com/m-idriss/3dime-api) - Backend source code
