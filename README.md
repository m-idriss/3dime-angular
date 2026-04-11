<div align="center">

<img src="public/assets/logo.png" alt="3dime" width="120" height="120" style="border-radius: 12px; margin-bottom: 20px;">

# 3dime-angular

</div>

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-3dime.com-00D4AA?style=for-the-badge)](https://3dime.com)
[![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-9C27B0?style=for-the-badge)](public/assets/manifest.json)

</div>

Modern personal portfolio built with Angular 20+ featuring a space-themed glassmorphism design. Showcases professional experience, tech stack, GitHub activity, and personal interests with PWA support.

## Quick Start

**Prerequisites:** Node.js 20+, npm 10+

```bash
npm install
npm start
# Open http://localhost:4200/
```

## Commands

```bash
npm start                                    # Dev server (http://localhost:4200)
npm test                                     # Unit tests
npm run build -- --configuration=production  # Production build
firebase deploy --only hosting               # Deploy to Firebase
```

## Project Structure

```
src/app/
├── components/    # UI components (profile, about, tech stack, etc.)
├── services/      # Data services (GitHub, Notion, theme)
├── models/        # TypeScript interfaces
└── app.ts         # Main application
```

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design and technical overview |
| [Installation](docs/INSTALLATION.md) | Detailed setup instructions |
| [Services](docs/SERVICES.md) | Service APIs and data management |
| [API Reference](docs/API.md) | Backend API endpoints |
| [Deployment](docs/DEPLOYMENT.md) | Production deploy and CI/CD |
| [Testing](docs/TESTING.md) | Unit tests, API tests, CI |
| [Roadmap](docs/ROADMAP.md) | Planned features and timeline |
| [Full Index](docs/README.md) | All documentation |

## 📸 Screenshots

<div align="center">

### 💼 Portfolio Homepage

![3dime-angular Desktop Screenshot](public/assets/screenshots/desktopPage1920x1080.jpeg)
*Modern portfolio showcasing experience, skills, and projects*

### 📱 Mobile Experience

<img src="public/assets/screenshots/iPhone_13_Pro_Max.jpeg" alt="3dime-angular Mobile Screenshot" width="375" />

*Fully responsive design optimized for all devices*

> 📝 **Note**: Screenshots are automatically updated daily via GitHub Actions.

</div>

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Idriss** — [3dime.com](https://3dime.com) | [@m-idriss](https://github.com/m-idriss)
