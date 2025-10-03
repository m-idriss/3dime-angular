# Security Alert Resolution Guide

## Issue: Exposed Firebase API Key

GitHub's secret scanning detected a Firebase API key exposed in the repository at:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

This guide provides steps to resolve this security alert.

---

## ✅ Resolution Steps (Already Applied)

This repository has already been secured with the following changes:

### 1. Removed Exposed Secrets ✓

The Firebase configuration containing the API key has been removed from:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

**Why this is safe:**
- The Firebase SDK is not installed in this application
- The Firebase configuration was never used
- Only the `apiUrl` property is actually needed

### 2. Created Example Files ✓

Example environment files have been created as templates:
- `src/environments/environment.example.ts`
- `src/environments/environment.prod.example.ts`

These serve as documentation for the expected structure.

### 3. Updated .gitignore ✓

Added security notes to `.gitignore` to prevent future accidental commits of sensitive data.

### 4. Enhanced Documentation ✓

- Updated `SECURITY.md` with comprehensive security guidelines
- Added security section to `README.md`
- Documented secret management best practices

---

## 🔐 What You Need to Do

### For Repository Maintainers

#### 1. Rotate the Exposed API Key

Since the Firebase API key was exposed publicly, you should rotate it:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `image-to-ics`
3. Navigate to **APIs & Services → Credentials**
4. Find the API key: `AIzaSyDvQ4aCcWtSxGmTXefINTcsdb0O5zheYzE`
5. Either:
   - **Delete it** (if not used anywhere)
   - **Restrict it** (if needed for future use):
     - Add application restrictions (HTTP referrers for websites)
     - Limit to specific APIs only
     - Set rate limits

#### 2. Dismiss GitHub Security Alert

Once the key is rotated or restricted:

1. Go to your repository: https://github.com/m-idriss/3dime-angular
2. Navigate to **Security → Secret scanning**
3. Find alert #1
4. Click **Dismiss alert**
5. Select reason: "Revoked" or "Used in tests" (if restricted)

#### 3. Review Other Secrets

Check if there are other secrets in:
- GitHub Actions workflows (`.github/workflows/`)
- Firebase Functions (`functions/src/`)
- CI/CD configurations

Ensure all secrets are stored in:
- GitHub Secrets (for Actions)
- Firebase Secret Manager (for Functions)
- Environment variables (for deployments)

---

## 🛡️ Future Prevention

### Before Committing Code

Always check for secrets before committing:

```bash
# Search for common secret patterns
git diff --staged | grep -E "api[_-]?key|secret|token|password" -i

# Or use git-secrets tool
git secrets --scan
```

### Use Pre-commit Hooks

Install a pre-commit hook to prevent secret commits:

1. Install git-secrets:
```bash
# macOS
brew install git-secrets

# Linux
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets && sudo make install
```

2. Configure for your repository:
```bash
cd /path/to/3dime-angular
git secrets --install
git secrets --register-aws
git secrets --add 'AIza[0-9A-Za-z_-]{35}'  # Firebase API key pattern
```

### Environment Variable Pattern

Instead of hardcoding configuration, use this pattern:

```typescript
// ❌ BAD - Hardcoded secret
export const environment = {
  apiKey: "AIzaSyDvQ4aCcWtSxGmTXefINTcsdb0O5zheYzE"
};

// ✅ GOOD - Use environment variable
export const environment = {
  apiKey: process.env['FIREBASE_API_KEY'] || ''
};
```

For Angular specifically:
- Use environment files with placeholders
- Replace at build time with platform-specific configuration
- Use Angular's `environment` replacement feature

---

## 📋 Checklist

For repository maintainers, verify:

- [ ] Exposed Firebase API key rotated or restricted
- [ ] GitHub security alert dismissed
- [ ] No other secrets in the repository
- [ ] Team members informed about security best practices
- [ ] Pre-commit hooks configured (optional but recommended)
- [ ] CI/CD secrets stored in GitHub Secrets
- [ ] Firebase Functions secrets in Secret Manager

---

## 📚 Additional Resources

- [GitHub Secret Scanning Documentation](https://docs.github.com/en/code-security/secret-scanning)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- Repository [SECURITY.md](./SECURITY.md) for detailed guidelines

---

## 🆘 Need Help?

If you have questions about security best practices or need assistance:

1. Review the [SECURITY.md](./SECURITY.md) file
2. Check [GitHub Docs on Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
3. Open a discussion in the repository (for non-sensitive questions)

**For security vulnerabilities:** Follow the responsible disclosure process in SECURITY.md.
