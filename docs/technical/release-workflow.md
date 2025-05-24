# Development & Release Workflow

## Overview

Simple workflow: **Feature Branch → PR → Merge to Main → Release → Deploy**

- **Development**: Feature branches with PR validation
- **Staging**: `main` branch automatically builds (no deployment)
- **Production**: Deploy only when GitHub releases are published

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout main && git pull origin main
git checkout -b feature/your-feature-name

# Develop and test locally
pnpm dev:app
pnpm test && pnpm lint

# Commit with conventional commits
git add . && git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

### 2. Pull Request

- Create PR to `main` branch
- Automated validation runs (lint, tests, build, security)
- Get code review and merge

### 3. Staging Validation

- Merge to `main` triggers build validation
- Test changes in staging environment

## Release & Deployment

### 4. Create Release

```bash
# Ensure you're on latest main
git checkout main && git pull origin main

# Create release (bumps version, commits, tags)
pnpm release:patch    # Bug fixes: 0.0.1 → 0.0.2
pnpm release:minor    # New features: 0.0.1 → 0.1.0
pnpm release:major    # Breaking changes: 0.0.1 → 1.0.0

# Push everything
git push origin main --follow-tags
```

### 5. Deploy to Production

1. Go to GitHub repository → Releases
2. Find your new release (created automatically)
3. Edit release notes and description
4. Click **"Publish release"**
5. This triggers automatic deployment to production

## Commands Reference

```bash
# Development
pnpm dev:app          # Start development server
pnpm test             # Run tests
pnpm lint             # Check code style
pnpm build            # Build all packages

# Release
pnpm release:patch    # Bug fix release
pnpm release:minor    # Feature release
pnpm release:major    # Breaking change release
pnpm version:check    # Check current versions
```

## Commit Message Format

Use conventional commits for automatic changelog generation:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance (dependencies, build, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions/updates

**Examples:**

```bash
feat: add user authentication
fix: resolve memory leak in sync server
docs: update API documentation
chore: upgrade dependencies
```

## Troubleshooting

### Release Command Issues

- **Dirty working directory**: Run `git status` and commit/stash changes
- **Version sync problems**: Run `pnpm version:check` to verify versions

### Deployment Failures

- Check GitHub Actions logs for detailed errors
- Verify Azure secrets are configured in repository settings
- Monitor Azure portal for deployment status

### Emergency Rollback

1. Find previous stable release on GitHub
2. Create new release pointing to that tag
3. Publish to trigger deployment of previous version

## Branch Naming

- `feature/descriptive-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/what-changed` - Documentation
- `hotfix/critical-fix` - Emergency fixes

## Required Secrets

Configure in GitHub repository settings:

- `REGISTRY_USERNAME` - Azure Container Registry
- `REGISTRY_PASSWORD` - Azure Container Registry
- `AZURE_STATIC_WEB_APPS_API_TOKEN_WEB` - Web app deployment
- `AZURE_STATIC_WEB_APPS_API_TOKEN_DOCS` - Docs deployment
