# Migration Guide: From Static to Dynamic SEO

This guide helps you migrate existing SEO tags from `index.html` to the dynamic SEO service.

## Before and After Comparison

### Before: Static SEO in index.html

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Portfolio - Full Stack Developer</title>
  <meta name="description" content="Personal portfolio showcasing my projects and skills in web development">
  <meta name="keywords" content="developer, portfolio, web development, angular, javascript">
  <meta name="author" content="John Doe">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph -->
  <meta property="og:title" content="My Portfolio - Full Stack Developer">
  <meta property="og:description" content="Personal portfolio showcasing my projects">
  <meta property="og:image" content="https://example.com/og-image.png">
  <meta property="og:url" content="https://example.com">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="My Portfolio - Full Stack Developer">
  <meta name="twitter:description" content="Personal portfolio showcasing my projects">
  <meta name="twitter:image" content="https://example.com/og-image.png">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "John Doe",
    "jobTitle": "Full Stack Developer",
    "url": "https://example.com"
  }
  </script>
  
  <link rel="canonical" href="https://example.com">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### After: Dynamic SEO with SeoService

**Clean index.html:**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Loading...</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Only critical meta tags remain -->
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

**Dynamic SEO in app.ts:**
```typescript
import { Component, OnInit } from '@angular/core';
import { SeoService } from './shared/seo';

@Component({
  selector: 'app-root',
  templateUrl: './app.html'
})
export class App implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTags({
      title: 'My Portfolio - Full Stack Developer',
      description: 'Personal portfolio showcasing my projects and skills in web development',
      keywords: ['developer', 'portfolio', 'web development', 'angular', 'javascript'],
      author: 'John Doe',
      url: 'https://example.com',
      type: 'website',
      image: 'https://example.com/og-image.png',
      twitterCard: 'summary_large_image',
      robots: 'index, follow'
    });

    this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
  }
}
```

**JSON-LD in assets/seo/person.schema.json:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "John Doe",
  "jobTitle": "Full Stack Developer",
  "url": "https://example.com"
}
```

## Migration Steps

### Step 1: Identify Your Current SEO Tags

Make a list of all SEO-related tags in your `index.html`:
- Title
- Meta description
- Meta keywords
- Author
- Robots
- Open Graph tags (og:*)
- Twitter Card tags (twitter:*)
- Canonical URL
- JSON-LD scripts

### Step 2: Create JSON-LD Schema Files

Extract any JSON-LD scripts from `index.html` and save them as `.json` files in `public/assets/seo/`:

**Example: public/assets/seo/person.schema.json**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "jobTitle": "Your Job Title",
  "url": "https://yoursite.com",
  "sameAs": [
    "https://github.com/username",
    "https://linkedin.com/in/username"
  ]
}
```

### Step 3: Update Your App Component

Add SEO initialization to your main app component:

```typescript
import { Component, OnInit } from '@angular/core';
import { SeoService } from './shared/seo';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    // Set default SEO tags
    this.seoService.updateTags({
      title: 'Your page title from index.html',
      description: 'Your meta description from index.html',
      keywords: ['keyword1', 'keyword2', 'keyword3'],
      author: 'Your name',
      url: 'https://yoursite.com',
      type: 'website',
      image: 'https://yoursite.com/og-image.png',
      twitterCard: 'summary_large_image',
      robots: 'index, follow'
    });

    // Load JSON-LD schemas
    this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
    this.seoService.injectJsonLd('assets/seo/website.schema.json', 'website');
  }
}
```

### Step 4: Clean Up index.html

Remove all SEO tags from `index.html`, keeping only:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Loading...</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="favicon.ico">
  <!-- Keep only critical meta tags and resources -->
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### Step 5: Add Route-Specific SEO

For pages with unique SEO requirements, update tags in the component:

```typescript
import { Component, OnInit } from '@angular/core';
import { SeoService } from '../shared/seo';

@Component({
  selector: 'app-about',
  template: `<h1>About Me</h1>`
})
export class AboutComponent implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTags({
      title: 'About Me - My Portfolio',
      description: 'Learn more about my background and experience',
      url: 'https://yoursite.com/about',
      type: 'article'
    });
  }
}
```

### Step 6: Test Everything

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Run the dev server:**
   ```bash
   npm start
   ```

3. **Verify in browser:**
   - Check page title in browser tab
   - Open DevTools → Elements → `<head>`
   - Verify all meta tags are present
   - Check for JSON-LD scripts

4. **Test with SEO tools:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Common Pitfalls

### 1. Keywords as String Instead of Array

❌ **Wrong:**
```typescript
keywords: 'developer, portfolio, angular'
```

✅ **Correct:**
```typescript
keywords: ['developer', 'portfolio', 'angular']
```

### 2. Forgetting to Load JSON-LD Schemas

❌ **Wrong:**
```typescript
ngOnInit(): void {
  this.seoService.updateTags({...});
  // Forgot to load JSON-LD!
}
```

✅ **Correct:**
```typescript
ngOnInit(): void {
  this.seoService.updateTags({...});
  this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
}
```

### 3. Incorrect JSON-LD File Path

❌ **Wrong:**
```typescript
this.seoService.injectJsonLd('src/assets/seo/person.schema.json', 'person');
```

✅ **Correct:**
```typescript
this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
```

### 4. Not Updating URL for Each Page

❌ **Wrong:**
```typescript
// Same URL on every page
this.seoService.updateTags({ url: 'https://example.com' });
```

✅ **Correct:**
```typescript
// Unique URL for each page
this.seoService.updateTags({ url: 'https://example.com/about' });
```

## Verification Checklist

After migration, verify:

- [ ] Page title updates correctly in browser tab
- [ ] Meta description appears in `<head>`
- [ ] Meta keywords are comma-separated
- [ ] Open Graph tags are present (og:title, og:description, og:image, og:url, og:type)
- [ ] Twitter Card tags are present (twitter:card, twitter:title, twitter:description)
- [ ] Canonical URL is set correctly
- [ ] JSON-LD scripts appear in `<head>` with proper formatting
- [ ] Each route has unique SEO tags
- [ ] Production build includes schema JSON files in dist/

## Testing SEO

### Local Testing

Use browser DevTools to inspect the `<head>`:

```javascript
// In browser console
console.log(document.title);
console.log(document.querySelector('meta[name="description"]')?.content);
console.log(document.querySelector('meta[property="og:title"]')?.content);
console.log(document.querySelector('link[rel="canonical"]')?.href);
```

### SEO Validation Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **Schema.org Validator**: https://validator.schema.org/

### Lighthouse SEO Audit

Run Lighthouse in Chrome DevTools:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "SEO" category
4. Click "Generate report"

## Rollback Plan

If you need to rollback:

1. Keep your old `index.html` backed up
2. Simply restore the file
3. Remove SEO initialization from `app.ts`

The service won't interfere with static tags, so you can gradually migrate route by route.

## Benefits After Migration

✅ **Maintainability**: All SEO in one place  
✅ **Type Safety**: TypeScript catches errors  
✅ **Scalability**: Easy to add new routes/schemas  
✅ **Testing**: Can unit test SEO logic  
✅ **Dynamic**: Can update SEO based on data  
✅ **Clean**: Minimal index.html  

## Need Help?

See the full documentation:
- `src/app/shared/seo/README.md` - Complete API reference
- `docs/SERVICES.md` - Service integration guide
- `src/app/shared/seo/seo-example.component.ts` - Working example
