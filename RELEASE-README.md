# Development & Release Workflow Documentation

This document provides comprehensive instructions for the complete development workflow, from feature development to production deployment.

## Overview

The development workflow uses **GitFlow-inspired branching** with **unified versioning** across all packages in the monorepo. The process emphasizes code quality, automated testing, and controlled releases.

## Complete Workflow Architecture

```
Feature Branch → PR Validation → Code Review → Merge to Main → Staging → Release → Production
```

**Environments**:

- **Development**: Local development with feature branches
- **Staging**: `main` branch automatically deploys to staging environment
- **Production**: Tagged releases deploy to production environment

**Key Principles**:

- All changes go through Pull Request review
- Automated validation ensures code quality
- Local release creation with developer control
- Automated deployment once tagged

## Prerequisites

### Required Permissions

- Write access to the repository
- GitHub Actions workflow execution permissions
- Azure deployment credentials (configured as repository secrets)

### Azure Secrets Configuration

Ensure these secrets are configured in GitHub repository settings:

- `REGISTRY_USERNAME` - Azure Container Registry username
- `REGISTRY_PASSWORD` - Azure Container Registry password
- `AZURE_STATIC_WEB_APPS_API_TOKEN_WEB` - Static Web App deployment token for main app
- `AZURE_STATIC_WEB_APPS_API_TOKEN_DOCS` - Static Web App deployment token for docs

## Development Workflow

### Step 1: Feature Development

1. **Create Feature Branch**

   ```bash
   # Start from latest main
   git checkout main
   git pull origin main

   # Create feature branch (use conventional naming)
   git checkout -b feature/user-authentication
   # or git checkout -b fix/memory-leak
   # or git checkout -b docs/api-documentation
   ```

2. **Develop Your Feature**

   ```bash
   # Make your changes
   # Test locally: pnpm dev:app
   # Run tests: pnpm test
   # Check linting: pnpm lint
   ```

3. **Commit Changes**
   ```bash
   # Use conventional commits for changelog generation
   git add .
   git commit -m "feat: add user authentication system"
   # or git commit -m "fix: resolve memory leak in sync server"
   ```

### Step 2: Pull Request Submission

4. **Push Feature Branch**

   ```bash
   git push origin feature/user-authentication
   ```

5. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Base: `main` ← Compare: `feature/user-authentication`
   - Fill out PR template with:
     - Description of changes
     - Testing instructions
     - Breaking changes (if any)

### Step 3: Automated PR Validation

**GitHub Actions automatically runs:**

- ✅ **Linting** - Code style validation
- ✅ **Type Checking** - TypeScript validation
- ✅ **Tests** - All test suites
- ✅ **Build** - Successful compilation
- ✅ **Security Audit** - Dependency vulnerabilities
- ✅ **Secret Scanning** - No hardcoded secrets

**PR Status Updates:**

- 🔄 **Pending**: Validation in progress
- ✅ **Success**: All checks passed, ready for review
- ❌ **Failed**: Issues found, requires fixes

### Step 4: Code Review & Merge

6. **Address Review Feedback**

   ```bash
   # Make requested changes
   git add .
   git commit -m "fix: address code review feedback"
   git push origin feature/user-authentication
   ```

7. **Merge to Main**
   - Reviewer approves PR
   - Use "Squash and merge" for clean history
   - Delete feature branch after merge

### Step 5: Staging Deployment

**Automatic staging deployment:**

- Merge to `main` triggers `Deploy to Azure Staging` workflow
- Builds latest code with `latest` Docker tags
- Deploys to staging environment for final validation

## Release Process

### Step 6: Production Release

8. **Validate Staging Environment**

   ```bash
   # Test the staging deployment thoroughly
   # Verify all features work as expected
   # Check performance and functionality
   ```

9. **Prepare for Release**

   ```bash
   # Ensure you're on main with latest changes
   git checkout main
   git pull origin main

   # Verify clean working directory
   git status  # Should show: nothing to commit, working tree clean
   ```

10. **Create Release Locally**

    ```bash
    # For patch release (bug fixes: 0.0.1 → 0.0.2)
    pnpm release:patch

    # For minor release (new features: 0.0.1 → 0.1.0)
    pnpm release:minor

    # For major release (breaking changes: 0.0.1 → 1.0.0)
    pnpm release:major
    ```

11. **Review Release Changes**

    ```bash
    # Check the version bump and changelog
    git log --oneline -3
    cat CHANGELOG.md

    # Verify all packages have correct versions
    pnpm version:check
    ```

12. **Deploy to Production**
    ```bash
    # Push commits and tags together
    git push origin main --follow-tags
    ```

### Step 7: Automated Production Deployment

Once you push the tag, GitHub Actions automatically:

1. **Detects New Tag** - `Deploy Release` workflow triggers on `v*` tags
2. **Builds & Tests** - Runs `pnpm build` and `pnpm test`
3. **Creates Docker Images** - Builds and tags with version number
4. **Pushes to Registry** - Updates Azure Container Registry
5. **Deploys to Production** - Updates Azure services with new version
6. **Creates GitHub Release** - Automatic release with changelog

## What Happens During a Release

### Local Release Phase

1. **Version Management**

   - Root `package.json` version is bumped
   - All package versions are synchronized using `pnpm version:sync`
   - New version is applied to:
     - `/package.json`
     - `/products/app/package.json`
     - `/products/yjs-sync-server/package.json`

2. **Changelog Generation**

   - Automatic changelog generation using `changelogen`
   - Conventional commit messages are parsed
   - Organized by type: Features, Bug Fixes, etc.
   - Updates `CHANGELOG.md` with new version entry

3. **Git Operations**
   - Changes committed with message: `chore: release vX.X.X`
   - Git tag created: `vX.X.X`
   - Ready for push to trigger deployment

### Automated Deployment Phase

4. **Docker Image Versioning**

   - Three container images built:
     - `nodenoggin.azurecr.io/nodenoggin-web-app`
     - `nodenoggin.azurecr.io/nodenoggin-yjs-sync-server`
     - `nodenoggin.azurecr.io/nodenoggin-docs`
   - Each image tagged with both `latest` and version number (e.g., `1.2.3`)

5. **GitHub Release**

   - Automatic GitHub release creation
   - Release notes generated from changelog
   - Tagged version attached to release

6. **Azure Production Deployment**
   - **App Service**: YJS sync server deployed with versioned container
   - **Static Web Apps**: Web app and docs deployed from versioned containers
   - Production environment updated with new release

## Deployment Environments

### Staging Environment

- **Trigger**: Any push to `main` branch (except release commits)
- **Purpose**: Testing and validation before production
- **Images**: Uses `latest` Docker tags
- **URL**: Azure staging URLs

### Production Environment

- **Trigger**: Git tag push (via local release process)
- **Purpose**: Live production environment
- **Images**: Uses versioned Docker tags (e.g., `1.2.3`)
- **URL**: Production URLs (https://www.nodenogg.in)

## Version Management Commands

### Check Current Versions

```bash
pnpm version:check
```

Output example:

```
Root: 0.0.1
nodenogg.in: 0.0.1
@nodenogg.in/yjs-sync-server: 0.0.1
```

### Sync Package Versions

```bash
pnpm version:sync
```

Forces all packages to match the root package.json version.

## Rollback Procedures

### Quick Rollback via Azure

1. **Identify Previous Version**

   - Check GitHub releases for previous stable version
   - Note the version number (e.g., `1.2.2`)

2. **Manual Azure Deployment**
   - Trigger release workflow with previous version
   - Or manually deploy previous container images in Azure portal

### Git-Based Rollback

1. **Revert to Previous Tag**

   ```bash
   git checkout v1.2.2
   git checkout -b hotfix/rollback-1.2.2
   ```

2. **Create Emergency Release**
   ```bash
   pnpm release:patch  # Creates 1.2.3 with rollback changes
   ```

## Monitoring and Validation

### Post-Release Checklist

- [ ] GitHub release created successfully
- [ ] All container images pushed to Azure Container Registry
- [ ] Azure App Service updated (check https://websocketsnodenoggin.azurewebsites.net)
- [ ] Static Web Apps deployed (check production URLs)
- [ ] Application functionality verified
- [ ] No errors in Azure Application Insights

### Health Checks

- **YJS Sync Server**: Container healthcheck on port 8787
- **Web App**: Static site availability
- **Docs**: Documentation site accessibility

## Troubleshooting

### Common Issues

#### Local Release Script Fails

- **Cause**: Dirty working directory or missing dependencies
- **Solution**: Run `git status` and `pnpm install` before release

#### Docker Build Failures

- **Cause**: Build errors in application code
- **Solution**: Run `pnpm build` locally first to identify issues

#### Azure Deployment Timeouts

- **Cause**: Large container images or Azure service issues
- **Solution**: Monitor Azure status and retry if needed

#### Missing Environment Variables

- **Cause**: Azure secrets not configured
- **Solution**: Verify all required secrets in GitHub repository settings

### Emergency Procedures

#### Stop Failed Deployment

1. Cancel running `Deploy Release` GitHub Action workflow
2. Check Azure portal for any partially deployed resources
3. Deploy previous version if necessary

#### Critical Production Issue

1. Identify last known good version
2. Execute rollback procedure
3. Create hotfix branch for urgent fixes
4. Follow normal release process for hotfix

## Branch Naming Conventions

Use clear, descriptive branch names following these patterns:

**Feature Branches:**

- `feature/user-authentication`
- `feature/dark-mode-toggle`
- `feature/real-time-sync`

**Bug Fix Branches:**

- `fix/memory-leak-sync-server`
- `fix/login-validation-error`
- `fix/dockerfile-build-failure`

**Documentation Branches:**

- `docs/api-documentation`
- `docs/deployment-guide`
- `docs/contributor-guidelines`

**Hotfix Branches:**

- `hotfix/critical-security-patch`
- `hotfix/production-outage-fix`

## Commit Message Standards

Follow conventional commits for accurate changelog generation:

**Types:**

- `feat:` - New features → Minor version bump
- `fix:` - Bug fixes → Patch version bump
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring without feature changes
- `test:` - Test additions/updates
- `chore:` - Maintenance tasks (dependencies, build, etc.)
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

**Breaking Changes:**

- Add `BREAKING CHANGE:` in commit body → Major version bump
- Or use `feat!:` or `fix!:` for breaking changes

**Examples:**

```bash
feat: add real-time collaboration features
fix: resolve memory leak in sync server
docs: update API documentation for v2 endpoints
chore: upgrade Vue to v3.5.14
feat!: redesign user authentication system

BREAKING CHANGE: authentication tokens now expire after 24 hours
```

## Best Practices

### Development

- [ ] Create feature branch from latest `main`
- [ ] Write tests for new features
- [ ] Update documentation for API changes
- [ ] Test locally before pushing: `pnpm dev:app`
- [ ] Run full validation: `pnpm test && pnpm lint && pnpm build`

### Pull Requests

- [ ] Clear description of changes
- [ ] Link to related issues
- [ ] Include testing instructions
- [ ] Mark breaking changes clearly
- [ ] Request appropriate reviewers

### Before Releasing

- [ ] All PRs merged and staging validated
- [ ] No failing tests or linting errors
- [ ] Performance testing completed
- [ ] Breaking changes documented
- [ ] Release notes reviewed

### Release Timing

- Avoid releases during high-traffic periods
- Plan releases for business hours when support is available
- Allow time for post-release monitoring and hotfixes

## Support and Contacts

For issues with the release process:

1. Check GitHub Actions logs for detailed error information
2. Review Azure portal for deployment status
3. Consult this documentation for troubleshooting steps
4. Contact repository maintainers for assistance
