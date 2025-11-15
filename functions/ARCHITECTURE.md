# Backend Caching Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Angular Frontend                         │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ GitHub   │  │ Notion   │  │ Stats    │  │ Profile  │        │
│  │ Service  │  │ Service  │  │ Service  │  │ Component│        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │              │              │               │
└───────┼─────────────┼──────────────┼──────────────┼──────────────┘
        │             │              │              │
        │             │   HTTP API Calls            │
        │             │              │              │
        ▼             ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Firebase Cloud Functions                      │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ proxyApi     │  │ githubCommits│  │ githubSocial │          │
│  │ (Router)     │  │              │  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐          │
│  │notionFunction│  │ CacheManager │  │ CacheManager │          │
│  │              │  │              │  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│  ┌──────▼──────────────────▼──────────────────▼──────┐          │
│  │            statisticsFunction                      │          │
│  │            with CacheManager                       │          │
│  └──────┬─────────────────────────────────────────────┘          │
│         │                                                         │
└─────────┼─────────────────────────────────────────────────────────┘
          │
          │  Cache Read/Write
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Firestore Cache Storage                       │
│                                                                   │
│  Collection: github-cache          Collection: notion-cache      │
│  ┌────────────────────────┐        ┌────────────────────────┐   │
│  │ Doc: commits-6         │        │ Doc: data              │   │
│  │ Doc: commits-12        │        │ - version: "abc123"    │   │
│  │ Doc: profile           │        │ - data: {...}          │   │
│  │ Doc: social-links      │        │ - lastCheckAt: 167... │   │
│  └────────────────────────┘        │ - updatedAt: "2025.." │   │
│                                     └────────────────────────┘   │
│  Collection: stats-cache                                         │
│  ┌────────────────────────┐                                      │
│  │ Doc: statistics        │                                      │
│  │ - version: "def456"    │                                      │
│  │ - data: {...}          │                                      │
│  │ - lastCheckAt: 167...  │                                      │
│  └────────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
          │
          │  External API Calls (when cache refresh needed)
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External APIs                               │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ GitHub API   │  │ Notion API   │  │ Firestore    │          │
│  │ GraphQL      │  │ DataSources  │  │ Tracking     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Normal Request (Cache Hit)

```
1. Client Request
   └─> Firebase Function
       └─> CacheManager.get()
           ├─> Check Firestore for cached data
           ├─> ✅ Cache Hit! (data exists)
           ├─> Return cached data IMMEDIATELY (< 100ms)
           └─> Check if cache is stale
               └─> If stale: Background refresh
                   ├─> Fetch from external API
                   ├─> Compare version hash
                   └─> Update cache only if changed
```

### First Request (Cache Miss)

```
1. Client Request
   └─> Firebase Function
       └─> CacheManager.get()
           ├─> Check Firestore for cached data
           ├─> ❌ Cache Miss! (no data)
           ├─> Fetch from external API (synchronous)
           ├─> Store in Firestore with version
           └─> Return fresh data to client
```

### Force Refresh Request

```
1. Client Request (?force=true)
   └─> Firebase Function
       └─> CacheManager.get(forceRefresh=true)
           ├─> Check cooldown period
           ├─> If within cooldown: return cached data
           └─> If cooldown passed:
               ├─> Return cached data immediately
               └─> Background refresh
                   ├─> Fetch from external API
                   └─> Update cache
```

## Cache Configuration

| Component | Collection | Key | TTL | Force Cooldown | Purpose |
|-----------|-----------|-----|-----|----------------|---------|
| `githubCommits` | `github-cache` | `commits-{months}` | 1h | 5m | GitHub contribution activity |
| `githubSocial` | `github-cache` | `profile` or `social-links` | 1h | 5m | GitHub profile and social media links |
| `notionFunction` | `notion-cache` | `data` | 1h | 5m | Portfolio content (experience, education, hobbies, tech stack) |
| `statisticsFunction` | `stats-cache` | `statistics` | 5m | 1m | Platform usage statistics |

## CacheManager Class

### Key Methods

```typescript
class CacheManager<T> {
  // Get data from cache or fetch fresh
  async get(
    fetchFn: () => Promise<T>,
    versionFn: (data: T) => string,
    forceRefresh: boolean
  ): Promise<T>

  // Clear cache entry manually
  async clear(): Promise<void>

  // Get cache metadata
  async getMetadata(): Promise<{...}>
}
```

### Cache Entry Structure

```typescript
interface CacheEntry<T> {
  version: string;      // Hash for change detection
  data: T;             // Actual cached data
  lastCheckAt: number; // Timestamp of last refresh check
  updatedAt: string;   // ISO timestamp of last update
}
```

## Performance Characteristics

### Response Times

| Scenario | Response Time | Notes |
|----------|--------------|-------|
| Cache Hit (fresh) | < 100ms | Firestore read only |
| Cache Hit (stale) | < 100ms | Returns cached + background refresh |
| Cache Miss | 2-5 seconds | Full external API call |
| Force Refresh | < 100ms | Returns cached + background refresh (if cooldown passed) |

### API Call Reduction

With 1-hour TTL and moderate traffic:
- **Before caching**: ~3,600 API calls/hour (1 per second)
- **After caching**: ~1-2 API calls/hour (initial + refresh)
- **Reduction**: ~99.9% fewer external API calls

## Benefits by Endpoint

### GitHub Commits
- **Before**: GraphQL query every request (~2-3s)
- **After**: Cache hit in ~50ms
- **Improvement**: 40-60x faster

### GitHub Profile/Social
- **Before**: REST API call every request (~1-2s)
- **After**: Cache hit in ~50ms
- **Improvement**: 20-40x faster

### Notion Data
- **Before**: DataSource query every request (~2-4s)
- **After**: Cache hit in ~50ms
- **Improvement**: 40-80x faster

### Statistics
- **Before**: Firestore aggregation every request (~500ms)
- **After**: Cache hit in ~50ms
- **Improvement**: 10x faster

## Monitoring & Observability

### Log Messages

```
✅ Cache hit for commits-12 (age: 1234567)
❌ Cache miss for profile - fetching fresh data
🔄 Refreshing cache for social-links
✨ Cache updated for commits-12 (version changed)
ℹ️  Cache checked for profile - no changes
⏸️  Cooldown active for notion-data - skipping refresh
⚠️  Background refresh failed for statistics
```

### Key Metrics to Monitor

1. **Cache Hit Rate**: Should be > 95%
2. **Background Refresh Success Rate**: Should be > 99%
3. **Average Response Time**: Should be < 200ms
4. **External API Calls**: Should match refresh frequency

## Security Considerations

- ✅ No sensitive credentials stored in cache
- ✅ API tokens remain in environment variables
- ✅ Cache respects CORS origins
- ✅ Force refresh has cooldown protection
- ✅ Firestore security rules apply

## Future Enhancements

### Phase 2 (Potential)
- [ ] Redis/Memcached for sub-10ms responses
- [ ] Cache warming on deployment
- [ ] Multi-region cache replication
- [ ] Cache analytics dashboard
- [ ] Automatic cache invalidation webhooks
- [ ] Smart TTL adjustment based on change frequency

### Phase 3 (Advanced)
- [ ] Predictive cache warming
- [ ] Edge caching with CDN integration
- [ ] Real-time cache synchronization
- [ ] A/B testing different cache strategies
