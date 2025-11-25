# Automatic Versioning

This repository uses **automatic versioning** for deployment packages. The version number is automatically incremented on every build, ensuring consistent and traceable versioning.

## 🎯 How It Works

### Automatic PATCH Increment

Each build automatically increments the **PATCH** version of the form.

When you push to `main` branch, the CI/CD pipeline (GitHub Actions or Azure DevOps) automatically:

1. **Reads** the current version from `package.json`
2. **Increments** the PATCH version (e.g., `1.0.0` → `1.0.1`)
3. **Updates** `package.json` with the new version
4. **Commits** the updated `package.json` back to the repository
5. **Generates** deployment package with the new version

**Example sequence:**
```
Push 1: 1.0.0 → 1.0.1
Push 2: 1.0.1 → 1.0.2
Push 3: 1.0.2 → 1.0.3
...and so on
```

### ⚙️ Dual CI/CD Support

This versioning system works identically in **both** CI/CD platforms:

- ✅ **GitHub Actions** (`.github/workflows/build-deployment-package.yml`)
- ✅ **Azure DevOps Pipelines** (`azure-pipelines.yml`)

Both pipelines use the **same logic** for version increment, ensuring consistency regardless of which platform you use.

### 📝 Commit Message Recommendations

While the system automatically increments PATCH for all changes, it's good practice to use conventional commits for documentation:

```bash
# Bug fixes
git commit -m "fix: correct date validation"

# New features
git commit -m "feat: add multi-select field"

# Maintenance
git commit -m "chore: update dependencies"

# Documentation
git commit -m "docs: improve API documentation"
```

All commits result in: `v1.0.0` → `v1.0.1` (PATCH increment)

## 🎛️ Manual Version Override (Advanced)

Si necesitas cambiar MAJOR o MINOR versiones (ej: para breaking changes), debes hacerlo manualmente:

### Opción 1: Editar package.json directamente

```bash
# Editar package.json manualmente
nano form-template/package.json
# Cambiar "version": "1.0.5" → "2.0.0"

git add form-template/package.json
git commit -m "chore: bump to v2.0.0 for breaking changes"
git push

# El próximo auto-increment será: 2.0.0 → 2.0.1
```

### Opción 2: Trigger manual del workflow

**GitHub Actions:**
1. Go to **Actions** → **Build Deployment Package (Offline)**
2. Click **Run workflow**
3. El workflow construirá con la versión actual del `package.json`

**Azure DevOps:**
1. Go to **Pipelines** → **Run pipeline**
2. El pipeline construirá con la versión actual del `package.json`

## Initial Setup

If this is a new repository without tags, the workflow starts at `v1.0.0` by default.

To set a different starting version:

```bash
# Create initial tag
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

## Workflow Triggers

The automatic versioning workflow runs on:

1. **Push to `main` branch** with changes in:
   - `*/src/**` (any form source code)
   - `*/package.json` (any form package.json)
   - `build-form.js` (shared build script)

2. **Manual trigger** from GitHub Actions UI (with custom version input)

## Version Tag Format

All version tags follow the format: `vX.Y.Z`

- `v` prefix (lowercase)
- Semantic versioning: `MAJOR.MINOR.PATCH`
- Examples: `v1.0.0`, `v2.3.5`, `v10.5.12`

## Deployment Package Naming

Deployment packages are named: `bizuit-custom-forms-deployment-{VERSION}.zip`

Examples:
- `bizuit-custom-forms-deployment-1.2.3.zip`
- `bizuit-custom-forms-deployment-2.0.0.zip`

## Troubleshooting

### Tag Already Exists

If you see "Tag already exists" error, it means a version was already created. This can happen if:

1. The workflow ran twice (rare)
2. A manual tag was created

**Solution:** The workflow will skip tag creation automatically. Next commit will increment from the existing tag.

### Wrong Version Bump

If the version bumped incorrectly, you can:

1. Delete the incorrect tag:
   ```bash
   git tag -d v1.2.3
   git push origin :refs/tags/v1.2.3
   ```

2. Create a new commit with the correct prefix:
   ```bash
   git commit -m "feat: correct feature description"
   git push
   ```

### Reset Version Sequence

To restart versioning from a specific version:

```bash
# Delete all tags (careful!)
git tag -l | xargs git tag -d
git push origin --delete $(git tag -l)

# Create new starting tag
git tag -a v2.0.0 -m "Reset to v2.0.0"
git push origin v2.0.0
```

## Advanced: Customizing Version Logic

To modify the version increment logic, edit [`.github/workflows/build-deployment-package.yml`](.github/workflows/build-deployment-package.yml):

```yaml
# Lines 45-100: Get version info step
# Modify the regex patterns to match different commit message formats
```

Example customizations:

```bash
# Add custom prefix for minor version
elif echo "$COMMIT_MSG" | grep -qiE "^(feat|feature|minor|add):"; then

# Change major version detection
if echo "$COMMIT_MSG" | grep -qiE "^(breaking|major|v2):"; then
```

## Traceability in Custom Forms Admin UI

When you upload a deployment package to the custom forms server, the **commit information is preserved** and displayed in the admin interface:

### What You'll See

1. **Forms Management Page** (`/admin/forms`):
   - Each form displays its current version
   - Click "Versions" button to see version history

2. **Version History Modal**:
   - **Package Version**: Auto-incremented semantic version (e.g., `1.2.3`)
   - **Commit Hash**: Short hash (e.g., `a7b3c9f`) - **clickable link** to view the commit
   - **Build Date**: When the package was built
   - **Release Notes**: Extracted from commit message

### Commit Link

The commit hash is a **clickable link** that opens the full commit in your git provider:
- **GitHub**: `https://github.com/your-org/repo/commit/{hash}`
- **GitLab**: `https://gitlab.com/your-org/repo/-/commit/{hash}`
- **Bitbucket**: `https://bitbucket.org/your-org/repo/commits/{hash}`
- **Azure DevOps**: `https://dev.azure.com/org/project/_git/repo/commit/{hash}`

The URL is automatically generated from the `commitUrl` field in `manifest.json`, which is set by the workflow based on your repository URL.

### How It Works

1. **Workflow** generates `manifest.json` with:
   ```json
   {
     "packageVersion": "1.2.3",
     "commitHash": "a7b3c9f1234567890abcdef...",
     "commitShortHash": "a7b3c9f",
     "commitUrl": "https://github.com/your-org/repo/commit/a7b3c9f...",
     "repositoryUrl": "https://github.com/your-org/repo",
     "buildDate": "2025-11-20T19:45:00.000Z"
   }
   ```

2. **Backend API** stores this metadata in SQL Server (`CustomFormVersions` table)

3. **Admin UI** displays the commit hash as a clickable link

### Benefits

- **Full traceability**: From deployed form → version → commit → code changes
- **Quick debugging**: Click commit hash to see exactly what code is running
- **Version confidence**: Know exactly which git commit each version came from
- **Audit trail**: Track deployment history with git integration

## Related Documentation

- [GitHub Actions Workflow](.github/workflows/build-deployment-package.yml)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
