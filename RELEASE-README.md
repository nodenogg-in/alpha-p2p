# Release Process Documentation

This document provides comprehensive instructions for releasing new versions of the Nodenogg.in monorepo and deploying to Azure.

## Overview

The release strategy uses **unified versioning** across all packages in the monorepo. All services (web app, yjs-sync-server, docs) are versioned together and deployed as a coordinated release.

## Release Workflow Architecture

```
Feature Development → Staging (main branch) → Release (tagged) → Production
```

- **Staging**: Pushes to `main` branch deploy to Azure staging environment
- **Production**: Manual releases create GitHub tags and deploy versioned containers to production

## Prerequisites

### Required Permissions
- Write access to the repository
- GitHub Actions workflow execution permissions
- Azure deployment credentials (configured as repository secrets)

### Azure Secrets Configuration
Ensure these secrets are configured in GitHub repository settings:

- `AZURE_CREDENTIALS` - Azure service principal credentials
- `REGISTRY_USERNAME` - Azure Container Registry username
- `REGISTRY_PASSWORD` - Azure Container Registry password
- `AZURE_STATIC_WEB_APPS_API_TOKEN_WEB` - Static Web App deployment token for main app
- `AZURE_STATIC_WEB_APPS_API_TOKEN_DOCS` - Static Web App deployment token for docs

## Release Methods

### Method 1: GitHub Actions (Recommended)

1. **Navigate to GitHub Actions**
   - Go to the repository on GitHub
   - Click on "Actions" tab
   - Select "Release" workflow

2. **Trigger Release**
   - Click "Run workflow"
   - Select branch: `main`
   - Choose version bump type:
     - `patch` - Bug fixes (0.0.1 → 0.0.2)
     - `minor` - New features (0.0.1 → 0.1.0)
     - `major` - Breaking changes (0.0.1 → 1.0.0)
   - Click "Run workflow"

3. **Monitor Progress**
   - Watch the workflow execution in real-time
   - Verify all steps complete successfully:
     - ✅ Version bump and changelog generation
     - ✅ Build and test all packages
     - ✅ Docker image build and push
     - ✅ Git tag creation
     - ✅ GitHub release creation
     - ✅ Azure production deployment

### Method 2: Local Release (Alternative)

1. **Ensure Clean Working Directory**
   ```bash
   git status
   # Should show: nothing to commit, working tree clean
   ```

2. **Pull Latest Changes**
   ```bash
   git checkout main
   git pull origin main
   ```

3. **Run Release Command**
   ```bash
   # For patch release (bug fixes)
   pnpm release:patch
   
   # For minor release (new features)
   pnpm release:minor
   
   # For major release (breaking changes)
   pnpm release:major
   ```

4. **Push Changes and Tags**
   ```bash
   git push origin main
   git push origin --tags
   ```

## What Happens During a Release

### 1. Version Management
- Root `package.json` version is bumped
- All package versions are synchronized using `pnpm version:sync`
- New version is applied to:
  - `/package.json`
  - `/products/app/package.json`
  - `/products/yjs-sync-server/package.json`

### 2. Changelog Generation
- Automatic changelog generation using `changelogen`
- Conventional commit messages are parsed
- Organized by type: Features, Bug Fixes, etc.
- Updates `CHANGELOG.md` with new version entry

### 3. Git Operations
- Changes committed with message: `chore: release vX.X.X`
- Git tag created: `vX.X.X`
- Tag and commits pushed to repository

### 4. Docker Image Versioning
- Three container images built:
  - `nodenoggin.azurecr.io/nodenoggin-web-app`
  - `nodenoggin.azurecr.io/nodenoggin-yjs-sync-server`
  - `nodenoggin.azurecr.io/nodenoggin-docs`
- Each image tagged with both `latest` and version number (e.g., `1.2.3`)

### 5. GitHub Release
- Automatic GitHub release creation
- Release notes generated from changelog
- Tagged version attached to release

### 6. Azure Production Deployment
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
- **Trigger**: Manual release workflow execution
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

#### Release Workflow Fails at Version Bump
- **Cause**: Dirty working directory or merge conflicts
- **Solution**: Ensure main branch is clean before release

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
1. Cancel running GitHub Action workflow
2. Check Azure portal for any partially deployed resources
3. Manually revert if necessary

#### Critical Production Issue
1. Identify last known good version
2. Execute rollback procedure
3. Create hotfix branch for urgent fixes
4. Follow normal release process for hotfix

## Best Practices

### Before Releasing
- [ ] All tests passing locally: `pnpm test`
- [ ] No linting errors: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] Staging environment tested and validated
- [ ] Breaking changes documented

### Commit Message Standards
Follow conventional commits for accurate changelog generation:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `chore:` - Maintenance tasks

### Release Timing
- Avoid releases during high-traffic periods
- Plan releases for business hours when support is available
- Allow time for post-release monitoring

## Support and Contacts

For issues with the release process:
1. Check GitHub Actions logs for detailed error information
2. Review Azure portal for deployment status
3. Consult this documentation for troubleshooting steps
4. Contact repository maintainers for assistance