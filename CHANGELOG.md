# Changelog

All notable changes to this repository, newest first. One entry per release, and each entry says
WHY, not only what — a year from now the question will be "why does the version in package.json on
main not match what was packaged?", and the answer has to be here.

This file is a changelog and nothing else. It used to end with a handful of loose sections
(Project Structure, Commits, Testing, Known Issues, Future Enhancements) that were frozen in
November 2025 and described forms this repository no longer has. What lives where instead:

| looking for | read |
|---|---|
| the layout of the repository | [README.md](README.md) |
| how to run the tests, build, or test a form locally | [README.md](README.md) § Testing |
| how a form is developed end to end | [FORM_DEVELOPMENT_GUIDE.md](FORM_DEVELOPMENT_GUIDE.md) |
| how it gets deployed | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) |
| what commit did what | `git log` |
| what is broken or wanted | the repository's issues |

## [1.2.0] - 2026-09-28

The template could not meet the rule it is supposed to demonstrate: it had no tests at all, nothing
type-checked it, and its only workflow packaged without ever building or testing. Fixing that
required fixing a fourth thing first — packaging wrote to `main`, so `main` could not be protected.

### Added - Tests

- **Jest + Testing Library in `form-template`**, with 14 tests over the sample form (90% of
  `src/index.tsx`): loading state, the parameters the host sends, the stats cards, the table, the
  filter, both modals and the submit flow.
  See `form-template/src/__tests__/form-template.test.tsx`.
- `jest.config.cjs` — `.cjs`, not `.js`: the package is `"type": "module"` and Jest reads its
  config as CommonJS.
- `jest.setup.ts` — two shims jsdom needs, both with the reason written next to them:
  - `window.DEV_MODE = true` **before** the form is imported. `src/utils/sentry.ts` reads it at
    import time and, when it is not true, replaces `console.log`/`console.warn` with silent
    versions for the rest of the run.
  - `window.matchMedia`, which jsdom does not implement and `BizuitThemeProvider` asks for on
    mount. Without it every render of every form dies.
- `form-template/tsconfig.json` and an `npm run type-check` (`tsc --noEmit`). There was no tsconfig
  at all, and esbuild STRIPS the types without reading them: a form with a real type error built,
  shipped and failed in the browser.

**The `@tyconsa` packages are not mocked, on purpose.** The form imports them, the build marks them
external and the host provides them at runtime, so a test that mocks them proves nothing about
whether the template still works with the packages as published today.

### Added - `.github/workflows/build-and-test.yml`

Type-checks, tests and builds **every** form on every push to `main`, on every pull request, **and
every night at 06:00 UTC**. The nightly run first moves the BIZUIT packages to their newest
published version — `npm install` alone would honour the lockfiles and keep proving that an old,
frozen combination works.

That nightly run is the point of the file: the packages move on their own, and "it worked when we
last touched it" is not the same as "it works today".

### Added - root scripts

`npm test`, `npm run type-check` and `npm run build` now run the matching script in **every** form,
via `scripts/run-in-forms.js`. A form that does not declare one of them is a **failure**, never a
skip: a form with no tests is exactly what this is meant to catch.

`npm test` used to be `echo "no test specified" && exit 1`.

### Changed - the version no longer comes from a commit on `main`

The packaging workflow used to increment every `package.json`, commit the deployment ZIPs into
`{form}/upload/` and push to `main`. That made the robot a writer on the default branch, so
protecting `main` broke packaging outright — it had been failing on every merge with
`GH006: Protected branch update failed`.

`MAJOR.MINOR` still come from each form's `package.json`, where a human decides them. **`PATCH` is
now the workflow run number**: monotonic, and it needs nobody's write access.

Said out loud because it will surprise someone: the version in `package.json` on `main` stays at
its `MAJOR.MINOR` and **does not track what was packaged**. The ZIP, its `manifest.json` and the
release carry the full version.

### Changed - Node 18 → 20

In both workflows. Node 18 has been out of support since April 2025.

### Changed - `main` is protected

Pull request required, with the `Type-check, test and build every form` run green and the branch up
to date. No force pushes, no branch deletion.

### Removed - the stale Azure DevOps pipeline

`azure-pipelines.yml` (529 lines) and `AZURE_DEVOPS_SETUP.md`. No Azure DevOps project pointed at
this repository, the README already called it deprecated, and it duplicated the **old** GitHub
workflow — the one that pushed version bumps and ZIPs back to the branch. Anyone starting from this
template and adopting that file would have inherited the bug this release had to fix. It was still
on Node 18.

### Fixed - the lockfile was ignored while being committed

`form-template/.gitignore` listed `package-lock.json` although the file was tracked, so a form
copied from this template was born without a lock. Without a lock every CI run resolves the
dependencies again — which matters more now that the nightly run moves the BIZUIT packages on
purpose: the whole point is that the other runs do not.

---

## [1.1.2] - 2025-11-13

### Fixed - Critical Build Issues

#### Problem 1: Dynamic require of 'react' is not supported
**Root Cause**: esbuild was generating fallback code with `typeof require` pattern even when marking React as external.

**Solution**: Created `globalReactPlugin` for esbuild that intercepts React/ReactDOM imports at build time and replaces them with `window.React`/`window.ReactDOM` references.

```javascript
const globalReactPlugin = {
  name: 'global-react',
  setup(build) {
    // Intercept react imports
    build.onResolve({ filter: /^react$/ }, args => {
      return { path: args.path, namespace: 'global-react' }
    })

    // Replace with window.React
    build.onLoad({ filter: /.*/, namespace: 'global-react' }, args => {
      const contents = args.path === 'react'
        ? 'module.exports = window.React'
        : 'module.exports = window.ReactDOM'
      return { contents, loader: 'js' }
    })
  }
}
```

#### Problem 2: Form does not export a default component
**Root Cause**: esbuild format `iife` was generating a global variable instead of ES6 module with proper exports.

**Solution**: Changed build format from `iife` to `esm` to generate proper ES6 modules with `export default`.

**Before** (IIFE):
```javascript
var BizuitForm_solicitud_vacaciones = (function() { ... })();
```

**After** (ESM):
```javascript
function FormComponent() { ... }
export { FormComponent as default };
```

#### Problem 3: GitHub Actions double-zipping artifacts
**Root Cause**: Workflow was manually creating .zip then uploading to artifacts, causing GitHub Actions to wrap it in another .zip.

**Solution**: Upload `deployment-package/` directory directly instead of pre-zipped file. GitHub Actions automatically zips the artifact.

### Changed
- **build-form.js**:
  - Added `globalReactPlugin` to intercept React imports
  - Changed format from `iife` to `esm`
  - Removed `globalName` (not needed for ESM)
- **.gitignore**: Added `deployment-package/` (generated by CI only)
- **.github/workflows/build-deployment-package.yml**:
  - Upload directory instead of .zip file
  - Prevent double-zipping

### Technical Details

**Plugin Implementation**:
- Intercepts: `react`, `react-dom`, `react/jsx-runtime`, `react/jsx-dev-runtime`
- Returns: `window.React`, `window.ReactDOM`, `window.React.createElement` references
- Result: No `require()` fallback code generated

**Module Format**:
- Old: IIFE with global variable
- New: ES6 module with `export default`
- Compatible with: Dynamic `import()` in form-loader

**Verification**:
```bash
# Check for typeof require (should not be found)
grep -i "typeof require" dist/form.js

# Check for export default (should be found)
tail -n 5 dist/form.js  # Should see: export{X as default};
```

## [1.0.0] - 2025-11-13

### Added - New Form: Solicitud de Soporte Técnico

**Description**: IT Support ticket creation form with categories, priorities, and rich details.

**Features**:
- **Categories**: Software, Hardware, Network, Access, Other (with icons)
- **Priorities**: Low, Medium, High, Critical (with color coding)
- **Fields**:
  - Subject (required)
  - Problem description (required, with character counter)
  - Category selector (required)
  - Priority selector (required)
  - Location/Area (optional)
  - Contact phone (optional)
  - Affected equipment (optional)
- **Visual feedback**: Dynamic priority/category preview with colors
- **Responsive design**: Grid layout for desktop/mobile

**Technical Specs**:
- Package: `@tyconsa/bizuit-form-solicitud-soporte`
- Version: 1.0.0
- Compiled size: 8.08 KB
- Format: ESM with `export default`
- No `typeof require` issues

**Color Coding by Priority**:
- 🟢 Baja: Green background
- 🟡 Media: Yellow background
- 🟠 Alta: Orange background
- 🔴 Crítica: Red background

### Infrastructure

**Database Integration**:
- .NET Web API backend endpoints for forms list and compiled code
- SQL Server integration via Dapper
- Next.js API proxy routes

**Deployment Pipeline**:
- GitHub Actions workflow for automated compilation
- 90-day artifact retention
- Manifest generation with form metadata
