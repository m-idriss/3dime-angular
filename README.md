# 3dime-angular

> **Personal Portfolio Website for Idriss** - A modern Angular 20+ application showcasing professional experience, technical skills, and personal interests with a beautiful space-themed design.

A personal portfolio application built with Angular 20+ featuring real-time GitHub activity visualization.

## Features

- 📊 **GitHub Activity Heatmap**: Displays real commit activity from your repositories
- 🎨 **Modern UI**: Clean, responsive design with multiple theme options
- 🔧 **Backend Integration**: PHP proxy for GitHub API calls with authentication support
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ⚡ **Fast Loading**: Optimized build with proper error handling and fallbacks

## 📋 Project Roadmap

For a comprehensive overview of planned features, improvements, and development timeline, see [ROADMAP.md](./ROADMAP.md).

## Development server

To start a local development server, run:

```bash
npm install
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## GitHub Heatmap Configuration

The application includes a GitHub activity heatmap that fetches real commit data from your repositories.

### Basic Setup (Sample Data)

The application works out of the box with sample data when GitHub API is not configured.

### Production Setup (Real Data)

For real GitHub data, configure your GitHub credentials:

1. Copy the example configuration file:
   ```bash
   cp config.php.example config.php
   ```

2. Get a GitHub Personal Access Token:
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Generate a new token with `public_repo` scope
   - Copy the token

3. Configure your credentials in `config.php`:
   ```php
   define('GITHUB_TOKEN', 'your-token-here');
   define('GITHUB_USERNAME', 'your-username');
   define('GITHUB_REPO', 'your-main-repo');
   ```

4. Or set environment variables:
   ```bash
   export GITHUB_TOKEN=your-token-here
   ```

### Customizing Repositories

Edit `services/github.php` to include your repositories in the heatmap:

```php
$repos = [
    ['name' => 'your-repo-1'],
    ['name' => 'your-repo-2'],
    ['name' => 'your-repo-3']
];
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory, including the PHP backend files. The production build is ready to deploy to any web server with PHP support.

## Deployment

The built application (`dist/3dime-angular/browser/`) contains:
- Static Angular files
- PHP proxy endpoints (`proxy.php`, `services/github.php`)
- Configuration files

Deploy to any web server with PHP 7.4+ support. The heatmap will automatically fall back to sample data if GitHub API is not configured.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

## Architecture

### Frontend (Angular)
- **Components**: Modular components for profile, experience, projects, etc.
- **Services**: GitHub integration and data management
- **Styling**: SCSS with CSS custom properties for theming

### Backend (PHP)
- **proxy.php**: Main API endpoint handling GitHub requests
- **services/github.php**: GitHub API integration with retry logic and rate limiting
- **Fallback system**: Sample data when API is unavailable

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
