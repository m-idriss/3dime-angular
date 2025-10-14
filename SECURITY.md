# Security Policy

## Supported Versions

This project is actively maintained with security updates for the following versions:

| Version    | Supported          |
| ---------- | ------------------ |
| 20.x.x     | :white_check_mark: |
| 19.x.x     | :white_check_mark: |
| < 19.0     | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Email the maintainer with details of the vulnerability
3. Include as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We will acknowledge your report within 2 business days and provide updates at least every 5 business days. After triage, we will inform you whether the vulnerability will be accepted and fixed, or declined (with reasons). If accepted, we will work with you on disclosure timing and credit.

## Security Best Practices

### Secrets and API Keys

**NEVER commit secrets, API keys, or credentials to the repository.**

#### Environment Configuration

This project uses `.env` files for environment configuration, which are auto-generated into TypeScript files:

**Configuration Files:**
- `.env.example` - Template with all available environment variables (committed to git)
- `.env` and `.env.local` - Your local configuration (gitignored, never committed)
- `src/environments/environment.ts` - Auto-generated from `.env` (tracked in git with defaults)
- `src/environments/environment.prod.ts` - Auto-generated from `.env` (tracked in git with defaults)

**Important:**
- `.env` and `.env.local` files are gitignored and will NOT be committed
- Environment TypeScript files are auto-generated - do not edit them manually
- Use `.env.example` as a template for your local `.env` file
- For production, set environment variables in your deployment platform

**Setup:**
1. Copy `.env.example` to `.env`
2. Configure your secrets in `.env`
3. Run `npm start` or `npm run build` - environment files are auto-generated

#### Firebase Configuration

Configure Firebase in your `.env` file:

```bash
NG_FIREBASE_API_KEY=your_api_key_here
NG_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NG_FIREBASE_PROJECT_ID=your-project-id
NG_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NG_FIREBASE_MESSAGING_SENDER_ID=123456789
NG_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**Security Best Practices:**
1. **For local development**: Configure `.env` file locally (gitignored)
2. **For production**: Set `NG_*` environment variables in your hosting platform
3. **Firebase API keys** can be restricted in the Firebase Console:
   - Go to Google Cloud Console → Credentials
   - Restrict the API key to specific domains
   - Enable only the APIs you need

**Note:** Firebase API keys for client-side apps are not secret but should be restricted to prevent abuse.

#### GitHub Secrets

For GitHub Actions and CI/CD:
- Store secrets in GitHub repository settings → Secrets and variables → Actions
- Never echo or log secrets in workflows
- Use minimal permissions for tokens

### Dependencies

- Keep dependencies up to date with `npm audit` and `npm update`
- Review security advisories regularly
- Use `npm audit fix` to automatically fix vulnerabilities when possible

### Code Security

- Avoid using `eval()` or similar dynamic code execution
- Sanitize user inputs
- Use TypeScript strict mode for type safety
- Follow Angular security best practices for XSS prevention

### Deployment Security

- Always use HTTPS in production
- Set appropriate CORS policies - Firebase Functions use an allowlist of trusted origins:
  - Production: `https://3dime.com`, `https://www.3dime.com`
  - Development: `http://localhost:4200`, `http://localhost:5000`
  - **Never use** `cors({ origin: true })` which allows all origins
- Use Content Security Policy (CSP) headers
- Enable security headers (X-Frame-Options, X-Content-Type-Options, etc.)

## Security Checklist for Contributors

Before submitting a pull request:

- [ ] No secrets or API keys in the code
- [ ] Dependencies are up to date
- [ ] No `npm audit` high/critical vulnerabilities
- [ ] Input validation for user data
- [ ] Proper error handling without leaking sensitive information
- [ ] HTTPS used for all external API calls
- [ ] CORS policies use allowlists instead of `origin: true`

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.io/guide/security)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

