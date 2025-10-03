# Deployment Optimization

## Overview

The GitHub Actions deployment workflow has been optimized to only trigger when necessary files change. This reduces unnecessary deployments, saves CI/CD resources, and speeds up the development workflow.

## What Triggers Deployment

Deployments are automatically triggered when pushing to the `main` branch **AND** any of the following files are modified:

### Source Code
- `src/**` - All source code files (components, services, styles, etc.)
- `public/**` - Public assets (images, fonts, manifest, etc.)

### Build & Dependencies
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `angular.json` - Angular CLI configuration
- `tsconfig*.json` - TypeScript configuration files

### Backend Functions
- `functions/**` - Firebase Functions (if used for backend APIs)

### Deployment Configuration
- `.github/workflows/deploy.yml` - The deployment workflow itself
- `firebase.json` - Firebase hosting configuration
- `.firebaserc` - Firebase project configuration

## What Does NOT Trigger Deployment

The following file changes will **NOT** trigger a deployment:

### Documentation
- `README.md` - Project documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `SECURITY.md` - Security policies
- `ROADMAP.md` - Project roadmap
- `docs/**` - All documentation files
- `*.md` - Any markdown files (except those in deployment paths)

### CI/CD Configuration (Non-Deployment)
- `.github/workflows/update-screenshot.yml` - Screenshot automation
- `.github/workflows/summary.yml` - Issue summarization
- `.github/workflows/check-dead-links.yml` - Link checker
- `.github/workflows/labeler.yml` - PR labeling
- `.github/dependabot.yml` - Dependabot configuration
- `.github/FUNDING.yml` - Funding information
- `.github/ISSUE_TEMPLATE/**` - Issue templates

### Development Files
- `.vscode/**` - VS Code settings
- `.editorconfig` - Editor configuration
- `.gitignore` - Git ignore rules
- `LICENSE` - License file

### Screenshots & Assets (Non-Public)
- Screenshots committed via the screenshot workflow
- Any files outside the `public/` directory that aren't part of the build

## Benefits

### 1. Resource Efficiency
- Reduces unnecessary CI/CD pipeline runs
- Saves compute resources and minutes
- Lower environmental impact

### 2. Faster Development
- Documentation changes don't trigger long deployment processes
- Quicker feedback loop for non-deployment changes
- Improved developer experience

### 3. Cost Savings
- Fewer CI/CD minutes consumed
- Reduced FTP bandwidth usage
- Lower hosting costs for metered services

### 4. Better Git History
- Clearer deployment history
- Easier to track actual application deployments
- Simplified rollback process

## Examples

### ✅ Will Trigger Deployment

```bash
# Changing a component
git commit -m "feat: update profile card design"
git push origin main
# ✅ Deployment triggered (src/ modified)

# Updating dependencies
git commit -m "chore: update Angular to latest version"
git push origin main
# ✅ Deployment triggered (package.json modified)

# Adding new assets
git commit -m "feat: add new logo image"
git push origin main
# ✅ Deployment triggered (public/ modified)

# Updating build configuration
git commit -m "chore: optimize production build settings"
git push origin main
# ✅ Deployment triggered (angular.json modified)
```

### ❌ Will NOT Trigger Deployment

```bash
# Updating README
git commit -m "docs: update installation instructions"
git push origin main
# ❌ No deployment (README.md not in deployment paths)

# Changing contribution guidelines
git commit -m "docs: add code of conduct"
git push origin main
# ❌ No deployment (CONTRIBUTING.md not in deployment paths)

# Updating screenshot workflow
git commit -m "ci: improve screenshot automation"
git push origin main
# ❌ No deployment (other workflow files don't trigger deployment)

# Adding issue templates
git commit -m "chore: add bug report template"
git push origin main
# ❌ No deployment (.github/ISSUE_TEMPLATE/ not in deployment paths)
```

## How to Force Deployment

If you need to force a deployment without changing deployment-related files:

### Option 1: Manual Workflow Dispatch (Recommended)
If workflow_dispatch is enabled, you can manually trigger the workflow from GitHub Actions UI.

### Option 2: Touch a Deployment File
```bash
# Make a minor change to the deployment workflow
touch .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "chore: trigger deployment"
git push origin main
```

### Option 3: Add a Comment to a Build File
```bash
# Add a comment to package.json or angular.json
# Then commit and push
```

## Monitoring Deployments

### View Deployment History
1. Go to **Actions** tab in GitHub
2. Select **🚀 Deploy website on push** workflow
3. View recent runs

### Check if a Push Will Deploy
Before pushing, you can check which files are modified:
```bash
git status
git diff --name-only origin/main
```

If any of the files match the deployment paths, a deployment will trigger.

## Rollback

If a deployment fails or needs to be rolled back:

1. **Revert the commit** that caused the issue
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Or deploy a previous version**
   ```bash
   git checkout <previous-commit>
   # Make a change to a deployment file
   git commit -am "chore: rollback to previous version"
   git push origin main
   ```

## Troubleshooting

### Deployment Not Triggering
- **Check file paths**: Ensure modified files match the path filters
- **Check workflow status**: Verify the workflow is enabled in Settings → Actions
- **Check secrets**: Ensure FTP credentials are configured correctly

### Deployment Triggered Unexpectedly
- **Review commit**: Check which files were modified in the commit
- **Update path filters**: Adjust `.github/workflows/deploy.yml` if needed

## Customization

To modify which files trigger deployment, edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
    paths:
      # Add or remove paths as needed
      - 'src/**'
      - 'your-custom-path/**'
```

## Related Documentation

- [GitHub Actions Path Filters](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)
- [Angular Build Configuration](https://angular.io/guide/build)
- [Firebase Hosting Deployment](https://firebase.google.com/docs/hosting/quickstart)

## Changelog

### 2024-10-03
- ✨ Added path filters to deployment workflow
- 📝 Created deployment optimization documentation
- ✅ Tested with various file change scenarios
