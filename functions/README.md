# Firebase Functions

This directory contains the Firebase Cloud Functions for the 3dime-angular application, providing backend API endpoints and proxy services.

## Overview

The Firebase Functions serve as a backend layer for:
- **GitHub API Proxying**: Fetch user profile, social links, and commit activity
- **Notion API Integration**: Retrieve portfolio data (experience, education, stuff, hobbies, tech stack)
- **Calendar Converter**: AI-powered image/PDF to ICS calendar conversion
- **CORS Handling**: Secure cross-origin requests with whitelisted domains

## Prerequisites

- **Node.js**: 22+ recommended (Node 20 works but Node 22 is recommended for full compatibility)
- **npm**: 10+
- **Firebase CLI**: Install with `npm install -g firebase-tools`
- **Firebase Project**: Set up in [Firebase Console](https://console.firebase.google.com)

## Installation

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install
```

## Project Structure

```
functions/
├── src/
│   ├── index.ts              # Main entry point and proxy API
│   └── proxies/
│       ├── githubCommits.ts  # GitHub commit activity endpoint
│       ├── githubSocial.ts   # GitHub profile and social links
│       ├── notion.ts         # Notion API integration
│       └── converter.ts      # Calendar converter (AI-powered)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Available Functions

### 1. Proxy API (`proxyApi`)

Central proxy endpoint that routes requests to other functions.

**Endpoint**: `/proxyApi`  
**Method**: GET  
**Query Parameters**:
- `target` - Target function (`profile`, `social`, `commit`, `notion`, `converter`)
- `months` - (Optional) Number of months for commit history

**Example**:
```
GET /proxyApi?target=profile
GET /proxyApi?target=commit&months=12
```

### 2. GitHub Commits (`githubCommits`)

Fetches GitHub commit activity for the past N months.

**Endpoint**: `/githubCommits`  
**Method**: GET  
**Query Parameters**:
- `months` - Number of months (default: 12)

### 3. GitHub Social (`githubSocial`)

Retrieves GitHub profile information and social links.

**Endpoint**: `/githubSocial`  
**Method**: GET  
**Query Parameters**:
- `target` - `profile` or `social`

### 4. Notion Function (`notionFunction`)

Fetches portfolio data from Notion database.

**Endpoint**: `/notionFunction`  
**Method**: GET

**Environment Variables Required**:
- `NOTION_TOKEN` - Notion API integration token
- `NOTION_DATASOURCE_ID` - Notion database ID

### 5. Converter Function (`converterFunction`)

Converts images/PDFs to ICS calendar files using AI.

**Endpoint**: `/converterFunction`  
**Method**: POST  
**Body**: Image/PDF file data

**Environment Variables Required**:
- `OPENAI_API_KEY` - OpenAI API key for GPT-4 Vision

## Development

### Local Development

1. **Install Firebase Emulator Suite**:
```bash
firebase init emulators
```

2. **Start Emulators**:
```bash
# From project root
firebase emulators:start
```

3. **Test Functions Locally**:
```bash
# Functions run at http://localhost:5001
curl http://localhost:5001/[project-id]/us-central1/proxyApi?target=profile
```

### Build Functions

```bash
# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run build:watch
```

### Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:proxyApi
firebase deploy --only functions:githubCommits
```

## Configuration

### Environment Variables

Set secrets using Firebase CLI:

```bash
# GitHub API token (for higher rate limits)
firebase functions:secrets:set GITHUB_TOKEN

# Notion API credentials
firebase functions:secrets:set NOTION_TOKEN
firebase functions:secrets:set NOTION_DATASOURCE_ID

# OpenAI API key
firebase functions:secrets:set OPENAI_API_KEY
```

### CORS Configuration

Allowed origins are configured in `src/index.ts`:

```typescript
const allowedOrigins = [
  'https://3dime.com',
  'https://www.3dime.com',
  'http://localhost:4200',
  'http://localhost:5000'
];
```

Update this array to add more allowed origins.

### Function Options

Global function options are set in `src/index.ts`:

```typescript
setGlobalOptions({ 
  maxInstances: 10  // Maximum concurrent instances
});
```

## Testing

### API Testing with Bruno

The project includes a Bruno API collection for testing:

```bash
# See bruno-collections/3dime-api/README.md
cd ../bruno-collections/3dime-api
bru run .
```

### Manual Testing

```bash
# Test proxy API
curl "https://us-central1-[project-id].cloudfunctions.net/proxyApi?target=profile"

# Test GitHub commits (12 months)
curl "https://us-central1-[project-id].cloudfunctions.net/proxyApi?target=commit&months=12"

# Test Notion integration
curl "https://us-central1-[project-id].cloudfunctions.net/proxyApi?target=notion"
```

## Logs and Monitoring

### View Logs

```bash
# View all function logs
firebase functions:log

# View specific function logs
firebase functions:log --only proxyApi

# Follow logs in real-time
firebase functions:log --follow
```

### Firebase Console

Monitor functions in the [Firebase Console](https://console.firebase.google.com):
- **Functions Dashboard**: View usage, errors, and performance
- **Logs**: Real-time and historical logs
- **Metrics**: Request count, execution time, memory usage

## Error Handling

All functions include comprehensive error handling:

```typescript
try {
  // Function logic
} catch (err) {
  console.error('Error:', err);
  return res.status(500).json({ 
    error: err.message 
  });
}
```

Common error responses:
- `400` - Bad Request (missing or invalid parameters)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (CORS error)
- `500` - Internal Server Error

## Performance

### Optimization Tips

1. **Use Function Caching**: Cache API responses when possible
2. **Minimize Cold Starts**: Keep functions warm with scheduled pings
3. **Optimize Dependencies**: Use tree-shaking and minimize bundle size
4. **Set Timeouts**: Configure appropriate timeout values for functions
5. **Monitor Metrics**: Track execution time and memory usage

### Current Performance

- **Average Execution Time**: 200-500ms
- **Cold Start Time**: 1-2 seconds
- **Memory Usage**: 256MB default
- **Concurrent Executions**: Max 10 instances

## Security

### Best Practices

1. **Never commit secrets**: Use Firebase secrets management
2. **Validate input**: Always validate request parameters
3. **Use CORS whitelist**: Restrict allowed origins
4. **Rate limiting**: Implement rate limiting for public endpoints
5. **Authentication**: Use Firebase Auth for protected endpoints

### Environment Security

```bash
# View configured secrets
firebase functions:secrets:access

# Delete a secret
firebase functions:secrets:destroy SECRET_NAME
```

## Troubleshooting

### Common Issues

**Issue**: Function not deploying
```bash
# Check Firebase CLI version
firebase --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: CORS errors
- Verify origin is in `allowedOrigins` array
- Check Firebase Hosting configuration
- Ensure credentials are properly configured

**Issue**: Function timeouts
- Increase timeout in function configuration
- Optimize API calls and processing
- Check for infinite loops or blocking operations

**Issue**: Environment variables not working
- Use Firebase secrets instead of environment variables
- Verify secrets are set: `firebase functions:secrets:access`
- Check function configuration in Firebase Console

## Documentation

For more information, see:
- **[API Documentation](../docs/API.md)** (from repository root: `docs/API.md`) - Detailed API endpoint documentation
- **[Main README](../README.md)** (from repository root: `README.md`) - Project overview
- **[Firebase Functions Docs](https://firebase.google.com/docs/functions)** - Official documentation

## Contributing

When adding new functions:
1. Create function file in `src/proxies/`
2. Export function in `src/index.ts`
3. Update this README with endpoint documentation
4. Add tests to Bruno collection
5. Update API documentation in `docs/API.md`

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
