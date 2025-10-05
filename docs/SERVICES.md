# Services Documentation

> Documentation for all services in the 3dime-angular portfolio application.

## Table of Contents

- [Overview](#overview)
- [Core Services](#core-services)
  - [ThemeService](#themeservice)
  - [ProfileService](#profileservice)
  - [NotionService](#notionservice)
  - [SeoService](#seoservice)
- [Service Guidelines](#service-guidelines)

---

## Overview

Services provide shared business logic, data management, and API integration across components. All services use Angular's dependency injection system and are provided at the root level.

### Service Architecture

```
src/app/services/
├── theme.service.ts      # Theme and appearance management
├── profile.service.ts    # GitHub profile and social data
└── notion.service.ts     # Notion API integration

src/app/shared/seo/
├── seo.service.ts        # SEO and meta tag management
├── seo.models.ts         # SEO interfaces and types
└── schemas/              # JSON-LD structured data schemas
    ├── person.schema.json
    ├── website.schema.json
    └── article.schema.json
```

---

## Core Services

### ThemeService

**Location**: `src/app/services/theme.service.ts`

**Purpose**: Manage application theme, background, and font size settings with persistence.

#### Configuration

```typescript
interface ThemeConfig {
  THEME_MODES: string[];          // ['dark', 'white', 'glass']
  DEFAULT_THEME: string;          // 'glass'
  BACKGROUND_MODES: string[];     // ['black', 'white', 'video']
  DEFAULT_BACKGROUND: string;     // 'video'
  FONT_SIZES: string[];          // ['normal', 'large', 'small']
  DEFAULT_FONT_SIZE: string;     // 'normal'
}
```

#### Public Methods

##### getCurrentTheme()
Returns the current theme mode.

```typescript
getCurrentTheme(): string
```

**Returns**: `'dark' | 'white' | 'glass'`

**Example**:
```typescript
const currentTheme = this.themeService.getCurrentTheme();
console.log(currentTheme); // 'glass'
```

##### cycleTheme()
Cycles to the next theme in the sequence (dark → white → glass → dark).

```typescript
cycleTheme(): string
```

**Returns**: The new theme name

**Example**:
```typescript
const newTheme = this.themeService.cycleTheme();
console.log(newTheme); // 'dark'
```

##### getCurrentBackground()
Returns the current background mode.

```typescript
getCurrentBackground(): string
```

**Returns**: `'black' | 'white' | 'video'`

##### toggleBackground()
Cycles to the next background mode.

```typescript
toggleBackground(): string
```

**Returns**: The new background mode

##### getCurrentFontSize()
Returns the current font size mode.

```typescript
getCurrentFontSize(): string
```

**Returns**: `'normal' | 'large' | 'small'`

##### cycleFontSize()
Cycles to the next font size.

```typescript
cycleFontSize(): string
```

**Returns**: The new font size mode

##### getThemeDisplayName()
Returns a user-friendly display name for a theme.

```typescript
getThemeDisplayName(theme: string): string
```

**Parameters**:
- `theme`: Theme name ('dark', 'white', 'glass')

**Returns**: Display name ('Dark Theme', 'Light Theme', 'Glass Theme')

##### getBackgroundDisplayName()
Returns a user-friendly display name for a background.

```typescript
getBackgroundDisplayName(background: string): string
```

##### getFontSizeDisplayName()
Returns a user-friendly display name for a font size.

```typescript
getFontSizeDisplayName(fontSize: string): string
```

#### Usage Example

```typescript
import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-settings',
  template: `
    <button (click)="changeTheme()">
      Current: {{ currentTheme }}
    </button>
  `
})
export class SettingsComponent {
  constructor(private readonly themeService: ThemeService) {}
  
  get currentTheme(): string {
    return this.themeService.getThemeDisplayName(
      this.themeService.getCurrentTheme()
    );
  }
  
  changeTheme(): void {
    this.themeService.cycleTheme();
  }
}
```

#### Persistence

All theme settings are persisted to `localStorage`:
- `theme` - Current theme mode
- `background` - Current background mode
- `fontSize` - Current font size

Settings are automatically restored on page load.

---

### ProfileService

**Location**: `src/app/services/profile.service.ts`

**Purpose**: Fetch and manage GitHub profile data, social links, and commit activity.

#### Interfaces

```typescript
interface SocialLink {
  provider: string;  // 'GitHub', 'LinkedIn', 'Twitter', etc.
  url: string;       // Full URL to profile
}

interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string;
  bio?: string;
  location?: string;
  public_repos: number;
  email?: string;
}

interface CommitData {
  date: number;      // Unix timestamp
  value: number;     // Number of commits
}
```

#### Public Methods

##### getProfile()
Fetches GitHub user profile information.

```typescript
getProfile(): Observable<GithubUser>
```

**Returns**: Observable of GitHub user data

**Caching**: Results are cached with `shareReplay(1)`

**Example**:
```typescript
this.profileService.getProfile().subscribe(user => {
  console.log(user.name);
  console.log(user.avatar_url);
});
```

##### getSocialLinks()
Fetches social media links from API.

```typescript
getSocialLinks(): Observable<SocialLink[]>
```

**Returns**: Observable array of social links

**Caching**: Results are cached with `shareReplay(1)`

**Example**:
```typescript
this.profileService.getSocialLinks().subscribe(links => {
  links.forEach(link => {
    console.log(`${link.provider}: ${link.url}`);
  });
});
```

##### getCommitsV2()
Fetches GitHub commit activity data for the last year.

```typescript
getCommitsV2(): Observable<CommitData[]>
```

**Returns**: Observable array of commit data with dates and values

**Caching**: Results are cached with `shareReplay(1)`

**Example**:
```typescript
this.profileService.getCommitsV2().subscribe(commits => {
  commits.forEach(commit => {
    const date = new Date(commit.date);
    console.log(`${date.toDateString()}: ${commit.value} commits`);
  });
});
```

#### Configuration

The service uses `environment.apiUrl` for the base API endpoint:

```typescript
private readonly baseUrl = environment.apiUrl;
```

#### Usage Example

```typescript
import { Component, OnInit } from '@angular/core';
import { ProfileService, GithubUser, SocialLink } from './services/profile.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile">
      <img [src]="avatar" [alt]="name">
      <h2>{{ name }}</h2>
      <p>{{ bio }}</p>
      
      <ul>
        @for (link of socialLinks; track link.provider) {
          <li>
            <a [href]="link.url">{{ link.provider }}</a>
          </li>
        }
      </ul>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  name = '';
  avatar = '';
  bio = '';
  socialLinks: SocialLink[] = [];
  
  constructor(private readonly profileService: ProfileService) {}
  
  ngOnInit(): void {
    this.profileService.getProfile().subscribe(user => {
      this.name = user.name || user.login;
      this.avatar = user.avatar_url;
      this.bio = user.bio || '';
    });
    
    this.profileService.getSocialLinks().subscribe(links => {
      this.socialLinks = links;
    });
  }
}
```

---

### NotionService

**Location**: `src/app/services/notion.service.ts`

**Purpose**: Fetch recommended products and tools from Notion database.

#### Public Methods

##### getStuff()
Fetches recommended items categorized by type.

```typescript
getStuff(): Observable<Record<string, any[]>>
```

**Returns**: Observable of items grouped by category

**Example**:
```typescript
this.notionService.getStuff().subscribe(data => {
  // data = {
  //   "Software": [...],
  //   "Hardware": [...],
  //   "Books": [...]
  // }
  
  Object.keys(data).forEach(category => {
    console.log(`${category}:`, data[category]);
  });
});
```

#### Item Structure

Each item contains:
- `name`: Item name
- `url`: Link to product
- `description`: Short description
- `rank`: Sort order within category
- `category`: Category name

#### Usage Example

```typescript
import { Component, OnInit } from '@angular/core';
import { NotionService } from './services/notion.service';

@Component({
  selector: 'app-stuff',
  template: `
    @for (category of categories; track category) {
      <section>
        <h2>{{ category }}</h2>
        <div class="items">
          @for (item of stuffByCategory[category]; track item.name) {
            <article>
              <h3>
                <a [href]="item.url">{{ item.name }}</a>
              </h3>
              <p>{{ item.description }}</p>
            </article>
          }
        </div>
      </section>
    }
  `
})
export class StuffComponent implements OnInit {
  stuffByCategory: Record<string, any[]> = {};
  
  constructor(private readonly notionService: NotionService) {}
  
  ngOnInit(): void {
    this.notionService.getStuff().subscribe(data => {
      this.stuffByCategory = data;
    });
  }
  
  get categories(): string[] {
    return Object.keys(this.stuffByCategory);
  }
}
```

---

### SeoService

**Location**: `src/app/shared/seo/seo.service.ts`

**Purpose**: Manage SEO metadata, Open Graph tags, Twitter Cards, and JSON-LD structured data dynamically.

#### Features

- Dynamic page title management
- Meta tag injection (description, keywords, author, robots)
- Open Graph protocol support
- Twitter Card meta tags
- Canonical URL management
- JSON-LD structured data injection
- Support for loading schemas from external files or inline objects

#### Public Methods

##### updateTags()
Updates page title and meta tags dynamically.

```typescript
updateTags(config: SeoTagConfig): void
```

**Parameters**:
```typescript
interface SeoTagConfig {
  title?: string;              // Page title
  description?: string;        // Meta description
  keywords?: string[];         // Meta keywords array
  author?: string;            // Author name
  image?: string;             // Open Graph image URL
  url?: string;               // Canonical URL
  type?: string;              // Open Graph type ('website', 'article', etc.)
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;       // Twitter handle
  twitterCreator?: string;    // Twitter creator handle
  robots?: string;            // Robots meta tag
}
```

**Example**:
```typescript
this.seoService.updateTags({
  title: 'My Portfolio – Java & Angular Developer',
  description: 'Showcasing my projects and skills in Java, Angular, Spring Boot...',
  keywords: ['Java', 'Angular', 'Spring Boot', 'Quarkus'],
  image: 'https://example.com/preview.png',
  url: 'https://example.com',
  type: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
});
```

##### injectJsonLd()
Inject JSON-LD structured data from a URL (e.g., assets file).

```typescript
injectJsonLd(url: string, id?: string): void
```

**Parameters**:
- `url`: URL to JSON-LD schema file
- `id`: Unique identifier for this script tag (optional, defaults to url)

**Example**:
```typescript
this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
this.seoService.injectJsonLd('assets/seo/website.schema.json', 'website');
```

##### injectJsonLdSchema()
Inject JSON-LD structured data directly from an object.

```typescript
injectJsonLdSchema(schema: JsonLdSchema, id: string): void
```

**Parameters**:
- `schema`: JSON-LD schema object
- `id`: Unique identifier for this script tag

**Example**:
```typescript
this.seoService.injectJsonLdSchema({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'John Doe',
  jobTitle: 'Software Developer',
  url: 'https://example.com'
}, 'person-schema');
```

##### removeJsonLdSchema()
Remove a JSON-LD schema by ID.

```typescript
removeJsonLdSchema(id: string): void
```

##### removeAllJsonLdSchemas()
Remove all JSON-LD schemas.

```typescript
removeAllJsonLdSchemas(): void
```

##### getTitle()
Get current page title.

```typescript
getTitle(): string
```

##### getMetaTag()
Get meta tag content by name.

```typescript
getMetaTag(name: string): string | null
```

#### JSON-LD Schema Files

The service supports loading JSON-LD schemas from the `public/assets/seo/schemas/` directory:

**Person Schema** (`person.schema.json`):
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "jobTitle": "Software Developer",
  "knowsAbout": ["Java", "Angular", "TypeScript"],
  "sameAs": ["https://github.com/username"]
}
```

**WebSite Schema** (`website.schema.json`):
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Portfolio Name",
  "url": "https://example.com",
  "description": "Portfolio description"
}
```

**Article Schema** (`article.schema.json`):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  }
}
```

#### Usage Example

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
    // Set default SEO tags
    this.seoService.updateTags({
      title: '3dime – Java & Angular Developer Portfolio',
      description: 'Personal portfolio showcasing projects and skills.',
      keywords: ['Java', 'Angular', 'Spring Boot'],
      author: '3dime',
      url: 'https://3dime.com',
      type: 'website',
      twitterCard: 'summary_large_image',
      robots: 'index, follow'
    });

    // Inject structured data
    this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person');
    this.seoService.injectJsonLd('assets/seo/website.schema.json', 'website');
  }
}
```

#### Route-Specific SEO

For route-specific SEO, inject the service in individual components:

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
      title: 'About Me – My Portfolio',
      description: 'Learn more about my experience and skills.',
      url: 'https://example.com/about'
    });
  }
}
```

#### Benefits

- **Clean HTML**: Keeps `index.html` minimal and maintainable
- **Dynamic Updates**: SEO tags update per route/component
- **Structured Data**: Easy JSON-LD schema management
- **Type Safety**: Full TypeScript support with interfaces
- **SSR Ready**: Works with Angular Universal for server-side rendering
- **Centralized**: Single service for all SEO concerns

---

## Service Guidelines

### Creating New Services

#### 1. Generate Service

```bash
ng generate service services/my-service
```

#### 2. Service Structure

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private readonly http: HttpClient;
  private cache$?: Observable<any>;
  
  constructor(http: HttpClient) {
    this.http = http;
  }
  
  getData(): Observable<any> {
    if (!this.cache$) {
      this.cache$ = this.http.get('/api/data').pipe(
        shareReplay(1)
      );
    }
    return this.cache$;
  }
}
```

### Best Practices

#### 1. Dependency Injection

Mark dependencies as `readonly`:

```typescript
constructor(
  private readonly http: HttpClient,
  private readonly myService: MyService
) {}
```

#### 2. Caching

Cache HTTP requests with `shareReplay`:

```typescript
getData(): Observable<Data> {
  if (!this.cache$) {
    this.cache$ = this.http.get<Data>('/api/data').pipe(
      shareReplay(1)
    );
  }
  return this.cache$;
}
```

#### 3. Error Handling

Handle errors gracefully:

```typescript
import { catchError, of } from 'rxjs';

getData(): Observable<Data[]> {
  return this.http.get<Data[]>('/api/data').pipe(
    catchError(error => {
      console.error('Error fetching data:', error);
      return of([]); // Return empty array as fallback
    }),
    shareReplay(1)
  );
}
```

#### 4. Type Safety

Use interfaces for data structures:

```typescript
interface UserData {
  id: number;
  name: string;
  email: string;
}

getUser(id: number): Observable<UserData> {
  return this.http.get<UserData>(`/api/users/${id}`);
}
```

#### 5. Configuration

Use environment variables for configuration:

```typescript
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  
  // Use baseUrl in methods
}
```

### Testing Services

#### Basic Service Test

```typescript
describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService]
    });
    
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should fetch data', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    
    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
  
  it('should handle errors', () => {
    service.getData().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });
    
    const req = httpMock.expectOne('/api/data');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

---

## Additional Resources

- [Angular Dependency Injection](https://angular.dev/guide/di)
- [RxJS Documentation](https://rxjs.dev/)
- [HttpClient Guide](https://angular.dev/guide/http)
- [Testing Services](https://angular.dev/guide/testing-services)
