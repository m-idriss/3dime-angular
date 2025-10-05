# SEO Module

This module provides a comprehensive solution for managing SEO metadata, Open Graph tags, Twitter Cards, and JSON-LD structured data in Angular applications.

## Features

- ✅ **Dynamic Title Management**: Update page titles programmatically
- ✅ **Meta Tags**: Description, keywords, author, robots
- ✅ **Open Graph Protocol**: Full OG tag support for social sharing
- ✅ **Twitter Cards**: Enhanced Twitter sharing with card metadata
- ✅ **Canonical URLs**: Automatic canonical link management
- ✅ **JSON-LD Structured Data**: Support for schema.org structured data
- ✅ **Type-Safe**: Full TypeScript support with interfaces
- ✅ **SSR Ready**: Compatible with Angular Universal

## Installation

The SEO module is already included in this project. No additional installation needed.

## Quick Start

### 1. Import the Service

```typescript
import { Component, OnInit } from '@angular/core';
import { SeoService } from './shared/seo';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class App implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    // Initialize SEO tags
    this.seoService.updateTags({
      title: 'My Portfolio – Developer',
      description: 'Personal portfolio showcasing my work',
      keywords: ['developer', 'portfolio', 'angular'],
      url: 'https://example.com'
    });

    // Load JSON-LD schemas
    this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
  }
}
```

### 2. Update Tags for Routes

```typescript
import { Component, OnInit } from '@angular/core';
import { SeoService } from '../shared/seo';

@Component({
  selector: 'app-about',
  template: `<h1>About</h1>`
})
export class AboutComponent implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTags({
      title: 'About Me',
      description: 'Learn more about my experience',
      url: 'https://example.com/about'
    });
  }
}
```

## API Reference

### SeoService

#### `updateTags(config: SeoTagConfig): void`

Update page title and meta tags.

**Parameters:**

```typescript
interface SeoTagConfig {
  title?: string;              // Page title
  description?: string;        // Meta description
  keywords?: string[];         // Meta keywords (array)
  author?: string;            // Author name
  image?: string;             // Open Graph image URL
  url?: string;               // Canonical URL
  type?: string;              // Open Graph type
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;       // Twitter handle
  twitterCreator?: string;    // Twitter creator handle
  robots?: string;            // Robots meta tag
}
```

**Example:**

```typescript
this.seoService.updateTags({
  title: 'My Page Title',
  description: 'Page description for search engines',
  keywords: ['keyword1', 'keyword2'],
  author: 'Your Name',
  url: 'https://example.com/page',
  type: 'website',
  image: 'https://example.com/og-image.png',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
});
```

#### `injectJsonLd(url: string, id?: string): void`

Load and inject JSON-LD structured data from a file.

**Example:**

```typescript
this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
```

#### `injectJsonLdSchema(schema: JsonLdSchema, id: string): void`

Inject JSON-LD structured data directly from an object.

**Example:**

```typescript
this.seoService.injectJsonLdSchema({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'John Doe',
  jobTitle: 'Developer'
}, 'person-schema');
```

#### `removeJsonLdSchema(id: string): void`

Remove a specific JSON-LD schema by its ID.

#### `removeAllJsonLdSchemas(): void`

Remove all JSON-LD schemas from the page.

#### `getTitle(): string`

Get the current page title.

#### `getMetaTag(name: string): string | null`

Get the content of a meta tag by its name.

## JSON-LD Schemas

### Creating Schema Files

Create JSON files in `public/assets/seo/` directory:

**Person Schema** (`person.schema.json`):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "url": "https://example.com",
  "jobTitle": "Software Developer",
  "description": "Full-stack developer specializing in...",
  "knowsAbout": ["Java", "Angular", "TypeScript"],
  "sameAs": [
    "https://github.com/username",
    "https://linkedin.com/in/username"
  ]
}
```

**WebSite Schema** (`website.schema.json`):

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Portfolio",
  "url": "https://example.com",
  "description": "Personal portfolio website",
  "author": {
    "@type": "Person",
    "name": "Your Name"
  }
}
```

**Article Schema** (`article.schema.json`):

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "author": {
    "@type": "Person",
    "name": "Your Name"
  },
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-01"
}
```

### Loading Schemas

```typescript
ngOnInit(): void {
  // Load from files
  this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
  this.seoService.injectJsonLd('assets/seo/website.schema.json', 'website');
  
  // Or inject directly
  this.seoService.injectJsonLdSchema({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com'
      }
    ]
  }, 'breadcrumb');
}
```

## Best Practices

### 1. Set Default SEO in App Component

```typescript
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class App implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    // Set site-wide defaults
    this.seoService.updateTags({
      title: 'My Portfolio',
      description: 'Default description',
      author: 'Your Name',
      type: 'website',
      robots: 'index, follow'
    });
  }
}
```

### 2. Override in Route Components

```typescript
@Component({
  selector: 'app-blog-post',
  template: `...`
})
export class BlogPostComponent implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    // Override with page-specific SEO
    this.seoService.updateTags({
      title: 'Blog Post Title',
      description: 'Blog post description',
      type: 'article',
      url: 'https://example.com/blog/post-title'
    });

    // Add article schema
    this.seoService.injectJsonLd('assets/seo/article.schema.json', 'article');
  }

  ngOnDestroy(): void {
    // Clean up article-specific schema when leaving route
    this.seoService.removeJsonLdSchema('article');
  }
}
```

### 3. Use Keywords Array

```typescript
this.seoService.updateTags({
  keywords: ['Angular', 'TypeScript', 'Web Development']
  // This becomes: <meta name="keywords" content="Angular, TypeScript, Web Development">
});
```

### 4. Always Set Canonical URLs

```typescript
this.seoService.updateTags({
  url: 'https://example.com/current-page'
  // This creates: <link rel="canonical" href="https://example.com/current-page">
});
```

### 5. Include Open Graph Images

```typescript
this.seoService.updateTags({
  image: 'https://example.com/og-image.png',
  title: 'Page Title',
  description: 'Page description'
  // Creates og:image, twitter:image tags
});
```

## Angular Universal (SSR) Support

The SEO service is fully compatible with Angular Universal for server-side rendering:

1. Tags are injected server-side
2. Crawlers see complete meta tags
3. JSON-LD schemas are pre-rendered
4. No additional configuration needed

## Testing

### Unit Testing the SEO Service

```typescript
import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService]
    });
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
  });

  it('should update page title', () => {
    service.updateTags({ title: 'Test Title' });
    expect(titleService.getTitle()).toBe('Test Title');
  });

  it('should update meta description', () => {
    service.updateTags({ description: 'Test description' });
    const metaTag = metaService.getTag('name="description"');
    expect(metaTag?.content).toBe('Test description');
  });
});
```

## Troubleshooting

### Issue: Meta tags not updating

**Solution**: Ensure the service is injected in the component constructor and `updateTags()` is called in `ngOnInit()`.

### Issue: JSON-LD not loading

**Solution**: Check that the JSON file path is correct and the file is in the `public/assets/seo/` directory.

### Issue: Duplicate meta tags

**Solution**: The service automatically updates existing tags. If you see duplicates, check if tags are being added manually in `index.html`.

## Migration from index.html

Before (in `index.html`):
```html
<head>
  <title>My Portfolio</title>
  <meta name="description" content="Portfolio description">
  <meta name="keywords" content="developer, portfolio">
  <meta property="og:title" content="My Portfolio">
  <!-- etc... -->
</head>
```

After (in component):
```typescript
ngOnInit(): void {
  this.seoService.updateTags({
    title: 'My Portfolio',
    description: 'Portfolio description',
    keywords: ['developer', 'portfolio']
  });
}
```

Keep `index.html` minimal:
```html
<head>
  <meta charset="utf-8">
  <title>Loading...</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Only critical meta tags here -->
</head>
```

## Resources

- [Schema.org Documentation](https://schema.org)
- [Open Graph Protocol](https://ogp.me)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Angular Meta Service](https://angular.dev/api/platform-browser/Meta)
- [Angular Title Service](https://angular.dev/api/platform-browser/Title)

## License

This module is part of the 3dime-angular project.
