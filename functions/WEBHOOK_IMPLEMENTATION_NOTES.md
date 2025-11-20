# Webhook Implementation Notes

This document provides technical context for the Notion webhook implementation.

## Architecture Overview

### Cache Strategy
- **TTL**: 24 hours (increased from 1 hour)
- **Update Mechanism**: Webhook-driven proactive updates
- **Fallback**: Time-based refresh after TTL expiration
- **Cache Location**: Firestore collection `notion-cache`, document `data`

### Key Files
- `functions/src/proxies/notionWebhook.ts` - Webhook handler
- `functions/src/proxies/notion.ts` - Main API endpoint
- `functions/src/utils/cache.ts` - Cache manager with `get()` and `set()` methods
- `functions/src/utils/notion.ts` - Shared Notion data fetching logic

## Security Implementation

### Webhook Signature Verification
```typescript
// IMPORTANT: Use rawBody, not parsed body
const bodyString = req.rawBody.toString("utf8");

// Case-insensitive header retrieval for compatibility
const signature = req.headers["notion-signature"] || 
                  req.headers["Notion-Signature"];

// Timing-safe comparison to prevent timing attacks
crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
```

**Why rawBody?**
- JSON.stringify(req.body) doesn't preserve original formatting
- Notion signs the original request body before parsing
- Using parsed body causes signature verification to fail

**Why case-insensitive?**
- Different HTTP clients may use different casing
- Ensures compatibility across various webhook sources

### Logging Security
```typescript
// Filter sensitive headers from logs
const safeHeaders = Object.keys(req.headers)
  .filter(key => !key.toLowerCase().includes("signature") && 
                 !key.toLowerCase().includes("auth"))
  .reduce((acc, key) => { acc[key] = req.headers[key]; return acc; }, {});
```

## Testing

### No Unit Tests
The Firebase Functions currently have no unit test infrastructure. Changes are validated through:
1. Build verification (`npm run build`)
2. Manual testing with curl
3. Firebase Functions logs
4. Firestore cache inspection

### Manual Testing Commands
```bash
# Test webhook without signature (dev/testing only)
curl -X POST https://notionwebhook-xxx.run.app \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'

# Test with signature
PAYLOAD='{"test":"webhook"}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "SECRET" | cut -d' ' -f2)
curl -X POST https://notionwebhook-xxx.run.app \
  -H "Content-Type: application/json" \
  -H "Notion-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

## Code Patterns

### Shared Utilities
The `fetchNotionData` function is extracted to `utils/notion.ts` to avoid duplication:
- Used by both `notionFunction` and `notionWebhook`
- Ensures consistent data structure across endpoints
- Single source of truth for Notion API queries

### Cache Manager Usage
```typescript
// For webhook updates (direct cache write)
await cache.set(freshData, simpleHash);

// For API endpoint (with TTL and background refresh)
const data = await cache.get(
  () => fetchNotionData(token, dataSourceId),
  simpleHash,
  forceRefresh
);
```

## Common Issues

### Signature Verification Fails
**Cause**: Using parsed body instead of raw body  
**Solution**: Always use `req.rawBody.toString("utf8")`

### Cache Not Updating
**Cause**: Webhook secret mismatch or Firestore permissions  
**Solution**: Verify secrets with `firebase functions:secrets:access NOTION_WEBHOOK_SECRET`

### Headers Not Found
**Cause**: Case-sensitive header retrieval  
**Solution**: Check both lowercase and title-case versions

## Future Improvements

### Potential Enhancements
- [ ] Add unit tests for webhook handler
- [ ] Implement retry logic for failed webhook updates
- [ ] Add metrics/monitoring for webhook success rate
- [ ] Support for multiple Notion databases
- [ ] Webhook verification for other data sources (GitHub, etc.)

### Testing Infrastructure
Consider adding:
- Firebase Functions Test SDK
- Mock Firestore for unit tests
- Integration tests for webhook flow
- Load testing for concurrent webhook calls
