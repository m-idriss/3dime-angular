# 📐 System Architecture Documentation

> **Comprehensive technical and architectural overview of the 3dime-angular portfolio application**

This document provides a complete system architecture for the 3dime-angular portfolio, including frontend Angular application, backend integration, data flow, and deployment architecture.

> **Note:** The backend is maintained in the separate [`m-idriss/3dime-api`](https://github.com/m-idriss/3dime-api) repository (Quarkus REST API). For backend architecture, caching strategies, and API implementation details, see the [3dime-api repository documentation](https://github.com/m-idriss/3dime-api).

## Table of Contents

1. [System Overview](#-1-system-overview)
2. [Technology Stack](#-2-technology-stack)
3. [Frontend Architecture](#-3-frontend-architecture)
4. [Backend Architecture](#-4-backend-architecture)
5. [Data Flow & State Management](#-5-data-flow--state-management)
6. [Authentication & Security](#-6-authentication--security)
7. [Caching Architecture](#-7-caching-architecture)
8. [Deployment Architecture](#-8-deployment-architecture)
9. [Feature-Specific Architectures](#-9-feature-specific-architectures)

---

# 🌟 1. System Overview

The 3dime-angular portfolio is a modern, high-performance personal portfolio application built with Angular 20.3+. It features an AI-powered Calendar Converter alongside traditional portfolio sections, all presented with a stunning space-themed design.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            End Users                                     │
│                    (Web, Mobile, Desktop PWA)                           │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Static Hosting / CDN                               │
│                    (Static Assets, Service Worker)                       │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ Loads
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Angular 20.3+ Frontend                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │  Components  │  │   Services   │  │   Routing    │                 │
│  │  - Profile   │  │  - GitHub    │  │  - Guards    │                 │
│  │  - Converter │  │  - Notion    │  │  - Resolvers │                 │
│  │  - Portfolio │  │  - Theme     │  │              │                 │
│  │  - Contact   │  │  - Converter │  │              │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS API Calls
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Quarkus REST API                                      │
│                  (3dime-api - External Repository)                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  API Proxy Layer (proxyApi)                                      │  │
│  │  - GitHub Integration  - Notion Integration                      │  │
│  │  - Converter (AI)      - Statistics                              │  │
│  │  - Quota Management    - Social Links                            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                             │                                             │
│                             │ Cache Layer                                │
│                             ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Backend Cache (TTL-based)                                       │  │
│  │  - github-cache     - notion-cache                               │  │
│  │  - stats-cache      - Background refresh                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ External API Calls
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      External Services                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │  GitHub API  │  │  Notion API  │  │  OpenAI API  │                 │
│  │  (GraphQL +  │  │ (DataSources)│  │  (GPT-4o)    │                 │
│  │   REST)      │  │              │  │              │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Characteristics

- **Modern Angular Stack**: Standalone components, TypeScript strict mode, RxJS for reactive programming
- **Progressive Web App**: Installable, offline-capable, share target integration
- **Quarkus Backend**: REST API (in [3dime-api repo](https://github.com/m-idriss/3dime-api)) for API proxy and AI processing
- **Intelligent Caching**: Backend-managed caching with background refresh
- **AI Integration**: OpenAI GPT-4 Vision for calendar event extraction
- **Space-Themed UI**: Glassmorphism effects with modern CSS features

---

# 🛠️ 2. Technology Stack

## Frontend Technologies

### Pattern 1: Standard API Request (with Cache)

```
User Action → Component → Service → Backend API → Cache Check
                                                              │
                                                              ├─ Hit → Return Cached Data (< 100ms)
                                                              │        └─ Background Refresh if Stale
                                                              │
                                                              └─ Miss → External API Call (2-5s)
                                                                        └─ Store in Cache
                                                                        └─ Return Fresh Data
```

### Pattern 2: Authenticated Request (Converter)

```
User Upload → Converter Component → Auth Service → Get ID Token
                                                         │
                                                         ▼
                                            Backend API endpoint (with token)
                                                         │
                                                         ├─ Verify Token
                                                         ├─ Check Quota (Notion)
                                                         ├─ Process with AI (OpenAI)
                                                         ├─ Update Quota
                                                         ├─ Log Usage
                                                         └─ Return ICS
```

### Pattern 3: PWA Offline Access

```
User Request → Service Worker Intercept
                       │
                       ├─ Network Available → Fetch from Network
                       │                      └─ Update Cache
                       │
                       └─ Network Unavailable → Serve from Cache
                                               └─ Show Offline UI
```

## State Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     Application State                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  UI State (Component Level)                                  │
│  ├─ menuOpen: boolean                                        │
│  ├─ loading: boolean                                         │
│  └─ editingEvent: CalendarEvent | null                       │
│                                                               │
│  Shared State (Service Level)                                │
│  ├─ theme$: BehaviorSubject<string>                          │
│  ├─ user$: BehaviorSubject<User | null>                      │
│  └─ quotaStatus$: BehaviorSubject<QuotaInfo>                 │
│                                                               │
│  Cached State (HTTP with shareReplay)                        │
│  ├─ profile$: Observable<GithubUser>                         │
│  ├─ commits$: Observable<CommitData[]>                       │
│  └─ stuff$: Observable<Record<string, any[]>>                │
│                                                               │
│  Persisted State (localStorage)                              │
│  ├─ theme: 'glass' | 'dark' | 'white'                        │
│  ├─ background: 'video' | 'black' | 'white'                  │
│  └─ fontSize: 'normal' | 'large' | 'small'                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

# 🔐 6. Authentication & Security

## Authentication Flow

```
┌─────────────┐
│   User      │
│  Clicks     │
│ "Sign In"   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Auth Service (Frontend)                │
│   - signInWithGoogle()                   │
│   - Opens Google OAuth popup             │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Google OAuth Provider                   │
│   - Validates Google credentials         │
│   - Issues ID token (JWT)                │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Frontend receives UserCredential       │
│   - Store user in auth service           │
│   - Get ID token: user.getIdToken()      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Send request to converter function     │
│   - Authorization: Bearer <id_token>     │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Backend verifies token                 │
│   - admin.auth().verifyIdToken(token)    │
│   - Extract user ID and email            │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Process authenticated request          │
│   - Check quota for user                 │
│   - Process conversion                   │
│   - Track usage                          │
└─────────────────────────────────────────┘
```

## Security Measures

### Frontend Security

| Measure | Implementation |
|---------|---------------|
| **HTTPS Only** | Enforced by static hosting / CDN |
| **CSP Headers** | Content Security Policy configured |
| **XSS Prevention** | Angular's built-in sanitization |
| **CORS** | Restricted to specific origins |
| **Environment Variables** | Sensitive data in environment files (not committed) |

### Backend Security

| Measure | Implementation |
|---------|---------------|
| **Token Verification** | Backend verifies all ID tokens |
| **Rate Limiting** | Quota system prevents abuse |
| **API Keys** | Stored as server environment variables, never exposed |
| **Input Validation** | Request body validation before processing |
| **Error Handling** | Generic error messages to prevent info leakage |

### API Key Management

```
Development:
  - .env.example (template)
  - .env (local, gitignored)

Production:
  - Server environment variables
  - GitHub Actions secrets: OPENAI_API_KEY
  - Environment variables injected at build time
```

## Quota System (Notion-based)

Prevents abuse of AI conversion feature:

1. **User limits stored in Notion database**
   - Monthly conversion quota per user
   - Tracked by user ID

2. **Quota check before processing**
   ```typescript
   const quota = await notion.databases.query({
     filter: { property: 'UserID', equals: userId }
   });
   if (quota.conversions >= quota.limit) {
     throw new Error('Monthly quota exceeded');
   }
   ```

3. **Automatic tracking**
   - Each conversion increments counter
   - Notion automation notifies admin on high usage

---

# 💾 7. Caching Architecture

## Multi-Layer Caching Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                    Layer 1: Browser Cache                       │
│                    (Service Worker)                             │
│  - Static assets (JS, CSS, images): 1 year                     │
│  - HTML: Network-first, fallback to cache                      │
│  - API responses: Not cached (handled by Layer 2)              │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    Layer 2: RxJS shareReplay                    │
│                    (Frontend Services)                          │
│  - Duration: Session lifetime                                  │
│  - Scope: Single page load                                     │
│  - Benefits: Prevents duplicate HTTP requests                  │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    Layer 3: Backend Cache                       │
│                    (Quarkus API)                                │
│  - TTL: 1 hour (most), 5 min (statistics)                     │
│  - Scope: Global, all users                                    │
│  - Benefits: Fast response, reduced external API calls         │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    External APIs                                │
│  - GitHub API, Notion API, OpenAI API                          │
└────────────────────────────────────────────────────────────────┘
```

## Backend Cache Implementation

Detailed documentation: See the backend documentation in the `3dime-api` repository for caching implementation details.

### Cache Manager

```typescript
class CacheManager<T> {
  constructor(options: {
    collection: string;    // Cache collection
    key: string;          // Document ID
    ttl: number;          // Time-To-Live in ms
    forceCooldown?: number; // Min time between force refreshes
  });
  
  async get(
    fetchFn: () => Promise<T>,      // Function to fetch fresh data
    versionFn: (data: T) => string, // Version hashing function
    forceRefresh: boolean           // Force refresh flag
  ): Promise<T>;
}
```

### Cache Configuration

| Endpoint | Collection | Key | TTL | Purpose |
|----------|-----------|-----|-----|---------|
| `githubCommits` | `github-cache` | `commits-{months}` | 1h | GitHub activity |
| `githubSocial` | `github-cache` | `profile` / `social-links` | 1h | Profile data |
| `notionFunction` | `notion-cache` | `data` | 1h | Portfolio content |
| `statisticsFunction` | `stats-cache` | `statistics` | 5m | Usage stats |

### Cache Behavior

**Cache Hit (Fresh)**
```
Request → Check Cache → Found & Fresh → Return Immediately (< 100ms)
```

**Cache Hit (Stale)**
```
Request → Check Cache → Found but Stale
                                   │
                                   ├─ Return Cached Data (< 100ms)
                                   └─ Background Refresh
                                       └─ Update cache if data changed
```

**Cache Miss**
```
Request → Check Cache → Not Found → Fetch from API (2-5s)
                                        └─ Store in Cache
                                        └─ Return Fresh Data
```

## Performance Impact

| Metric | Before Caching | After Caching | Improvement |
|--------|---------------|---------------|-------------|
| **Response Time** | 2-5s | < 100ms | **20-50x faster** |
| **API Calls/hour** | ~3,600 | 1-2 | **99.9% reduction** |
| **User Experience** | Slow initial load | Instant | **Perceived instant** |

---

# 🚀 8. Deployment Architecture

## CI/CD Pipeline

### GitHub Actions Workflows

```
.github/workflows/
├── qodana_code_quality.yml # Code quality analysis
├── update-screenshot.yml   # Automated screenshot updates
├── release.yml            # Release automation
├── labeler.yml            # PR labeling
└── summary.yml            # PR summary generation
```

### Deployment Flow

```
┌─────────────┐
│  Developer  │
│  Manually   │
│   Deploys   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Build Application Locally          │
│  - npm run build --configuration    │
│    production                       │
│  - Output: dist/3dime-angular/      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Deploy to Hosting                  │
│  - Netlify / Vercel / GitHub Pages  │
│  - Manual FTP/SFTP upload           │
│  - Custom web server                 │
└─────────────────────────────────────┘
```

### Deployment Targets

#### Production (3dime.com)

| Component | Deployment Method | Hosting |
|-----------|------------------|---------|
| **Frontend** | Deploy to static hosting platform | CDN-backed |
| **Backend API** | See [3dime-api repository](https://github.com/m-idriss/3dime-api) | Cloud platform |

#### Development

```bash
# Local development server
npm start  # http://localhost:4200

# Local backend (Quarkus dev mode)
# See 3dime-api repository for instructions
```

## Environment Configuration

### Frontend Environments

```typescript
// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.3dime.com',
};
```

### Backend Configuration

Configure environment variables in the [3dime-api repository](https://github.com/m-idriss/3dime-api):

```bash
# Set in .env or server environment variables
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
NOTION_TOKEN=secret_...
```

## Hosting Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        DNS (3dime.com)                       │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Static Hosting / CDN                        │  │
│  │  - SSL/TLS (configured per platform)'s Encrypt)                  │  │
│  │  - Global CDN with edge locations                     │  │
│  │  - Serves static files from dist/                     │  │
│  │  - Service Worker caching                             │  │
│  └────────────────┬──────────────────────────────────────┘  │
│                   │                                          │
│                   ├─ /index.html                             │
│                   ├─ /assets/*                               │
│                   ├─ /*.js, /*.css                           │
│                   └─ Service Worker (ngsw-worker.js)         │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Quarkus REST API (api.3dime.com)                │
│  - See 3dime-api repository for deployment details            │
│  - API endpoints:                                            │
│    • /api/* (main endpoints)                                │
│    • /api/converter (AI processing)                         │
└─────────────────────────────────────────────────────────────┘
```

---

# 🎯 9. Feature-Specific Architectures

## Calendar Converter - AI System Design

The **Converter module** allows users to authenticate, convert images into ICS events via Gemini Pro, track their usage quotas, and trigger admin notifications.

## 🔎 High-Level Flow

1. User authenticates using **Google OAuth**.
2. Frontend sends images + auth token to the **Proxy**.
3. Proxy checks the monthly quota via **Notion**.
4. If quota is valid → Proxy sends images to **Gemini Pro** to generate ICS event(s).
5. Proxy updates user quota in Notion.
6. Proxy logs usage in Notion.
7. Notion automatically notifies the assigned Admin.

---

## 🧩 Converter — Sequence Diagram

```mermaid
sequenceDiagram
    participant FE as 🌐 Frontend
    participant A as 🔒 Google OAuth
    participant P as 🪞 Proxy
    participant NQ as 🧠 Notion - (Quota DB)
    participant GP as ✨ Gemini Pro
    participant NL as 🧠 Notion - (Stats DB)
    participant NN as 🔔 Notion - Admin Notify

    FE->>A: Authenticate with Google
    A-->>FE: Auth token (JWT)

    FE->>P: Send images + auth token

    P->>NQ: Check monthly quota
    NQ-->>P: Quota OK/Exceeded

    alt Quota OK
        P->>GP: Convert images to ICS
        GP-->>P: ICS result

        P->>NQ: Update quota
        NQ-->>P: Quota updated

        P->>NL: Log usage
        NL-->>P: Log saved

        NL->>NN: Notify admin
        NN-->>NN: Admin receives alert

        P-->>FE: Return ICS file(s)
    else Quota Exceeded
        P-->>FE: Error: Quota exceeded
    end
```

---

## Portfolio Data Integration

The **Portfolio module** retrieves both GitHub and Notion data through the Proxy and displays it in the frontend as cards and widgets.

## 🔎 High-Level Flow

1. Frontend requests portfolio data from the **Proxy**.
2. Proxy fetches content categories from **Notion (3Dime DB)**.
3. Proxy fetches:

  * GitHub activity heatmap
  * GitHub profile data
  * GitHub social links
  * GitHub repo metadata (releases, etc.)
4. Proxy merges Notion + GitHub data.
5. Frontend renders all cards and components.

### 🔄 Backend Cache

The proxy uses a **TTL-based cache** to store all portfolio-related data.
This reduces the number of calls to GitHub and Notion APIs, prevents hitting rate limits, and improves load times.
Cached entries follow a TTL-based invalidation strategy.

---

## 🧩 Portfolio — Sequence Diagram

```mermaid
sequenceDiagram
    participant FE as 🌐 Frontend
    participant P as 🪞 Proxy
    participant N as 🧠 Notion (3Dime DB)
    participant G as 🐙 GitHub API

    FE->>P: Request portfolio data

    P->>N: Fetch Notion categories
    N-->>P: Notion data

    P->>G: Fetch GitHub data (profile, activity, etc.)
    G-->>P: GitHub data

    P-->>FE: Combined portfolio data
    FE-->>FE: Render cards + GitHub widgets
```

---

## Complete Technology Stack

### Frontend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Angular | 20.3.10 | Core application framework with standalone components |
| **Language** | TypeScript | 5.9.3 | Type-safe development |
| **Reactive Programming** | RxJS | 7.8.2 | Observable streams and async operations |
| **Styling** | SCSS | - | Component styling with CSS custom properties |
| **UI Components** | Bootstrap | 5.3.8 | UI component library |
| **Build Tool** | Angular CLI | 20.3.9 | Build system with esbuild bundler |
| **PWA** | @angular/service-worker | 20.3.9 | Progressive Web App capabilities |
| **PDF Processing** | PDF.js | 5.4.5 | PDF to image conversion |
| **Calendar Visualization** | cal-heatmap | 4.2.4 | GitHub activity heatmap |
| **Calendar Display** | FullCalendar | 6.1.16 | Event calendar rendering |
| **ICS Generation** | ical.js | 2.2.2 | iCalendar file format handling |

### Backend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Quarkus | Latest | Cloud-native Java REST API |
| **Authentication** | Google OAuth / JWT | - | Token-based authentication |
| **AI Processing** | OpenAI API | Latest | GPT-4o Vision for calendar extraction |
| **HTTP Client** | Quarkus REST Client | - | HTTP requests to external APIs |

### External APIs

| Service | Purpose | Integration Type |
|---------|---------|------------------|
| **GitHub API** | Profile data, social links, commit activity | GraphQL + REST |
| **Notion API** | Portfolio content (stuff, recommendations) | DataSource API |
| **OpenAI GPT-4o** | Calendar event extraction from images/PDFs | REST API |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting with Angular-specific rules |
| **Prettier** | Code formatting |
| **Jasmine + Karma** | Unit testing framework |
| **Bruno** | API testing collections |
| **GitHub Actions** | CI/CD pipeline automation |

### Hosting & Deployment

| Service | Purpose |
|---------|---------|
| **Static Hosting** | Netlify, Vercel, or similar CDN-backed hosting |
| **Backend API** | api.3dime.com (Quarkus, see 3dime-api repo) |
| **Custom Domain** | 3dime.com with SSL/TLS |

---

# 🎨 3. Frontend Architecture

## Component Architecture

The application uses Angular 20.3+ standalone components with a modular, feature-based structure.

### Component Hierarchy

```
App (Root Component)
├── Profile Card
│   ├── Social Links
│   ├── Theme Switcher
│   └── Menu (Mobile)
├── About
├── Tech Stack
├── GitHub Activity
│   └── Cal-Heatmap Visualization
├── Experience
├── Education
├── Calendar Converter ⭐
│   ├── File Upload (Drag & Drop)
│   ├── Auth Gate (Google OAuth)
│   ├── File List
│   ├── Progress Tracker
│   ├── Event Editor
│   └── ICS Download
├── Stuff (Notion-powered)
├── Hobbies
├── Contact
└── Footer
```

### Directory Structure

```
src/app/
├── components/           # UI Components
│   ├── profile-card/    # Profile with social links
│   ├── about/           # About section
│   ├── tech-stack/      # Technologies showcase
│   ├── github-activity/ # Contribution heatmap
│   ├── experience/      # Work experience
│   ├── education/       # Academic background
│   ├── converter/       # AI Calendar Converter ⭐
│   ├── stuff/           # Recommendations
│   ├── hobbies/         # Personal interests
│   ├── contact/         # Contact info
│   └── footer/          # Footer section
├── services/            # Business Logic
│   ├── github.service.ts      # GitHub API integration
│   ├── notion.service.ts      # Notion API integration
│   ├── theme.service.ts       # Theme management
│   ├── converter.service.ts   # Calendar converter logic
│   └── auth.service.ts        # Google OAuth authentication
├── models/              # TypeScript interfaces
├── guards/              # Route guards
├── utils/               # Utility functions
├── constants/           # App constants
└── app.ts              # Root component
```

## Service Layer

### Core Services

```typescript
// GitHub Service - Profile and activity data
export class GithubService {
  getProfile(): Observable<GithubUser>
  getSocialLinks(): Observable<SocialLink[]>
  getCommitsV2(): Observable<CommitData[]>
}

// Notion Service - Portfolio content
export class NotionService {
  getStuff(): Observable<Record<string, any[]>>
}

// Theme Service - Appearance management
export class ThemeService {
  getCurrentTheme(): string
  cycleTheme(): string
  toggleBackground(): string
  cycleFontSize(): string
}

// Converter Service - AI calendar processing
export class ConverterService {
  convertToCalendar(files: File[], token: string): Observable<ConversionResult>
  downloadICS(events: CalendarEvent[], filename: string): void
}

// Auth Service - Google OAuth authentication
export class AuthService {
  signInWithGoogle(): Promise<UserCredential>
  signOut(): Promise<void>
  getIdToken(): Promise<string | null>
}
```

## State Management

The application uses a **service-based state management** approach with RxJS:

- **Local Component State**: Angular signals and properties for component-specific state
- **Shared State**: Services with BehaviorSubject/ReplaySubject for cross-component state
- **API Caching**: `shareReplay(1)` operator for HTTP request caching
- **Theme Persistence**: localStorage for theme preferences

```typescript
// Example: Theme Service State Management
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme$ = new BehaviorSubject<string>('glass');
  
  theme$ = this.currentTheme$.asObservable();
  
  cycleTheme(): string {
    const newTheme = this.getNextTheme();
    this.currentTheme$.next(newTheme);
    localStorage.setItem('theme', newTheme);
    return newTheme;
  }
}
```

## Routing Strategy

- **Hash-based routing** for compatibility with static hosting
- **Lazy loading** (potential future enhancement for converter module)
- **Route guards** for authentication-required features

## Styling Architecture

### CSS Custom Properties (Design Tokens)

```scss
:root {
  // Colors
  --text-primary: rgba(255, 255, 255, 0.95);
  --accent-color: #3b82f6;
  --glass-bg: rgba(255, 255, 255, 0.05);
  
  // Spacing
  --space-md: 1rem;
  --space-lg: 1.5rem;
  
  // Typography
  --font-size-base: 1.125rem;
  
  // Effects
  --glass-blur: blur(16px);
  --border-radius: 16px;
}
```

### Theming System

- **Glass Theme** (default): Translucent frosted-glass effect with space video background
- **Dark Theme**: Pure black background with high-contrast text
- **White Theme**: Clean white background for accessibility

---

# ⚙️ 4. Backend Architecture

> **Note:** The backend is maintained in a separate repository: [`m-idriss/3dime-api`](https://github.com/m-idriss/3dime-api)
> 
> The backend is built with **Quarkus**, a modern, cloud-native Java framework optimized for containerized environments and serverless deployments.
> 
> For complete backend architecture, function implementation details, API endpoint specifications, and deployment instructions, see the [3dime-api repository](https://github.com/m-idriss/3dime-api).

## Backend Overview

The backend is a **Quarkus-based REST API** deployed as a serverless application. The frontend (this repository) consumes these APIs via HTTP requests.

### Key Backend Services

- **GitHub Integration** - Fetch profile data and commit activity
- **Notion Integration** - Retrieve portfolio content (stuff, experience, education)
- **AI Converter** - Calendar event extraction using OpenAI GPT-4 Vision
- **Statistics & Quota** - Usage tracking and quota management
- **Caching** - Backend TTL-based caching with intelligent refresh strategies

### Backend Technology Stack

The [`3dime-api`](https://github.com/m-idriss/3dime-api) backend is built with:

- **Quarkus** - Supersonic Subatomic Java framework for cloud-native applications
- **Java** - Modern Java with reactive programming
- **RESTEasy** - JAX-RS implementation for REST endpoints
- **Microprofile** - Cloud-native microservices APIs

**Key Benefits:**
- Fast startup times and low memory footprint
- Native compilation support with GraalVM
- Optimized for serverless and containerized deployments
- Developer-friendly with live reload and streamlined APIs

## API Integration

### Main Proxy Endpoint

The backend exposes a unified proxy API at `https://api.3dime.com` that routes requests based on the `target` parameter:

| Target | Description | Cache TTL |
|--------|-------------|-----------|
| `profile` | GitHub user profile | 1 hour |
| `social` | Social media links | 1 hour |
| `commits` | GitHub commit activity | 1 hour |
| `notion` | Portfolio content | 24 hours* |
| `statistics` | Usage statistics | 5 minutes |
| `quotaStatus` | User quota status | Real-time |

*Notion cache uses webhook-based invalidation for instant updates

### Converter Endpoint

Separate authenticated endpoint for AI-powered calendar conversion:
- **URL**: `https://converter.3dime.com` (or similar)
- **Auth**: JWT token required
- **Quota**: Managed via Notion database
- **Processing**: OpenAI GPT-4 Vision API

## External API Integration

### GitHub API

**GraphQL** for commit activity (efficient, single query):
```graphql
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
```

**REST API** for profile and social links:
```
GET https://api.github.com/users/{username}
GET https://api.github.com/users/{username}/social_accounts
```

### Notion API

**DataSource API** for portfolio content:
```typescript
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const response = await notion.databases.query({
  database_id: NOTION_DATABASE_ID,
  filter: { property: 'Status', status: { equals: 'Published' } }
});
```

### OpenAI API

**GPT-4o Vision** for calendar event extraction:
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: SYSTEM_PROMPT },
        { type: 'image_url', image_url: { url: imageBase64 } }
      ]
    }
  ]
});
```

---

# 🔄 5. Data Flow & State Management

---

# 📊 Performance Characteristics

## Build Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Build Time** | ~14 seconds | Production build with optimization |
| **Bundle Size (Raw)** | 2.06 MB | Uncompressed JavaScript + CSS |
| **Transfer Size** | 479.12 kB | Compressed with gzip |
| **Initial Load** | < 3 seconds | On 3G connection |
| **Time to Interactive** | < 2 seconds | After initial load |

## Test Coverage

| Category | Count | Status |
|----------|-------|--------|
| **Unit Tests** | 100 tests | ✅ All passing |
| **Components** | ~15 components | Full coverage |
| **Services** | 5+ services | Full coverage |
| **Test Execution** | < 1 second | After build (14s) |

## Runtime Performance

### Frontend Performance

| Metric | Target | Actual |
|--------|--------|--------|
| **First Contentful Paint** | < 1.5s | ✅ ~1.2s |
| **Largest Contentful Paint** | < 2.5s | ✅ ~2.1s |
| **Time to Interactive** | < 3.5s | ✅ ~2.8s |
| **Cumulative Layout Shift** | < 0.1 | ✅ ~0.05 |

### Backend Performance

| Operation | Cold Start | Warm |
|-----------|-----------|------|
| **GitHub API (cached)** | ~150ms | < 100ms |
| **Notion API (cached)** | ~200ms | < 100ms |
| **Converter (AI)** | ~5-8s | ~3-5s |
| **Cache Hit** | N/A | < 50ms |

## Optimization Techniques

### Frontend Optimizations

- ✅ **OnPush Change Detection** - All components use OnPush strategy
- ✅ **TrackBy Functions** - Efficient list rendering with @for
- ✅ **Image Optimization** - WebP format with lazy loading
- ✅ **Code Splitting** - Lazy-loaded routes (future enhancement)
- ✅ **Tree Shaking** - Dead code elimination in production builds
- ✅ **Minification** - JavaScript and CSS minification
- ✅ **Compression** - Gzip compression on hosting

### Backend Optimizations

- ✅ **Backend Caching** - TTL-based cache with background refresh
- ✅ **API Request Batching** - GraphQL for efficient GitHub queries
- ✅ **Connection Pooling** - Reused HTTP connections
- ✅ **Parallel Processing** - Concurrent image processing for converter
- ✅ **Rate Limiting** - Quota system prevents API abuse

---

# 🔍 Monitoring & Observability

## Logging Strategy

### Frontend Logging

```typescript
// Console logging for development
if (!environment.production) {
  console.log('[Component]', 'Action performed', data);
}

// Error tracking (future: integrate Sentry)
window.addEventListener('error', (event) => {
  // Log to error tracking service
});
```

### Backend Logging

```typescript
// Backend logging
logger.info('Cache hit', { key, age });
functions.logger.warn('API rate limit approaching', { remaining });
functions.logger.error('External API failed', { error, endpoint });
```

## Key Metrics to Monitor

### Application Health

| Metric | Tool | Threshold |
|--------|------|-----------|
| **Uptime** | Hosting provider | > 99.9% |
| **Error Rate** | Backend Logs | < 0.1% |
| **Response Time** | Cache metrics | < 200ms |
| **API Quota** | Notion tracking | < 80% |

### User Experience

| Metric | Measurement | Target |
|--------|-------------|--------|
| **Load Time** | Lighthouse | < 3s |
| **Bounce Rate** | Analytics | < 40% |
| **Session Duration** | Analytics | > 2min |
| **Conversion Rate** | Converter usage | Track trend |

### Infrastructure

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| **Function Errors** | Cloud Functions | > 5% error rate |
| **Cache Reads** | Backend logs | > 10K/day |
| **Cache Writes** | Backend logs | > 1K/day |
| **Cache Hit Rate** | Logs analysis | < 90% |

---

# 🔮 Future Architecture Considerations

## Scalability Enhancements

### Phase 1: Short-term (1-3 months)
- [ ] **Redis/Memcached** - Sub-10ms cache responses
- [ ] **CDN Optimization** - Edge caching for API responses
- [ ] **Image CDN** - Cloudinary or imgix integration
- [ ] **Analytics Integration** - Google Analytics 4 or Plausible

### Phase 2: Mid-term (3-6 months)
- [ ] **GraphQL Gateway** - Unified API layer
- [ ] **Real-time Updates** - WebSocket for live data
- [ ] **Multi-region Deployment** - Global edge functions
- [ ] **Database Optimization** - Indexes and query optimization

### Phase 3: Long-term (6-12 months)
- [ ] **Microservices** - Separate converter service
- [ ] **Kubernetes** - Container orchestration
- [ ] **Event-driven Architecture** - Message queues
- [ ] **A/B Testing Framework** - Feature flag system

## Architecture Evolution

### Current: Monolithic Frontend + Serverless Backend
```
Angular SPA → Quarkus REST API (api.3dime.com) → External APIs
```

### Future: Micro-Frontend + Microservices
```
┌──────────────────────────────────────────┐
│  Shell App (Main Portfolio)             │
├──────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐         │
│  │ Converter  │  │ Analytics  │         │
│  │ Micro-App  │  │ Micro-App  │         │
│  └────────────┘  └────────────┘         │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  API Gateway (GraphQL Federation)        │
├──────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │Converter │  │Portfolio │  │ Stats  │ │
│  │ Service  │  │ Service  │  │Service │ │
│  └──────────┘  └──────────┘  └────────┘ │
└──────────────────────────────────────────┘
```

---

# 📚 Additional Resources

## Related Documentation

- **[Component Architecture](./COMPONENTS.md)** - Detailed component documentation
- **[Services Documentation](./SERVICES.md)** - Service APIs and usage
- **[Design System](./DESIGN_SYSTEM.md)** - Styling and theming guide
- **[API Reference](./API.md)** - Backend API endpoints
- **[Calendar Converter](./CONVERTER.md)** - AI conversion feature details
- **[PWA Guide](./PWA.md)** - Progressive Web App features
- **Caching Strategy (moved)** - See caching implementation details in the external `3dime-api` repository (CACHING.md)
- **Backend Architecture (moved)** - See the functions architecture details in the external `3dime-api` repository README

## External References

- [Angular Documentation](https://angular.dev/) - Official Angular guide
- [Quarkus Documentation](https://quarkus.io/guides/) - Backend framework docs
- [OpenAI API Reference](https://platform.openai.com/docs) - GPT-4 Vision API
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide


```
