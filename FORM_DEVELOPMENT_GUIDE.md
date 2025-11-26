# 🎯 BIZUIT Custom Forms - Development Guide

> **Complete guide for creating and developing custom forms**
> Based on the form-template and production forms best practices

**Version**: 1.0.0
**Author**: Tycon S.A.
**License**: ISC

---

## 📋 What's Included

This template provides a complete, production-ready structure for building BIZUIT custom forms:

✅ **Professional UI** - Clean design with Bizuit UI Components
✅ **SDK Integration** - Authentication, process calls, error handling
✅ **Data Grid** - Sortable, filterable table with TanStack Table
✅ **Form Controls** - Combo boxes, buttons, cards
✅ **Dark Mode** - Full dark theme support
✅ **TypeScript** - Type-safe development
✅ **Fat Bundle** - Standalone dev.html for quick testing
✅ **Best Practices** - Error handling, loading states, logging

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# From form-template directory
npm install
```

### 2. Setup Development Credentials

```bash
# Copy the credentials template
cp dev-credentials.example.js dev-credentials.js

# Edit with your Dashboard credentials
nano dev-credentials.js
```

**Edit dev-credentials.js** with your actual credentials:
```javascript
export const DEV_CREDENTIALS = {
  username: 'your.email@company.com',
  password: 'YourPassword',
  apiUrl: 'https://test.bizuit.com/{yourTenant}BizuitDashboardapi/api/'
};
```

⚠️ **IMPORTANT:** This file is in `.gitignore` and won't be committed.

### 3. Test with Fat Bundle (Fastest)

```bash
# Build fat bundle
npm run build

# Serve locally
cd dist
python3 -m http.server 8080

# Open in browser
open http://localhost:8080/dev.html
```

The form will automatically use your dev-credentials.js for authentication.

### 4. Test on Runtime (Production-like)

For complete testing with SDK calls and database:

```bash
# Build form
npm run build

# Start runtime app (from project root)
cd ../../
./start-all.sh

# Upload ZIP via admin
open http://localhost:3001/admin/upload-forms
# Upload the generated ZIP from form-template/upload/

# Test form
open http://localhost:3001/form/form-template
```

**Note:** For runtime testing, you'll need dev credentials configured in `runtime-app/`. See the main [DEVELOPMENT.md](DEVELOPMENT.md#setup-de-credenciales-de-desarrollo) guide.

---

## 🏗️ Architecture

### Component Structure

```typescript
FormTemplate
├── BizuitThemeProvider    # Theme and i18n
├── Header                 # Title, version, user info
├── User Info Card         # Dashboard context (optional)
├── Loading State          # Spinner while loading
├── Error State            # Error message with retry
└── Main Content
    ├── Filters Section    # Combo box, action buttons
    ├── Data Grid Section  # TanStack Table with data
    └── Actions Section    # Submit, cancel buttons
```

### Data Flow

```
1. Component Mounts
   ↓
2. useEffect() triggers loadData()
   ↓
3. SDK authenticates with Dashboard API
   ↓
4. SDK calls process (raiseEvent)
   ↓
5. Parse process response → ExampleItem[]
   ↓
6. Render data in BizuitDataGrid
   ↓
7. User interactions (filter, sort, submit)
```

---

## 🔧 Customization Guide

### Step 1: Update SDK Configuration

```typescript
// src/index.tsx (lines 27-33)
const SDK_CONFIG = {
  defaultApiUrl: 'https://test.bizuit.com/{yourTenant}BizuitDashboardapi/api/',
  processName: 'YourActualProcessName'  // ← Change this
};
```

### Step 2: Define Your Data Types

```typescript
// src/index.tsx
interface YourDataItem {
  id: number;
  field1: string;
  field2: number;
  // ... your fields
}
```

### Step 3: Update Process Call

```typescript
// src/index.tsx
const result = await sdk.process.raiseEvent({
  processName: SDK_CONFIG.processName,
  activityName: 'YourActivityName',  // ← Update
  additionalParameters: sdk.process.createParameters([
    { name: 'pParam1', value: 'value1' },  // ← Your params
    { name: 'pParam2', value: 'value2' }
  ])
}, [], token);
```

### Step 4: Parse Response Data

```typescript
// src/index.tsx
const items: YourDataItem[] = result.parameters
  .filter(p => p.name === 'YourArrayParam')  // ← Update filter
  .map(p => ({
    id: p.value.id,           // ← Your field mapping
    field1: p.value.field1,
    field2: p.value.field2
  }));
```

### Step 5: Configure Data Grid Columns

```typescript
// src/index.tsx
const columns: ColumnDef<YourDataItem>[] = [
  {
    accessorKey: 'field1',
    header: 'Field 1 Header',
    size: 200,
  },
  {
    accessorKey: 'field2',
    header: 'Field 2 Header',
    size: 120,
    cell: ({ getValue }) => {
      // Custom cell rendering
      const value = getValue() as number;
      return <span>${value}</span>;
    }
  },
  // ... more columns
];
```

### Step 6: Update Styles and Branding

```typescript
// Header title
<h1 className="text-3xl font-bold text-slate-900 dark:text-white">
  Your Form Title  // ← Update
</h1>

// Color scheme (search and replace):
// orange-600 → your-color-600
// orange-700 → your-color-700
// etc.
```

---

## 💻 Development Workflows

### Workflow 1: Fat Bundle (Recommended for UI Work)

**Use when**: Styling, layout, component testing

```bash
# Edit form
code src/index.tsx

# Build (fast - only your code)
npm run build

# Serve
cd dist && python3 -m http.server 8080

# Test
open http://localhost:8080/dev.html

# Iteration: Edit → Build → Refresh
```

**Pros**:
- ⚡ Fast rebuilds (< 1 second)
- ⚡ Instant browser refresh
- ✅ Perfect for UI iterations
- ✅ Can test real SDK calls (uncomment auth code in src/index.tsx lines 110-126)
- ✅ Optional backend - UI works without it, SDK needs backend running

**Cons**:
- 🐢 Slower than pure mock data approach

### Workflow 2: Runtime Testing (Production-like)

**Use when**: SDK integration, process testing, final validation

```bash
# Build form
npm run build

# Start all services (from project root)
cd ../../
./start-all.sh

# Upload ZIP
open http://localhost:3001/admin/upload-forms

# Test form
open http://localhost:3001/form/form-template
```

**Pros**:
- ✅ Tests real SDK calls
- ✅ Tests database loading
- ✅ Production-like behavior

**Cons**:
- 🐢 Slower (need upload each change)
- 🐢 Backend required

---

## 🔑 Environment Configuration

### Development Credentials

For local fat bundle testing, you need dev credentials in the form directory:

**File**: `./dev-credentials.js` (in the form directory, NOT in runtime-app/)

```javascript
export const DEV_CREDENTIALS = {
  username: 'your.email@company.com',
  password: 'YourDashboardPassword',
  apiUrl: 'https://test.bizuit.com/{yourTenant}BizuitDashboardapi/api/'
  //                                  ^^^^^^^^^^
  //                                  Your tenant name
}
```

**Setup**:
```bash
# Copy example file
cp dev-credentials.example.js dev-credentials.js

# Edit with your credentials
nano dev-credentials.js
```

**Tenant name pattern**:
- Pattern: `{tenant}BizuitDashboardapi/api/`
- Example: `clientXBizuitDashboardapi`
- Replace `clientX` with your actual tenant name

**IMPORTANT**: This file is in `.gitignore` and must be created locally for each form you develop.

### Required Environment Variables

**File**: `../runtime-app/.env.local` (for runtime app)

```env
# Enable dev mode for local testing (CRITICAL SECURITY)
# IMPORTANT: Must use NEXT_PUBLIC_ prefix for client-side access
NEXT_PUBLIC_ALLOW_DEV_MODE=true  # ← Set to 'true' for development, 'false' for production

# Dashboard API (CORS proxy for local dev)
NEXT_PUBLIC_BIZUIT_DASHBOARD_API_URL=/api/bizuit

# Backend API (server-side only)
FASTAPI_URL=http://127.0.0.1:8000

# Development credentials (used when NEXT_PUBLIC_ALLOW_DEV_MODE=true)
DEV_USERNAME=your-dashboard-username
DEV_PASSWORD=your-dashboard-password
DEV_API_URL=https://test.bizuit.com/yourTenantBizuitDashboardapi/api/

# Session & Security
NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES=30
WEBHOOK_SECRET=your-webhook-secret
```

---

## 🧪 Testing Checklist

Before deploying:

- [ ] Form loads without errors (fat bundle)
- [ ] Data grid displays correctly (fat bundle)
- [ ] Filters work (fat bundle)
- [ ] SDK calls succeed (runtime testing)
- [ ] Process integration works (runtime testing)
- [ ] Form loads from database (runtime testing)
- [ ] Mobile responsive (browser DevTools)
- [ ] Dark mode works (theme toggle)
- [ ] No console errors (all scenarios)

---

## 📦 Deployment

### Automatic Deployment (GitHub Actions)

```bash
# 1. Commit your changes
git add form-template/
git commit -m "feat: add new form feature"

# 2. Push to main
git push origin main

# 3. GitHub Actions will:
#    - Build form
#    - Bump version
#    - Create deployment ZIP
#    - Upload to Artifacts
#    - Commit ZIP to repo
#    - Create git tag

# 4. Download artifact from GitHub Actions
# 5. Upload via admin panel
```

### Manual Deployment

```bash
# Build
npm run build

# Create ZIP
cd dist
zip -r ../form-template-deployment.zip .

# Upload via admin panel
open http://localhost:3001/admin/upload-forms
```

---

## 📚 Additional Resources

- **Main Repository Documentation**: [README.md](README.md)
- **Development Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Interactive Docs**: `http://localhost:3001/docs`
- **SDK Documentation**: `../packages/bizuit-form-sdk/README.md`
- **UI Components**: `../packages/bizuit-ui-components/README.md`

---

## 💡 Tips & Best Practices

### DO:
- ✅ Use TypeScript for type safety
- ✅ Handle loading and error states
- ✅ Log important events to console
- ✅ Use Bizuit UI Components (consistent design)
- ✅ Test with fat bundle first (faster iteration)
- ✅ Use semantic versioning in commits (feat:, fix:, chore:)

### DON'T:
- ❌ Hardcode API URLs (use SDK_CONFIG)
- ❌ Ignore error handling
- ❌ Skip loading states
- ❌ Commit sensitive credentials
- ❌ Manually change package.json version (let workflow handle it)

---

## 🐛 Common Troubleshooting

### "Cannot find module '@tyconsa/bizuit-form-sdk'"

```bash
npm install
```

### "Process call failed"

```bash
# Check SDK_CONFIG.processName matches your actual process
# Check Dashboard API is accessible

# For Fat Bundle (dev.html):
# - Check dev-credentials.js in form directory (e.g., form-template/dev-credentials.js)
# - Verify SDK authentication code is uncommented (src/index.tsx lines 110-126)
# - Ensure backend is running on port 8000

# For Runtime App:
# - Check .env.local variables in runtime-app/:
#   DEV_USERNAME, DEV_PASSWORD, DEV_API_URL
#   NEXT_PUBLIC_ALLOW_DEV_MODE=true
```

### "Form not rendering"

```bash
# Check browser console for errors
# Verify React and UI components loaded
# Check BizuitThemeProvider is wrapping everything
```

### "Invalid author format" on Upload

```bash
# Error: Invalid author format: Tycon S.A.

# Cause: Backend validation doesn't allow spaces in author field

# Fix: Edit package.json
{
  "author": "Tyconsa"  // ✅ No spaces
}

# Valid alternatives:
{
  "author": "Tycon-SA"     // ✅ Hyphen
  "author": "Tycon_SA"     // ✅ Underscore
  "author": "john.doe"     // ✅ Dot allowed (no spaces)
}
```

---

## 📋 Validation Rules Reference

### package.json Field Validation

The backend validates these fields with strict regex patterns:

| Field | Regex | Allows Spaces? | Example Valid | Example Invalid |
|-------|-------|----------------|---------------|-----------------|
| **author** | `^[a-zA-Z0-9._@-]+$` | ❌ No | `Tyconsa`, `john.doe` | `Tycon SA` |
| **name** | (flexible) | ✅ Yes (in scope) | `@tyconsa/my-form` | - |
| **version** | `^\d+\.\d+\.\d+$` | ❌ No | `1.0.5` | `v1.0.0`, `1.0` |
| **description** | (no validation) | ✅ Yes | Any text | - |

**Key Rules**:
- ⚠️ **author**: NO SPACES - use `Tyconsa`, `John-Doe`, or `admin@bizuit`
- ⚠️ **version**: Semantic versioning (MAJOR.MINOR.PATCH)
- ✅ **description**: Free text, any format

**Why no spaces in author?**
Security validation (SQL injection, XSS, command injection prevention)

---

**Happy coding!** 🚀
