# 3dime-angular Portfolio - Copilot Instructions

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information here is incomplete or found to be in error.**

## Project Overview

This is an Angular 20+ personal portfolio website showcasing professional experience, technical skills, and personal interests with a beautiful space-themed design. The application displays sections for profile, about, tech stack, experience, education, stuff recommendations, hobbies, and contact information.

**Project Goals:**
- Showcase professional portfolio with modern, engaging design
- Maintain high performance and accessibility standards
- Use latest Angular features (standalone components, signals)
- Serve as a reference implementation for Angular best practices

## Table of Contents
- [Quick Start](#working-effectively)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Common Development Tasks](#common-development-tasks)
- [Testing & Validation](#testing-changes)
- [Important Guidelines](#important-guidelines)

## Working Effectively

### Prerequisites and Setup
- Install Node.js 20+ (Functions require Node 22 but work with 20)
- Chrome/Chromium browser for testing
- **NEVER CANCEL any build or test commands** - builds take 8+ seconds, tests take 12+ seconds

### Bootstrap the Repository
```bash
# Install all dependencies - takes ~30 seconds, NEVER CANCEL
npm install

# Install Firebase Functions dependencies (if using Firebase features)
cd functions && npm install
cd ..
```

### Build Process
```bash
# Development build - takes ~8 seconds, NEVER CANCEL. Set timeout to 30+ seconds.
npm run build

# Production build - takes ~8.5 seconds, NEVER CANCEL. Set timeout to 30+ seconds.
npm run build -- --configuration=production

# Build Firebase Functions - takes ~6 seconds, NEVER CANCEL. Set timeout to 20+ seconds.
cd functions && npm run build
```

**Expected Build Warnings (NORMAL):**
- No warnings expected - budgets have been adjusted to match optimized production build
- CommonJS dependencies may cause optimization warnings - non-breaking

### Development Server
```bash
# Start development server - takes ~4 seconds to start, runs on localhost:4200
npm start
# OR
ng serve
```
The application will be available at `http://localhost:4200/` with hot reload enabled.

### Testing
```bash
# Run tests with headless Chrome - takes ~12 seconds, NEVER CANCEL. Set timeout to 30+ seconds.
CHROME_BIN=/usr/bin/google-chrome-stable npx ng test --browsers=ChromeHeadless --watch=false

# Run tests in watch mode (interactive development)
npm test
```

**Expected Test Behavior:**
- All tests currently fail due to missing HttpClient providers (normal for current test setup)
- Tests build successfully and execute in headless Chrome
- 11 total tests with all failures related to dependency injection setup (HttpClient not provided)

### Validation Steps
Always run these steps after making changes:

1. **Build Validation:**
   ```bash
   npm run build
   ```
   - Should complete in ~8 seconds with warnings (normal)
   - Check `dist/3dime-angular/` directory is created

2. **Application Functionality:**
   ```bash
   npm start
   ```
   - Navigate to `http://localhost:4200/`
   - Verify clean UI with portfolio sections displayed
   - Check profile card with social links
   - Verify all sections render correctly (Profile, About, Tech Stack, GitHub Activity, Experience, Education, Stuff, Hobbies, Contact)

3. **Test Validation:**
   ```bash
   CHROME_BIN=/usr/bin/google-chrome-stable npx ng test --browsers=ChromeHeadless --watch=false
   ```
   - Currently shows "11 FAILED" due to missing HttpClient providers (expected pattern)

### Code Formatting
```bash
# Format code using Prettier (configured in package.json)
npx prettier --write src/
```

## Project Structure

### Key Directories
```
src/
├── app/
│   ├── components/
│   │   ├── profile-card/      # Personal profile and social links
│   │   ├── about/             # About me section
│   │   ├── tech-stack/        # Technologies and skills
│   │   ├── github-activity/   # GitHub contribution activity
│   │   ├── experience/        # Work experience and projects
│   │   ├── education/         # Education and training
│   │   ├── stuff/             # Recommended products and tools
│   │   ├── hobbies/           # Personal interests
│   │   └── contact/           # Contact information
│   ├── services/
│   │   ├── profile.service.ts # GitHub profile and activity data
│   │   ├── notion.service.ts  # Notion API integration
│   │   └── theme.service.ts   # Theme management service
│   ├── app.ts                 # Main standalone app component
│   └── app.config.ts          # Application configuration
├── environments/              # Environment-specific configs (unused)
└── styles.scss               # Global SCSS styles with space theme
```

### Key Files to Know
- `package.json` - Main dependencies and npm scripts
- `angular.json` - Angular project configuration
- `ROADMAP.md` - Comprehensive project roadmap and planning
- `src/styles.scss` - Main styling with CSS custom properties

## Technology Stack

### Frontend
- **Angular 20.2.2** with standalone components
- **TypeScript 5.9+** for type safety
- **SCSS** for styling with modern CSS features and custom properties
- **RxJS** for reactive programming
- **Glassmorphism** UI design with space theme

### Styling & Design
- **CSS Custom Properties** for theming
- **Modern CSS** with grid, flexbox, and backdrop-filter
- **Responsive Design** with mobile-first approach
- **Space-themed UI** with particle effects and gradient backgrounds
- **Accessibility** features and semantic HTML

### Development Tools
- **Angular CLI** for project management and builds
- **Jasmine + Karma** for unit testing
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety

## Configuration

### Development Setup
The application works out-of-the-box with no additional configuration needed.

Environment variables are currently unused but can be added to `src/environments/` for future features.

## Common Development Tasks

### Adding New Components
```bash
# Generate new component with SCSS styling
ng generate component components/my-component --style=scss
```

### Working with Services
Current services:
- `ProfileService` - Fetch GitHub profile data and commit activity
- `NotionService` - Integrate with Notion API for stuff/recommendations
- `ThemeService` - Manage theme switching and preferences

### Content Updates
Most content is currently hardcoded in component templates. Future improvements will include:
- JSON-based content management
- Dynamic data loading
- CMS integration options

### Testing Changes
1. **Always start with a clean build:**
   ```bash
   npm run build
   ```

2. **Test in development:**
   ```bash
   npm start
   ```

3. **Validate with tests:**
   ```bash
   CHROME_BIN=/usr/bin/google-chrome-stable npx ng test --browsers=ChromeHeadless --watch=false
   ```

4. **Check production build:**
   ```bash
   npm run build -- --configuration=production
   ```

### Portfolio Content Flow
The application displays:
1. **Profile section** with photo, name, and social links
2. **About section** with personal description
3. **Tech Stack** showing technologies and skills
5. **Experience & Projects** listing work history
6. **Education & Training** showing academic background
7. **Stuff** section with recommended products/tools
8. **Hobbies & Interests** displaying personal interests
9. **Contact** information and links

### Known Limitations
- Content is currently hardcoded in component templates
- Some external CDN resources may be blocked in restricted environments
- Tests require HttpClient provider setup (currently all tests fail with NG0201 errors)

## Important Guidelines

### What TO DO ✅
- **Always run builds and tests** before committing changes
- **Use adequate timeouts** for long-running commands (30+ seconds for builds, tests)
- **Follow existing patterns** in the codebase for consistency
- **Test responsive design** on different screen sizes
- **Verify glassmorphism effects** work in supported browsers
- **Check accessibility** with semantic HTML and ARIA labels
- **Use TypeScript strict mode** for type safety
- **Follow Angular style guide** for component and service structure
- **Use standalone components** (Angular 20+ pattern)

### What NOT TO DO ❌
- **Never cancel build/test commands** - they need time to complete
- **Don't remove working tests** - all current test failures are expected (HttpClient setup)
- **Don't add dependencies** without checking bundle size impact
- **Don't modify environment files** with real secrets (use .example files)
- **Don't change global styles** without considering all components
- **Don't break responsive design** - test on mobile and desktop
- **Don't ignore accessibility** - maintain WCAG AA compliance
- **Don't use class-based components** - use standalone functional components
- **Don't skip code formatting** - use Prettier before committing
- **Don't push to main directly** - use feature branches

### When to Ask for Help 🤔
Ask the user for guidance when:
- **Security concerns** - handling API keys, authentication, or sensitive data
- **Architecture decisions** - major refactoring or new patterns
- **External dependencies** - adding new npm packages
- **Breaking changes** - modifications that affect existing functionality
- **Unclear requirements** - ambiguous feature requests
- **Performance issues** - bundle size grows significantly
- **Test failures** - unexpected test failures (beyond HttpClient issues)

## Debugging Tips

### Build Issues
- Check `angular.json` syntax if build fails
- Verify all dependencies installed with `npm install`
- Clear `dist/` directory and rebuild if needed

### Styling Issues  
- Check CSS custom properties are properly defined in `styles.scss`
- Verify glassmorphism effects work in supported browsers
- Test responsive breakpoints on different screen sizes

### Runtime Issues
- Check browser console for any JavaScript errors
- Test space-themed animations and transitions

## Deployment

### Static Site Hosting
The `dist/3dime-angular/` directory contains static files ready for deployment to:
- **GitHub Pages** (recommended for portfolio sites)
- **Netlify** with automatic builds
- **Vercel** with optimized performance
- **Any static hosting service**

### Manual Deployment
```bash
# Build for production
npm run build -- --configuration=production

# The dist/ folder contains deployable files
```
