# Performance Improvements

This document outlines the performance optimizations implemented to improve the application's runtime performance and initial page load speed.

## Summary of Changes

### 1. API Call Optimization with Caching

**Problem**: Multiple components were making duplicate HTTP requests to the same API endpoints.

**Solution**: Implemented proper caching using RxJS `shareReplay(1)` operator.

**Impact**:
- `NotionService.fetchAll()`: Reduced from 5+ duplicate requests (one per component) to 1 cached request
- `ProfileService.getCommitsV2()`: Now properly caches the observable, preventing duplicate requests
- All ProfileService methods now consistently use caching pattern

**Files Modified**:
- `src/app/services/notion.service.ts`
- `src/app/services/profile.service.ts`

### 2. OnPush Change Detection Strategy

**Problem**: Components were using default change detection, causing unnecessary checks on every change detection cycle.

**Solution**: Implemented `ChangeDetectionStrategy.OnPush` on all components with proper `ChangeDetectorRef` usage.

**Impact**:
- Reduced change detection cycles significantly
- Components only check for changes when:
  - Input properties change
  - Events are triggered
  - Observables emit and `markForCheck()` is called
- Improved rendering performance, especially beneficial for larger applications

**Components Updated**:
- `About`
- `Contact`
- `Education`
- `Experience`
- `GithubActivity`
- `Hobbies`
- `ProfileCard`
- `Stuff`
- `TechStack`

### 3. Immutable State Updates

**Problem**: Components were mutating arrays directly, which doesn't work well with OnPush change detection.

**Solution**: Updated `ProfileCard` component to use immutable array operations.

**Impact**:
- Better compatibility with OnPush change detection
- More predictable state management
- Easier to debug and maintain

**Example**:
```typescript
// Before
this.socialLinks.unshift({ provider: 'GitHub', url: user.html_url});

// After
this.socialLinks = [{ provider: 'GitHub', url: user.html_url}, ...this.socialLinks];
```

### 4. Native Fetch API for HTTP Requests

**Problem**: Using XMLHttpRequest for HTTP calls, which is older and less performant.

**Solution**: Enabled native Fetch API using `provideHttpClient(withFetch())`.

**Impact**:
- Better performance for HTTP requests
- Modern API with improved error handling
- Better browser compatibility with newer standards

**Files Modified**:
- `src/app/app.config.ts`

### 5. Optimized Template Tracking

**Status**: Already implemented in codebase

The application already uses Angular 20's modern `@for` control flow with proper `track` expressions:
- All loops track by unique identifiers (`name`, `provider`)
- Reduces DOM manipulation when collections update
- More efficient than old `*ngFor` with `trackBy` functions

## Performance Metrics

### Bundle Size
- **Current**: 668.77 kB (raw) / 180.85 kB (gzipped)
- **Target**: 500 kB
- **Note**: Main bundle size is dominated by the `cal-heatmap` library (required for GitHub activity visualization)

### Runtime Performance Improvements
1. **Reduced Network Requests**: 5+ duplicate Notion API calls → 1 cached call
2. **Reduced Change Detection**: All components now use OnPush strategy
3. **Improved HTTP Performance**: Using native Fetch API
4. **Better State Management**: Immutable updates throughout
5. **Optimized Resource Loading**: 
   - Zero render-blocking CSS resources
   - Deferred non-critical JavaScript
   - 2.2MB background video loads only when needed
   - Reduced initial page load time by deferring Font Awesome (~300KB) and cal-heatmap CSS

## Additional Optimizations Already in Place

The application already has several performance optimizations:
- Event coalescing enabled in zone configuration
- Modern Angular 20 control flow (`@for`, `@if`)
- Standalone components (tree-shakeable)
- Proper semantic HTML structure
- SCSS for efficient styling

### 6. Critical Resource Loading Optimization

**Problem**: External CSS and JavaScript resources were loading synchronously, blocking initial page render.

**Solution**: Implemented strategic resource loading optimizations:
- Deferred non-critical CSS (Font Awesome, cal-heatmap) using `rel="preload"`
- Added `defer` attribute to d3.js script
- Added `preload="none"` to background video (2.2MB asset)

**Impact**:
- Reduced render-blocking resources from 3 to 0
- Background video no longer downloads until needed
- Faster First Contentful Paint (FCP)
- Better perceived performance on initial page load

**Files Modified**:
- `src/index.html` - Updated resource loading strategy
- `src/app/services/theme.service.ts` - Added preload="none" to dynamically created video elements

**Example**:
```html
<!-- Before -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">
<script src="https://d3js.org/d3.v7.min.js"></script>
<video autoplay muted loop playsinline>

<!-- After -->
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<script src="https://d3js.org/d3.v7.min.js" defer></script>
<video autoplay muted loop playsinline preload="none">
```

## Future Optimization Opportunities

For further performance improvements, consider:
1. **Lazy Loading**: Implement route-based code splitting (when routes are added)
2. **Bundle Optimization**: Consider alternatives to cal-heatmap or lazy-load it
3. **Image Optimization**: Implement lazy loading for images
4. **Service Worker**: Add PWA capabilities for offline support and caching
5. **Preloading**: Implement preloading strategies for data
6. **Virtual Scrolling**: If lists become very long
7. **Web Workers**: For heavy computations (if needed)
8. **Critical CSS Inlining**: Consider inlining critical CSS in HTML for faster FCP

## Testing

All changes have been validated:
- ✅ Build succeeds with no errors
- ✅ Application renders correctly
- ✅ Components display properly
- ✅ Fallback states work correctly
- ✅ No breaking changes to existing functionality

## References

- [Angular Change Detection](https://angular.io/guide/change-detection)
- [RxJS shareReplay](https://rxjs.dev/api/operators/shareReplay)
- [Angular HttpClient with Fetch](https://angular.io/api/common/http/withFetch)
- [Angular Control Flow](https://angular.io/guide/control-flow)
