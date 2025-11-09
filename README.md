<div align="center">

# 🌟 3dime-angular

<img src="public/assets/logo.png" alt="3dime Logo" width="120" height="120"/>

### ✨ Modern Personal Portfolio Website ✨

*A sophisticated Angular 20+ application showcasing professional experience, technical skills, and personal interests with a beautiful space-themed design*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-3dime.com-00D4AA?style=for-the-badge)](https://3dime.com)
[![Angular](https://img.shields.io/badge/Angular-20.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-9C27B0?style=for-the-badge)](public/assets/manifest.json)

---

</div>

## 🎯 Overview

3dime-angular is a modern, high-performance personal portfolio application built with Angular 20+ and designed to showcase your professional journey in an elegant, engaging way. Featuring a stunning space-themed design with glassmorphism effects, this application creates a memorable digital presence that stands out.

**Architecture**: Modern Angular standalone components with TypeScript strict mode, SCSS styling with CSS custom properties, and Progressive Web App capabilities.

Perfect for developers, designers, and professionals who want a fast, beautiful, and maintainable portfolio website that showcases their work with style.

## ✨ Features

### 🎨 **Modern Design**
- **Glassmorphism UI** - Stunning frosted glass effects with space-themed aesthetics
- **Responsive Layout** - Flawless experience across all devices and screen sizes
- **Dark Theme** - Professional dark aesthetic with particle effects and gradient backgrounds
- **Smooth Animations** - Subtle micro-interactions and fluid transitions

### ⚡ **Performance & Technology**
- **Angular 20+** - Latest Angular with standalone components and modern features
- **TypeScript 5.9+** - Type-safe development with strict mode
- **Progressive Web App (PWA)** - Installable, works offline, app-like experience
- **Optimized Build** - Production-ready with tree-shaking and lazy loading
- **Fast Loading** - Optimized assets and efficient resource loading
- **RxJS** - Reactive programming for smooth data streams

### 🔗 **Portfolio Sections**
- **Profile Card** - Personal branding with photo and social links
- **About** - Professional introduction and summary
- **Tech Stack** - Showcase of skills and technologies
- **GitHub Activity** - Live GitHub contribution visualization
- **Experience** - Work history and project highlights
- **Education** - Academic background and certifications
- **Calendar Converter** - AI-powered image/PDF to ICS calendar conversion with Firebase Authentication
- **Stuff** - Recommended tools and products (Notion integration)
- **Hobbies** - Personal interests and activities
- **Contact** - Professional contact information

### 🛡️ **Modern Web Standards**
- **Standalone Components** - Modular, tree-shakeable architecture
- **Semantic HTML5** - Accessible markup with proper ARIA labels
- **CSS Custom Properties** - Maintainable theming system
- **Mobile-First Design** - Optimized for mobile devices first
- **SEO Optimized** - Proper meta tags and structured content

## 🛠️ Technology Stack

<table>
<tr>
<td align="center">

**Frontend Core**
- Angular 20.2+
- TypeScript 5.9+
- RxJS 7.8+
- Zone.js 0.15+
- Standalone Components

</td>
<td align="center">

**Styling & Design**
- SCSS with CSS Variables
- Glassmorphism Effects
- Space-Themed Design
- Responsive Grid/Flexbox
- Mobile-First Approach

</td>
<td align="center">

**PWA Features**
- Service Worker
- Web App Manifest
- Offline Support
- App Icons
- Install Prompts

</td>
</tr>
<tr>
<td align="center">

**Build & Tools**
- Angular CLI 20.2+
- esbuild Bundler
- TypeScript Compiler
- Karma + Jasmine Testing
- Prettier Formatting

</td>
<td align="center">

**Integrations**
- Notion API
- GitHub API
- Cal-heatmap
- Font Awesome Icons
- Google Fonts

</td>
<td align="center">

**Deployment**
- Firebase Hosting
- GitHub Actions CI/CD
- FTP Deployment
- Static Hosting Ready
- Environment Configs

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20+ (Functions require Node 22 but work with 20)
- **npm**: 10+
- **Chrome/Chromium**: For testing (optional)
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/m-idriss/3dime-angular.git
cd 3dime-angular

# Install dependencies (takes ~30 seconds)
npm install

# Optional: Install Firebase Functions dependencies
cd functions && npm install && cd ..

# Verify installation with a build
npm run build
```

### Development Server

Start a local development server:

```bash
# Start dev server (runs on http://localhost:4200/)
npm start

# OR using Angular CLI directly
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building for Production

Build the project for production deployment:

```bash
# Production build
npm run build -- --configuration=production

# Output location: dist/3dime-angular/
```

The build process takes ~8-10 seconds and generates optimized, production-ready static files.

## ⚙️ Configuration

### Content Customization

Update your personal information in the component files:

1. **Profile Card**: `src/app/components/profile-card/`
2. **About Section**: `src/app/components/about/`
3. **Tech Stack**: `src/app/components/tech-stack/`
4. **Experience**: `src/app/components/experience/`
5. **Education**: `src/app/components/education/`
6. **Contact**: `src/app/components/contact/`

### Styling Customization

Customize the theme in `src/styles.scss` using CSS custom properties:

```scss
:root {
  --primary-color: #00d4aa;
  --accent-color: #3b82f6;
  --background: #000000;
  --glass-bg: rgba(255, 255, 255, 0.1);
}
```

### PWA Configuration

The application includes full Progressive Web App (PWA) support with service workers for offline functionality and installability on mobile devices.

**PWA Features:**
- 🔄 **Service Worker** - Automatic caching and offline support
- 📱 **Installable** - Add to home screen on mobile and desktop
- 📤 **Share Target** - Share images/PDFs from other apps directly to the converter
- ⚡ **App Shortcuts** - Quick access to Calendar Converter from app icon
- 🔔 **Update Notifications** - Automatic detection of new app versions

**Configuration Files:**
- `ngsw-config.json` - Service worker caching strategy and configuration
- `public/assets/manifest.json` - App manifest with icons, shortcuts, and share target
- `angular.json` - Build configuration with service worker enabled for production

**Installing the PWA on Mobile:**

1. **iOS (Safari):**
   - Open the website in Safari
   - Tap the Share button (square with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Customize the name if desired
   - Tap "Add" to install

2. **Android (Chrome):**
   - Open the website in Chrome
   - Tap the menu (⋮) in the top right
   - Tap "Install app" or "Add to Home Screen"
   - Confirm the installation
   - The app icon will appear on your home screen

3. **Desktop (Chrome/Edge):**
   - Open the website
   - Click the install icon (⊕) in the address bar
   - Or go to Settings → Install [app name]
   - The app will launch in its own window

**Using PWA Features:**

- **Share Images to Convert:** After installing, you can share images or PDFs from other apps directly to 3dime for calendar conversion
- **Quick Access Shortcut:** Long-press the app icon to access the Calendar Converter directly
- **Offline Access:** The app will work offline for previously cached content
- **Automatic Updates:** When a new version is available, you'll be prompted to reload

**Testing PWA Locally:**

```bash
# Build for production (enables service worker)
npm run build -- --configuration=production

# Serve the production build
npx http-server dist/3dime-angular/browser -p 8080

# Open http://localhost:8080 and test PWA features
```

### API Integration

For Notion integration (Stuff section):
1. Set up Notion API credentials
2. Configure Firebase Functions in `functions/src/`
3. Deploy Firebase Functions for API endpoints

### Firebase Authentication Setup

The Calendar Converter feature requires Firebase Authentication with Google provider. See [Firebase Authentication Setup Guide](docs/FIREBASE_AUTH_SETUP.md) for detailed instructions.

**Quick Setup:**
1. Create/configure Firebase project in [Firebase Console](https://console.firebase.google.com)
2. Enable Google authentication provider
3. Add your Firebase config to `src/environments/environment.ts` and `environment.prod.ts`
4. Configure authorized domains (localhost, your production domain)

See the [complete setup guide](docs/FIREBASE_AUTH_SETUP.md) for step-by-step instructions.

## 🔒 Security

### Environment Configuration

The application uses environment files for configuration:
- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

**Important Security Notes:**

⚠️ **Never commit secrets, API keys, or credentials to the repository!**

#### Best Practices

1. **For Development:**
   - Use example files as templates (`environment.example.ts`)
   - Configure actual environment files locally
   - Keep sensitive data in environment variables or secure storage

2. **For Production:**
   - Use platform-specific environment configuration (Netlify, Vercel, etc.)
   - Use Firebase Hosting environment configuration for Firebase deployments
   - Restrict API keys to specific domains in service provider consoles

3. **API Key Security:**
   - Firebase API keys can be restricted in Google Cloud Console
   - Enable only the APIs you need
   - Set domain restrictions to prevent unauthorized use

#### Secret Management

For Firebase Functions and backend services:
```bash
# Set secrets using Firebase CLI (never commit these)
firebase functions:secrets:set GITHUB_TOKEN
firebase functions:secrets:set NOTION_TOKEN
firebase functions:secrets:set NOTION_DATASOURCE_ID
```

#### GitHub Actions Secrets

Store CI/CD secrets in GitHub repository settings:
- Go to Settings → Secrets and variables → Actions
- Add repository secrets (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, etc.)
- Never log or echo secrets in workflows

For detailed security guidelines, see [SECURITY.md](./SECURITY.md).

## 🌐 Deployment

### Deployment Options

3dime-angular supports multiple deployment options to fit different hosting environments:

#### Static Hosting (Recommended)
- **Platforms**: Netlify, Vercel, GitHub Pages, Firebase Hosting, AWS S3, Azure Static Web Apps
- **Process**: Build and upload the `dist/3dime-angular/browser/` directory
- **Requirements**: Static file hosting, no server-side processing needed
- **Benefits**: Fast, scalable, cost-effective

#### Traditional Hosting
- **Platforms**: Any web server (Nginx, Apache, IIS)
- **Process**: Deploy built files and configure routing
- **Requirements**: Web server with URL rewriting for SPA routing

### Automatic Deployment (GitHub Actions)

The project includes automated deployment via GitHub Actions:

1. **Configure Secrets**: Add your deployment credentials to GitHub repository secrets:
   ```
   FTP_SERVER     → your-server.com
   FTP_USERNAME   → your-username
   FTP_PASSWORD   → your-password
   FTP_PATH       → /public_html/ (or your web root)
   ```

2. **Push to main**: Deployment triggers automatically on push to `main` branch when relevant files change:
   - Source code (`src/**`, `public/**`)
   - Dependencies (`package.json`, `package-lock.json`)
   - Build configuration (`angular.json`, `tsconfig*.json`)
   - Firebase Functions (`functions/**`)
   - Deployment workflow (`.github/workflows/deploy.yml`)
   - Firebase configuration (`firebase.json`, `.firebaserc`)
   
   **Note**: Documentation changes, screenshots, and other non-deployment files won't trigger deployment.

3. **Workflow**: The GitHub Action will:
   - Install dependencies
   - Build production version
   - Deploy via FTP to your server

### Creating Releases

The project includes an automated release workflow that creates tags and GitHub releases without needing the CLI:

**Via GitHub Actions (Recommended)**:

1. Navigate to **Actions** → **🏷️ Create Tag and Release** in your GitHub repository
2. Click **Run workflow** and configure:
   - **Version bump type**: Choose `patch` (0.0.x), `minor` (0.x.0), `major` (x.0.0), or `custom`
   - **Custom version**: If you selected "custom", enter version like `1.2.3`
   - **Pre-release**: Check if this is a pre-release (beta, alpha, etc.)
   - **Include build artifacts**: Check to attach compiled build files to the release
3. Click **Run workflow** to create the release

**What the workflow does**:
- ✅ Auto-detects current version from `package.json` or git tags
- ✅ Calculates and validates new version number
- ✅ Updates `package.json` with new version
- ✅ Creates annotated git tag (e.g., `v1.2.3`)
- ✅ Generates changelog with commit categorization
- ✅ Creates GitHub release with release notes
- ✅ Optionally builds and attaches artifacts
- ✅ Pushes changes to main branch

**Version Bump Examples**:
- `patch`: 1.0.0 → 1.0.1 (bug fixes, small changes)
- `minor`: 1.0.0 → 1.1.0 (new features, backwards compatible)
- `major`: 1.0.0 → 2.0.0 (breaking changes)
- `custom`: Specify any version like 2.5.0

📚 **For detailed instructions, examples, and troubleshooting, see [RELEASE_GUIDE.md](RELEASE_GUIDE.md)**

### Manual Deployment

#### Static Hosts (Netlify, Vercel)

```bash
# Build for production
npm run build -- --configuration=production

# Deploy the dist/3dime-angular/browser/ directory
# Follow your hosting provider's deployment instructions
```

#### Firebase Hosting

```bash
# Build for production
npm run build -- --configuration=production

# Deploy to Firebase
firebase deploy --only hosting
```

#### Traditional Web Server

```bash
# Build for production
npm run build -- --configuration=production --base-href=/

# Upload dist/3dime-angular/browser/ contents to your web server
# Configure URL rewriting to support Angular routing
```

### Server Configuration for SPA Routing

For Angular's client-side routing to work correctly, configure your server to redirect all requests to `index.html`:

**Nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache** (`.htaccess`):
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

## 📚 Documentation

Comprehensive documentation is available to help you understand and work with the project:

### Getting Started
- **[README.md](./README.md)** (this file) - Project overview and quick start
- **[Development Guidelines](./docs/DEVELOPMENT.md)** - Setup, workflow, and best practices
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project

### Technical Documentation
- **[Component Documentation](./docs/COMPONENTS.md)** - Component architecture and usage
- **[Services Documentation](./docs/SERVICES.md)** - Service APIs and data management
- **[Design System](./docs/DESIGN_SYSTEM.md)** - Design principles, colors, and styling
- **[API Documentation](./docs/API.md)** - Firebase Functions and API endpoints
- **[PWA Documentation](./docs/PWA.md)** - Progressive Web App features and setup
- **[Calendar Converter](./docs/CONVERTER.md)** - AI-powered calendar conversion feature
- **[Firebase Functions](./functions/README.md)** - Backend functions and deployment
- **[Bruno API Collection](./bruno-collections/3dime-api/README.md)** - API testing with Bruno

### Planning & Roadmap
- **[Project Roadmap](./ROADMAP.md)** - Planned features and development timeline
- **[Security Policy](./SECURITY.md)** - Security guidelines and vulnerability reporting

For a complete documentation overview, see [docs/README.md](./docs/README.md).

## 🧪 Testing

### Unit Tests

Run unit tests with Karma and Jasmine:

```bash
# Run tests once (headless Chrome)
CHROME_BIN=/usr/bin/google-chrome-stable npx ng test --browsers=ChromeHeadless --watch=false

# Run tests in watch mode (for development)
npm test
```

**Expected Behavior**:
- Tests build successfully in ~12 seconds
- Some tests may show expected failures related to HttpClient setup (this is normal for current test configuration)

### API Testing with Bruno

This repository includes a Bruno API collection for testing API endpoints:

```bash
# Install Bruno desktop app from https://www.usebruno.com/downloads
# Or install Bruno CLI
npm install -g @usebruno/cli

# Run all API tests
bru run bruno-collections/3dime-api

# Run specific test
bru run bruno-collections/3dime-api --filename "GitHub User Profile.bru"
```

**Available Tests**:
- GitHub User Profile API - Verifies API response and login field
- More tests coming soon for Firebase Functions

See [Bruno Collection Documentation](./bruno-collections/3dime-api/README.md) for detailed information.

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools:

```bash
# Generate a new component
ng generate component components/component-name --style=scss

# Generate a new service
ng generate service services/service-name

# Generate other schematics
ng generate --help
```

## 📸 Screenshots

<div align="center">

### 🖥️ Portfolio Sections

![3dime-angular Desktop Screenshot](public/assets/screenshots/desktopPage1920x1080.jpeg)

*Space-themed design showcasing glassmorphism effects and responsive layout*

### 📱 Mobile Experience

<img src="public/assets/screenshots/iPhone_13_Pro_Max.jpeg" alt="3dime-angular Mobile Screenshot" width="375" />

*Responsive design optimized for mobile devices*

> 📝 **Note**: Screenshots are automatically updated daily via GitHub Actions. See `.github/workflows/update-screenshot.yml` for details.

</div>

## 🎯 Use Cases

- **Software Developers** - Showcase your GitHub projects, technical skills, and work experience
- **Web Developers** - Demonstrate your frontend skills with a modern, performant portfolio
- **Designers** - Present your design philosophy and aesthetic sense
- **Tech Professionals** - Create a comprehensive digital resume and professional presence
- **Students** - Display your learning journey, projects, and academic achievements
- **Freelancers** - Professional landing page for client discovery and credibility



## 🏗️ Architecture

### Frontend Architecture

3dime-angular follows modern Angular best practices with a component-based architecture:

```
src/app/
├── components/
│   ├── profile-card/      # Personal branding and social links
│   ├── about/             # Professional introduction
│   ├── tech-stack/        # Skills and technologies showcase
│   ├── github-activity/   # GitHub contribution visualization
│   ├── experience/        # Work history and projects
│   ├── education/         # Academic background
│   ├── stuff/             # Tool recommendations (Notion API)
│   ├── hobbies/           # Personal interests
│   └── contact/           # Contact information
├── services/
│   ├── theme.service.ts   # Theme management
│   ├── github.service.ts # GitHub profile data
│   └── notion.service.ts  # Notion API integration
├── app.ts                 # Main standalone app component
└── app.config.ts          # Application configuration
```

### Key Technologies

- **Angular 20+**: Standalone components with modern Angular features
- **TypeScript 5.9+**: Strict mode for enhanced type safety and code quality
- **RxJS 7.8+**: Reactive programming for data streams and async operations
- **SCSS**: Advanced styling with CSS custom properties and mixins
- **Glassmorphism**: Modern UI design with frosted glass effects and backdrop filters

### Design Philosophy

- **Standalone Components**: Tree-shakeable, modular architecture for optimal bundle size
- **Type Safety**: TypeScript strict mode ensures reliability and maintainability
- **Reactive Programming**: RxJS for handling async data and user interactions
- **CSS Custom Properties**: Maintainable theming system with runtime flexibility
- **Mobile-First**: Responsive design built from the ground up for mobile devices

For detailed component documentation, see [docs/COMPONENTS.md](./docs/COMPONENTS.md).

## 🔧 Advanced Topics

### Performance Optimization

The application is optimized for performance:

- **Bundle Size**: Production build ~1.23MB raw (316KB transferred) with tree-shaking
- **Code Splitting**: Lazy loading for optimal initial load time
- **Asset Optimization**: Compressed images and efficient resource loading
- **Build Configuration**: Production builds include minification and optimization

### Custom Styling

Customize the space theme by modifying CSS custom properties in `src/styles.scss`:

```scss
:root {
  /* Colors */
  --primary-color: #00d4aa;
  --accent-color: #3b82f6;
  --background: #000000;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
}
```

### Progressive Web App (PWA)

The application includes **full PWA support** with Angular Service Worker:

**Core Features:**
- ✅ **Service Worker** - Automatic caching with `ngsw-config.json` configuration
- ✅ **Offline Support** - App works offline for cached content
- ✅ **Installable** - Add to home screen on iOS, Android, and desktop
- ✅ **Share Target** - Share images/PDFs from other apps to the converter
- ✅ **App Shortcuts** - Quick access to Calendar Converter from app icon
- ✅ **Update Notifications** - Automatic prompts when new versions are available
- ✅ **Optimized Icons** - 192x192 and 512x512 maskable icons for all platforms

**Configuration:**
- `ngsw-config.json` - Service worker caching strategy and asset groups
- `public/assets/manifest.json` - PWA manifest with shortcuts and share target
- `src/app/app.ts` - PWA install prompt handler and update checker
- `angular.json` - Production build configuration with service worker enabled

**Installation:**
See the [PWA Configuration](#pwa-configuration) section for detailed installation instructions for iOS, Android, and desktop.

**Technical Implementation:**
- Uses `@angular/service-worker` package
- Service worker only active in production builds (`isDevMode()` check)
- Registers with `registerWhenStable:30000` strategy for optimal performance
- Includes update checker that prompts users for new versions

### API Integration

For dynamic content and external integrations:

1. **GitHub API**: Fetch user profile and contribution data
2. **Notion API**: Load recommended tools and products
3. **Firebase Functions**: Backend API endpoints for data processing

See [docs/API.md](./docs/API.md) for detailed API documentation.

## 📊 Performance Metrics

- ⚡ **Build Time**: ~8-10 seconds for production build
- 📦 **Bundle Size**: 1.23MB raw / 316KB transferred (optimized and minified)
- 🚀 **Load Time**: < 3 seconds on 3G networks
- 📱 **Mobile Optimized**: Responsive design with mobile-first approach
- ♿ **Accessible**: Semantic HTML with ARIA labels
- 🔍 **SEO Ready**: Proper meta tags and structured content

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m '✨ Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please read our [Contributing Guidelines](./CONTRIBUTING.md) for detailed information on:
- Code of conduct
- Development workflow
- Code style guidelines
- Testing requirements
- Pull request process

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Idriss Mohamady** - Portfolio Developer

- 🌐 Website: [3dime.com](https://3dime.com)
- 💼 LinkedIn: [linkedin.com/in/i-mohamady](https://www.linkedin.com/in/i-mohamady/)
- 🐙 GitHub: [github.com/m-idriss](https://github.com/m-idriss)

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Font Awesome for icons
- Notion for the API integration
- The open-source community for inspiration

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

<div align="center">

**Made with ❤️ using Angular 20+ and TypeScript**

*Modern architecture • Space-themed design • Progressive Web App*

[![Star this repo](https://img.shields.io/github/stars/m-idriss/3dime-angular?style=social)](https://github.com/m-idriss/3dime-angular)
[![Follow @m-idriss](https://img.shields.io/github/followers/m-idriss?label=Follow&style=social)](https://github.com/m-idriss)

</div>

